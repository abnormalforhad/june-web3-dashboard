import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useWallet } from '../hooks/useWallet';
import { usePortfolio } from '../hooks/usePortfolio';
import { useGas } from '../hooks/useGas';
import { useTransactions } from '../hooks/useTransactions';
import { useAI } from '../hooks/useAI';
import MetricCard from '../components/MetricCard';
import TokenRow from '../components/TokenRow';
import TxRow from '../components/TxRow';
import AIChat from '../components/AIChat';
import ChainAllocation from '../components/ChainAllocation';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg text-center">
      <div className="text-[12px] font-medium font-mono text-text-primary">${payload[0].value?.toLocaleString()}</div>
      <div className="text-[10px] text-text-tertiary mt-0.5">{payload[0].payload.date}</div>
    </div>
  );
}

export default function Dashboard() {
  const { address, balance, isConnected } = useWallet();
  const { tokens, totalValue, totalChange, chartData, isLoading } = usePortfolio(address);
  const { standard, isLoading: gasLoading } = useGas();
  const { transactions } = useTransactions(address);
  const { messages, sendMessage, isLoading: aiLoading } = useAI({
    address,
    balance,
    gas: typeof standard === 'number' ? standard.toFixed(1) : standard,
  });

  const pnl = totalValue * (totalChange / 100);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-2.5">
        <MetricCard
          label="Net Worth"
          value={`$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          sub={`${totalChange >= 0 ? '▲' : '▼'} ${Math.abs(totalChange).toFixed(1)}% today`}
          subType={totalChange >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          label="24h P&L"
          value={`${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          sub={tokens[0] ? `Best: ${tokens[0].symbol} ${tokens[0].change24h >= 0 ? '+' : ''}${tokens[0].change24h?.toFixed(1)}%` : ''}
          subType={pnl >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          label="Gas (Gwei)"
          value={gasLoading ? '...' : typeof standard === 'number' ? standard.toFixed(1) : standard}
          sub={standard < 20 ? '▼ Low right now' : standard < 40 ? '— Normal' : '▲ High'}
          subType={standard < 20 ? 'down' : standard < 40 ? 'neutral' : 'up'}
        />
        <MetricCard
          label="Active Chains"
          value="4"
          sub="ETH · ARB · SOL · BASE"
          subType="neutral"
        />
      </div>

      {/* Portfolio chart + Token list */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-text-primary">Portfolio (7d)</span>
            <a href="/portfolio" className="text-[11px] text-text-tertiary hover:text-text-primary transition-colors">View all →</a>
          </div>
          <div className="h-[110px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#9b9ba5' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={['dataMin - 200', 'dataMax + 200']} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 4 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === chartData.length - 1 ? '#185FA5' : '#e8e8ec'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-tertiary text-xs">Loading chart...</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-text-primary">Token Holdings</span>
            <a href="/portfolio" className="text-[11px] text-text-tertiary hover:text-text-primary transition-colors">Manage →</a>
          </div>
          <div className="space-y-1.5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)
              : tokens.slice(0, 4).map(t => <TokenRow key={t.symbol} {...t} />)
            }
          </div>
        </div>
      </div>

      {/* Transactions + AI Chat */}
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-text-primary">Recent Txns</span>
            <a href="/history" className="text-[11px] text-text-tertiary hover:text-text-primary transition-colors">All →</a>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 4).map((tx, i) => <TxRow key={tx.hash || i} tx={tx} />)}
          </div>
        </div>

        <AIChat messages={messages} onSend={sendMessage} isLoading={aiLoading} />
      </div>

      {/* Chain allocation */}
      <ChainAllocation />
    </div>
  );
}
