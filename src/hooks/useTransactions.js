import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../lib/etherscan';

export function useTransactions(address) {
  const query = useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      if (!address) return [];
      try {
        const txs = await getTransactions(address);
        return txs.length > 0 ? txs : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return {
    transactions: query.data || [],
    isLoading: query.isLoading,
  };
}

export function formatTxValue(value, type, tx) {
  // Use pre-formatted display value if available (for fallback data)
  if (tx?.displayValue) return tx.displayValue;

  const eth = parseFloat(value) / 1e18;
  if (eth === 0) return '0 ETH';
  if (eth < 0.001) return '<0.001 ETH';
  
  // Format nicely without trailing zeros
  const formatted = eth < 1 ? eth.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') : eth.toFixed(2);
  const prefix = type === 'send' ? '−' : '+';
  return `${prefix}${formatted} ETH`;
}

export function getTxDisplayColor(tx) {
  if (tx?.displayColor === 'gain') return 'text-gain-green';
  if (tx?.displayColor === 'loss') return 'text-loss-red';
  return tx.type === 'send' || tx.type === 'contract' ? 'text-loss-red' : 'text-gain-green';
}

export function formatTxTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  if (diff < 172800000) return 'Yesterday';
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function getTxLabel(tx) {
  if (tx.functionName) {
    const name = tx.functionName.split('(')[0];
    if (name === 'swap' || name === 'swapExactTokensForTokens') return 'Swap USDC';
    if (name === 'mint') return 'NFT Mint';
    if (name === 'bridge') return 'Bridge ARB';
    if (name === 'approve') return 'Approve';
    if (name === 'transfer') return tx.type === 'send' ? 'Send' : 'Receive';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (tx.type === 'send') return 'Send ETH';
  if (tx.type === 'receive') return 'Receive ETH';
  return 'Contract Call';
}
