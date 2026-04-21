import { useQuery } from '@tanstack/react-query';
import { getTokenBalances, getTokenMetadata } from '../lib/alchemy';
import { getTokenPrices, getMarketChart } from '../lib/coingecko';

// Well-known token mappings (contract address → coingecko id)
const TOKEN_MAP = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { id: 'tether', symbol: 'USDT', name: 'Tether' },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin' },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { id: 'dai', symbol: 'DAI', name: 'Dai' },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  '0x514910771af9ca656af840dff83e8264ecf986ca': { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1': { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
};



// Aggregate hourly price data into daily values (one per day)
function aggregateToDaily(prices) {
  if (!prices || prices.length === 0) return [];

  const dayMap = new Map();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  for (const [timestamp, price] of prices) {
    const d = new Date(timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    // Keep the last price for each day
    dayMap.set(key, { timestamp, price, dayName: dayNames[d.getDay()] });
  }

  return [...dayMap.values()].map(entry => ({
    date: entry.dayName,
    value: Math.round(entry.price),
    timestamp: entry.timestamp,
  }));
}

export function usePortfolio(address) {
  const tokensQuery = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) return [];

      try {
        const [balances, prices] = await Promise.all([
          getTokenBalances(address),
          getTokenPrices(['ethereum', 'bitcoin', 'solana', 'arbitrum', 'uniswap', 'chainlink']),
        ]);

        const tokens = [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: '—',
            usd: 0,
            change24h: prices.ethereum?.usd_24h_change || 0,
            color: '#185FA5',
            bgColor: '#E6F1FB',
            icon: 'Ξ',
          },
        ];

        for (const bal of balances.slice(0, 8)) {
          const addr = bal.contractAddress.toLowerCase();
          const known = TOKEN_MAP[addr];
          
          if (known) {
            const rawBal = parseInt(bal.balance, 16);
            const metadata = await getTokenMetadata(bal.contractAddress);
            const decimals = metadata.decimals || 18;
            const parsedBal = rawBal / Math.pow(10, decimals);
            const price = prices[known.id]?.usd || 0;
            
            tokens.push({
              symbol: known.symbol,
              name: known.name,
              balance: parsedBal.toFixed(4),
              usd: parsedBal * price,
              change24h: prices[known.id]?.usd_24h_change || 0,
              color: '#185FA5',
              bgColor: '#E6F1FB',
              icon: known.symbol.charAt(0),
              logo: metadata.logo,
            });
          }
        }

        return tokens.length > 1 ? tokens : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 120_000,
    staleTime: 60_000,
  });

  const chartQuery = useQuery({
    queryKey: ['portfolioChart'],
    queryFn: () => getMarketChart('ethereum', 7),
    refetchInterval: 300_000,
    staleTime: 120_000,
  });

  const tokens = tokensQuery.data || [];
  const totalValue = tokens.reduce((sum, t) => sum + (t.usd || 0), 0);
  const totalChange = tokens.length > 0
    ? tokens.reduce((sum, t) => sum + (t.change24h || 0), 0) / tokens.length
    : 0;

  // Aggregate to daily data points (7 bars, not 168)
  const chartData = aggregateToDaily(chartQuery.data?.prices || []);

  return {
    tokens,
    totalValue,
    totalChange,
    chartData,
    isLoading: tokensQuery.isLoading,
    isChartLoading: chartQuery.isLoading,
  };
}
