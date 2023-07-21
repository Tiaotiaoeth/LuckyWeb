// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LyLottery.sol";

contract LyPunter is Ownable {

    struct Prize {
        uint256 issueNum;       // the issue number
        uint256 rewardLevel;    // the prize level, 1 for top prize, 2 for secondary prize
        uint256 rewardValue;    // the prize amount
        uint256 nftId;
    }

    // instance of LyLottery
    LyLottery immutable private _lottery; 

    // the prize pool for each issue
    mapping(uint256 => uint256) private _issuePool;
    // all prizes, key is NFT id
    mapping(uint256 => Prize) private _prizes;
    // cummulative prize withdrawed by each user
    mapping(address => uint256) private _cumPrizeByUser;
    // un-redeemed prizes' nftid
    uint256[] private _unredeemPrize;
    // all prizes' nftid
    uint256[] private _allPrizes;
    // start index of unredeemed prize array, make un-redeemed prized compact
    uint private _startIdx;
    uint256 private _maxIssueNum;

    event Redeem(uint256 indexed nftId, uint256 value);

    constructor(address accountAddr) {
        _lottery = LyLottery(accountAddr);
        _startIdx = 0;
    }

    function setRewards(
        uint256 issueNum,
        uint256[] memory ids,
        uint256 topNum,
        uint256 topValue,
        uint256 secondNum,
        uint256 secondValue
    ) public onlyOwner {
        require(ids.length == (topNum + secondNum), "ErrorSetRewardParam");

        uint256 totalValue = 0;
        for (uint i = 0; i < ids.length; i++) {
            Prize storage aPrize = _prizes[ids[i]];
            require(aPrize.issueNum == 0, 'SetRewardYet!');
            _allPrizes.push(ids[i]);

            aPrize.issueNum = issueNum;
            aPrize.nftId = ids[i];

            uint256 value = secondValue;
            if (i < topNum) {
                value = topValue;
                aPrize.rewardLevel = 1;
            } else {
                aPrize.rewardLevel = 2;
            }

            aPrize.rewardValue = value;
            totalValue += value;

            if (_startIdx > 0) {
                _unredeemPrize[_startIdx-1] = ids[i];
                _startIdx--;
            } else {
                _unredeemPrize.push(ids[i]);
            }
        }
        _issuePool[issueNum] = totalValue;

        if (issueNum > _maxIssueNum) {
            _maxIssueNum = issueNum;
        }
    }

    function payReward(uint256 issueNum) public payable {
        require(_issuePool[issueNum] == msg.value, "ErrorPayReward");
    }

    function redeem() external {
        address user = msg.sender;

        uint start = _startIdx;
        uint size = _unredeemPrize.length;
        uint256 totalPrizeValue = 0;
        for (uint i = start; i < size; i++) {
            uint256 nftId = _unredeemPrize[i];
            if (_lottery.checkOwnership(user, nftId)) {
                if (i > _startIdx) {
                    _unredeemPrize[i] = _unredeemPrize[_startIdx];
                }
                _startIdx++;
                uint256 thePrize = _prizes[nftId].rewardValue;
                totalPrizeValue += thePrize;

                emit Redeem(nftId, thePrize);
            }
        }

        require(totalPrizeValue > 0, "NoMorePrize");
        require(address(this).balance >= totalPrizeValue, "NotEnoughBalance");

        // transfer
        _cumPrizeByUser[user] += totalPrizeValue;
        (bool success, ) = user.call{value: totalPrizeValue}("");
        require(success, "RedeemFailed");
    }

    function getCummPrizeByUser() public view returns (uint256) {
        address user = msg.sender;
        return _cumPrizeByUser[user];
    }

    // return the prize redeemable by the msg.sender
    function getBalanceByUser() public view returns (uint256)
    {
        address user = msg.sender;
        uint256 totalPrize = 0;

        uint start = _startIdx;
        uint unredeemSize = _unredeemPrize.length - start;
        for (uint i = start; i < start + unredeemSize; i++) {
            uint256 nftId = _unredeemPrize[i];
            if (_lottery.checkOwnership(user, nftId)) {
                totalPrize += _prizes[nftId].rewardValue;
            }
        }
        return totalPrize;
    }

    function getPrizesByUser() 
        public 
        view 
        returns (Prize[] memory, uint256[] memory)
    {
        address user = msg.sender;
        uint size = _allPrizes.length;

        uint256[] memory myPrizes = new uint256[](size);
        uint validPrizeNum = 0;
        bool[] memory isIssueNums = new bool[](_maxIssueNum);
        uint issueSize = 0;
        for (uint i = 0; i < size; i++) {
            uint256 nftId = _allPrizes[i];
            if (_lottery.checkOwnership(user, nftId)) {
                myPrizes[validPrizeNum] = nftId;
                validPrizeNum++;

                uint256 issueNum = _prizes[nftId].issueNum - 1;
                // dedup
                if (!isIssueNums[issueNum]) {
                    isIssueNums[issueNum] = true;
                    issueSize++;
                }
            }
        }

        // collect prizes by the user
        Prize[] memory myValidPrizes = new Prize[](validPrizeNum);
        for (uint i = 0; i < validPrizeNum; i++) {
            myValidPrizes[i] = _prizes[myPrizes[i]];
        }

        // collect issue numbers this user won
        uint256[] memory issueNums = new uint256[](issueSize);
        uint idx = 0;
        for (uint i=0; i<isIssueNums.length; i++) {
            if (isIssueNums[i]) {
                issueNums[idx] = i+1;
                idx++;
            }
        }
        return (myValidPrizes, issueNums);
    }
}
