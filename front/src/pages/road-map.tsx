import { useRouter } from 'next/router';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const router = useRouter();
  return (
    <Main meta={<Meta title="Lucky Bet Now!" description="Lucky Bet Now." />}>
      <div className="bg-black py-10">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mx-auto  sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-orange-500 sm:text-4xl">
              Road Map
            </h2>
          </div>
          <div className="mt-10 flex w-full lg:flex">
            <div className=" w-7/12 pr-4 pt-6">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600 ">
                MAP OFFER
              </h2>
              <p className="mt-4 text-base text-gray-500">
                Offers premium accounts with support for several head exchanges,
                including Binance, OKEX, Deribit, etc., and offers a variety of
                subscription prices for customers of different sizes.
              </p>
            </div>
            <div className=" w-5/12 text-center">
              <img
                src={`${router.basePath}/assets/images/rm-1.png`}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="inline-block h-60 w-60 rounded-full "
              />
            </div>
          </div>

          <div className="mt-20 flex w-full lg:flex">
            <div className="order-first w-7/12 pr-4 pt-6  md:order-last">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600 ">
                Develop more Game
              </h2>
              <p className="mt-4  text-base text-gray-500">
                Offers premium accounts with support for several head exchanges,
                including Binance, OKEX, Deribit, etc., and offers a variety of
                subscription prices for customers of different sizes.
              </p>
            </div>
            <div className="w-5/12 text-center">
              <img
                src={`${router.basePath}/assets/images/rm-2.png`}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="inline-block h-60 w-60 rounded-full "
              />
            </div>
          </div>

          <div className="mt-20  flex w-full lg:flex">
            <div className=" w-7/12 pr-4 pt-6">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600 ">
                Add More lucky Role
              </h2>
              <p className="mt-4  text-base text-gray-500">
                Offers premium accounts with support for several head exchanges,
                including Binance, OKEX, Deribit, etc., and offers a variety of
                subscription prices for customers of different sizes.
              </p>
            </div>
            <div className=" w-5/12 text-center">
              <img
                src={`${router.basePath}/assets/images/rm-3.png`}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="inline-block h-60 w-60 rounded-full "
              />
            </div>
          </div>

          <div className="mt-20 flex w-full lg:flex">
            <div className="order-first w-7/12 pr-4 pt-6  md:order-last">
              <h2 className="text-2xl font-bold tracking-tight text-orange-600 ">
                Build Lotterverse
              </h2>
              <p className="mt-4  text-base text-gray-500">
                Offers premium accounts with support for several head exchanges,
                including Binance, OKEX, Deribit, etc., and offers a variety of
                subscription prices for customers of different sizes.
              </p>
            </div>
            <div className="w-5/12 text-center">
              <img
                src={`${router.basePath}/assets/images/rm-4.png`}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="inline-block h-60 w-60 rounded-full "
              />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
