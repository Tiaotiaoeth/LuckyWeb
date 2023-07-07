from web3 import Web3
from decimal import Decimal

def check_link_balance():
    w3 = Web3(Web3.HTTPProvider('https://goerli-rollup.arbitrum.io/rpc'))

    link_addr = '0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28'
    link_abi = open('./monitor/LinkToken.abi').read()
    link_token = w3.eth.contract(address=link_addr, abi=link_abi)

    vrfv2_addr = '0x5387161c011850E69e36dE5B7be7d55B90d86994'
    balance = link_token.functions.balanceOf(vrfv2_addr).call()
    balance = w3.from_wei(balance, 'ether')
    print('Link balance', balance)


check_link_balance()
