import { Popover } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';

import { LyIssuerContract, publicClient } from '../utils/client';

export default function TopHold() {
  const [issueNum, setIssueNum] = useState(parseUnits('0', 0));
  const [roundNum, setRoundNum] = useState([parseUnits('0', 0)]);
  const [roundList, setRoundList] = useState([0n, []]);

  const { data: walletClient } = useWalletClient();

  const getHeadTickets = async () => {
    try {
      const readIssueNum = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getIssueNum',
      });
      setIssueNum(readIssueNum);

      const readLotteryNum = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getLotteryNum',
        args: [issueNum],
        account: walletClient?.account,
      });
      setRoundNum(readLotteryNum);

      const readThisRound = await publicClient.readContract({
        ...LyIssuerContract,
        functionName: 'getRecords',
        args: [issueNum],
        account: walletClient?.account,
      });
      setRoundList(readThisRound);
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };
  useEffect(() => {
    getHeadTickets();
  }, [walletClient, issueNum]);

  return (
    <div>
      <Popover className="relative">
        <Popover.Button className=" ml-4 flex items-center justify-center gap-[10px] rounded-lg bg-[#FFFFFF14]  px-5 py-2">
          <span className="text-white">Mine</span>
          <span className="text-[#0EE98D]">{roundList[1].length}</span>
        </Popover.Button>

        <Popover.Panel className="absolute right-0 top-11 z-10 h-[216px]  w-[280px]  rounded-lg bg-[#13103299] px-5 py-3">
          <div className="grid grid-cols-3 gap-3">
            {roundList[1].map((nfts) => (
              <span
                key={nfts}
                className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
              >
                {formatUnits(nfts, 0)}
              </span>
            ))}
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
