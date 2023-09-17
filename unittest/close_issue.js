const { expect } = require("chai");
const { ethers } = require("hardhat");
const { issuer_addr } = require("./test.json");
const { user_pks } = require("./signer.json");

describe("LuckyWeb contract", function() {
  it("Clear Issue", async function() {

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

    const _NOT_START = 0;
    const _STARTED = 1;
    const _FREEZED = 2;
    const _CLOSED = 3;
    var num = await issue.getIssueNum();
    var status = await issue.getIssueStatus();
    console.log('issue number:' + num + ', status: ' + status);
    console.log('after betting...............');
    var num1 = await issue.connect(_signer1).getLotteryNum(num);
    var num2 = await issue.connect(_signer2).getLotteryNum(num);
    var num3 = await issue.connect(_signer3).getLotteryNum(num);
    var num4 = await issue.connect(_signer4).getLotteryNum(num);
    console.log('bet count: user1=' + num1 + ', user2=' + num2 + ', user3=' + num3 + ', user4=' + num4);

         if (status == _FREEZED) {
        [pool, size] = await issue.getBalanceAndSize();
        console.log('Pool: ' + pool + ', size: ' + size);
        await issue.closeIssue();
        await issue.doLottery();
    }
    if (status == _CLOSED) {
        await issue.doLottery();
    }


    var rewards;
    for (var i=0; i < 4; i++) {
        var balance = await ethers.provider.getBalance(signers[i].address);
        console.log('user ' + (i+1) + ' balance=' + balance);

        var prizes = await issue.connect(signers[i]).allHistory(false);
        //console.log(prizes);
        for (var j=0; j<prizes.length; j++) {
            console.log('issue=' + prizes[j].issueNum + ', size= ' + prizes[j].size);
            console.log('user' + (i+1) + ' rewards ' + prizes[j].userRewardLocalIds);
            console.log('tickets:' + prizes[j].userTicketLocalIds);
            rewards = prizes[j].localids;
        }
    }
    console.log('issue rewards: ' + rewards);

    var postTreasuryBalance = await ethers.provider.getBalance(_treasurySign.address);
    console.log('treasury balance=' + postTreasuryBalance * 1e-12);
    var postIssuerBalance = await ethers.provider.getBalance(_issuerSign.address);
    console.log('issuer balance=' + postIssuerBalance *1e-12);
    var postDefDistBalance = await ethers.provider.getBalance(_dist1.address);
    console.log('default distributor balance=' + postDefDistBalance *1e-12);
    var postDistBalance = await ethers.provider.getBalance(_dist2.address);
    console.log('distributor balance=' + postDistBalance *1e-12);

    var postLottorBalance = await ethers.provider.getBalance(issue.getLyLottorAddr());
    console.log('Lottor contract balance=' + postLottorBalance * 1e-12);
    var postPunterBalance = await ethers.provider.getBalance(issue.getLyPunterAddr());
    console.log('Punter contract balance=' + postPunterBalance *1e-12);

    num = await issue.getIssueNum();
    status = await issue.getIssueStatus();
    console.log('issue number:' + num + ', status: ' + status);
  });
});
