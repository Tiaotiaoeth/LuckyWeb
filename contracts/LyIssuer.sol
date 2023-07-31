// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LyLottor.sol";
import "./LyPunter.sol";
import "./LyLottery.sol";
import "./LyVRFV2.sol";

contract LyIssuer is Ownable {
    //---- How to play
    // the price of single lottery, 0.001 eth
    uint256 constant public _lotteryPrice = 1000000 gwei;
    uint256 constant public _lottorBonus  = 100000 gwei;
    // max number of lotteries for each issue
    uint256 constant public _maxBetNum = 1000;
    // the number of top rewards
    uint32 constant public _topRewardNum = 1;
    // the number of secondary rewards
    uint32 constant public _secondRewardNum = 25;
    // the percentage of top reward (50%) to the prize pool in reciprocal
    uint256 constant public _topRewardPctRecip = 2;

    // the address of the treasury
    address payable immutable public _treasury;

    //---- related contracts
    LyLottor immutable private _lyLottor;
    LyPunter immutable private _lyPunter;
    LyLottery immutable private _lyLottery;
    LyVRFV2 immutable private _lyVrfV2;
    // the address of the issuer
    address payable immutable private _issuer;
    address payable immutable private _defaultDistributor;

    // internal status of each issue
    uint256 constant private _NOT_START = 0;
    uint256 constant private _STARTED = 1;
    uint256 constant private _FREEZED = 2;
    uint256 constant private _CLOSED = 3;
    // flags of rewards
    uint256 constant private _TOP_REWARD = 1;
    uint256 constant private _SECOND_REWARD = 2;

    // bonus percentage of each role
    uint256 constant public _PunterPercent = 80;
    uint256 constant public _LottorPercent = 10;
    uint256 constant public _TreasuryPercent = 6;
    uint256 constant public _IssuerPercent = 4;

    // chainlink configuration, this is for Arbitrum Georli Testnet
    address constant public _LinkTokenAddr = 0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28;
    address constant public _VRFV2WrapperAddr = 0x674Cda1Fef7b3aA28c535693D658B42424bb7dBD;
    uint32 private _VRFCallbackGasLimit = 400000;
    uint16 private _VRFRequestConfirmations = 3;

    struct Lottery {
        address buyer;          // the address of original buyer
        uint256 nftId;          // the NFT ID of the lottery
    }

    struct Issue {
        uint256 balance;   // the balance of the prize pool
        Lottery[] records; // lotteries
        uint256[] rewards; // the NFT ID of winners
        uint256 extraTreasure; // extra balance are reserved by the treasure
        uint256 trafficBonus; // self traffic bonus
        uint256 distributionBonus;
        uint256 minLotteryNFTId; // the minimal nftId of this issue, localNftId = nftId - minLotteryNFTId + 1
    }

    struct ReducedIssue {
        uint256 issueNum;
        uint256 size;
        uint256[] rewards;
        uint256[] localids;
    }

    // all the issues of lottery
    mapping(uint256 => Issue) private _issues;
    // issue number to VRF request Ids
    mapping(uint256 => uint256[]) private issueNumReqIds;
    // status of each issue
    mapping(uint256 => uint256) private _issueStatus;
    // for each issue, one address only one bet
    bool private _flagOneAddrOneBet;
    mapping(address => uint256) private _userMaxIssue;

    using Counters for Counters.Counter;
    // issue number starts at one
    Counters.Counter private _issueCounter;

    event NewIssue(uint256 _issueNum);
    event FreezeIssue(uint256 indexed _issueNum, uint256 lottorSize, uint256 poolBalance);
    event CloseIssue(uint256 indexed _issueNum);
    event Reward(uint256 indexed _issueNum, uint256 indexed userNFT, uint256 level, uint256 value);
    event Bet(uint256 indexed userNFT, uint256 num, uint256 recommender);

    constructor(
        address payable treasuryAddr,
        address payable issuerAddr, 
        address payable distAddr, 
        address lyLotteryAddr
    ) {
        // msg.sender is the administrator
        _lyLottor = new LyLottor(distAddr);
        _lyLottery = LyLottery(lyLotteryAddr);
        _lyPunter = new LyPunter(lyLotteryAddr);
        _lyVrfV2 = new LyVRFV2(_LinkTokenAddr, _VRFV2WrapperAddr);

        _treasury = treasuryAddr;
        _issuer = issuerAddr;
        // tokenId = 1 is occupied by the default distributor
        _defaultDistributor = distAddr;
        _flagOneAddrOneBet = false;

        newIssue();
    }

    function getLyLottorAddr() public view returns (address) {
        return address(_lyLottor);
    }

    function getLyPunterAddr() public view returns (address) {
        return address(_lyPunter);
    }

    function getVRFV2Addr() public view returns (address) {
        return address(_lyVrfV2);
    }

    /// lottery management

    function setFlagOneAddrOneBet(bool flag) external onlyOwner {
        _flagOneAddrOneBet = flag;
    }

    function _checkFlagOneAddrOneBet(address user, uint256 issueNum) internal returns (bool) {
        uint256 theMaxIssueNum = _userMaxIssue[user];
        if (theMaxIssueNum >= issueNum) {
            return false;
        }
        _userMaxIssue[user] = issueNum;
        return true;
    }

    // calculate top and secondary prizes
    function _calcPrizeValues(uint256 issueNum) private view returns (uint256, uint256) {
        uint256 _poolBalance = _issues[issueNum].balance;
        require(_poolBalance > 0, "EmptyPool");

        // the prize pool after tax
        uint256 poolAfterTax = _poolBalance * _PunterPercent / 100;
        // the value of the top reward
        uint256 topValue = poolAfterTax / _topRewardPctRecip;
        // the value of the secondary reward
        uint256 secondValue = (poolAfterTax - topValue) / _secondRewardNum;

        require(topValue + secondValue*_secondRewardNum <= poolAfterTax, "ErrorCalcReward");
        return (topValue, secondValue);
    }

    function _setWinnerInfo(
        uint256 issueNum,
        uint256[] memory _randIndice,
        Issue storage _issue,
        uint256 _topValue,
        uint256 _secondValue
    ) private returns (uint256) {
        Lottery storage lottery = _issue.records[_randIndice[0]];

        uint256 nftId = lottery.nftId;
        _issue.rewards.push(nftId);

        uint256 rewardTotal = _topValue;
        emit Reward(issueNum, nftId, _TOP_REWARD, _topValue);

        // randomly select secondary winner
        for(uint i = 1; i < _secondRewardNum+1; i++) {
            lottery = _issue.records[_randIndice[i]];

            nftId = lottery.nftId;
            _issue.rewards.push(nftId);

            rewardTotal += _secondValue;
            emit Reward(issueNum, nftId, _SECOND_REWARD, _secondValue);
        }
        return rewardTotal;
    }

    function newIssue() private {
        _issueCounter.increment();
        uint256 issueNum = _issueCounter.current();
        _issueStatus[issueNum] = _STARTED;

        Issue storage issue = _issues[issueNum];
        issue.minLotteryNFTId = _lyLottery.getMaxTokenId();

        emit NewIssue(issueNum);
    }

    function setVRFConfg(uint32 _gasLimit, uint16 _confirms) external onlyOwner {
        require(_gasLimit >= 300000, 'too small gas limit');
        require(_confirms > 2, 'ConfirmNums must >= 3');

        _VRFCallbackGasLimit = _gasLimit;
        _VRFRequestConfirmations = _confirms;
    }

    /* close current issue, request random number from ChainLink Oracle */
    function closeIssue() external onlyOwner {
        uint256 issueNum = _issueCounter.current();
        require(_issueStatus[issueNum] == _FREEZED, "CannotCloseIssue");

        uint256[] storage reqIds = issueNumReqIds[issueNum];
        uint32 size = _topRewardNum + _secondRewardNum;
        while (size > 10) {
            uint256 reqId = _lyVrfV2.requestRandomWords(_VRFCallbackGasLimit, _VRFRequestConfirmations, 10);
            size -= 10;
            reqIds.push(reqId);
        }
        if (size > 0) {
            uint256 reqId = _lyVrfV2.requestRandomWords(_VRFCallbackGasLimit, _VRFRequestConfirmations, size);
            reqIds.push(reqId);
        }
        _issueStatus[issueNum] = _CLOSED;
    }

    function checkRandomNumbers(
        uint256 issueNum, 
        uint256 lottorSize
    ) internal view returns (uint256[] memory) {
        uint256[] storage reqIds = issueNumReqIds[issueNum];
        require(reqIds.length > 0, 'InvalidVRFRequest');

        // get random numbers from VRF
        uint32 size = _topRewardNum + _secondRewardNum;
        uint256[] memory randomNumbers = new uint256[](size);
        uint index = 0;
        for (uint i=0; i<reqIds.length; i++) {
            (, bool fulfilled, uint256[] memory randomWords) = _lyVrfV2.getRequestStatus(reqIds[i]);
            require(fulfilled, 'VRF request not filled');

            for (uint j=0; j<randomWords.length; j++) {
                randomNumbers[index] = randomWords[j];
                index += 1;
            }
        }
        require(index == size, "Error Random Number");

        uint256[] memory nums = new uint256[](size);
        uint[] memory indices = new uint[](lottorSize);
        for (uint nonce=0; nonce < size; nonce++) {
            uint totalSize = lottorSize - nonce;
            uint randnum = randomNumbers[nonce] % totalSize;
            index = 0;
            if (indices[randnum] != 0) {
                index = indices[randnum];
            } else {
                index = randnum;
            }

            if (indices[totalSize - 1] == 0) {
                indices[randnum] = totalSize - 1;
            } else {
                indices[randnum] = indices[totalSize - 1];
            }
            nums[nonce] = index;
        }

        return nums;
    }

    /* liquidate prize pool */
    function doLottery() external onlyOwner {
        uint256 issueNum = _issueCounter.current();
        require(_issueStatus[issueNum] == _CLOSED, "CannotDoLottery");

        Issue storage issue = _issues[issueNum];
        uint256[] memory randomNumbers = checkRandomNumbers(issueNum, issue.records.length);
        (uint256 topValue, uint256 secondValue) = _calcPrizeValues(issueNum);

        // get random numbers from chainlink
        uint256 rewardTotal = _setWinnerInfo(issueNum, randomNumbers, issue, topValue, secondValue);

        // liquidation
        // 1. prize
        uint256 _poolBalance = issue.balance;
        _lyPunter.setRewards(issueNum, issue.rewards, _topRewardNum, topValue, _secondRewardNum, secondValue);
        // 2. lottor distributors' bonus, equals to issue.balance * 10%
        uint256 trafficBonus = issue.trafficBonus;
        uint256 distBonus = issue.distributionBonus;
        // 3. the issuer fee
        uint256 issuerValue = _poolBalance * _IssuerPercent / 100;
        require(issuerValue > 0, "ErrorIssuerValue");
        // 4. the treasury fee
        uint256 treasuryValue = _poolBalance - rewardTotal - trafficBonus - distBonus - issuerValue;
        treasuryValue += issue.extraTreasure;
        require(treasuryValue > 0, "ErrorTreasuryValue");

        // transfer
        _lyPunter.payReward{value: rewardTotal}(issueNum);
        _lyLottor.payBonus{value: distBonus}(issueNum, distBonus);

        (bool success, ) = _defaultDistributor.call{value: trafficBonus}("");
        require(success, "ErrorPayTraffic");

        (success, ) = _treasury.call{value: treasuryValue}("");
        require(success, "ErrorPayTreasury");

        (success, ) = _issuer.call{value: issuerValue}("");
        require(success, "ErrorPayIssuer");

        newIssue();
    }


    /// API for lottery

    /* get current issue number */
    function getIssueNum() public view returns (uint256) {
        return _issueCounter.current();
    }

    // get the prize pool and number of lottery
    function getBalanceAndSize() external view returns (uint256, uint256) {
        uint256 issueNum = _issueCounter.current();
        require(_issueStatus[issueNum] >= _STARTED, "NotStart");
        // the number of lottery
        uint256 size = _issues[issueNum].records.length;
        uint256 _poolBalance = getBalance();
        return (_poolBalance, size);
    }

    /* get the latest rewards: issue number, total bets, winners */
    function getLatestRewards() 
        external view returns (uint256, uint256, uint256, uint256[] memory) 
    {
        uint256 issueNum = _issueCounter.current();
        if (_issueStatus[issueNum] == _CLOSED) {
            Issue storage issue = _issues[issueNum];
            return (issueNum, issue.records.length, issue.minLotteryNFTId, issue.rewards);
        } else if (issueNum > 1 && _issueStatus[issueNum-1] == _CLOSED) {
            Issue storage issue = _issues[issueNum-1];
            return (issueNum-1, issue.records.length, issue.minLotteryNFTId, issue.rewards);
        }
        uint256[] memory emptyLottor = new uint256[](0);
        return (0, 0, 0, emptyLottor);
    }

    /* get records by issue number */
    function getRecords(
        uint256 issueNum
    ) external onlyOwner view returns (uint256, Lottery[] memory) {
        require(_issueStatus[issueNum] == _CLOSED, "NotClosed");

        Issue storage issue = _issues[issueNum];
        return (issue.minLotteryNFTId, issue.records);
    }

    /* get rewards by issue number */
    function getRewards(
        uint256 issueNum
    ) external view returns (uint256, uint256, uint256, uint256[] memory) {
        require(_issueStatus[issueNum] == _CLOSED, "NotClosed");

        Issue storage issue = _issues[issueNum];
        return (issueNum, issue.records.length, issue.minLotteryNFTId, issue.rewards);
    }

    function getBatchRewards(
        uint256[] memory issueNums
    ) external view returns (ReducedIssue[] memory) {
        uint size = issueNums.length;
        ReducedIssue[] memory groupRewards = new ReducedIssue[](size);

        for (uint i = 0; i < size; i++) {
            uint256 issueNum = issueNums[i];
            require(_issueStatus[issueNum] == _CLOSED, "NotClosed");

            Issue storage issue = _issues[issueNum];
            groupRewards[i].issueNum = issueNum;
            groupRewards[i].size = issue.records.length;
            groupRewards[i].rewards = issue.rewards;

            uint256[] memory localids =  new uint256[](issue.rewards.length);
            uint256 baseId = issue.minLotteryNFTId;
            for (uint j = 0; j < issue.rewards.length; j++) {
                localids[j] = issue.rewards[j] - baseId + 1;
            }
            groupRewards[i].localids = localids;
        }

        return groupRewards;
    }


    /* for status monitor */
    function getIssueStatus() external view onlyOwner returns (uint256) {
        uint256 issueNum = _issueCounter.current();
        return _issueStatus[issueNum];
    }

    /* prize pool */
    function getBalance() view public returns(uint) {
        return address(this).balance;
    }

    /// Punter operations

    /* Bet
     * recommender is the distributor
     * num is the number of lottery
     *
     */
    function bet(uint256 recommender, uint256 num) external payable {
        uint256 _issueNum = _issueCounter.current();
        require(_issueStatus[_issueNum] == _STARTED, "NotStarted");

        uint256 _value = msg.value;
        uint256 _requiredValue = _lotteryPrice * num;
        require(_value >= _requiredValue, "NotEnoughETH");

        address _user = msg.sender;
        if (_flagOneAddrOneBet) {
            require(_checkFlagOneAddrOneBet(_user, _issueNum), "AlreadyBetThisIssue");
            require(num == 1, "NoMoreThanOneBet");
        }

        Issue storage curIssue = _issues[_issueNum];
        uint256 lottorSize = curIssue.records.length;
        require(lottorSize + num < _maxBetNum + 10, "InvalidBetNum");

        for (uint bn=0; bn < num; bn++) {
            uint256 id = _lyLottery.safeMint(_user);
            curIssue.records.push(Lottery({
                buyer: _user,
                nftId: id
            }));
            
            emit Bet(id, _issueNum, recommender);
        }

        // booking
        if (_value > _requiredValue) {
            curIssue.extraTreasure += (_value - _requiredValue);
        }

        uint256 _poolBalance = curIssue.balance + _requiredValue;
        curIssue.balance = _poolBalance;
        uint256 _bonus = _lottorBonus * num;
        if (recommender == 1 || !_lyLottor.exists(recommender)) {
            // token of _defaultDistributor is 1
            curIssue.trafficBonus += _bonus;
        } else {
            _lyLottor.record(_user, _issueNum, recommender, _bonus);
            curIssue.distributionBonus += _bonus;
        }

        // check whether to close this issue
        lottorSize = curIssue.records.length;
        if (lottorSize >= _maxBetNum) {
            _issueStatus[_issueNum] = _FREEZED;
            emit FreezeIssue(_issueNum, lottorSize, _poolBalance);
        }
    }

    function getIssueBaseNftId(uint256 issueNum) public view returns (uint256) {
        Issue storage curIssue = _issues[issueNum];
        return curIssue.minLotteryNFTId;
    }

    /* get lotteries by issue number of user */
    function getLotteryNum(uint256 issueNum) external view returns (uint256) {
        uint256 lotteryNum = 0;
        address sender = msg.sender;
        Lottery[] memory records = _issues[issueNum].records;
        for (uint i = 0; i < records.length; i++) {
            if (_lyLottery.checkOwnership(sender, records[i].nftId)) {
                lotteryNum += 1;
            }
        }
        return lotteryNum;
    }

}
