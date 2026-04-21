// Fallback to Alchemy's public 'demo' key if the user hasn't configured their own yet.
// Note: The 'demo' key is heavily rate-limited and should only be used for testing.
const rawKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const API_KEY = (!rawKey || rawKey === 'your_key') ? 'demo' : rawKey;

const BASE_URL = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;
const NFT_BASE = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}`;

async function alchemyFetch(method, params = []) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export async function getTokenBalances(address) {
  try {
    const result = await alchemyFetch('alchemy_getTokenBalances', [address, 'erc20']);
    return result.tokenBalances
      .filter(t => t.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000')
      .map(t => ({
        contractAddress: t.contractAddress,
        balance: t.tokenBalance,
      }));
  } catch (err) {
    console.warn('Alchemy getTokenBalances failed:', err);
    return [];
  }
}

export async function getTokenMetadata(contractAddress) {
  try {
    const result = await alchemyFetch('alchemy_getTokenMetadata', [contractAddress]);
    return {
      name: result.name,
      symbol: result.symbol,
      decimals: result.decimals,
      logo: result.logo,
    };
  } catch {
    return { name: 'Unknown', symbol: '???', decimals: 18, logo: null };
  }
}

export async function getNFTsForOwner(address) {
  try {
    const res = await fetch(
      `${NFT_BASE}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=20`
    );
    const data = await res.json();
    return (data.ownedNfts || []).map(nft => ({
      tokenId: nft.tokenId,
      name: nft.name || nft.raw?.metadata?.name || `#${nft.tokenId}`,
      collection: nft.contract?.name || nft.contract?.openSeaMetadata?.collectionName || 'Unknown',
      image: nft.image?.cachedUrl || nft.image?.originalUrl || nft.raw?.metadata?.image || null,
      contractAddress: nft.contract?.address,
      tokenType: nft.tokenType,
    }));
  } catch (err) {
    console.warn('Alchemy getNFTs failed:', err);
    return [];
  }
}

export async function getAssetTransfers(address) {
  try {
    const result = await alchemyFetch('alchemy_getAssetTransfers', [{
      fromAddress: address,
      category: ['external', 'erc20', 'erc721'],
      maxCount: '0x14',
      order: 'desc',
    }]);
    return result.transfers || [];
  } catch {
    return [];
  }
}
