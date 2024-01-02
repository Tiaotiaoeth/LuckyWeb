// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts@4.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.0.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.0.0/utils/Counters.sol";

contract LyLottery is ERC721, Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

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

    function balanceOf(address owner) public view override returns (uint256) {
        return ERC721.balanceOf(owner);
    }

    function checkOwnership(address owner, uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == owner;
    }

    // return global token id and local issue lottery id
    function safeMint(address to) public returns (uint256) {
        require(_admin == msg.sender, "NotAllowed|SetAdminFirst");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        return tokenId;
    }

    function getMaxTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
