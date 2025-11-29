import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {
  monad,
  monadTestnet,
  mainnet,
} from 'wagmi/chains';



export  const config = getDefaultConfig({
  appName: 'guess puzzle',
  projectId: '314d34076b3a84844a29b9a25007da5e',
  chains: [monad,monadTestnet,mainnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});


