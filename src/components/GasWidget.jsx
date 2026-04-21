import { useGas } from '../hooks/useGas';

export default function GasWidget({ compact = false }) {
  const { slow, standard, fast, slowUsd, standardUsd, fastUsd, baseFee, isLoading } = useGas();

  if (isLoading) {
    return (
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="h-4 skeleton w-24 mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-16 skeleton rounded-lg" />)}
        </div>
      </div>
    );
  }

  const tiers = [
    { label: 'Slow', emoji: '🐢', gwei: slow, usd: slowUsd, color: 'text-gain-green', bg: 'bg-gain-green-bg' },
    { label: 'Standard', emoji: '🚶', gwei: standard, usd: standardUsd, color: 'text-eth-blue', bg: 'bg-eth-blue-bg' },
    { label: 'Fast', emoji: '⚡', gwei: fast, usd: fastUsd, color: 'text-btc-amber', bg: 'bg-btc-amber-bg' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {tiers.map(t => (
          <div key={t.label} className="flex items-center gap-1.5">
            <span className="text-xs">{t.emoji}</span>
            <span className="text-xs font-mono font-medium">{typeof t.gwei === 'number' ? t.gwei.toFixed(1) : t.gwei}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-text-primary">⛽ Gas Tracker</h3>
        <span className="text-[10px] text-text-tertiary font-mono">Base: {typeof baseFee === 'number' ? baseFee.toFixed(1) : baseFee} Gwei</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiers.map(t => (
          <div key={t.label} className={`${t.bg} rounded-lg p-3 text-center hover:scale-[1.02] transition-transform`}>
            <div className="text-sm mb-1">{t.emoji}</div>
            <div className="text-[10px] text-text-tertiary mb-0.5">{t.label}</div>
            <div className={`text-lg font-mono font-medium ${t.color}`}>{typeof t.gwei === 'number' ? t.gwei.toFixed(0) : t.gwei}</div>
            <div className="text-[10px] text-text-tertiary mt-0.5">~${t.usd}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
