import { useQuery } from '@tanstack/react-query';
import { getGasOracle, getEthPrice } from '../lib/etherscan';

export function useGas() {
  const gasQuery = useQuery({
    queryKey: ['gasOracle'],
    queryFn: getGasOracle,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const ethPriceQuery = useQuery({
    queryKey: ['ethPrice'],
    queryFn: getEthPrice,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const gas = gasQuery.data || { slow: 0, standard: 0, fast: 0, baseFee: 0 };
  const ethPrice = ethPriceQuery.data || 0;

  // Estimate USD cost for a standard 21000 gas transfer
  const estimateUsd = (gwei) => {
    const gasLimit = 21000;
    const costEth = (gwei * gasLimit) / 1e9;
    return (costEth * ethPrice).toFixed(2);
  };

  return {
    slow: gas.slow,
    standard: gas.standard,
    fast: gas.fast,
    baseFee: gas.baseFee,
    slowUsd: estimateUsd(gas.slow),
    standardUsd: estimateUsd(gas.standard),
    fastUsd: estimateUsd(gas.fast),
    ethPrice,
    isLoading: gasQuery.isLoading,
    lastBlock: gas.lastBlock,
  };
}
