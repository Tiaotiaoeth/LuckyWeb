import sys
from web3 import Web3
from decimal import Decimal

code_map = {
    0: 'not start',
    1: 'started',
    2: 'freezed',
    3: 'closed'
}
def decode_status(code):
    return code_map.get(code, 'unknown')

def main():
    if len(sys.argv) < 2:
        print('Usage python %s close|lottery' % sys.argv[0])
        return

    w3 = Web3(Web3.HTTPProvider('https://goerli-rollup.arbitrum.io/rpc'))

    admin_addr = "0x8cE50606048e70051da10dFaAc45d6f4C4cCe683"
    admin_balance = balance_from = w3.from_wei(w3.eth.get_balance(admin_addr), 'ether')
    print('admin balance: ', admin_balance)

    lyissue_addr = '0x991C0B6f062cC1f3d499F983444B91F49D1Bf966'
    lyissue_abi = open('./monitor/LyIssuer.ABI').read()
    lyissue = w3.eth.contract(address=lyissue_addr, abi=lyissue_abi)
    issue_num = lyissue.functions.getIssueNum().call()

    pk = "6a80227400cc48ff81f096f4bde0a763e4dd4afc9a3a5f8fc1e6d17d5c53314a"

    status_code = lyissue.functions.getIssueStatus().call(
        {
            'from': admin_addr
        }
    )
    status = decode_status(status_code)
    print('issue number=%d, status=%s' % (issue_num, status))

    if sys.argv[1] == 'close':
        try_close(w3, status_code, lyissue, admin_addr, pk)
    elif sys.argv[1] == 'lottery':
        try_lottery(w3, status_code, lyissue, admin_addr, pk)
    else:
        print('Nothing to do')

def try_close(w3, status_code, lyissue, admin_addr, pk):
    if status_code != 2:
        print('cannot close issue due to status')
        return

    close_rsp = lyissue.functions.closeIssue()
    tx = {
        'from': admin_addr,
        'gas': 2500000,
        'gasPrice': w3.eth.gas_price * 2,
        'nonce': w3.eth.get_transaction_count(admin_addr)
    }
    transaction = close_rsp.build_transaction(tx)
    signed_tx = w3.eth.account.sign_transaction(transaction, pk)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction).hex()
    print('doClose() transaction hash', tx_hash)
    w3.eth.wait_for_transaction_receipt(tx_hash)

    issue_num = lyissue.functions.getIssueNum().call()
    status_code = lyissue.functions.getIssueStatus().call(
        {
            'from': admin_addr
        }
    )
    status = decode_status(status_code)
    print('issue number=%d, status=%s' % (issue_num, status))

def try_lottery(w3, status_code, lyissue, admin_addr, pk):
    if status_code != 3:
        print('cannot lottery issue due to status')
        return

    close_rsp = lyissue.functions.doLottery()
    tx = {
        'from': admin_addr,
        'gas': 4500000,
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(admin_addr)
    }
    transaction = close_rsp.build_transaction(tx)
    signed_tx = w3.eth.account.sign_transaction(transaction, pk)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction).hex()
    print('doLottery() transaction hash', tx_hash)
    w3.eth.wait_for_transaction_receipt(tx_hash)

    issue_num = lyissue.functions.getIssueNum().call()
    status_code = lyissue.functions.getIssueStatus().call(
        {
            'from': admin_addr
        }
    )
    status = decode_status(status_code)
    print('issue number=%d, status=%s' % (issue_num, status))

    #web3.to_wei(Decimal('3841357.360894980500000001'), 'ether')

    #tx_hash = greeter.functions.setGreeting('Nihao').transact()
    #tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

main()
