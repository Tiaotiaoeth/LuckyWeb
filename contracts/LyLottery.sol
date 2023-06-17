// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LyLottery is ERC721, ERC721Burnable, Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _localIdCounter;

    // from global token id to local id
    mapping(uint256 => uint256) private _issueLotteryId;
    // administrator address
    address private _admin;

    constructor() ERC721("LuckyBet", "LYB") {
    }

    function setAdmin(address admin) public onlyOwner {
        _admin = admin;
    }

    function getTokenNum() public view returns (uint256) {
        // the number of tokens
        return ERC721.balanceOf(msg.sender);
    }

    function balanceOf(address owner) public onlyOwner view override returns (uint256) {
        // the number of tokens
        return ERC721.balanceOf(owner);
    }

    function ownerOf(uint256 tokenId) public onlyOwner view override returns (address) {
        address theOwner = _ownerOf(tokenId);
        require(theOwner != address(0), "ERC721: invalid token ID");
        return theOwner;
    }

    function checkOwnership(address owner, uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) == owner;
    }

    function reset() public {
        require(_admin == msg.sender, "NotAllowed");
        _localIdCounter.reset();
        _localIdCounter.increment();
    }

    // return global token id and local issue lottery id
    function safeMint(address to) public returns (uint256, uint256) {
        require(_admin == msg.sender, "NotAllowed");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        uint256 localId = _localIdCounter.current();
        _localIdCounter.increment();
        _issueLotteryId[tokenId] = localId;
        return (tokenId, localId);
    }
}
