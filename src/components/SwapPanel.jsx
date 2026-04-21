import { useState } from 'react';
import { useGas } from '../hooks/useGas';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#185FA5', bg: '#E6F1FB', price: 3820 },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', color: '#185FA5', bg: '#E6F1FB', price: 1 },
  { symbol: 'USDT', name: 'Tether', icon: '₮', color: '#1D9E75', bg: '#E1F5EE', price: 1 },
  { symbol: 'DAI', name: 'Dai', icon: '◈', color: '#633806', bg: '#FAEEDA', price: 1 },
  { symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿', color: '#633806', bg: '#FAEEDA', price: 54500 },
  { symbol: 'ARB', name: 'Arbitrum', icon: '◇', color: '#3C3489', bg: '#EEEDFE', price: 1.15 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', color: '#FF007A', bg: '#FFE6F1', price: 7.50 },
];

export default function SwapPanel() {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const { standard, standardUsd } = useGas();

  const outputAmount = amount && fromToken && toToken
    ? ((parseFloat(amount) * fromToken.price) / toToken.price).toFixed(6)
    : '';

  const rate = fromToken && toToken ? (fromToken.price / toToken.price).toFixed(6) : '';
  const priceImpact = amount ? (Math.random() * 0.3).toFixed(2) : '0.00';

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 w-full animate-fade-in">
      <h3 className="text-[15px] font-medium text-text-primary mb-4">Token Swap</h3>

      {/* From */}
      <div className="bg-surface-secondary rounded-xl p-3.5 mb-1">
        <div className="text-[11px] text-text-tertiary mb-2">You pay</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-xl font-mono font-medium text-text-primary outline-none"
          />
          <div className="relative">
            <button
              onClick={() => { setShowFromSelect(!showFromSelect); setShowToSelect(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-sm font-medium hover:bg-surface-tertiary transition-colors"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: fromToken.bg, color: fromToken.color }}>{fromToken.icon}</span>
              {fromToken.symbol}
              <span className="text-text-tertiary text-[10px]">▼</span>
            </button>
            {showFromSelect && (
              <TokenSelector tokens={TOKENS} selected={fromToken} onSelect={(t) => { setFromToken(t); setShowFromSelect(false); }} />
            )}
          </div>
        </div>
        {amount && <div className="text-[11px] text-text-tertiary mt-1">~${(parseFloat(amount || 0) * fromToken.price).toLocaleString()}</div>}
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button onClick={handleSwapTokens} className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-all hover:rotate-180 duration-300">
          ↕
        </button>
      </div>

      {/* To */}
      <div className="bg-surface-secondary rounded-xl p-3.5 mt-1 mb-4">
        <div className="text-[11px] text-text-tertiary mb-2">You receive</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 text-xl font-mono font-medium text-text-primary">{outputAmount || '0.0'}</div>
          <div className="relative">
            <button
              onClick={() => { setShowToSelect(!showToSelect); setShowFromSelect(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-sm font-medium hover:bg-surface-tertiary transition-colors"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: toToken.bg, color: toToken.color }}>{toToken.icon}</span>
              {toToken.symbol}
              <span className="text-text-tertiary text-[10px]">▼</span>
            </button>
            {showToSelect && (
              <TokenSelector tokens={TOKENS} selected={toToken} onSelect={(t) => { setToToken(t); setShowToSelect(false); }} />
            )}
          </div>
        </div>
        {outputAmount && <div className="text-[11px] text-text-tertiary mt-1">~${(parseFloat(outputAmount || 0) * toToken.price).toLocaleString()}</div>}
      </div>

      {/* Quote details */}
      {amount && (
        <div className="space-y-2 mb-4 text-[12px]">
          <div className="flex justify-between"><span className="text-text-tertiary">Rate</span><span className="font-mono">1 {fromToken.symbol} = {rate} {toToken.symbol}</span></div>
          <div className="flex justify-between"><span className="text-text-tertiary">Price Impact</span><span className="text-gain-green">{priceImpact}%</span></div>
          <div className="flex justify-between"><span className="text-text-tertiary">Est. Gas</span><span className="font-mono">{typeof standard === 'number' ? standard.toFixed(0) : standard} Gwei (~${standardUsd})</span></div>
        </div>
      )}

      {/* CTA */}
      <button
        disabled={!amount}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:bg-surface-tertiary disabled:text-text-tertiary bg-sidebar text-white hover:bg-[#1a1a2e] active:scale-[0.98]"
      >
        {amount ? 'Review Swap' : 'Enter an amount'}
      </button>
    </div>
  );
}

function TokenSelector({ tokens, selected, onSelect }) {
  return (
    <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg py-1 w-44 z-20 animate-fade-in">
      {tokens.map(t => (
        <button
          key={t.symbol}
          onClick={() => onSelect(t)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-secondary transition-colors ${t.symbol === selected.symbol ? 'bg-surface-secondary font-medium' : ''}`}
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: t.bg, color: t.color }}>{t.icon}</span>
          <span>{t.symbol}</span>
          <span className="text-text-tertiary text-[11px] ml-auto">{t.name}</span>
        </button>
      ))}
    </div>
  );
}
