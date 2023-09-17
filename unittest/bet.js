const { expect } = require("chai");
const { ethers } = require("hardhat");
const { issuer_addr } = require("./test.json");
const { user_pks } = require("./signer.json");

describe("LuckyWeb contract", function() {
  it("Bet and Clear Issue", async function() {

    const LyIssuer = await ethers.getContractFactory("LyIssuer");
    const issue = await LyIssuer.attach(issuer_addr);
    await issue.deployed();

    const LyPunter = await ethers.getContractFactory("LyPunter");
    const punter = await LyPunter.attach(issue.getLyPunterAddr());
    await punter.deployed();

    var url = 'http://localhost:8545';
    var provider = new ethers.providers.JsonRpcProvider(url);
    const _signer1 = new ethers.Wallet(user_pks[0], provider);
    const _signer2 = new ethers.Wallet(user_pks[1], provider);
    const _signer3 = new ethers.Wallet(user_pks[2], provider);
    const _signer4 = new ethers.Wallet(user_pks[3], provider);
    let signers = [_signer1, _signer2, _signer3, _signer4];
    const _treasurySign = _signer1;
    const _issuerSign = _signer4;
    const _dist1 = _signer3;
    const _dist2 = _signer2;

    console.log('before betting...............');
    for (var i=0; i < 4; i++) {
        var balance = await ethers.provider.getBalance(signers[i].address);
        console.log('user ' + (i+1) + ' balance=' + balance);
    }
    var treasuryBalance = await ethers.provider.getBalance(_treasurySign.address);
    console.log('treasury balance:' + treasuryBalance);
    var issuerBalance = await ethers.provider.getBalance(_issuerSign.address);
    console.log('issuer balance:' + issuerBalance);
    var defDistBalance = await ethers.provider.getBalance(_dist1.address);
    console.log('default distributor balance:' + defDistBalance);
    var distBalance = await ethers.provider.getBalance(_dist2.address);
    console.log('distributor balance:' + distBalance);

         var lottorBalance = await ethers.provider.getBalance(issue.getLyLottorAddr());
    console.log('Lottor contract balance:' + lottorBalance);
    var punterBalance = await ethers.provider.getBalance(issue.getLyPunterAddr());
    console.log('Punter contract balance:' + punterBalance);

    let num = await issue.getIssueNum();
    var status = await issue.getIssueStatus();
    console.log('issue number:' + num + ', status: ' + status);

    const _NOT_START = 0;
    const _STARTED = 1;
    const _FREEZED = 2;
    const _CLOSED = 3;
    if (status == _FREEZED) {
        [pool, size] = await issue.getBalanceAndSize();
        console.log('Pool: ' + pool + ', size: ' + size);
        await issue.closeIssue();
        await issue.doLottery();
    }
    if (status == _CLOSED) {
        await issue.doLottery();
    }


    await issue.connect(_signer1).setFlagOneAddrOneBet(false);

    var defaultDistId = 1;
    var realDistId = 2;
    await issue.connect(_signer1).bet(defaultDistId, 1, { value: ethers.utils.parseEther("0.001") });
    await issue.connect(_signer2).bet(realDistId, 1, { value: ethers.utils.parseEther("0.0011") });
    var [pool, size] = await issue.getBalanceAndSize();
    console.log('Pool: ' + pool + ', size: ' + size);

         for (var t = 0; t < 1; t++) {
        console.log('betting ' + (1+t));
        await issue.connect(_signer3).bet(realDistId, 250, { value: ethers.utils.parseEther("0.25"), gasLimit: ethers.utils.parseEther("0.00000000003") });
        //await issue.connect(_signer4).bet(realDistId, 250, { value: ethers.utils.parseEther("0.25"), gasLimit: ethers.utils.parseEther("0.00000000003") });
        await issue.connect(_signer4).bet(0, 250, { value: ethers.utils.parseEther("0.25"), gasLimit: ethers.utils.parseEther("0.00000000003") });
        await issue.connect(_signer1).bet(defaultDistId, 250, { value: ethers.utils.parseEther("0.25"), gasLimit: ethers.utils.parseEther("0.00000000003") });
        await issue.connect(_signer2).bet(realDistId, 250, { value: ethers.utils.parseEther("0.25"), gasLimit: ethers.utils.parseEther("0.00000000003") });
    }

  });
});
