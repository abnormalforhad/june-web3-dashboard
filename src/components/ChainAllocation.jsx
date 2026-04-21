import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CHAIN_COLORS = {
  Ethereum: '#185FA5',
  Solana: '#1D9E75',
  Arbitrum: '#7F77DD',
  Base: '#EF9F27',
};

const DEFAULT_DATA = [
  { name: 'Ethereum', value: 52, color: CHAIN_COLORS.Ethereum },
  { name: 'Solana', value: 28, color: CHAIN_COLORS.Solana },
  { name: 'Arbitrum', value: 12, color: CHAIN_COLORS.Arbitrum },
  { name: 'Base', value: 8, color: CHAIN_COLORS.Base },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="text-xs font-medium text-text-primary">{d.name}</div>
      <div className="text-[11px] text-text-tertiary font-mono">{d.value}%</div>
    </div>
  );
}

export default function ChainAllocation({ data = DEFAULT_DATA, showChart = true }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-text-primary">Chain Allocation</h3>
      </div>

      <div className={showChart ? 'flex items-center gap-6' : ''}>
        {showChart && (
          <div className="w-28 h-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex-1 space-y-0">
          {data.map(chain => (
            <div key={chain.name} className="flex items-center justify-between py-1.5 border-b border-border-light last:border-b-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: chain.color }} />
                <span className="text-xs text-text-primary">{chain.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 mx-3">
                <div className="flex-1 h-1 bg-surface-tertiary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${chain.value}%`, background: chain.color }} />
                </div>
              </div>
              <span className="text-[11px] text-text-secondary font-mono min-w-[30px] text-right">{chain.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
