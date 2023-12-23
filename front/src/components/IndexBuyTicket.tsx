/* eslint-disable import/no-extraneous-dependencies */
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputField,
  NumberInputIncrementTrigger,
  NumberInputScrubber,
} from '@ark-ui/react';
// import { Transition } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useWeb3Modal } from '@web3modal/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import { parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { LyIssuerContract } from '../utils/client';

export default function IndexBuyTicket({ propsLotteryNum, propsBlanaceSize }) {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const label = isConnected ? 'Disconnect' : 'Connect Wallet';

  const [accountBanlance, setAccountBanlance] = useState({
    decimals: 1,
    formatted: '1',
    symbol: 'ETH',
    value: 1n,
  });

  async function buyTicket() {}

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

  const balance = useBalance({
    address,
    onSuccess(data) {
      setAccountBanlance(data);
    },
  });

  const [amount, setAmount] = useState('1');

  const debouncedAmount = useDebounce(amount, 500);

  // const youPay = useDebounce((amount * 1e-3).toFixed(3), 500);

  const youPay = (amount * 1e-3).toFixed(3);

  const [shareId, setShareId] = useState(1);
  // const [getShare, setGetShare] = useState(1);

  const searchParams = useSearchParams();
  // const getShare = searchParams.get('shareId');
  useEffect(() => {
    const getShare = searchParams.get('shareId');
    try {
      const parsedShareId = BigInt(getShare);
      setShareId(parsedShareId);
    } catch (error) {
      setShareId(1n); // Set the default value when BigInt conversion fails
    }
  }, [searchParams]);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing,
  } = usePrepareContractWrite({
    ...LyIssuerContract,
    functionName: 'bet',
    // eslint-disable-next-line radix
    args: [shareId, parseInt(debouncedAmount)],
    enabled: Boolean(debouncedAmount),
    value: parseEther(youPay),
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

  const router = useRouter();
  // const isSuccess = true; // Replace this with your actual isSuccess condition

  useEffect(() => {
    if (isSuccess) {
      router.refresh();
    }
  }, [isSuccess]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <div className=" flex h-[68px] items-center rounded-md  bg-[#13103299] px-4">
          <div className="  ">
            <div className=" flex h-10  w-10  items-center justify-center rounded-full border border-[#0EE98D] bg-[#08080C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.97819 5.6163C10.7012 5.03869 11.1643 4.14954 11.1643 3.15221C11.1643 1.41129 9.75305 0 8.01213 0C6.27122 0 4.85992 1.41129 4.85992 3.15221C4.85992 3.95282 5.1584 4.68372 5.65014 5.2397L5.64794 5.24191L5.69051 5.28447C5.75093 5.35023 5.81411 5.41341 5.87986 5.47383L8.00026 7.59423L9.97819 5.6163Z"
                  fill="#0EE98D"
                />
                <path
                  d="M5.61548 6.04477C5.03785 5.32238 4.14907 4.85965 3.15221 4.85965C1.41129 4.85965 0 6.27094 0 8.01186C0 9.75277 1.41129 11.1641 3.15221 11.1641C3.95287 11.1641 4.68382 10.8655 5.23982 10.3737L5.24219 10.3761L5.28882 10.3295C5.35157 10.2716 5.41196 10.2112 5.46984 10.1485L7.59451 8.0238L5.61548 6.04477Z"
                  fill="#0EE98D"
                />
                <path
                  d="M10.384 9.97797C10.9616 10.7008 11.8506 11.1638 12.8478 11.1638C14.5887 11.1638 16 9.7525 16 8.01158C16 6.27067 14.5887 4.85938 12.8478 4.85937C12.0472 4.85937 11.3162 5.15786 10.7603 5.64963L10.7584 5.64774L10.723 5.68307C10.6521 5.74786 10.5841 5.81586 10.5193 5.88683L8.40605 8.00006L10.384 9.97797Z"
                  fill="#0EE98D"
                />
                <path
                  d="M6.04614 10.3834C5.32297 10.961 4.85965 11.8503 4.85965 12.8478C4.85965 14.5887 6.27094 16 8.01186 16C9.75277 16 11.1641 14.5887 11.1641 12.8478C11.1641 12.0472 10.8656 11.3163 10.3739 10.7603L10.3761 10.7581L10.3327 10.7147C10.2728 10.6495 10.2101 10.5869 10.145 10.527L8.0238 8.40577L6.04614 10.3834Z"
                  fill="#0EE98D"
                />
              </svg>
            </div>
          </div>
          <div className="ml-3  mr-4 block h-full w-px bg-[#D1D6DD1A]" />
          <NumberInput min={1} max={propsBlanaceSize} inputMode="numeric">
            <NumberInputScrubber />

            <NumberInputControl className="flex flex-row">
              <NumberInputDecrementTrigger className="flex  flex-col items-center  justify-center rounded bg-[#FFFFFF0F]  px-[17px] py-2  hover:bg-[#FFFFFF33] active:bg-[#FFFFFF29] disabled:bg-[#FFFFFF0F]">
                <MinusIcon
                  className=" h-[22px] w-[22px] text-white"
                  aria-hidden="true"
                />
              </NumberInputDecrementTrigger>

              <NumberInputField
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                type="number"
                className="mx-5 block w-full   border-0 bg-transparent  px-2 py-[5px]  text-center text-[26px] font-semibold leading-[38px] text-white shadow-sm ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 "
              />
              <NumberInputIncrementTrigger className="flex  flex-col items-center  justify-center rounded bg-[#FFFFFF0F]  px-[17px] py-2  hover:bg-[#FFFFFF33] active:bg-[#FFFFFF29] disabled:bg-[#FFFFFF0F]">
                <PlusIcon
                  className=" h-[22px] w-[22px] text-white"
                  aria-hidden="true"
                />
              </NumberInputIncrementTrigger>
            </NumberInputControl>
          </NumberInput>
        </div>
        <div className=" mt-4  flex justify-between ">
          <div className="   flex  w-[224px] flex-col items-start gap-1  rounded-md bg-[#13103299]  py-6  pl-6 ">
            <div className=" text-sm font-semibold text-[#908CB8]">
              Total on AETH
            </div>
            <div className=" text-xl font-semibold text-[#8B8CF2]">
              ≈ {youPay}
            </div>
          </div>
          <div className="flex w-[224px] flex-col  items-start gap-1   rounded-md  bg-[#13103299]   py-6 pl-6">
            <div className="text-sm font-semibold text-[#908CB8]">
              Your tickets
            </div>
            <div className="text-xl font-semibold text-[#8B8CF2]">
              {propsLotteryNum}
            </div>
          </div>
        </div>

        {/* <div className="pt-2 text-right text-sm text-gray-600">
          AETH Balance: {parseFloat(accountBanlance.formatted).toFixed(3)}
        </div>
        <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
          <span className="text-sm font-medium tracking-tight text-gray-300">
            Price:
          </span>
          <span className="text-sm  leading-6 tracking-wide text-gray-600">
            1 ticket = 0.001 AETH
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
          <span className="text-sm font-medium tracking-tight text-gray-300">
            You Pay:
          </span>
          <span className="text-sm  leading-6 tracking-wide text-gray-600">
            ~{youPay} AETH
          </span>
        </div> */}

        <div className=" flex  flex-col ">
          {isConnected ? (
            <button
              type="submit"
              disabled={isPreparing || isWriteLoading || isConfirming}
              loading={isPreparing || isWriteLoading || isConfirming}
              className="group mt-5 flex  justify-center rounded-md  bg-gradient-to-r from-[#FE1C74] from-10% via-[#E76450] via-60% to-[#E651C4] to-90% px-14  py-5 text-xl  font-semibold text-white   shadow-sm  hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)] active:opacity-60  disabled:opacity-30 "
            >
              {isConfirming ? 'Buying...' : 'Buy Ticket'}

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
          ) : (
            <button
              type="submit"
              className="mt-5  flex   justify-center  rounded-md bg-gradient-to-r from-[#FE1C74] from-10% via-[#E76450] via-60% to-[#E651C4]  to-90% px-14  py-5 text-xl font-semibold  text-white shadow-sm hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)]  active:opacity-60 "
              onClick={onClick}
              disabled={loading}
            >
              {loading ? 'Loading...' : label}
            </button>
          )}

          {isSuccess && (
            <div className="hidden text-center text-sm font-semibold tracking-tight text-orange-600">
              {toast.success('Successfully Buy Ticket')}
            </div>
          )}
          {isPrepareError && (
            // <div>{setShowNotification(true)} className="hidden"</div>
            <div className="hidden overflow-hidden text-center text-sm font-semibold tracking-tight text-orange-600">
              isPrepareError: {prepareError?.message}
            </div>
          )}

          {isWriteError && (
            <div className="hidden overflow-hidden text-center text-sm font-semibold tracking-tight text-orange-600">
              isWriteError: {error?.message}
              {toast.error('Buy Ticket Failed Try Again')}
            </div>
            // <div className='max-w-xs overflow-hidden'></div>
          )}
        </div>
      </form>
    </div>
  );
}
