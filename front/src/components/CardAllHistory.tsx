import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';

import { LyIssuerContract, publicClient } from '../utils/client';
import ModalMyTicket from './ModalMyTicket';
import ModalPerTicket from './ModalPerTicket';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function CardAllHistory() {
  // const { address, isConnecting, isDisconnected } = useAccount();

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const { data: walletClient } = useWalletClient();
  // const [latestRewards, setLatestRewards] = useState([]);

  const [loadMore, setLoadMore] = useState(parseUnits('3', 0));
  const [allHistory, setAllHistory] = useState([
    {
      issueNum: parseUnits('0', 0),
      localids: [parseUnits('0', 0), parseUnits('0', 0)],
      size: parseUnits('0', 0),
      userRewardLocalIds: [parseUnits('0', 0), parseUnits('0', 0)],
      userTicketLocalIds: [parseUnits('0', 0), parseUnits('0', 0)],
      userTickets: [parseUnits('0', 0), parseUnits('0', 0)],
    },
  ]);

  const [issNumber, setIssNumber] = useState(1);

  const [onlyOne, setonlyOne] = useState(false);

  const getallHistory = async () => {
    try {
      const readAllHistory = await publicClient.readContract({
        ...LyIssuerContract,
        args: [loadMore],
        functionName: 'allHistory',
        account: walletClient?.account,
      });

      setAllHistory(readAllHistory?.reverse());
      setIssNumber(formatUnits(readAllHistory[0]?.issueNum, 0));
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getallHistory().finally(() => {
      setLoading(false);
    });

    if (issNumber > 3 && loadMore === 3n) {
      setHasMore(true);
    }
  }, [loadMore, issNumber, walletClient]);

  const nextClick = () => {
    if (loading) return;
    setLoadMore(parseUnits('1000', 0));
    setHasMore(false);
  };

  const [allPerTickets, setAllPerTickets] = useState(null);

  const [allMyTickets, setAllMyTickets] = useState(null);

  const handleMorePerTickets = (hi) => {
    setAllPerTickets(hi);
  };
  const handleMoreMyTickets = (hi) => {
    setAllMyTickets(hi);
  };

  const handleClosePerTickets = () => {
    setAllPerTickets(null);
  };

  const handleCloseMyTickets = () => {
    setAllMyTickets(null);
  };

  return (
    <div>
      {onlyOne ? (
        <div className=" rounded-xl  bg-[#2A283D] px-6 pb-9   pt-6  shadow-[0px_15px_35px_0px_rgba(0,0,0,0.20)] ">
          <h2 className="  mb-9 text-xl font-semibold text-white">
            Waiting for lottery
          </h2>
        </div>
      ) : (
        <div
          id="history-top"
          className=" mb-[60px]  rounded-xl bg-[#2A283D] px-6 pb-9   pt-6  shadow-[0px_15px_35px_0px_rgba(0,0,0,0.20)] "
        >
          <h2 className="  mb-9 text-xl font-semibold text-white">
            ALL History
          </h2>

          {allHistory.map((hi) => (
            <div key={hi.issueNum}>
              <div className=" mb-4 text-lg font-medium leading-8 text-[#908CB8]">
                Pool #{formatUnits(hi.issueNum, 0)}
              </div>
              <div className="mb-16 flex">
                <div className="flex  w-1/3 flex-col  rounded-lg bg-gradient-to-br from-[#0042ff80]  to-[#eb001b80] p-6">
                  <h5 className="text-sm font-semibold text-[#908CB8]">
                    Jackpot
                  </h5>

                  <h6 className="animated-text-fg w-[409px] bg-gradient-to-r  from-[#FDFF83]  to-[#FF338E] text-[40px]    font-bold  drop-shadow-[0px_4px_10px_rgba(0,0,0,0.30)] ">
                    {(formatUnits(hi.size, 0) * 0.0005).toFixed(5)} AETH
                  </h6>
                  <div className=" upcoming-bg mb-5 mt-1 w-[112px]  text-center text-base font-normal leading-[36px]  text-[#8B8CF2]">
                    #{formatUnits(hi.localids[0], 0)}
                  </div>
                  <div className=" flex justify-between text-sm text-[#8B8CF2]">
                    <div className="">
                      <span className="font-semibold">
                        {(formatUnits(hi.size, 0) * 0.001).toFixed(5)}
                      </span>{' '}
                      AETH <br />
                      PrizePot
                    </div>
                    <div className="">
                      <span className="font-semibold">
                        {formatUnits(hi.size, 0)}
                      </span>{' '}
                      <br />
                      Total player this round
                    </div>
                  </div>
                </div>
                <div className="ml-4  flex flex-1  flex-col  justify-between  rounded-md bg-[#13103299]  p-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-[#908CB8]">
                        PerTicket
                      </h5>
                      <span className="text-[11px]  font-normal text-[#8B8CF2] ">
                        2th~ 11th Winner
                      </span>
                    </div>
                    <h6 className="   flex items-center text-3xl font-bold text-white">
                      {(formatUnits(hi.size, 0) * 0.000025).toFixed(5)}
                      <span className=" pl-2 text-sm font-normal">AETH</span>
                    </h6>
                  </div>
                  <div className="  grid grid-cols-4  flex-wrap gap-x-5 gap-y-4">
                    {hi.localids.slice(1).map((localid) => (
                      <span
                        key={localid}
                        className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
                      >
                        #{formatUnits(localid, 0)}
                      </span>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleMorePerTickets(hi)}
                      className="sb-bg h-[36px] w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2] hover:opacity-60"
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
                </div>
                <div className="ml-4  flex flex-1  flex-col  justify-between  rounded-md bg-[#13103299]  p-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-[#908CB8]">
                        My tickets
                      </h5>
                    </div>
                    <div className=" flex  flex-wrap  gap-x-3 gap-y-2">
                      {hi.userRewardLocalIds.map((rewardLocal) => (
                        <h6
                          className=" flex items-center text-2xl  font-semibold text-white"
                          key={rewardLocal}
                        >
                          <span className="text-sm font-normal">#</span>
                          {formatUnits(rewardLocal, 0)}
                        </h6>
                      ))}
                    </div>
                  </div>
                  <div className="  grid grid-cols-4 flex-wrap  gap-x-5 gap-y-4">
                    {hi.userTicketLocalIds.slice(0, 3).map((ticketLocal) => (
                      <span
                        key={ticketLocal}
                        className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2] "
                      >
                        #{formatUnits(ticketLocal, 0)}
                      </span>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleMoreMyTickets(hi)}
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
                </div>
              </div>

              {allPerTickets && (
                <ModalPerTicket
                  hi={allPerTickets}
                  isOpen
                  onClose={handleClosePerTickets}
                />
              )}

              {allMyTickets && (
                <ModalMyTicket
                  hi={allMyTickets}
                  isOpen
                  onClose={handleCloseMyTickets}
                />
              )}
            </div>
          ))}

          {hasMore ? (
            <button
              type="button"
              onClick={nextClick}
              className=" flex    w-full justify-center rounded-md bg-[#423D5B] py-4  text-center text-base font-semibold text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)]   hover:bg-[#FD2073]  active:opacity-60"
            >
              {loading ? 'Loading...' : 'View more'}
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
