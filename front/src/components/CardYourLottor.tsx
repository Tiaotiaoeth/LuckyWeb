import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { TwitterShareButton } from 'react-share';
import { formatEther, formatUnits, parseUnits } from 'viem';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';

import ApplyLottor from '@/components/ApplyLottor';

import { LyLottorContract, publicClient } from '../utils/client';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
export default function CardYourLottor() {
  const [tokenId, setTokenId] = useState();
  const [exists, setExists] = useState(false);
  const [invitationNum, setInvitationNum] = useState();
  const [cummBonus, setCummBonus] = useState([
    parseUnits('0', 0),
    parseUnits('0', 0),
  ]);
  const [balanceNum, setBalanceNum] = useState();

  const { data: walletClient } = useWalletClient();

  // Clipboard Clipboard
  const [value, setValue] = React.useState(
    'https://testnet.luckyweb.io/?shareId='
  );
  const [copied, setCopied] = React.useState(false);
  const onClipChange = React.useCallback(({ target: { value } }) => {
    setValue(value);
    setCopied(true);
  }, []);
  const onClipClick = React.useCallback(({ target: { innerText } }) => {
    // console.log(`Clicked on "${innerText}"!`);
  }, []);
  const onClipCopy = React.useCallback(() => {
    setCopied(true);
  }, []);

  // Clipboard Clipboard

  const getIndexNum = async () => {
    try {
      const readTokenId = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'getTokenId',
        account: walletClient?.account,
      });
      setTokenId(readTokenId);

      // setValue(copyUrl);

      const copyUrl = `https://testnet.luckyweb.io/?shareId=${readTokenId}`;

      setValue(copyUrl);

      const readExists = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'exists',
        args: [readTokenId],
      });
      setExists(readExists);

      const readInvitationNum = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'getInvitationNum',
        account: walletClient?.account,
      });
      setInvitationNum(readInvitationNum);

      const readCummBonus = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'getCummBonus',
        account: walletClient?.account,
      });
      setCummBonus(readCummBonus);

      const readBalanceNum = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'getBalance',
        account: walletClient?.account,
      });
      setBalanceNum(readBalanceNum);
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };
  useEffect(() => {
    // getTopLottor();
    getIndexNum();
    setExists(false); // true
  }, [walletClient, tokenId]);

  const validTokenId: bigint = tokenId !== undefined ? tokenId : BigInt(0);
  const RtnTokenId = tokenId !== undefined ? tokenId.toString() : '';
  const validInvitationNum =
    invitationNum !== undefined ? invitationNum.toString() : '';

  const validCummBonus =
    cummBonus[0] !== undefined ? formatEther(cummBonus[0]) : '';

  const validCummBonusBlock =
    cummBonus[1] !== undefined ? formatEther(cummBonus[1]) : '';

  const validBalanceNum =
    balanceNum !== undefined ? formatEther(balanceNum) : '';

  const shareUrl = `https://testnet.luckyweb.io/?shareId=${RtnTokenId}`;
  const shareTitle = 'LuckyWeb';

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing,
  } = usePrepareContractWrite({
    ...LyLottorContract,
    functionName: 'withdraw',
    account: walletClient?.account,
  });
  // console.log('config', config);
  const {
    data,
    error,
    isLoading: isWriteLoading,
    isError: isWriteError,
    write,
  } = useContractWrite(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      {exists ? (
        <div>
          <div className="mx-auto   max-w-[1100px]  ">
            <div className="  mb-16  flex  items-center    justify-between  ">
              <h2 className="text-[40px] font-medium text-white">My Lottor</h2>
            </div>
            <div className=" mb-16 flex justify-between">
              <div className=" rounded-xl  bg-gradient-to-tr   from-[#0042ff3d]  to-[#eb001b3d] ">
                <img
                  src={`${router.basePath}/assets/images/my-lottor.png`}
                  alt="join now"
                  className="w-[400px]"
                />
              </div>
              <div className="ml-6 flex-1 gap-5 rounded-xl bg-[#2A283D] p-10 shadow-[0px_15px_35px_0px_rgba(0,0,0,0.20)]">
                <div className="flex  justify-between">
                  <div className=" text-base font-semibold text-[#908CB8]">
                    Lucky Lottor{' '}
                  </div>
                  <div className="flex  items-center   gap-x-2">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.92154 0.571247C8.2077 -0.190416 9.7923 -0.190416 11.0785 0.571247L15.9215 3.43932C17.2077 4.20099 18 5.6086 18 7.13192V12.8681C18 14.3914 17.2077 15.799 15.9215 16.5607L11.0785 19.4288C9.7923 20.1904 8.20769 20.1904 6.92154 19.4288L2.07846 16.5607C0.792305 15.799 0 14.3914 0 12.8681V7.13192C0 5.6086 0.792305 4.20099 2.07846 3.43932L6.92154 0.571247ZM9 5.75C8.30964 5.75 7.75 6.30964 7.75 7C7.75 7.41421 7.41421 7.75 7 7.75C6.58579 7.75 6.25 7.41421 6.25 7C6.25 5.48122 7.48122 4.25 9 4.25C10.5188 4.25 11.75 5.48122 11.75 7C11.75 7.54634 11.5899 8.05757 11.3138 8.48663C11.1409 8.75537 10.9387 9.01194 10.7523 9.24363L10.6518 9.36825C10.4971 9.5597 10.3551 9.73544 10.2239 9.91577C9.90029 10.3605 9.75 10.6947 9.75 11V11.5C9.75 11.9142 9.41421 12.25 9 12.25C8.58579 12.25 8.25 11.9142 8.25 11.5V11C8.25 10.2007 8.64241 9.53977 9.01096 9.03325C9.16669 8.81923 9.33733 8.60814 9.4925 8.41619L9.58364 8.30329C9.76883 8.07313 9.92648 7.87065 10.0524 7.67495C10.1774 7.48068 10.25 7.24996 10.25 7C10.25 6.30964 9.69036 5.75 9 5.75ZM9.75 14C9.75 13.5858 9.41421 13.25 9 13.25C8.58579 13.25 8.25 13.5858 8.25 14V15C8.25 15.4142 8.58579 15.75 9 15.75C9.41421 15.75 9.75 15.4142 9.75 15V14Z"
                          fill="#0EE98D"
                        />
                      </svg>
                    </span>
                    <Link
                      href="/"
                      className="text-sm   leading-6 tracking-wide text-[#0EE98D]"
                    >
                      How to become a Lottor?
                    </Link>
                  </div>
                </div>
                <div className="text-4xl font-semibold text-white">
                  #{RtnTokenId}
                </div>
                <div className="mb-5 flex justify-start gap-4">
                  <div className=" w-1/2 text-base font-normal text-[#908CB8]">
                    Linked Address
                    <b className=" pl-1 font-semibold text-white">
                      {validInvitationNum} Addr
                    </b>
                  </div>
                  <div className=" flex w-1/2  text-base font-normal text-[#908CB8]">
                    CTS.
                    <b className=" px-1 font-semibold  text-white">
                      {formatEther(cummBonus[0]) * 10000}
                    </b>
                    Tkts.{' '}
                    <div className=" ml-1 flex h-5  w-5 items-center justify-center rounded-full border border-[#0EE98D] bg-[#08080C]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.18773 3.56928C6.6212 3.22271 6.89886 2.68942 6.89886 2.09127C6.89886 1.04673 6.05209 0.199951 5.00754 0.199951C3.96299 0.199951 3.11621 1.04673 3.11621 2.09127C3.11621 2.57167 3.29532 3.01024 3.5904 3.34383L3.58906 3.34517L3.61488 3.37098C3.65093 3.41019 3.68862 3.44788 3.72783 3.48393L5.00046 4.75656L6.18773 3.56928Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.57051 3.82815C3.22396 3.39398 2.69023 3.11579 2.09152 3.11579C1.04697 3.11579 0.200195 3.96257 0.200195 5.00711C0.200195 6.05166 1.04697 6.89844 2.09152 6.89844C2.57185 6.89844 3.01037 6.71938 3.34395 6.42437L3.34531 6.42573L3.37181 6.39923C3.41062 6.36352 3.44793 6.32621 3.48364 6.28741L4.75671 5.01434L3.57051 3.82815Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.42796 6.18409C6.77446 6.61936 7.30889 6.89837 7.90848 6.89837C8.95303 6.89837 9.7998 6.05159 9.7998 5.00705C9.7998 3.9625 8.95303 3.11572 7.90848 3.11572C7.42825 3.11572 6.98982 3.29471 6.65626 3.58961L6.65527 3.58862L6.63731 3.60659C6.59217 3.64759 6.54902 3.69074 6.50802 3.73588L5.24388 5.00002L6.42796 6.18409Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.82693 6.43071C3.39346 6.77729 3.11579 7.31058 3.11579 7.90873C3.11579 8.95327 3.96256 9.80005 5.00711 9.80005C6.05166 9.80005 6.89844 8.95327 6.89844 7.90873C6.89844 7.42833 6.71933 6.98977 6.42425 6.65617L6.42559 6.65483L6.39977 6.62902C6.36372 6.58981 6.32603 6.55212 6.28682 6.51607L5.01419 5.24344L3.82693 6.43071Z"
                          fill="#0EE98D"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-5 flex  justify-start gap-4">
                  <div className=" w-1/2  text-base font-normal text-[#908CB8]">
                    Is Unclaimed
                    <b className=" pl-1 font-semibold  text-white">
                      {' '}
                      {validBalanceNum > 0 ? 'Yes' : 'No'}
                    </b>
                  </div>
                  <div className=" w-1/2  text-base font-normal text-[#908CB8]">
                    Update Block
                    <b className=" pl-1 font-semibold  text-white">
                      {formatUnits(cummBonus[1], 0)}
                    </b>
                  </div>
                </div>

                <div className=" mb-5">
                  <h5 className="mb-2 text-base font-semibold text-[#908CB8]">
                    Linked Address
                  </h5>
                  <div className=" flex h-14 items-center justify-between rounded-lg bg-[#13103299] px-6">
                    <div className="text-white">{shareUrl}</div>

                    <CopyToClipboard
                      onCopy={onClipCopy}
                      options={{ message: 'Whoa!' }}
                      text={value}
                    >
                      <button
                        onClick={onClipClick}
                        type="button"
                        className="group  mx-auto   p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          className=" fill-[#8B8CF2]  group-hover:fill-[#FD2073]  group-active:opacity-60"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9.53573 4.41663H5.66669V3.99996C5.66669 2.15901 7.15907 0.666626 9.00002 0.666626H14C15.841 0.666626 17.3334 2.15901 17.3334 3.99996V8.99996C17.3334 10.8409 15.841 12.3333 14 12.3333H13.5834V8.46424C13.5834 6.22881 11.7712 4.41663 9.53573 4.41663ZM9.00002 17.3333H4.00002C2.15907 17.3333 0.666687 15.8409 0.666687 14V8.99996C0.666687 7.15901 2.15907 5.66663 4.00002 5.66663H9.00002C10.841 5.66663 12.3334 7.15901 12.3334 8.99996V14C12.3334 15.8409 10.841 17.3333 9.00002 17.3333Z"
                          />
                        </svg>
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="flex justify-between gap-4 ">
                  <button
                    type="submit"
                    className="flex  h-14 w-1/2 flex-row items-center justify-center rounded-md bg-[#423D5B] px-[7px] py-[10px]  hover:bg-[#FD2073] active:opacity-60 disabled:bg-[#423D5B] disabled:opacity-30"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                      >
                        <path
                          d="M0.4375 11.9375C0.4375 13.905 2.03249 15.5 4 15.5H10C11.9675 15.5 13.5625 13.905 13.5625 11.9375V6.5C13.5625 4.53249 11.9675 2.9375 10 2.9375C9.68934 2.9375 9.4375 3.18934 9.4375 3.5C9.4375 3.81066 9.68934 4.0625 10 4.0625C11.3462 4.0625 12.4375 5.1538 12.4375 6.5V9.90191C11.8003 9.30382 10.9429 8.9375 10 8.9375H4C3.05709 8.9375 2.19974 9.30382 1.5625 9.90191V6.5C1.5625 5.15381 2.65381 4.0625 4 4.0625C4.31066 4.0625 4.5625 3.81066 4.5625 3.5C4.5625 3.18934 4.31066 2.9375 4 2.9375C2.03249 2.9375 0.4375 4.53248 0.4375 6.5L0.4375 11.9375Z"
                          fill="white"
                        />
                        <path
                          d="M5.10225 5.35237C5.32192 5.1327 5.67808 5.1327 5.89775 5.35237L6.4375 5.89212L6.4375 1.06259C6.4375 0.75193 6.68934 0.500092 7 0.500092C7.31066 0.500092 7.5625 0.751932 7.5625 1.06259L7.5625 5.89212L8.10225 5.35237C8.32192 5.1327 8.67808 5.1327 8.89775 5.35237C9.11742 5.57204 9.11742 5.92819 8.89775 6.14786L7.92808 7.11753C7.41551 7.63009 6.58449 7.63009 6.07192 7.11753L5.10225 6.14786C4.88258 5.92819 4.88258 5.57203 5.10225 5.35237Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <span className="pl-2 text-sm  font-semibold text-white">
                      Download
                    </span>
                  </button>

                  <TwitterShareButton
                    url={shareUrl}
                    title={shareTitle}
                    className="!active:opacity-60  !disabled:!bg-[#423D5B] flex h-14 w-1/2 flex-row items-center justify-center rounded-md !bg-[#423D5B]  px-[7px] py-[10px] hover:!bg-[#FD2073] disabled:opacity-30"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M4.3572 13.3951C5.53993 13.4347 6.71859 13.2368 7.82353 12.8131C8.92847 12.3894 9.93726 11.7485 10.7903 10.9283C11.6433 10.108 12.3233 9.12516 12.79 8.03768C13.2567 6.9502 13.5006 5.7802 13.5075 4.59683C14.0495 3.92609 14.4519 3.15377 14.6912 2.32526C14.7091 2.25981 14.7076 2.19058 14.6871 2.12592C14.6665 2.06126 14.6277 2.00393 14.5753 1.96083C14.5229 1.91772 14.4591 1.89068 14.3917 1.88297C14.3243 1.87525 14.2561 1.88719 14.1953 1.91734C13.9118 2.05384 13.5925 2.09793 13.2826 2.0434C12.9726 1.98888 12.6876 1.83848 12.4676 1.6134C12.1869 1.30592 11.8472 1.05793 11.4688 0.884121C11.0905 0.710312 10.681 0.614221 10.2648 0.601541C9.84863 0.588861 9.43412 0.65985 9.04586 0.810303C8.6576 0.960756 8.30349 1.18761 8.0045 1.47743C7.59514 1.87388 7.2953 2.36949 7.13412 2.91609C6.97294 3.46269 6.95591 4.0417 7.08468 4.59683C4.40519 4.7568 2.56554 3.48504 1.09383 1.74138C1.04961 1.69131 0.991777 1.65519 0.92738 1.63745C0.862984 1.61971 0.794814 1.6211 0.731195 1.64146C0.667577 1.66182 0.611263 1.70026 0.569131 1.75209C0.526999 1.80392 0.500872 1.8669 0.493941 1.93334C0.21357 3.48858 0.415819 5.09237 1.07352 6.52932C1.73123 7.96626 2.81289 9.16753 4.17324 9.9718C3.26112 11.0179 1.98022 11.6712 0.597921 11.7955C0.523865 11.8077 0.455502 11.8429 0.402399 11.8959C0.349297 11.949 0.314114 12.0173 0.301773 12.0914C0.289432 12.1654 0.300551 12.2415 0.333574 12.3089C0.366598 12.3763 0.419872 12.4317 0.485942 12.4673C1.68853 13.0683 3.01284 13.3857 4.3572 13.3951Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <span className="pl-2  text-sm  font-semibold text-white">
                      Twitter
                    </span>
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto   max-w-[1100px]  ">
            <div className="mb-16 flex  items-center    justify-between  ">
              <h2 className="text-[40px] font-medium text-white">
                Unclaimed Rewards
              </h2>
            </div>
            <div className="mb-16 flex justify-between gap-6">
              <div className=" w-1/3 rounded-xl bg-[#2A283D] px-6 pb-10 pt-6 shadow-[0px_15px_35px_0px_rgba(0,0,0,0.20)]">
                <div className="mb-2 flex gap-2">
                  <span className=" text-base font-semibold text-[#908CB8]">
                    Pool
                  </span>
                  <span className=" text-base font-normal text-[#FFFFFF1F]">
                    |
                  </span>
                  <span className="  text-base font-normal text-[#8B8CF2]">
                    AETH
                  </span>
                </div>
                <div className=" flex h-[68px] items-center rounded-md  bg-[#13103299] px-4">
                  <div className="  ">
                    <div className=" flex h-10  w-10  items-center justify-center rounded-full  ">
                      <img
                        src={`${router.basePath}/assets/images/Ellipse1090.svg`}
                        alt="USDT"
                        className=" h-10 w-10"
                      />
                    </div>
                  </div>
                  <div className="mx-4  block h-full w-px bg-[#D1D6DD1A]" />
                  <div className="flex w-full items-center justify-between">
                    <span className=" text-lg font-semibold text-white">
                      {validBalanceNum}
                    </span>
                    <span className=" text-xs font-normal text-[#908CB8]">
                      AETH
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPreparing || isWriteLoading || isConfirming}
                  loading={isPreparing || isWriteLoading || isConfirming}
                  onClick={() => write?.()}
                  className="group mt-5 flex w-full justify-center  rounded-md bg-white px-14 py-[14px] text-lg font-semibold hover:bg-[#FD2073] hover:text-white active:text-white active:opacity-60  disabled:opacity-30 disabled:hover:bg-white  disabled:hover:text-gray-950"
                >
                  {isConfirming ? 'Claiming...' : 'Claim'}
                  <svg
                    className="-mr-1 ml-3   hidden h-5 w-5 animate-spin text-black 
                    group-disabled:flex motion-reduce:hidden "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </button>
                {isSuccess && (
                  <div className="hidden overflow-hidden text-center text-sm font-semibold tracking-tight text-orange-600">
                    {toast.success(' Successfully Claim!')}
                  </div>
                )}

                {isPrepareError && (
                  // <div>{setShowNotification(true)} className="hidden"</div>
                  <div className="hidden overflow-hidden text-center text-sm font-semibold tracking-tight text-orange-600">
                    isPrepareError: {prepareError?.message}
                    {/* {toast.error('PrepareError Try Again')} */}
                  </div>
                )}

                {isWriteError && (
                  <div className="hidden overflow-hidden text-center text-sm font-semibold tracking-tight text-orange-600">
                    isWriteError: {error?.message}
                    {toast.error('Claim Failed Try Again')}
                  </div>
                  // <div className='max-w-xs overflow-hidden'></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto    mb-[248px]    max-w-[1100px]     ">
          <div className="   flex    justify-between ">
            <div className="w-[456px]   flex-auto">
              <h2 className="animated-text-fg w-[432px]  bg-gradient-to-r  from-[#fff] from-10% to-[#C6C0ED] to-90%    text-[72px]  font-bold leading-[88px]">
                Become a LuckyLottor
              </h2>
              <h3 className="animated-text-fg  w-[441px]  bg-gradient-to-r from-[#FDFF83] from-10% to-[#FF338E] to-90%  py-4  text-[32px]  font-bold  leading-10">
                A Simple Three-Step Guide
              </h3>
              <ApplyLottor />
            </div>
            <div className="w-[560px]   flex-initial">
              <div className="flex items-center justify-between pt-2">
                <div className=" h-16 w-16 rounded-full bg-[#FD2073] text-center text-2xl font-bold leading-[4rem] text-white">
                  1
                </div>
                <dl className=" w-[468px] ">
                  <dt className="text-3xl font-medium text-white">
                    Apply to Be a LuckyLottor
                  </dt>
                  <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                    Use LyLottor's smart contract to join LuckyWeb as a
                    LuckyLottor.
                  </dd>
                </dl>
              </div>

              <div className="  ml-8  h-14 border-l-2 border-dotted border-[#8D83BF]" />

              <div className="flex items-center justify-between ">
                <div className=" h-16 w-16 rounded-full bg-[#FD20731F] text-center text-2xl font-bold leading-[4rem] text-[#FD3BD1]">
                  2
                </div>
                <dl className=" w-[468px] ">
                  <dt className="text-3xl font-medium text-white">
                    Share Referral Material
                  </dt>
                  <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                    Invite others with your unique link. Referrals are recorded
                    when others buy tickets via your link.
                  </dd>
                </dl>
              </div>
              <div className="  ml-8  h-14 border-l-2 border-dotted border-[#8D83BF]" />

              <div className="flex items-center justify-between pb-2">
                <div className=" h-16 w-16 rounded-full bg-[#FD20731F] text-center text-2xl font-bold leading-[4rem] text-[#FD3BD1]">
                  3
                </div>
                <dl className=" w-[468px] ">
                  <dt className="text-3xl font-medium text-white">
                    Earn from Referrals
                  </dt>
                  <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                    Get 10% of sales from purchases made by your referred
                    addresses through LyLottor.
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
