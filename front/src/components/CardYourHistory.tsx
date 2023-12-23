import { useWeb3Modal } from '@web3modal/react';
import router from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// eslint-disable-next-line import/no-extraneous-dependencies
import { formatEther } from 'viem';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';

import { LyPunterContract, publicClient } from '../utils/client';

export default function CardYourHistory() {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const label = isConnected ? 'Disconnect' : 'Connect Wallet';

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }

  function onClick() {
    if (isConnected) {
      buyTicket();
    } else {
      onOpen();
    }
  }

  const [balanceByUser, setBalanceByUser] = useState([]);
  const [cummPrizeByUser, setCummPrizeByUser] = useState([]);
  const [youAllIssueNum, setYouAllIssueNum] = useState([]);

  const getNewData = async () => {
    try {
      // Uncollected:
      const readBalanceByUser = await publicClient.readContract({
        ...LyPunterContract,
        functionName: 'getBalanceByUser',
        account: walletClient?.account,
        args: [],
      });
      setBalanceByUser(readBalanceByUser);

      // Collected: formatEther
      const readCummPrizeByUser = await publicClient.readContract({
        ...LyPunterContract,
        functionName: 'getCummPrizeByUser',
        account: walletClient?.account,
        args: [],
      });
      setCummPrizeByUser(readCummPrizeByUser);
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };

  useEffect(() => {
    getNewData();
  }, [walletClient]);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing,
  } = usePrepareContractWrite({
    ...LyPunterContract,
    functionName: 'redeem',
    account: walletClient?.account,
  });
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
      <div className=" mb-[54px] rounded-xl bg-gradient-to-tr from-[#0042ff80] to-[#eb001b80] px-6 pb-9   pt-6  backdrop:blur-2xl ">
        <h2 className="  mb-9 text-xl font-semibold text-white">My History</h2>

        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="mr-[58px]">
                <img
                  src={`${router.basePath}/assets/images/my-history.svg`}
                  alt="my-history"
                  className="h-[80px]"
                />
              </div>
              <div className=" mr-[120px]">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  Uncollected
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    {Number(formatEther(balanceByUser)).toFixed(3)}
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
              <div className="mr-[120px]">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  Collected
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    {Number(formatEther(cummPrizeByUser)).toFixed(3)}
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
              <div className="">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  TotalGains
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    {Number(
                      formatEther(balanceByUser + cummPrizeByUser)
                    ).toFixed(3)}
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={isPreparing || isWriteLoading || isConfirming}
              loading={isPreparing || isWriteLoading || isConfirming}
              onClick={() => write?.()}
              className="group  flex  justify-center rounded-md bg-gradient-to-r from-[#FE1C74] from-10% via-[#E76450] via-60% to-[#E651C4]  to-90% px-14  py-5 text-xl   font-semibold  text-white shadow-sm hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)]  active:opacity-60 disabled:opacity-30"
            >
              {isConfirming ? 'Claiming...' : 'Claim'}
              <svg
                className="-mr-1 ml-3 hidden h-5 w-5 animate-spin text-white group-disabled:flex motion-reduce:hidden "
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
              <div className="hidden text-center text-sm font-semibold tracking-tight text-orange-600">
                {toast.success('Successfully Claim')}
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
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="mr-[58px]">
                <img
                  src={`${router.basePath}/assets/images/my-history.svg`}
                  alt="my-history"
                  className="h-[80px]"
                />
              </div>
              <div className=" mr-[120px]">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  Uncollected
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    --
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
              <div className="mr-[120px]">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  Collected
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    --
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
              <div className="">
                <div className=" mb-3 text-sm font-semibold text-[#908CB8]">
                  TotalGains
                </div>
                <div className="flex items-center">
                  <span className="  text-[26px] font-semibold text-[#908CB8]">
                    --
                  </span>
                  <span className=" pl-1 text-sm font-semibold text-white">
                    AETH
                  </span>
                </div>
              </div>
            </div>
            <button
              className=" flex  justify-center rounded-md bg-gradient-to-r from-[#FE1C74] from-10% via-[#E76450] via-60% to-[#E651C4]  to-90% px-14  py-5 text-xl   font-semibold  text-white shadow-sm hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)]  active:opacity-60 "
              onClick={onClick}
              disabled={loading}
            >
              {loading ? 'Loading...' : label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
