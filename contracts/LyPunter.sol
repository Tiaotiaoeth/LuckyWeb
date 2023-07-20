// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LyLottery.sol";

contract LyPunter is Ownable {

    struct Prize {
        uint256 issueNum;       // the issue number
        uint256 rewardLevel;    // the prize level, 1 for top prize, 2 for secondary prize
        uint256 rewardValue;    // the prize amount
    }

    // instance of LyLottery
    LyLottery immutable private _lottery; 

    // the prize pool for each issue
    mapping(uint256 => uint256) private _issuePool;
    // all prizes, key is NFT id
    mapping(uint256 => Prize) private _prizes;
    // cummulative prize withdrawed by each user
    mapping(address => uint256) private _cumPrizeByUser;
    // un-redeemed prizes' nft
    uint256[] private _unredeemPrize;
    // start index of unredeemed prize array, make un-redeemed prized compact
    uint private _startIdx;

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
            aPrize.issueNum = issueNum;

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

    // return the number and prizes redeemable by the msg.sender
    function getPrizesByUser() public view returns (uint, Prize[] memory) {
        address user = msg.sender;

        uint start = _startIdx;
        uint unredeemSize = _unredeemPrize.length - start;
        Prize[] memory redeemable = new Prize[](unredeemSize);
        uint validNum = 0;
        for (uint i = start; i < start + unredeemSize; i++) {
            uint256 nftId = _unredeemPrize[i];
            if (_lottery.checkOwnership(user, nftId)) {
                redeemable[validNum] = _prizes[nftId];
                validNum++;
            }
        }

        return (validNum, redeemable);
    }

}
