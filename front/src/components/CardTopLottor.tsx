import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

import { LyLottorContract, publicClient } from '../utils/client';

export default function CardTopLottor() {
  const [bonus, setBonus] = useState([]);

  const getTopLottor = async () => {
    try {
      const readBonus = await publicClient.readContract({
        ...LyLottorContract,
        functionName: 'getLottorsWithBonus',
      });
      setBonus(readBonus);
    } catch (error) {
      console.error('Error retrieving balance:', error);
    }
  };

  useEffect(() => {
    getTopLottor();
  }, []);

  const convertedArr = bonus.map((value) => Number(value));
  const topLottor = convertedArr
    .map((value, index) => {
      return {
        rank: (index + 1).toString().padStart(2, '0'),
        lotterId: (index + 2).toString().padStart(2, '0'),
        accuReturn: value.toString(),
      };
    })
    .sort((a, b) => {
      return b.accuReturn - a.accuReturn;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = topLottor.slice(indexOfFirstPost, indexOfLastPost);

  const totalPosts = topLottor.length;

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(topLottor.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(Math.ceil(topLottor.length / postsPerPage));
  };
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="mx-auto   max-w-[1100px]  " id="lottor-top">
        <div className="mb-16 flex  items-center    justify-between  ">
          <h2 className="text-[40px] font-medium text-white">Top Lottor</h2>
        </div>
        {topLottor ? (
          <div>
            <div className="grid  h-14 grid-cols-4 items-center gap-2  rounded-xl bg-[#2A283D] pl-[36px]  pr-[20px] text-lg font-medium text-[#908CB8]">
              <div>Rank</div>
              <div>Lottor ID</div>
              <div>CTS</div>
              <div className="flex flex-1 justify-end gap-x-4">
                <button
                  type="button"
                  onClick={firstPage}
                  className="inline-flex items-center  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-white hover:fill-[#FD2073]  active:opacity-60"
                  >
                    <path d="M9 19C9 20.1046 8.66421 21 8.25 21C7.83579 21 7.5 20.1046 7.5 19V7C7.5 5.89543 7.83579 5 8.25 5C8.66421 5 9 5.89543 9 7V19Z" />
                    <path d="M17.7803 19.7803C17.4874 20.0732 17.0126 20.0732 16.7197 19.7803L10.7197 13.7803C10.4268 13.4874 10.4268 13.0126 10.7197 12.7197L16.7197 6.71967C17.0126 6.42678 17.4874 6.42678 17.7803 6.71967C18.0732 7.01256 18.0732 7.48744 17.7803 7.78033L12.3107 13.25L17.7803 18.7197C18.0732 19.0126 18.0732 19.4874 17.7803 19.7803Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={previousPage}
                  className="inline-flex items-center  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-white hover:fill-[#FD2073]  active:opacity-60"
                  >
                    <path d="M14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303L7.46967 12.5303C7.17678 12.2374 7.17678 11.7626 7.46967 11.4697L13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967C14.8232 5.76256 14.8232 6.23744 14.5303 6.53033L9.06066 12L14.5303 17.4697C14.8232 17.7626 14.8232 18.2374 14.5303 18.5303Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextPage}
                  className="inline-flex items-center  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-white hover:fill-[#FD2073]  active:opacity-60"
                  >
                    <path d="M9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967L16.5303 11.4697C16.8232 11.7626 16.8232 12.2374 16.5303 12.5303L10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303C9.17678 18.2374 9.17678 17.7626 9.46967 17.4697L14.9393 12L9.46967 6.53033C9.17678 6.23744 9.17678 5.76256 9.46967 5.46967Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={lastPage}
                  className="inline-flex items-center  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-white hover:fill-[#FD2073]  active:opacity-60"
                  >
                    <path d="M15 5C15 3.89543 15.3358 3 15.75 3C16.1642 3 16.5 3.89543 16.5 5L16.5 17C16.5 18.1046 16.1642 19 15.75 19C15.3358 19 15 18.1046 15 17L15 5Z" />
                    <path d="M6.21967 4.21967C6.51256 3.92678 6.98744 3.92678 7.28033 4.21967L13.2803 10.2197C13.5732 10.5126 13.5732 10.9874 13.2803 11.2803L7.28033 17.2803C6.98744 17.5732 6.51256 17.5732 6.21967 17.2803C5.92678 16.9874 5.92678 16.5126 6.21967 16.2197L11.6893 10.75L6.21967 5.28033C5.92678 4.98744 5.92678 4.51256 6.21967 4.21967Z" />
                  </svg>
                </button>
              </div>
            </div>

            {currentPosts.map((currentPost) => (
              <div
                key={currentPost.id}
                className="group mt-3 grid h-[84px] grid-cols-4  items-center gap-2  rounded-lg bg-[#2A283D]  pl-[36px]   pr-[20px] text-lg      font-medium text-[#908CB8] hover:bg-gradient-to-tr hover:from-[#0042FF80] hover:to-[#EB001B80]"
              >
                <div className="text-xl font-semibold text-white">
                  No.{currentPost.rank}
                </div>
                <div className="text-lg font-medium text-[#8B8CF2] group-hover:text-white">
                  {currentPost.lotterId}
                </div>
                <div className="text-lg font-medium text-[#0EE98D]">
                  {formatEther(currentPost.accuReturn) * 10000} Tkts.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </div>
  );
}
