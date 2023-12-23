import { createPublicClient, createWalletClient, http } from 'viem';
import { arbitrumGoerli } from 'viem/chains';

import { LyIssuerAbi } from './AbiLyIssuer';
import { LyLottorAbi } from './AbiLyLottor';
import { LyPunterAbi } from './AbiLyPunter';

const LyIssuerAddress = process.env.NEXT_PUBLIC_ISSUER_CONTACT_ADDRESS;
const LyLottorAddress = process.env.NEXT_PUBLIC_LOTTOR_CONTACT_ADDRESS;
const LyPunterAddress = process.env.NEXT_PUBLIC_PUNTER_CONTACT_ADDRESS;

export const LyIssuerContract = {
  address: LyIssuerAddress,
  abi: LyIssuerAbi,
};

export const LyLottorContract = {
  address: LyLottorAddress,
  abi: LyLottorAbi,
};

export const LyPunterContract = {
  address: LyPunterAddress,
  abi: LyPunterAbi,
};

export const publicClient = createPublicClient({
  chain: arbitrumGoerli,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: arbitrumGoerli,
  transport: http(),
});
