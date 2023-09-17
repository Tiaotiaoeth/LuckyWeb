const { expect } = require("chai");
const { ethers } = require("hardhat");
const { user_pks } = require("./signer.json");

describe("LuckyWeb contract", function() {
  it("Deployment 4 contracts", async function() {
    var url = 'http://localhost:8545';
    var provider = new ethers.providers.JsonRpcProvider(url);
    const _signer1 = new ethers.Wallet(user_pks[0], provider);
    const _signer2 = new ethers.Wallet(user_pks[1], provider);
    const _signer3 = new ethers.Wallet(user_pks[2], provider);
    const _signer4 = new ethers.Wallet(user_pks[3], provider);
    const _dist1 = _signer3;
    const _dist2 = _signer2;
    const _treasury = _signer1;
    const _issuer = _signer4.address;

    const LyLottery = await ethers.getContractFactory("LyLottery");
    const lottery = await LyLottery.deploy();
    //const lottery = await LyLottery.attach('');
    await lottery.deployed();
    let lotteryAddr = lottery.address;
    console.log('LyLottery deployed at:'+ lotteryAddr);

    const LyIssuer = await ethers.getContractFactory("LyIssuer");
    constructorArgs = [_treasury.address, _issuer, _dist1.address, lotteryAddr]
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
