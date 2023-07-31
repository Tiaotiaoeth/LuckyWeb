// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract LyLottor is Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct IssueStatus {
        bool payed;         // whether payed by LyIssuer
        uint256 totalBonus; // total bonus of this issue
    }
    // address to local tokenId
    mapping(address => uint256) private _localIds;
    // addresses invited by a distributor
    mapping(uint256 => address[]) private _inviteAddrs;
    // the map records the punter who is firstly invited by the distributor by token id 
    mapping(address => uint256) private _invitedMap;
    // balance of each distributor, from tokenId to balance
    mapping(uint256 => uint256) private _distBalance;
    // the cummulative bonus of each distributor
    mapping(uint256 => uint256) private _distCummBonus;
    // the tokenids of distributors for each issue
    mapping(uint256 => uint256[]) private _issueDists;
    // the total bonus of all distributors for each issue
    mapping(uint256 => IssueStatus) private _issueTotalBonus;
    // the record for each distributor and each issue
    mapping(uint256 => mapping(uint256 => uint256)) private _issueDistRecord;

    event LyLottorRecord(uint256 indexed issueNum, uint256 indexed tokenId, uint256 bonus);
    event Withdraw(uint256 indexed tokenId, uint256 amount);
    event PayDistributionBonus(uint256 _issueNum, uint256 amount);

    constructor(address defaultDistributor) {
        _tokenIdCounter.increment();
        _localIds[defaultDistributor] = 1;
    }

    /* each distributor must register for a local id */
    function register() public {
        address _user = msg.sender;
        require(_localIds[_user] == 0, "RegisteredYet!");

        // valid tokenId starts with 1
        _tokenIdCounter.increment();
        uint256 _tokenId = _tokenIdCounter.current();
        _localIds[_user] = _tokenId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return (0 < tokenId) && (tokenId <= _tokenIdCounter.current());
    }

    function getTokenId() public view returns (uint256) {
        uint256 _tokenId = _localIds[msg.sender];
        require(_tokenId > 0, "Invalid TokenID");

        return _tokenId;
    }

    function getBalance() public view returns (uint256) {
        uint256 _tokenId = getTokenId();
        return _distBalance[_tokenId];
    }

    function getCummBonus() public view returns (uint256) {
        uint256 _tokenId = getTokenId();
        return _distCummBonus[_tokenId];
    }

    // the total bonus of all distributors by the issue
    function getTotalBonus(
        uint256 _issueNum
    ) external view returns (uint256) {
        return _issueTotalBonus[_issueNum].totalBonus;
    }

    function getInvitationNum() external view returns (uint256) {
        uint256 _tokenId = getTokenId();
        return _inviteAddrs[_tokenId].length;
    }

    function getInvitedAddress() 
        external view returns (address[] memory) 
    {
        uint256 _tokenId = getTokenId();
        return _inviteAddrs[_tokenId];
    }

    function getLottorsWithBonus()
        external view returns (uint256[] memory)
    {
        uint256 maxTokenId = _tokenIdCounter.current();
        uint256[] memory cumBonus = new uint256[](maxTokenId-1);
        for (uint i = 2; i <= maxTokenId; i++) {
            uint256 bonus = _distCummBonus[i];
            cumBonus[i-2] = bonus;
        }
        return cumBonus;
    }

    /*
     * record for each sell
     * _user: who buy a lottery
     * _issueNum: the issue number
     * _tokenId: the tokenId of this distributor
     * _bonus: the bonus of these lottery
     */
    function record(
        address _user,
        uint256 _issueNum,
        uint256 _tokenId,
        uint256 _bonus
    ) external onlyOwner {
        uint256 currBonus = _issueDistRecord[_issueNum][_tokenId];
        if (currBonus == 0) {
            _issueDists[_issueNum].push(_tokenId);
        }
        _issueDistRecord[_issueNum][_tokenId] = currBonus + _bonus;
        _issueTotalBonus[_issueNum].totalBonus += _bonus;

        if (_invitedMap[_user] == 0) {
            _invitedMap[_user] = _tokenId;
            _inviteAddrs[_tokenId].push(_user);
        }

        emit LyLottorRecord(_issueNum, _tokenId, _bonus);
    }

    /* LyIssue transfer distribution fee to LyLottor */
    function payBonus(
        uint256 _issueNum, 
        uint256 amount
    ) external payable onlyOwner {
        require(amount==msg.value, "ErrorLottorBonus");

        IssueStatus memory istatus = _issueTotalBonus[_issueNum];
        require(!istatus.payed, "IssueLottorBonusPayedYet.");

        istatus.payed = true;
        uint256[] memory dists = _issueDists[_issueNum];
        for (uint i = 0; i < dists.length; i++) {
            uint256 distId = dists[i];
            uint256 value = _issueDistRecord[_issueNum][distId];
            _distBalance[distId] += value;
            _distCummBonus[distId] += value;
        }

        emit PayDistributionBonus(_issueNum, amount);
    }

    function withdraw() external {
        address _user = msg.sender;
        uint256 tokenId = _localIds[_user];
        require(tokenId > 0, "NotPermitted.");

        uint256 amount = _distBalance[tokenId];
        require(amount > 0, "NotEnough");

        _distBalance[tokenId] = 0;
        (bool success, ) = _user.call{value: amount}("");
        require(success, "WithdrawFailed");

        emit Withdraw(tokenId, amount);
    }
}
