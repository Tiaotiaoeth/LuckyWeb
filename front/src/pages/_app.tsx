import '../styles/global.css';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, arbitrumGoerli, hardhat } from 'wagmi/chains';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client [arbitrum, mainnet, polygon, optimism];

const chains = [arbitrumGoerli, arbitrum, hardhat];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  publicClient,
});

const themeVariables = {
  '--w3m-font-family': 'Poppins, sans-serif',
  '--w3m-accent-color': '#EB001B33',
  '--w3m-background-color': '#EB001B33',
  '--w3m-container-border-radius': '10px',
  '--w3m-button-border-radius': '6px',
  '--w3m-secondary-button-border-radius': '6px',
  '--w3m-button-hover-highlight-border-radius	': '1rem',
  '--w3m-text-medium-regular-size': '18px',
  '--w3m-text-medium-regular-weight': '600',
  '--w3m-background':
    'linear-gradient(66deg, rgba(235, 0, 27, 0.16) -11.84%, rgba(235, 0, 27, 0.48) 98.75%)',
};
// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <div className={`${poppins.variable} font-sans`}>
            <Component {...pageProps} />
          </div>
        </WagmiConfig>
      ) : null}

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeVariables={themeVariables}
      />
    </>
  );
}
