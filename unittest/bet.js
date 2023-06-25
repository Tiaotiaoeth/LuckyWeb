const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyWeb contract", function() {
  it("Bet and Clear Issue", async function() {

    const LyIssuer = await ethers.getContractFactory("LyIssuer");
    const issue = await LyIssuer.attach('0x3Aa5ebB10DC797CAC828524e59A333d0A371443c');
    await issue.deployed();

    var url = 'http://localhost:8545';
    var provider = new ethers.providers.JsonRpcProvider(url);
    const _signer1 = new ethers.Wallet('0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1', provider);
    const _signer2 = new ethers.Wallet('0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd', provider);
    const _signer3 = new ethers.Wallet('0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa', provider);
    const _signer4 = new ethers.Wallet('0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61', provider);
    let signers = [_signer1, _signer2, _signer3, _signer4];
    const _issuerSign = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider);
    const _treasurySign = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    const _dist1 = new ethers.Wallet('0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd', provider);
    const _dist2 = new ethers.Wallet('0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0', provider);

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
    }

    var defaultDistId = 1;
    var realDistId = 2;
    await issue.connect(_signer1).bet(defaultDistId, 1, { value: ethers.utils.parseEther("0.001") });
    await issue.connect(_signer2).bet(realDistId, 1, { value: ethers.utils.parseEther("0.0011") });
    var [pool, size] = await issue.getBalanceAndSize();
    console.log('Pool: ' + pool + ', size: ' + size);

    await issue.connect(_signer1).bet(defaultDistId, 3, { value: ethers.utils.parseEther("0.003") });
    await issue.connect(_signer2).bet(realDistId, 3, { value: ethers.utils.parseEther("0.003") });
    await issue.connect(_signer3).bet(realDistId, 3, { value: ethers.utils.parseEther("0.003") });
    await issue.connect(_signer4).bet(0, 3, { value: ethers.utils.parseEther("0.003") });


    status = await issue.getIssueStatus();
    console.log('issue number:' + num + ', status: ' + status);
    console.log('after betting...............');
    if (status == _FREEZED) {
        [pool, size] = await issue.getBalanceAndSize();
        console.log('Pool: ' + pool + ', size: ' + size);
        await issue.closeIssue();
    }

    for (var i=0; i < 4; i++) {
        var balance = await ethers.provider.getBalance(signers[i].address);
        console.log('user ' + (i+1) + ' balance=' + balance);
    }
    treasuryBalance = await ethers.provider.getBalance(_treasurySign.address);
    console.log('treasury balance (expect 940):' + treasuryBalance * 1e-12);
    issuerBalance = await ethers.provider.getBalance(_issuerSign.address);
    console.log('issuer balance (expect 560):' + issuerBalance*1e-12);
    defDistBalance = await ethers.provider.getBalance(_dist1.address);
    console.log('default distributor balance (expect 700):' + defDistBalance*1e-12);
    distBalance = await ethers.provider.getBalance(_dist2.address);
    console.log('distributor balance (epect 0):' + distBalance*1e-12);

    lottorBalance = await ethers.provider.getBalance(issue.getLyLottorAddr());
    console.log('Lottor contract balance (expect 700):' + lottorBalance * 1e-12);
    punterBalance = await ethers.provider.getBalance(issue.getLyPunterAddr());
    console.log('Punter contract balance (expect 11200):' + punterBalance*1e-12);
  });
});
