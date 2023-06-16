// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LyLottery.sol";

contract LyPunter is Ownable {

    LyLottery immutable private _lottery;

    // the prize pool for each issue
    mapping(uint256 => uint256) private _issuePool;
    // not redeemed balance, key is NFT id
    mapping(uint256 => uint256) private _prizeBalance;
    // cummulative prize of each user
    mapping(address => uint256) private _cummPrize;

    event Redeem(uint256 indexed nftId, uint256 value);

    constructor(address accountAddr) {
        _lottery = LyLottery(accountAddr);
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
            uint256 value = secondValue;
            if (i < topNum) {
                value = topValue;
            }
            _prizeBalance[ids[i]] = value;
            totalValue += value;
        }
        _issuePool[issueNum] = totalValue;
    }

    function payReward(uint256 issueNum) public payable {
        require(_issuePool[issueNum] == msg.value, "ErrorPayReward");
    }

    function redeem(uint256 nftId) external {
        address _user = msg.sender;
        require(_lottery.checkOwnership(_user, nftId), "NotHolder");

        uint256 _prize = _prizeBalance[nftId];
        require(_prize > 0, "NoPrize");
        require(address(this).balance >= _prize, "NotEnoughBalance");

        // transfer
        _prizeBalance[nftId] = 0;
        _cummPrize[_user] += _prize;
        (bool success, ) = _user.call{value: _prize}("");
        require(success, "RedeemFailed");

        emit Redeem(nftId, _prize);
    }
}
