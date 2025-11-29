import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { config } from "./rainbowKitConfig.js"
import React from 'react';
import ReactDOM from 'react-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import {QueryClientProvider,  QueryClient,} from "@tanstack/react-query";
import {RainbowKitProvider,lightTheme } from '@rainbow-me/rainbowkit';


const queryClient = new QueryClient();



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider modalSize="compact" theme={lightTheme({
        accentColor: 'rgb(117,117,117)',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      })}>
        <App />
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)

