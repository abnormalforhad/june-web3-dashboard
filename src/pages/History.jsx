import { useWallet } from '../hooks/useWallet';
import { useTransactions, formatTxValue, formatTxTime, getTxLabel } from '../hooks/useTransactions';

const txStyles = {
  send: { bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]', icon: '↑', amtColor: 'text-loss-red' },
  receive: { bg: 'bg-[#EAF3DE]', color: 'text-[#3B6D11]', icon: '↓', amtColor: 'text-gain-green' },
  contract: { bg: 'bg-[#EEEDFE]', color: 'text-[#534AB7]', icon: '⬡', amtColor: 'text-text-primary' },
};

export default function History() {
  const { address } = useWallet();
  const { transactions, isLoading } = useTransactions(address);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-medium text-text-primary">Transaction History</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Last {transactions.length} transactions</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_1fr_120px_100px_80px] gap-3 px-4 py-2.5 border-b border-border bg-surface-secondary text-[11px] font-medium text-text-tertiary">
          <div>Type</div>
          <div>Details</div>
          <div>Hash</div>
          <div>Value</div>
          <div>Time</div>
          <div>Status</div>
        </div>

        {/* Rows */}
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="h-8 skeleton rounded-lg" />
            </div>
          ))
        ) : (
          transactions.map((tx, i) => {
            const style = txStyles[tx.type] || txStyles.contract;
            return (
              <div
                key={tx.hash || i}
                className="grid grid-cols-[40px_1fr_1fr_120px_100px_80px] gap-3 px-4 py-2.5 border-b border-border-light hover:bg-surface-secondary/50 transition-colors items-center"
              >
                <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center text-[11px] ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>
                <div>
                  <div className="text-xs font-medium text-text-primary">{getTxLabel(tx)}</div>
                  <div className="text-[10px] text-text-tertiary truncate">{tx.to ? `To: ${tx.to.slice(0, 8)}…${tx.to.slice(-4)}` : ''}</div>
                </div>
                <div className="text-[11px] font-mono text-text-tertiary truncate">
                  {tx.hash?.slice(0, 10)}…{tx.hash?.slice(-6)}
                </div>
                <div className={`text-xs font-mono font-medium ${style.amtColor}`}>
                  {formatTxValue(tx.value, tx.type)}
                </div>
                <div className="text-[11px] text-text-tertiary">{formatTxTime(tx.timestamp)}</div>
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.isError ? 'bg-loss-red-bg text-loss-red' : 'bg-gain-green-bg text-gain-green'}`}>
                    {tx.isError ? 'Failed' : 'Success'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
