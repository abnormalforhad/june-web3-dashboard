const JUNE_API_BASE = 'https://api.blockchain.info/ai/api/v1';
const API_KEY = import.meta.env.VITE_JUNE_API_KEY;

export async function chatCompletion(messages, { stream = false } = {}) {
  const response = await fetch(`${JUNE_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      messages,
      stream,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`June API error: ${response.status} ${response.statusText}`);
  }

  if (stream) {
    return response.body;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function buildSystemPrompt({ address, balance, gas, ensName }) {
  return `You are June, a friendly and knowledgeable Web3 assistant built into the June Web3 dashboard. 
The user's wallet is ${address || 'not connected'}. 
${ensName ? `Their ENS name is ${ensName}.` : ''}
Their ETH balance is ${balance || 'unknown'} ETH. 
Current gas is ${gas || 'unknown'} Gwei. 
Help them with DeFi strategies, token analysis, NFT insights, gas optimization, and wallet analysis. 
Keep responses concise and actionable. Use numbers and data when available.
Format responses with markdown for readability.`;
}
