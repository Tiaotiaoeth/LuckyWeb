import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useWeb3Modal } from '@web3modal/react';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { LyLottorContract } from '../utils/client';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function MyModal() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const label = isConnected ? 'Disconnect' : 'Connect Wallet';

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }


  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing,
  } = usePrepareContractWrite({
    ...LyLottorContract,
    functionName: 'register',
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

  // const isSuccess = true; // Replace this with your actual isSuccess condition

  useEffect(() => {
    if (isSuccess) {
      // router.refresh();
      router.push(router.pathname);
    }
  }, [isSuccess]);

  return (
    <>
      <div>
        {isConnected ? (
          <button
            type="button"
            onClick={openModal}
            className=" mt-[56px]  inline-flex  items-center  justify-between rounded-lg  bg-gradient-to-br from-[#FE1C74] from-40% to-[#E76450] to-90% px-14  py-[21px] font-sans  text-lg font-semibold  leading-6 text-white  hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)] active:opacity-60"
          >
            Apply for Lottor
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className=" mt-[56px]  inline-flex  items-center  justify-between rounded-lg  bg-gradient-to-br from-[#FE1C74] from-40% to-[#E76450] to-90% px-14  py-[21px] font-sans  text-lg font-semibold  leading-6 text-white  hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)] active:opacity-60"
          >
            {loading ? 'Loading...' : label}
          </button>
        )}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>
          <div className={`${poppins.variable} font-sans`}>
            <div className="fixed inset-0 z-10 overflow-y-auto ">
              <div className="mx-auto  mt-20  flex w-[560px] items-stretch justify-center rounded-xl bg-[#2A283D] px-7 pb-12 pt-7  ">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                  enterTo="opacity-100 translate-y-0 md:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 md:scale-100"
                  leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                >
                  <Dialog.Panel className="flex w-full text-left text-base transition ">
                    <div className="relative flex   items-center    ">
                      <button
                        type="button"
                        className="absolute right-0 top-1 text-gray-400 hover:text-gray-500 "
                        onClick={closeModal}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <div className="">
                        <h2 className=" text-2xl font-semibold text-[#EEF2F8]">
                          Apply for Lottor
                        </h2>

                        <div className=" mb-7 mt-10">
                          <img
                            src={`${router.basePath}/assets/images/apply-lottor.png`}
                            alt="join now"
                            className="w-[504px]"
                          />
                        </div>

                        <p className=" mb-10 text-base font-normal  leading-7 text-[#908CB8]">
                          Submit your address information to the contract to
                          establish the link between the invitation code and the
                          address.{' '}
                        </p>
                        <p className=" mb-12 text-base font-normal  leading-7 text-[#908CB8]">
                          In the future we will use introduce more types of
                          tokens to participate in this part.
                        </p>

                        <div className="flex justify-end  gap-5">
                          <button
                            type="button"
                            className=" flex w-[155px] justify-center rounded-md bg-[#423D5B] px-6 py-4 text-base font-semibold text-white shadow-[0px_4px_10px_0px_rgba(0,0,0.30)]    hover:bg-[#FD2073]  active:opacity-60"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={
                              isPreparing || isWriteLoading || isConfirming
                            }
                            loading={
                              isPreparing || isWriteLoading || isConfirming
                            }
                            onClick={() => write?.()}
                            className=" group  flex w-[155px] justify-center  rounded-md bg-[#FD2073] px-6 py-4 text-base  font-semibold  text-white shadow-[0px_4px_10px_0px_rgba(0,0,0.30)]   hover:shadow-[0px_0px_16px_0px_rgba(252,37,112,0.60)]  active:opacity-60  disabled:opacity-30 "
                          >
                            {isConfirming ? 'Applying...' : 'Apply'}
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
                        </div>
                        <div className="flex ">
                          {isSuccess && (
                            <div className="hidden text-center text-sm font-semibold tracking-tight text-orange-600">
                              {toast.success('Successfully Apply Lottor!')}
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
                              {toast.error('Apply Lottor failed Try Again')}
                            </div>
                            // <div className='max-w-xs overflow-hidden'></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
