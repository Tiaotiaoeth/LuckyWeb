import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Poppins } from 'next/font/google';
import { Fragment, useEffect, useState } from 'react';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';

import { LyIssuerContract, publicClient } from '../utils/client';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function CardCurrentRound() {
  // const { address, isConnecting, isDisconnected } = useAccount();

  const [issueNumRound, setIssueNumRound] = useState(parseUnits('0', 0));
  const [balanceAndSize, setBalanceAndSize] = useState([
    parseUnits('0', 0),
    parseUnits('0', 0),
  ]);

  const [roundNumRound, setRoundNumRound] = useState([parseUnits('0', 0)]);

  const [roundLists, setRoundLists] = useState([parseUnits('0', 0)]);

  const [myTicketMore, setMyTicketMore] = useState(false);

  const { data: walletClient } = useWalletClient();
  // const [latestRewards, setLatestRewards] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const getCurrentRound = async () => {
    try {
      const readIssueNumRound = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getIssueNum',
      });
      setIssueNumRound(readIssueNumRound);

      const readBalanceAndSize = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getBalanceAndSize',
      });
      setBalanceAndSize(readBalanceAndSize);

      const readLotteryNumRound = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getLotteryNum',
        args: [issueNumRound],
        account: walletClient?.account,
      });
      setRoundNumRound(readLotteryNumRound);

      const readThisRounds = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getRecords',
        args: [issueNumRound],
        account: walletClient?.account,
      });

      setRoundLists(readThisRounds[1]);
      if (readThisRounds[1].length > 4) {
        setMyTicketMore(true);
      }
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };
  useEffect(() => {
    getCurrentRound();
  }, [walletClient, issueNumRound]);

  return (
    <div>
      <div
        id="history-top"
        className=" mb-[60px]  rounded-xl bg-[#2A283D] px-6 pb-9   pt-6  shadow-[0px_15px_35px_0px_rgba(0,0,0,0.20)] "
      >
        <div className="mb-10 flex">
          <div className=" mr-3 flex  h-10 w-10  items-center justify-center rounded-full  bg-[#0EE98D1F]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.1643 3.15221C11.1643 4.14954 10.7011 5.03869 9.97817 5.6163L8.11023 7.48423C8.04949 7.54498 7.95099 7.54498 7.89024 7.48423L5.87984 5.47383C5.81409 5.41341 5.75091 5.35023 5.69048 5.28447L5.64905 5.24304C5.64843 5.24242 5.64843 5.2414 5.64905 5.24077C5.64965 5.24017 5.64968 5.23921 5.64912 5.23857C5.15797 4.68273 4.8599 3.95228 4.8599 3.15221C4.8599 1.41129 6.27119 0 8.01211 0C9.75303 0 11.1643 1.41129 11.1643 3.15221ZM3.15218 4.85965C4.14904 4.85965 5.03782 5.32238 5.61545 6.04477L7.48448 7.9138C7.54523 7.97455 7.54523 8.07304 7.48448 8.13379L5.46981 10.1485C5.41193 10.2112 5.35154 10.2716 5.28879 10.3295L5.24338 10.3749C5.2427 10.3756 5.24161 10.3756 5.24094 10.3749C5.24029 10.3742 5.23925 10.3742 5.23857 10.3748C4.68272 10.866 3.95226 11.1641 3.15218 11.1641C1.41126 11.1641 -3.05176e-05 9.75277 -3.05176e-05 8.01186C-3.05176e-05 6.27094 1.41126 4.85965 3.15218 4.85965ZM10.3839 9.97797C10.9615 10.7008 11.8506 11.1638 12.8478 11.1638C14.5887 11.1638 16 9.75249 16 8.01158C16 6.27067 14.5887 4.85938 12.8478 4.85938C12.0476 4.85938 11.3171 5.15752 10.7612 5.64877C10.7606 5.64925 10.7598 5.64923 10.7593 5.64871C10.7588 5.64818 10.7579 5.64817 10.7574 5.64871L10.723 5.68307C10.652 5.74786 10.584 5.81586 10.5192 5.88683L8.51601 7.89006C8.45527 7.95081 8.45527 8.0493 8.51601 8.11005L10.3839 9.97797ZM4.85962 12.8478C4.85962 11.8503 5.32294 10.961 6.04611 10.3834L7.91377 8.51577C7.97452 8.45502 8.07301 8.45502 8.13376 8.51577L10.145 10.527C10.2101 10.5869 10.2727 10.6495 10.3327 10.7147L10.3749 10.7569C10.3756 10.7576 10.3756 10.7586 10.3749 10.7592C10.3743 10.7599 10.3743 10.7608 10.3749 10.7615C10.866 11.3173 11.164 12.0478 11.164 12.8478C11.164 14.5887 9.75274 16 8.01182 16C6.27091 16 4.85962 14.5887 4.85962 12.8478Z"
                fill="url(#paint0_linear_1097_44447)"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.1643 3.15221C11.1643 4.14954 10.7011 5.03869 9.97817 5.6163L8.11023 7.48423C8.04949 7.54498 7.95099 7.54498 7.89024 7.48423L5.87984 5.47383C5.81409 5.41341 5.75091 5.35023 5.69048 5.28447L5.64905 5.24304C5.64843 5.24242 5.64843 5.2414 5.64905 5.24077C5.64965 5.24017 5.64968 5.23921 5.64912 5.23857C5.15797 4.68273 4.8599 3.95228 4.8599 3.15221C4.8599 1.41129 6.27119 0 8.01211 0C9.75303 0 11.1643 1.41129 11.1643 3.15221ZM3.15218 4.85965C4.14904 4.85965 5.03782 5.32238 5.61545 6.04477L7.48448 7.9138C7.54523 7.97455 7.54523 8.07304 7.48448 8.13379L5.46981 10.1485C5.41193 10.2112 5.35154 10.2716 5.28879 10.3295L5.24338 10.3749C5.2427 10.3756 5.24161 10.3756 5.24094 10.3749C5.24029 10.3742 5.23925 10.3742 5.23857 10.3748C4.68272 10.866 3.95226 11.1641 3.15218 11.1641C1.41126 11.1641 -3.05176e-05 9.75277 -3.05176e-05 8.01186C-3.05176e-05 6.27094 1.41126 4.85965 3.15218 4.85965ZM10.3839 9.97797C10.9615 10.7008 11.8506 11.1638 12.8478 11.1638C14.5887 11.1638 16 9.75249 16 8.01158C16 6.27067 14.5887 4.85938 12.8478 4.85938C12.0476 4.85938 11.3171 5.15752 10.7612 5.64877C10.7606 5.64925 10.7598 5.64923 10.7593 5.64871C10.7588 5.64818 10.7579 5.64817 10.7574 5.64871L10.723 5.68307C10.652 5.74786 10.584 5.81586 10.5192 5.88683L8.51601 7.89006C8.45527 7.95081 8.45527 8.0493 8.51601 8.11005L10.3839 9.97797ZM4.85962 12.8478C4.85962 11.8503 5.32294 10.961 6.04611 10.3834L7.91377 8.51577C7.97452 8.45502 8.07301 8.45502 8.13376 8.51577L10.145 10.527C10.2101 10.5869 10.2727 10.6495 10.3327 10.7147L10.3749 10.7569C10.3756 10.7576 10.3756 10.7586 10.3749 10.7592C10.3743 10.7599 10.3743 10.7608 10.3749 10.7615C10.866 11.3173 11.164 12.0478 11.164 12.8478C11.164 14.5887 9.75274 16 8.01182 16C6.27091 16 4.85962 14.5887 4.85962 12.8478Z"
                fill="#0EE98D"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1097_44447"
                  x1="8.40736"
                  y1="6.74908"
                  x2="6.8787"
                  y2="8.08472"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.430498" stop-color="#0EE98D" />
                  <stop offset="1" stop-color="#FEFF97" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h2 className=" mb-1 pt-1 text-xl font-semibold text-white">
              Current Round
            </h2>
            <div className="  text-lg font-medium leading-8 text-[#908CB8]">
              Pool #{Number(issueNumRound)}
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex  w-1/3 flex-col  rounded-lg bg-gradient-to-br from-[#0042ff80]  to-[#eb001b80] p-6">
            <h5 className="text-sm font-semibold text-[#908CB8]">Jackpot</h5>

            <h6 className="animated-text-fg w-[409px] bg-gradient-to-r  from-[#FDFF83]  to-[#FF338E] text-[40px]    font-bold  drop-shadow-[0px_4px_10px_rgba(0,0,0,0.30)] ">
              {formatEther(balanceAndSize[0])} AETH
            </h6>

            <div className=" upcoming-bg mb-5 mt-1 w-[112px]  text-center text-base font-normal leading-[36px]  text-[#8B8CF2]">
              To Draw
            </div>

            <div className=" flex justify-between text-sm text-[#8B8CF2]">
              <div className="">
                <span className="font-semibold" />{' '}
                {(formatEther(balanceAndSize[0]) * 0.0005).toFixed(6)} AETH
                <br />
                PrizePot
              </div>
              <div className="">
                <span className="font-semibold" />{' '}
                {formatUnits(balanceAndSize[1], 0)}
                <br />
                Total player this round
              </div>
            </div>
          </div>

          <div className="ml-4  flex flex-1  flex-col  justify-start  rounded-md bg-[#13103299]  p-6">
            <div>
              <div className="mb-4 flex items-center justify-start">
                <h5 className="text-sm font-semibold text-[#908CB8]">
                  My tickets
                </h5>
              </div>
            </div>
            <div className="  grid grid-cols-7 flex-wrap  gap-x-5 gap-y-4">
              {roundLists.map((nfts) => (
                <span
                  key={formatUnits(nfts, 0)}
                  className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
                >
                  #{formatUnits(nfts, 0)}
                </span>
              ))}

              {myTicketMore ? (
                <div>
                  <button
                    type="button"
                    onClick={openModal}
                    className="sb-bg h-[36px] w-[72px]  text-center text-base font-normal  leading-[36px] text-[#8B8CF2] hover:opacity-60"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      className="mx-auto"
                    >
                      <path
                        d="M5.95544 11.4081C5.29271 11.4081 4.75546 10.8709 4.75546 10.2081C4.75546 9.54543 5.29271 9.0082 5.95544 9.0082C6.61818 9.0082 7.15543 9.54543 7.15543 10.2081C7.15543 10.8709 6.61818 11.4081 5.95544 11.4081ZM10.7551 11.4082C10.0924 11.4082 9.55511 10.871 9.55511 10.2083C9.55511 9.54556 10.0924 9.00833 10.7551 9.00833C11.4178 9.00833 11.9551 9.54556 11.9551 10.2083C11.9551 10.871 11.4178 11.4082 10.7551 11.4082ZM14.3555 10.2081C14.3555 10.8708 14.8927 11.4081 15.5555 11.4081C16.2182 11.4081 16.7555 10.8708 16.7555 10.2081C16.7555 9.54542 16.2182 9.00819 15.5555 9.00819C14.8927 9.00819 14.3555 9.54542 14.3555 10.2081Z"
                        fill="#8B8CF2"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div> </div>
              )}

              <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10 "
                  onClose={closeModal}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-50"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-50"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                  </Transition.Child>
                  <div className={`${poppins.variable} font-sans`}>
                    <div className="fixed inset-0 z-10 overflow-y-auto ">
                      <div className="mx-auto  mt-20  flex w-[530px] items-stretch justify-center rounded-xl bg-[#2A283D] p-7  ">
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
                            <div className="  w-full    ">
                              <button
                                type="button"
                                className="absolute right-0 top-1 text-gray-400 hover:text-gray-500 "
                                onClick={closeModal}
                              >
                                <span className="sr-only">Close</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>

                              <div className="  ">
                                <h2 className=" text-2xl font-semibold text-[#EEF2F8]">
                                  All My Tickets This Round
                                </h2>
                                <div className=" my-10  flex h-[250px]  flex-wrap  content-start gap-x-5      gap-y-4    overflow-y-auto  ">
                                  {roundLists.map((nfts) => (
                                    <span
                                      key={formatUnits(nfts, 0)}
                                      className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
                                    >
                                      #{formatUnits(nfts, 0)}
                                    </span>
                                  ))}
                                  {/* <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    41
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    46
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    41
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    46
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    41
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    4999
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    4999
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    4999
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    42
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    43
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    44
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    45
                                  </span>
                                  <span class="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]">
                                    4999
                                  </span> */}
                                </div>

                                <div className="flex justify-end ">
                                  <button
                                    type="button"
                                    className="  flex w-[155px] justify-center rounded-md  bg-[#FD2073] px-6 py-4 text-base font-semibold text-white hover:shadow-[0px_0px_16px_0px_rgba(252,37,112,0.60)] "
                                    onClick={closeModal}
                                  >
                                    Got it
                                  </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
