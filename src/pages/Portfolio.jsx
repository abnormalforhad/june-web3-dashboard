import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useWallet } from '../hooks/useWallet';
import { usePortfolio } from '../hooks/usePortfolio';
import TokenRow from '../components/TokenRow';
import ChainAllocation from '../components/ChainAllocation';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="text-xs font-medium font-mono">${payload[0].value?.toLocaleString()}</div>
      <div className="text-[10px] text-text-tertiary">{payload[0].payload.date}</div>
    </div>
  );
}

export default function Portfolio() {
  const { address } = useWallet();
  const { tokens, totalValue, totalChange, chartData, isLoading } = usePortfolio(address);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-text-primary">Portfolio</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Track your holdings across chains</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-medium text-text-primary">
            ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-sm ${totalChange >= 0 ? 'text-gain-green' : 'text-loss-red'}`}>
            {totalChange >= 0 ? '▲' : '▼'} {Math.abs(totalChange).toFixed(1)}% (24h)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="text-[13px] font-medium text-text-primary mb-4">Portfolio Value (7 Day)</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9b9ba5' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin - 200', 'dataMax + 200']} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#185FA5" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* All tokens */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-[13px] font-medium text-text-primary mb-3">All Holdings</h3>
          <div className="space-y-1.5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)
              : tokens.map(t => <TokenRow key={t.symbol} {...t} />)
            }
          </div>
        </div>

        {/* Chain breakdown */}
        <ChainAllocation showChart={true} />
      </div>
    </div>
  );
}
