import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import CardCurrentRound from '@/components/CardCurrentRound';
import TopHold from '@/components/TopHold';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import CardAllHistory from '../components/CardAllHistory';
import CardYourHistory from '../components/CardYourHistory';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const Result = () => {
  // const [loading, setLoading] = useState(false);
  // const { open } = useWeb3Modal();
  // const { isConnected } = useAccount();
  // const label = isConnected ? 'Disconnect' : 'Connect Wallet';

  // const [isOpen, setIsOpen] = useState(false);

  // function closeModal() {
  //   setIsOpen(false);
  // }

  // function openModal() {
  //   setIsOpen(true);
  // }

  // async function onOpen() {
  //   setLoading(true);
  //   await open();
  //   setLoading(false);
  // }

  // function onClick() {
  //   if (isConnected) {
  //     buyTicket();
  //   } else {
  //     onOpen();
  //   }
  // }

  return (
    <Main meta={<Meta title="Lucky Bet Now!" description="Lucky Bet Now." />}>
      <div className="  bg-image-3   ">
        <header className="  " id="header-top">
          <nav
            className="mx-auto flex max-w-full items-center justify-between p-6 lg:px-4"
            aria-label="Global"
          >
            <div className="flex lg:flex">
              <div className="text-[28px] font-medium text-[#f5f5f5]">
                Prize
              </div>
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

        <div className="  py-10">
          <div className="mx-auto   max-w-[1100px]  ">
            <CardYourHistory />

            <CardCurrentRound />
            <CardAllHistory />
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

export default Result;
