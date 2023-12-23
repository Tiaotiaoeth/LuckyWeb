import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { Toaster } from 'react-hot-toast';

// import { useRouter } from 'next/router';
import CardTopLottor from '@/components/CardTopLottor';
import CardYourLottor from '@/components/CardYourLottor';
import TopHold from '@/components/TopHold';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const LuckyLottor = () => {
  // const router = useRouter();

  return (
    <Main meta={<Meta title="Lucky Bet Now!" description="Lucky Bet Now." />}>
      <div className="  bg-image-2   ">
        <header className="  " id="header-top">
          <nav
            className="mx-auto flex max-w-full items-center justify-between p-6 lg:px-4"
            aria-label="Global"
          >
            <div className="flex lg:flex">
              <div className="text-[28px] font-medium text-[#f5f5f5]">
                LuckyLottor
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

        <div className=" py-10">
          <CardYourLottor />

          <CardTopLottor />
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

export default LuckyLottor;
