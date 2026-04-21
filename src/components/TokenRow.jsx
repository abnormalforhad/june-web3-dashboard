export default function TokenRow({ symbol, name, balance, usd, change24h, color, bgColor, icon, logo }) {
  const isPositive = change24h >= 0;

  return (
    <div className="flex items-center gap-2.5 py-1 group">
      {/* Token icon */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
        style={{ background: bgColor || '#E6F1FB', color: color || '#185FA5' }}
      >
        {logo ? (
          <img src={logo} alt={symbol} className="w-5 h-5 rounded-full" />
        ) : (
          icon || symbol?.charAt(0)
        )}
      </div>

      {/* Name + amount */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text-primary truncate">{name}</div>
        <div className="text-[11px] text-text-tertiary font-mono">
          {balance} {symbol}
        </div>
      </div>

      {/* USD value + change */}
      <div className="text-right">
        <div className="text-[13px] font-medium text-text-primary font-mono">
          ${typeof usd === 'number' ? usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : usd}
        </div>
        <div className={`text-[11px] ${isPositive ? 'text-gain-green' : 'text-loss-red'}`}>
          {isPositive ? '+' : ''}{typeof change24h === 'number' ? change24h.toFixed(1) : change24h}%
        </div>
      </div>
    </div>
  );
}
