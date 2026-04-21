import { useAccount, useBalance, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function useWallet() {
  const { address, isConnected, chain, connector } = useAccount();
  
  const { data: balanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: !!address },
  });

  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';
  const balanceUsd = balanceData ? (parseFloat(balanceData.formatted) * 3820).toFixed(2) : '0.00';

  const truncatedAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

  return {
    address,
    truncatedAddress,
    ensName: ensName || null,
    balance,
    balanceUsd,
    chain,
    connector,
    isConnected,
    symbol: balanceData?.symbol || 'ETH',
  };
}
