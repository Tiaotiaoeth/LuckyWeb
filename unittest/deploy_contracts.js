const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyWeb contract", function() {
  it("Deployment 4 contracts", async function() {
    var url = 'http://localhost:8545';
    var provider = new ethers.providers.JsonRpcProvider(url);
    const _dist1 = new ethers.Wallet('0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd', provider);
    const _dist2 = new ethers.Wallet('0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0', provider);
    const _treasury = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    const _issuer = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

    const LyLottery = await ethers.getContractFactory("LyLottery");
    const lottery = await LyLottery.deploy();
    //const lottery = await LyLottery.attach('');
    await lottery.deployed();
    let lotteryAddr = lottery.address;
    console.log('LyLottery deployed at:'+ lotteryAddr);

    const LyIssuer = await ethers.getContractFactory("LyIssuer");
    constructorArgs = [_issuer, _dist1.address, lotteryAddr]
    const issue = await LyIssuer.deploy(...constructorArgs);
    //const issue = await LyIssuer.attach('');
    await issue.deployed();
    lottery.setAdmin(issue.address);
    console.log('LyIssue deployed at:' + issue.address);

    const treasuryBalance = await ethers.provider.getBalance(_treasury.address);
    console.log('treasury balance:' + treasuryBalance);

    const LyLottor = await ethers.getContractFactory("LyLottor");
    const lottor = await LyLottor.attach(issue.getLyLottorAddr());
    await lottor.deployed();

    await lottor.connect(_dist2).register();
    var tokenId = await lottor.connect(_dist2).getTokenId();
    console.log('token id (expect 2):' + tokenId);
  });
});
