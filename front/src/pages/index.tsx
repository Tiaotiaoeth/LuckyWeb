import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';

import IndexBuyTicket from '@/components/IndexBuyTicket';
import TopHold from '@/components/TopHold';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { LyIssuerContract, publicClient } from '../utils/client';

const Index = () => {
  const router = useRouter();
  const [issueNum, setIssueNum] = useState(parseUnits('0', 0));
  const [balanceAndSize, setBalanceAndSize] = useState([
    parseUnits('0', 0),
    parseUnits('0', 0),
  ]);
  const [lotteryNum, setLotteryNum] = useState([parseUnits('0', 0)]);
  const [aWaiting, setAwaiting] = useState(true);
  const [rewards, setRewards] = useState([
    [
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
    ],
    [
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
    ],
    [
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
      parseUnits('0', 0),
    ],
  ]);

  const [finishedRounds, setFinishedRounds] = useState([
    [parseUnits('0', 0), parseUnits('0', 0), parseUnits('0', 0)],
  ]);

  const [openSoon, setOpenSoon] = useState(true);
  const [indexMyTicket, setIndexMyTicket] = useState([0n, []]);
  const [moreTicket, setMoreTicket] = useState(true);

  // const [punterAddr, setpunterAddr] = useState([parseUnits('1', 0)]);

  const { data: walletClient } = useWalletClient();

  function transposeAndReverseArray(arr) {
    const transposedArray = arr[0].map((_, colIndex) =>
      arr.map((row) => row[colIndex])
    );
    return transposedArray.reverse();
  }

  const getIndexNum = async () => {
    try {
      const readIssueNum = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getIssueNum',
      });
      setIssueNum(readIssueNum);
      const readBalanceAndSize = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getBalanceAndSize',
      });
      setBalanceAndSize(readBalanceAndSize);

      if (Number(formatUnits(readBalanceAndSize[1], 0)) >= 10) {
        setAwaiting(false);
      }

      const readLotteryNum = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getLotteryNum',
        args: [issueNum],
        account: walletClient?.account,
      });

      setLotteryNum(readLotteryNum);

      const readRewards = await publicClient.readContract({
        ...LyIssuerContract,
        args: [4n],
        functionName: 'getRewards',
      });

      setRewards(readRewards);

      setFinishedRounds(transposeAndReverseArray(readRewards));

      if (Number(issueNum) > 1) {
        setOpenSoon(false);
      }

      const readThisRound = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getRecords',
        args: [issueNum],
        account: walletClient?.account,
      });

      setIndexMyTicket(readThisRound);

      if (Number(readThisRound[1].length) > 3) {
        setMoreTicket(false);
      }
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };

  useEffect(() => {
    getIndexNum();
  }, [issueNum, walletClient]);

  return (
    <Main meta={<Meta title="Lucky Bet Now!" description="Lucky Bet Now." />}>
      <div className="  bg-image   ">
        <header className="" id="header-top">
          <nav
            className="mx-auto flex max-w-full items-center justify-between p-6 lg:px-4"
            aria-label="Global"
          >
            <div className="flex lg:flex">
              <Link href="/" className="text-[28px] font-medium text-[#f5f5f5]">
                LuckyBet
              </Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {/* Network Switcher Button */}
              <Web3NetworkSwitch class="mr-4" />
              {/* Predefined button  */}
              <Web3Button icon="show" label="Connect Wallet" balance="show" />

              <TopHold />
            </div>
          </nav>
        </header>

        <div className=" pt-16">
          <div className="mx-auto  mb-14  flex  max-w-[1100px]  items-center   justify-between ">
            <div className="w-[409px]   flex-auto">
              <h2 className="animated-text-fg w-[409px]  bg-gradient-to-r  from-[#FDFF83] to-[#FF338E]    text-[80px]  font-bold leading-[100px]">
                {aWaiting ? (
                  <div>Lucky Bet Now!</div>
                ) : (
                  <div>Awaiting the Draw</div>
                )}
              </h2>

              <h3 className="animated-text-fg  w-[235px]  bg-gradient-to-r from-[#5CD9B6] from-10% to-[#91E44B] to-90%  py-4  text-4xl  font-semibold  leading-10">
                Round #{Number(issueNum)}
                <div className="overflow-hidden  ">
                  {formatEther(balanceAndSize[0])} AETH
                </div>
              </h3>
              <div className=" mt-2 pb-10 text-base  font-medium leading-5 text-[#ffffff99]">
                {aWaiting ? (
                  <div>
                    in prizes
                    <p>
                      {10 - formatUnits(balanceAndSize[1], 0)} tickets until the
                      draw
                    </p>
                  </div>
                ) : (
                  <div>Drawing in 5-10 minutes.</div>
                )}
              </div>
            </div>

            {aWaiting ? (
              <div className="w-[520px] flex-initial  ">
                <div className="  flex    flex-col   gap-5 rounded-xl bg-gradient-to-tr  from-[#0042FF80]  from-10%  to-[#EB001B80] to-90% px-6 pb-11 pt-9 backdrop-blur-2xl">
                  <div className="flex  items-center  justify-between  gap-x-2   pb-7 ">
                    <h2 className=" text-3xl  font-semibold text-white sm:truncate  sm:tracking-tight">
                      Buy Ticket
                    </h2>
                    <span className=" text-base  font-normal leading-7  text-white opacity-60">
                      #{Number(issueNum)}
                    </span>
                  </div>
                  <div>
                    <div className=" mb-3 flex items-baseline justify-between  gap-x-2">
                      <span className=" text-lg font-semibold   text-white">
                        LuckyBet Ticket
                      </span>
                      <span className="text-sm    text-white">
                        Available{' '}
                        <span className="font-semibold text-[#8B8CF2]">
                          {10 - formatUnits(balanceAndSize[1], 0)} Tkts
                        </span>
                      </span>
                    </div>
                    <IndexBuyTicket
                      propsLotteryNum={Number(lotteryNum)}
                      propsBlanaceSize={
                        10 - Number(formatUnits(balanceAndSize[1], 0))
                      }
                    />
                  </div>
                  <div className="flex  items-center   gap-x-2">
                    <span className=" ">
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
                          d="M6.92154 0.571247C8.2077 -0.190416 9.7923 -0.190416 11.0785 0.571247L15.9215 3.43932C17.2077 4.20099 18 5.6086 18 7.13192V12.8681C18 14.3914 17.2077 15.799 15.9215 16.5607L11.0785 19.4288C9.7923 20.1904 8.20769 20.1904 6.92154 19.4288L2.07846 16.5607C0.792305 15.799 0 14.3914 0 12.8681V7.13192C0 5.6086 0.792305 4.20099 2.07846 3.43932L6.92154 0.571247ZM8 15C8 14.4477 8.44772 14 9 14C9.55229 14 10 14.4477 10 15C10 15.5523 9.55228 16 9 16C8.44772 16 8 15.5523 8 15ZM8.25 12C8.25 12.4142 8.58579 12.75 9 12.75C9.41421 12.75 9.75 12.4142 9.75 12L9.75 5C9.75 4.58579 9.41421 4.25 9 4.25C8.58579 4.25 8.25 4.58579 8.25 5L8.25 12Z"
                          fill="#8B8CF2"
                          fill-opacity="0.6"
                        />
                      </svg>
                    </span>
                    <span className="text-sm   leading-6 tracking-wide text-white">
                      You have
                      <span className="px-1 text-[#8B8CF2]">
                        {Number(lotteryNum)} Tkts
                      </span>
                      this round
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" relative   w-[645px] ">
                <div className="flex h-[264px] w-[360px] flex-col justify-between rounded-3xl bg-gradient-to-tr from-[#0042FF80] from-10% to-[#EB001B80]  to-90%  px-[24px]  pb-6 pt-8 ">
                  <div className=" h-20 w-20 rounded-full bg-[#0EE98D] p-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M27.9108 7.88054C27.9108 10.374 26.7528 12.597 24.9452 14.041L20.2756 18.7106C20.1237 18.8625 19.8775 18.8625 19.7256 18.7106L14.6975 13.6825C14.5347 13.5328 14.3781 13.3762 14.2284 13.2134L14.1227 13.1077C14.1211 13.1061 14.1211 13.1035 14.1227 13.1019C14.1242 13.1004 14.1243 13.098 14.1229 13.0963C12.8951 11.7068 12.1499 9.88067 12.1499 7.88054C12.1499 3.52829 15.6781 9.13723e-05 20.0304 9.13723e-05C24.3826 9.13723e-05 27.9108 3.52829 27.9108 7.88054ZM7.8805 12.1491C10.3724 12.1491 12.5942 13.3058 14.0383 15.1115L18.7112 19.7844C18.8631 19.9363 18.8631 20.1825 18.7112 20.3344L13.6746 25.371C13.5299 25.5279 13.3788 25.6789 13.2219 25.8236L13.1085 25.9371C13.1068 25.9388 13.1041 25.9388 13.1024 25.9371C13.1008 25.9355 13.0982 25.9354 13.0965 25.9369C11.7069 27.1648 9.88071 27.91 7.8805 27.91C3.52824 27.91 3.98529e-05 24.3818 3.98529e-05 20.0296C3.98529e-05 15.6773 3.52824 12.1491 7.8805 12.1491ZM25.9594 24.9445C27.4035 26.7516 29.6262 27.9093 32.1193 27.9093C36.4715 27.9093 39.9997 24.3811 39.9997 20.0289C39.9997 15.6766 36.4715 12.1484 32.1193 12.1484C30.1189 12.1484 28.2926 12.8938 26.9029 14.1219C26.9016 14.1231 26.8995 14.123 26.8983 14.1218C26.8969 14.1204 26.8948 14.1204 26.8935 14.1218L26.8091 14.2061C26.6305 14.3691 26.4595 14.5401 26.2965 14.7187L21.2901 19.7251C21.1382 19.877 21.1382 20.1232 21.2901 20.2751L25.9594 24.9445ZM12.1491 32.1193C12.1491 29.626 13.307 27.4031 15.1145 25.9591L19.7844 21.2892C19.9363 21.1373 20.1825 21.1373 20.3344 21.2892L25.3649 26.3197C25.526 26.468 25.6809 26.6229 25.8292 26.784L25.9372 26.892C25.9388 26.8936 25.9388 26.8963 25.9372 26.8979C25.9357 26.8994 25.9356 26.9019 25.937 26.9036C27.1649 28.2932 27.91 30.1192 27.91 32.1193C27.91 36.4716 24.3818 39.9998 20.0295 39.9998C15.6773 39.9998 12.1491 36.4716 12.1491 32.1193Z"
                        fill="#191927"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-3 text-xl font-normal text-[#908CB8]">
                      My Tickets
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {indexMyTicket[1].slice(0, 2).map((nfts) => (
                        <span
                          key={formatUnits(nfts, 0)}
                          className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
                        >
                          #{formatUnits(nfts, 0)}
                        </span>
                      ))}

                      {!moreTicket ? (
                        <div>
                          <Link
                            href="/prize/"
                            className="sb-bg flex h-[36px] w-[72px] items-center  text-center text-base font-normal  leading-[36px] text-[#8B8CF2] hover:opacity-60"
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
                          </Link>
                        </div>
                      ) : (
                        <div> </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-[-135px]">
                  <img
                    src={`${router.basePath}/assets/images/wating.png`}
                    alt="play now"
                    className="w-[387px]"
                  />
                </div>
              </div>
            )}
          </div>

          <div
            className="mx-auto    mb-[248px]    max-w-[1100px]     "
            id="rules-top"
          >
            <h2 className="mb-20 text-[40px] font-medium text-white">
              Game Rules
            </h2>

            <div className="   flex    justify-between ">
              <div className="w-[456px]   flex-auto">
                <img
                  src={`${router.basePath}/assets/images/play-now.png`}
                  alt="play now"
                  className="w-[456px]"
                />

                <Link
                  href="#header-top"
                  className="btn-rounded ml-[50px] mt-[-21px] inline-flex items-center justify-between rounded-lg bg-gradient-to-br  from-[#FE1C74] from-40%  to-[#E76450] to-90%  px-14  py-[21px] text-sm  leading-6 text-gray-400 hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)]  active:opacity-60"
                >
                  <span className="pr-[10px] text-lg font-semibold text-white">
                    Play Now
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="white"
                  >
                    <path
                      d="M10.352 6.697C11.3476 7.27234 11.3512 7.99611 10.352 8.64658L2.63131 14.0464C1.66122 14.5833 1.00236 14.2663 0.933198 13.1046L0.900437 1.80287C0.878596 0.732791 1.72856 0.430458 2.53849 0.943508L10.352 6.697Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
              <div className="w-[560px]   flex-initial">
                <div className="flex items-center justify-between pt-2">
                  <div className=" h-16 w-16 rounded-full bg-[#FD2073] text-center text-2xl font-bold leading-[4rem] text-white">
                    1
                  </div>
                  <dl className=" w-[468px] ">
                    <dt className="text-3xl font-medium text-white">
                      Buy Ticket
                    </dt>
                    <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                      Purchase a ticket for the lottery. Join now for a chance
                      to win.
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
                      Tickets Over 10
                    </dt>
                    <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                      If over 10 tickets are bought, a new jackpot opens. All
                      tickets are drawn.
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
                      View & Claim Prize
                    </dt>
                    <dd className="pt-3 text-lg font-medium leading-8 text-[#908CB8]">
                      Check winning numbers and claim your prize. Utilizes
                      Chainlink VRF.
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto   max-w-[1100px]  ">
            <div className="mb-10  flex  items-center    justify-between  ">
              <h2 className="text-[40px] font-medium text-white">
                Finished Rounds
              </h2>

              {openSoon ? (
                <div />
              ) : (
                <div>
                  <Link
                    href="/"
                    className="text-xl font-semibold text-[#FD2073]"
                  >
                    View more
                  </Link>
                </div>
              )}
            </div>

            {openSoon ? (
              <div className="flex flex-col    gap-4 rounded-xl bg-[#232234] p-9">
                <div className="text-center text-[20px] font-semibold text-white">
                  Open soon in
                </div>

                <div className="mx-auto flex h-[68px] w-[188px] items-center rounded-md  bg-[#13103299] px-4">
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.97819 5.6163C10.7012 5.03869 11.1643 4.14954 11.1643 3.15221C11.1643 1.41129 9.75305 0 8.01213 0C6.27122 0 4.85992 1.41129 4.85992 3.15221C4.85992 3.95282 5.1584 4.68372 5.65014 5.2397L5.64794 5.24191L5.69051 5.28447C5.75093 5.35023 5.81411 5.41341 5.87986 5.47383L8.00026 7.59423L9.97819 5.6163Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.61548 6.04477C5.03785 5.32238 4.14907 4.85965 3.15221 4.85965C1.41129 4.85965 0 6.27094 0 8.01186C0 9.75277 1.41129 11.1641 3.15221 11.1641C3.95287 11.1641 4.68382 10.8655 5.23982 10.3737L5.24219 10.3761L5.28882 10.3295C5.35157 10.2716 5.41196 10.2112 5.46984 10.1485L7.59451 8.0238L5.61548 6.04477Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.384 9.97797C10.9616 10.7008 11.8506 11.1638 12.8478 11.1638C14.5887 11.1638 16 9.7525 16 8.01158C16 6.27067 14.5887 4.85938 12.8478 4.85937C12.0472 4.85937 11.3162 5.15786 10.7603 5.64963L10.7584 5.64774L10.723 5.68307C10.6521 5.74786 10.5841 5.81586 10.5193 5.88683L8.40605 8.00006L10.384 9.97797Z"
                          fill="#0EE98D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.04614 10.3834C5.32297 10.961 4.85965 11.8503 4.85965 12.8478C4.85965 14.5887 6.27094 16 8.01186 16C9.75277 16 11.1641 14.5887 11.1641 12.8478C11.1641 12.0472 10.8656 11.3163 10.3739 10.7603L10.3761 10.7581L10.3327 10.7147C10.2728 10.6495 10.2101 10.5869 10.145 10.527L8.0238 8.40577L6.04614 10.3834Z"
                          fill="#0EE98D"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3  mr-4 block h-full w-px bg-[#D1D6DD1A]" />
                  <div className="text-[26px] font-semibold text-white">
                    {10 - formatUnits(balanceAndSize[1], 0)}
                  </div>
                </div>
                <div className="text-center  text-[18px] font-medium text-[#908CB8]">
                  Remaining Tickets
                </div>
              </div>
            ) : (
              <div>
                <div className="grid  h-14 grid-cols-5 items-center gap-2  bg-[#191927] pl-[36px]  pr-[20px] text-lg font-medium text-[#908CB8]">
                  <div>Round</div>
                  <div>Prize Pool</div>
                  <div>Total Player</div>
                  <div>Block Height </div>
                  <div>&nbsp;</div>
                </div>

                {finishedRounds.map((round: any) => (
                  <div
                    key={round}
                    className="group mt-3 grid h-[84px] grid-cols-5  items-center gap-2  rounded-lg bg-[#2A283D]  pl-[36px]   pr-[20px] text-lg      font-medium text-[#908CB8] hover:bg-gradient-to-tr hover:from-[#0042FF80] hover:to-[#EB001B80]"
                  >
                    <div className="text-xl font-semibold text-white">
                      {formatUnits(round[0], 0)}
                    </div>
                    <div className="text-lg font-medium text-[#8B8CF2] group-hover:text-white">
                      {(formatUnits(round[1], 0) * 0.001).toFixed(5)} AETH
                    </div>
                    <div className="text-lg font-medium text-[#8B8CF2]   group-hover:text-white">
                      {formatUnits(round[1], 0)}
                    </div>
                    <div className="text-lg font-medium text-[#0EE98D]">
                      {formatUnits(round[2], 0)}
                    </div>
                    <div className="text-right">
                      <Link
                        href="/prize/"
                        className="inline-block	h-11 rounded-lg bg-[#FFFFFF0F]  px-5 text-base font-semibold uppercase leading-[44px] text-white active:opacity-60  group-hover:bg-[#FD2073] "
                      >
                        view
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mx-auto   mb-32 mt-[100px]   flex   max-w-[1100px] justify-between ">
            <div className="w-[640px]">
              <h2 className="mb-6 text-[40px] font-medium text-white">
                Build and Win Together
              </h2>
              <div className="mb-16 pt-3 text-lg  font-medium leading-8 text-[#B2B1DA]">
                Become a LuckyLottor and be part of a thriving ecosystem. Sell
                lottery tickets and embrace the shared success. Your luck, our
                joy - together we win!
              </div>

              <Link
                href="/lucky-lottor/"
                className="btn-rounded  inline-flex items-center justify-between rounded-lg bg-gradient-to-br  from-[#FE1C74] from-40%  to-[#E76450] to-90% px-14  py-[21px] text-sm  leading-6 text-gray-400 hover:shadow-[0px_0px_20px_0px_rgba(235,89,87,0.60)]  active:opacity-60"
              >
                <span className="  text-xl  font-semibold text-white">
                  Join Now
                </span>
              </Link>
            </div>
            <div className="">
              <img
                src={`${router.basePath}/assets/images/join-now.png`}
                alt="join now"
                className="w-[360px]"
              />
            </div>
          </div>

          <div className="mx-auto      mb-32   mt-[100px]  flex max-w-[1100px] items-center justify-between rounded-lg bg-gradient-to-tr from-[#0042FF80] to-[#EB001B80]     px-[52px]  py-12">
            <div className="w-[640px]">
              <h2 className="mb-3 text-4xl   font-semibold leading-10 text-[#C3C4FF]">
                Connect with the community
              </h2>
              <div className=" text-xl  font-medium  leading-8 text-[#C3C4FF]">
                Feel free to ask questions, report issues, and meet new people.
              </div>
            </div>
            <div className="flex-1 text-right">
              <Link
                href="/lucky-lottor/"
                className="  inline-flex items-center justify-between rounded-full bg-gradient-to-r   from-[#FD2073]   to-[#FD2073]  px-9 py-[18px] text-sm  leading-6   text-gray-400 hover:bg-gradient-to-r  hover:from-[#fd4d8f] hover:to-[#fd4d8f] active:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="white"
                >
                  <path
                    d="M17.4622 9.82783C18.727 8.817 19.5371 7.26129 19.5371 5.51636C19.5371 2.46976 17.0674 0 14.0208 0C10.9742 0 8.50443 2.46976 8.50443 5.51636C8.50443 6.91653 9.02609 8.19486 9.88566 9.1676C9.88663 9.16871 9.88658 9.17038 9.88554 9.17142C9.88445 9.17251 9.88445 9.17428 9.88554 9.17537L9.92177 9.2116L13.8092 5.3242C13.8775 5.25586 13.9883 5.25586 14.0566 5.3242L18.0338 9.30133C17.8559 9.48985 17.6649 9.66584 17.4622 9.82783Z"
                    fill="white"
                  />
                  <path
                    d="M13.9754 13.2652L10.2899 9.57969L13.9754 13.2652Z"
                    fill="white"
                  />
                  <path
                    d="M9.82872 10.5805C8.81791 9.31512 7.2618 8.50446 5.51635 8.50446C2.46976 8.50446 0 10.9742 0 14.0208C0 17.0674 2.46976 19.5372 5.51635 19.5372C6.91648 19.5372 8.19477 19.0155 9.1675 18.156C9.1686 18.1551 9.17025 18.1551 9.17128 18.1562C9.17236 18.1572 9.17411 18.1572 9.17519 18.1562L9.23231 18.099L5.25708 14.1238C5.18874 14.0554 5.18874 13.9446 5.25708 13.8763L9.2099 9.92347C9.43353 10.1252 9.64058 10.345 9.82872 10.5805Z"
                    fill="white"
                  />
                  <path
                    d="M18.699 18.0335C19.6868 18.9654 21.0186 19.5366 22.4837 19.5366C25.5303 19.5366 28.0001 17.0669 28.0001 14.0203C28.0001 10.9737 25.5303 8.50393 22.4837 8.50393C21.0835 8.50393 19.805 9.02567 18.8323 9.88535C18.8312 9.88625 18.8297 9.8862 18.8288 9.88524C18.8278 9.88425 18.8261 9.88425 18.8251 9.88524L18.7605 9.94991C18.7469 9.96235 18.7334 9.97486 18.7199 9.98744L22.6087 13.8763C22.6771 13.9446 22.6771 14.0554 22.6087 14.1238L18.699 18.0335Z"
                    fill="white"
                  />
                  <path
                    d="M9.92342 18.7901C9.04141 19.768 8.50446 21.0631 8.50446 22.4836C8.50446 25.5302 10.9742 28 14.0208 28C17.0674 28 19.5372 25.5302 19.5372 22.4836C19.5372 21.0835 19.0155 19.8052 18.156 18.8324C18.155 18.8313 18.1551 18.8297 18.1561 18.8286C18.1572 18.8276 18.1572 18.8258 18.1561 18.8247L18.0846 18.7532C18.0487 18.7141 18.0122 18.6755 17.9752 18.6375C17.9752 18.6375 17.9752 18.6375 17.9752 18.6375C17.9949 18.6577 18.0144 18.6781 18.0338 18.6987L14.0566 22.6759C13.9883 22.7442 13.8775 22.7442 13.8092 22.6759L9.92342 18.7901Z"
                    fill="white"
                  />
                  <path
                    d="M13.8092 5.3242L9.92177 9.2116L9.95743 9.24728C10.0635 9.36272 10.1744 9.47364 10.2899 9.57969L13.9754 13.2652C13.989 13.2789 14.0112 13.2789 14.0249 13.2652L17.4622 9.82783C17.6649 9.66584 17.8559 9.48985 18.0338 9.30133L18.7199 9.98744C18.6137 10.0866 18.5114 10.1899 18.4133 10.297L14.7351 13.9752C14.7215 13.9889 14.7215 14.0111 14.7351 14.0247L18.1727 17.4623C18.3346 17.6649 18.5106 17.8557 18.699 18.0335L18.0338 18.6987C17.943 18.6024 17.8487 18.5094 17.7512 18.4199L14.0662 14.7349C14.0526 14.7212 14.0304 14.7212 14.0167 14.7349L10.5799 18.1717C10.3446 18.3598 10.125 18.5667 9.92342 18.7901L9.23231 18.099L9.24607 18.0853C9.36235 17.9785 9.47404 17.8668 9.5808 17.7505L13.265 14.0663C13.2787 14.0526 13.2787 14.0305 13.265 14.0168L9.82872 10.5805C9.64058 10.345 9.43353 10.1252 9.2099 9.92347L5.25708 13.8763L13.8092 5.3242Z"
                    fill="white"
                  />
                </svg>
                <span className=" pl-4   text-xl font-semibold text-white">
                  Join Our Telegram
                </span>
              </Link>
            </div>
          </div>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              'max-w-xs overflow-hidden  rounded-lg !bg-[#423D5B]  !text-white !text-lg !p-4  shadow-lg',
            duration: 5000,
          }}
        />
      </div>
    </Main>
  );
};

export default Index;
