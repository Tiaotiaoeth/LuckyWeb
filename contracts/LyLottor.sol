// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract LyLottor is Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // address to local tokenId
    mapping(address => uint256) private _localIds;
    // addresses invited by a distributor
    mapping(uint256 => address[]) private _inviteAddrs;
    mapping(uint256 => mapping(address => bool)) private _invitedMap;
    // balance of each distributor, from tokenId to balance
    mapping(uint256 => uint256) private _distBalance;
    // the cummulative bonus of each distributor
    mapping(uint256 => uint256) private _distCummBonus;
    // the tokenids of distributors for each issue
    mapping(uint256 => uint256[]) private _issueDists;
    // the total bonus of all distributors for each issue
    mapping(uint256 => uint256) private _issueTotalBonus;
    // the record for each distributor and each issue
    mapping(uint256 => mapping(uint256 => uint256)) private _issueDistRecord;

    event LyLottorRecord(uint256 indexed issueNum, uint256 lotteryId, uint256 indexed tokenId, uint256 bonus);
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
        return _localIds[msg.sender];
    }

    function getBalance(uint256 _tokenId) public view returns (uint256) {
        return _distBalance[_tokenId];
    }

    function getCummBonus(uint256 _tokenId) public view returns (uint256) {
        return _distCummBonus[_tokenId];
    }

    // the total bonus of all distributors by the issue
    function getTotalBonus(uint256 _issueNum) external view returns (uint256) {
        return _issueTotalBonus[_issueNum];
    }

    function getInvitationNum(uint256 tokenId) external view returns (uint256) {
        return _inviteAddrs[tokenId].length;
    }

    /*
     * record for each sell
     * _issueNum: the issue number
     * _lotteryId: the id of the lottery
     * _tokenId: the tokenId of this distributor
     * _bonus: the bonus of these lottery
     */
    function record(
        uint256 _issueNum,
        uint256 _lotteryId,
        uint256 _tokenId,
        uint256 _bonus
    ) external onlyOwner {
        uint256 currBonus = _issueDistRecord[_issueNum][_tokenId];
        if (currBonus == 0) {
            _issueDists[_issueNum].push(_tokenId);
        }
        _issueDistRecord[_issueNum][_tokenId] = currBonus + _bonus;
        _distBalance[_tokenId] += _bonus;
        _distCummBonus[_tokenId] += _bonus;

        _issueTotalBonus[_issueNum] += _bonus;

        emit LyLottorRecord(_issueNum, _lotteryId, _tokenId, _bonus);
    }

    /* LyIssue transfer distribution fee to LyLottor */
    function payBonus(uint256 _issueNum, uint256 amount) external payable onlyOwner {
        require(amount==msg.value, "ErrorLottorBonus");
        emit PayDistributionBonus(_issueNum, amount);
    }

    function withdraw(uint256 amount) external {
        address _user = msg.sender;
        uint256 tokenId = _localIds[_user];
        require(tokenId > 0, "NotPermitted.");
        require(_distBalance[tokenId] >= amount, "NotEnough");

        _distBalance[tokenId] -= amount;
        (bool success, ) = _user.call{value: amount}("");
        require(success, "WithdrawFailed");

        emit Withdraw(tokenId, amount);
    }
}
