import React, { useEffect, useState } from 'react';

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const openNotification = () => {
    setIsOpen(true);
  };

  const closeNotification = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    let timer: any;

    if (isOpen) {
      timer = setTimeout(() => {
        closeNotification();
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <div className="mx-auto max-w-md p-4">
      <button
        onClick={openNotification}
        className="rounded-md bg-blue-500 px-4 py-2 text-white"
      />

      {isOpen && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 py-6  ">
          <div
            className="pointer-events-auto w-full max-w-sm rounded-lg bg-[#423D5B] shadow-lg"
            role="alert"
          >
            <div className=" overflow-hidden  rounded-lg shadow-sm">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.9999 25.6667C20.4432 25.6667 25.6666 20.4434 25.6666 14C25.6666 7.55672 20.4432 2.33337 13.9999 2.33337C7.5566 2.33337 2.33325 7.55672 2.33325 14C2.33325 20.4434 7.5566 25.6667 13.9999 25.6667ZM19.3573 11.0373C19.654 10.6558 19.5852 10.1061 19.2038 9.8094C18.8223 9.51271 18.2726 9.58143 17.9759 9.96288L13.3011 15.9734C13.1971 16.107 13.0016 16.1244 12.8757 16.0111L9.9186 13.3497C9.55941 13.0264 9.00615 13.0555 8.68288 13.4147C8.3596 13.7739 8.38872 14.3272 8.74792 14.6505L11.705 17.3119C12.586 18.1048 13.9548 17.9834 14.6824 17.0478L19.3573 11.0373Z"
                        fill="url(#paint0_linear_802_4431)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.9999 25.6667C20.4432 25.6667 25.6666 20.4434 25.6666 14C25.6666 7.55672 20.4432 2.33337 13.9999 2.33337C7.5566 2.33337 2.33325 7.55672 2.33325 14C2.33325 20.4434 7.5566 25.6667 13.9999 25.6667ZM19.3573 11.0373C19.654 10.6558 19.5852 10.1061 19.2038 9.8094C18.8223 9.51271 18.2726 9.58143 17.9759 9.96288L13.3011 15.9734C13.1971 16.107 13.0016 16.1244 12.8757 16.0111L9.9186 13.3497C9.55941 13.0264 9.00615 13.0555 8.68288 13.4147C8.3596 13.7739 8.38872 14.3272 8.74792 14.6505L11.705 17.3119C12.586 18.1048 13.9548 17.9834 14.6824 17.0478L19.3573 11.0373Z"
                        fill="#0EE98D"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_802_4431"
                          x1="24.2793"
                          y1="7.34899"
                          x2="2.36694"
                          y2="7.54407"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#91E44B" />
                          <stop offset="1" stop-color="#5CD9B6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className=" text-lg font-medium text-white">
                      Claim successful
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={closeNotification}
                      className="inline-flex text-gray-400 transition duration-150 ease-in-out focus:text-gray-500 focus:outline-none"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
