export default function CardYourLottorInfo() {
  return (
    <div className="flex w-full lg:flex">
      <div className="w-2/5 pr-6">
        <div className="rounded-xl bg-gray-900   lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-full border-b border-gray-800  p-6  ">
            <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate  sm:tracking-tight">
              Luck Lottor #2233
            </h2>
          </div>

          <div className="h-40 w-full bg-green-600 pt-10	text-center">img</div>

          <div className="mt-4 flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Linked Address
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              1,000 Addr
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              CTS
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              8000 Tkts
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Is Unclaimed
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              Yes
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Update Block
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              222345
            </span>
          </div>
        </div>
      </div>
      <div className="w-2/5 flex-col">
        <div className="rounded-xl bg-gray-900   lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-full border-b border-gray-800  p-6  ">
            <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate  sm:tracking-tight">
              Pool
            </h2>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Asset:
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              AETH
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Unclaimed Rewards:
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              108 AETH
            </span>
          </div>
          <button
            type="button"
            className="m-6 flex justify-center rounded-md bg-gradient-to-r from-yellow-500 to-pink-500 p-3.5 text-sm font-semibold text-white shadow-sm  hover:from-green-500 hover:to-blue-500  "
          >
            Claim
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-gray-900  lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-full border-b border-gray-800  p-6  ">
            <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate  sm:tracking-tight">
              Pool
            </h2>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Asset:
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              USDT
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-x-2 px-6 py-2">
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              Unclaimed Rewards:
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              1000 USDT
            </span>
          </div>
          <button
            type="button"
            className="m-6 flex justify-center rounded-md bg-gradient-to-r from-yellow-500 to-pink-500 p-3.5 text-sm font-semibold text-white shadow-sm  hover:from-green-500 hover:to-blue-500  "
          >
            Claim
          </button>
        </div>
      </div>
      <div className="w-1/5 pl-6">
        <div className="rounded-xl bg-gray-900   lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-full border-b border-gray-800  p-6  ">
            <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate  sm:tracking-tight">
              Referral
            </h2>
          </div>

          <div className="mt-4  px-6 py-2">
            <div className="h-40 w-full bg-green-600 pt-10	text-center">
              Link
            </div>
            <div className="text-center text-gray-100">Copy Link</div>
          </div>
          <div className="mt-4  px-6 py-2">
            <div className="h-40 w-full bg-green-600 pt-10	text-center">
              Download
            </div>
            <div className="text-center text-gray-100">Download</div>
          </div>
          <div className="mt-4  px-6 py-2">
            <div className="h-40 w-full bg-green-600 pt-10	text-center">
              Twitter
            </div>
            <div className="text-center text-gray-100">Twitter</div>
          </div>
        </div>
      </div>
    </div>
  );
}
