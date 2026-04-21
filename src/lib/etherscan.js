const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const BASE_URL = 'https://api.etherscan.io/api';

async function etherscanFetch(params) {
  const url = new URL(BASE_URL);
  Object.entries({ ...params, apikey: API_KEY }).forEach(([k, v]) => url.searchParams.set(k, v));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Etherscan ${res.status}`);
  const data = await res.json();
  
  if (data.status === '0' && data.message !== 'No transactions found') {
    console.warn('Etherscan warning:', data.message);
  }
  return data.result;
}

export async function getGasOracle() {
  try {
    const result = await etherscanFetch({
      module: 'gastracker',
      action: 'gasoracle',
    });
    
    if (typeof result === 'string') {
      // API returned error string, use fallback
      return getFallbackGas();
    }
    
    return {
      slow: parseFloat(result.SafeGasPrice) || 15,
      standard: parseFloat(result.ProposeGasPrice) || 20,
      fast: parseFloat(result.FastGasPrice) || 28,
      baseFee: parseFloat(result.suggestBaseFee) || 14,
      lastBlock: result.LastBlock,
    };
  } catch (err) {
    console.warn('Etherscan gas oracle failed:', err);
    return getFallbackGas();
  }
}

function getFallbackGas() {
  return {
    slow: 12 + Math.random() * 5,
    standard: 18 + Math.random() * 5,
    fast: 25 + Math.random() * 8,
    baseFee: 14 + Math.random() * 3,
    lastBlock: '—',
  };
}

export async function getTransactions(address, page = 1, offset = 20) {
  try {
    const result = await etherscanFetch({
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page,
      offset,
      sort: 'desc',
    });

    if (!Array.isArray(result)) return [];

    return result.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gasUsed,
      gasPrice: tx.gasPrice,
      timestamp: parseInt(tx.timeStamp) * 1000,
      blockNumber: tx.blockNumber,
      isError: tx.isError === '1',
      type: tx.from?.toLowerCase() === address?.toLowerCase()
        ? 'send'
        : tx.to?.toLowerCase() === address?.toLowerCase()
          ? 'receive'
          : 'contract',
      functionName: tx.functionName || '',
      confirmations: tx.confirmations,
    }));
  } catch (err) {
    console.warn('Etherscan transactions failed:', err);
    return [];
  }
}

export async function getEthPrice() {
  try {
    const result = await etherscanFetch({
      module: 'stats',
      action: 'ethprice',
    });
    return parseFloat(result.ethusd) || 3820;
  } catch {
    return 3820;
  }
}
