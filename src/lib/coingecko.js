const BASE_URL = 'https://api.coingecko.com/api/v3';

const cache = new Map();
const CACHE_TTL = 60_000; // 1 minute

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getTokenPrices(ids = ['ethereum', 'bitcoin', 'solana', 'arbitrum']) {
  const cacheKey = `prices:${ids.join(',')}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${BASE_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.warn('CoinGecko prices failed:', err);
    // Return fallback prices
    return {
      ethereum: { usd: 3820, usd_24h_change: 5.2 },
      bitcoin: { usd: 54500, usd_24h_change: 2.1 },
      solana: { usd: 180, usd_24h_change: -1.8 },
      arbitrum: { usd: 1.15, usd_24h_change: 0.9 },
    };
  }
}

export async function getMarketChart(id = 'ethereum', days = 7) {
  const cacheKey = `chart:${id}:${days}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.warn('CoinGecko chart failed:', err);
    // Return mock 7-day data
    const now = Date.now();
    const day = 86400000;
    return {
      prices: Array.from({ length: 7 }, (_, i) => [
        now - (6 - i) * day,
        3400 + Math.random() * 600,
      ]),
    };
  }
}

export async function searchTokens(query) {
  try {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.coins || []).slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      thumb: c.thumb,
      marketCapRank: c.market_cap_rank,
    }));
  } catch {
    return [];
  }
}
