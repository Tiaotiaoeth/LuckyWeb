import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Poppins } from 'next/font/google';
import { Fragment } from 'react';
import { formatUnits } from 'viem';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function ModalPerTicket({ hi, isOpen, onClose }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={onClose}>
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
            <div className="mx-auto  mt-20  flex w-[530px] items-stretch justify-center rounded-xl bg-[#2A283D]  p-7  ">
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
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="">
                      <h2 className=" text-2xl font-semibold text-[#EEF2F8]">
                        All tickets
                      </h2>
                      <h5 className=" text-sm font-normal text-[#908CB8]">
                        {/* #{formatUnits(hi.issueNum, 0)} */}
                      </h5>
                      <div className=" mt-10  flex h-[250px]  flex-wrap  content-start      gap-x-5    gap-y-4  overflow-y-auto ">
                        {/* {hi.localids.slice(1).map((localid) => (
                          <span
                            key={localid}
                            className="  flex h-[28px]  w-[65px]     justify-center rounded-full   border border-[#8B8CF299] py-2 text-center text-[11px] font-normal  leading-3 text-[#8B8CF2]"
                          >
                            #{formatUnits(localid, 0)}
                          </span>
                        ))} */}

                        {hi.localids.slice(1).map((localid) => (
                          <span
                            key={localid}
                            className="sb-bg w-[72px] text-center  text-base font-normal  leading-[36px] text-[#8B8CF2]"
                          >
                            #{formatUnits(localid, 0)}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end  gap-5">
                        <button
                          type="button"
                          className="  flex w-[155px] justify-center rounded-md  bg-[#FD2073] px-6 py-4 text-base font-semibold text-white hover:shadow-[0px_0px_16px_0px_rgba(252,37,112,0.60)] "
                          onClick={onClose}
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
  );
}
