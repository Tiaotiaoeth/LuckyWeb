// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

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

    function ownerOf(uint256 tokenId) public view override returns (address) {
        address theOwner = _ownerOf(tokenId);
        require(theOwner != address(0), "ERC721: invalid token ID");
        return theOwner;
    }

    function checkOwnership(address owner, uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) == owner;
    }

    // return global token id and local issue lottery id
    function safeMint(address to) public returns (uint256) {
        require(_admin == msg.sender, "NotAllowed");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        return tokenId;
    }

    function getMaxTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
