import { useQuery } from '@tanstack/react-query';
import { getNFTsForOwner } from '../lib/alchemy';

export function useNFTs(address) {
  const query = useQuery({
    queryKey: ['nfts', address],
    queryFn: async () => {
      if (!address) return [];
      try {
        const nfts = await getNFTsForOwner(address);
        return nfts.length > 0 ? nfts : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 300_000,
    staleTime: 120_000,
  });

  return {
    nfts: query.data || [],
    isLoading: query.isLoading,
  };
}
