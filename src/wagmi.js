import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base } from 'wagmi/chains';
import { http } from 'wagmi';

const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const wcProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo';

export const config = getDefaultConfig({
  appName: 'June Web3',
  projectId: wcProjectId,
  chains: [mainnet, arbitrum, base],
  transports: {
    [mainnet.id]: http(
      alchemyKey && alchemyKey !== 'placeholder'
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
    [arbitrum.id]: http(
      alchemyKey && alchemyKey !== 'placeholder'
        ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
    [base.id]: http(
      alchemyKey && alchemyKey !== 'placeholder'
        ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`
        : undefined
    ),
  },
});
