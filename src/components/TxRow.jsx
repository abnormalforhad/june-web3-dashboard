import { formatTxValue, formatTxTime, getTxLabel, getTxDisplayColor } from '../hooks/useTransactions';

const txStyles = {
  send: { bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]', icon: '↑' },
  receive: { bg: 'bg-[#EAF3DE]', color: 'text-[#3B6D11]', icon: '↓' },
  contract: { bg: 'bg-[#EEEDFE]', color: 'text-[#534AB7]', icon: '⬡' },
};

export default function TxRow({ tx }) {
  const style = txStyles[tx.type] || txStyles.contract;
  const label = getTxLabel(tx);
  const time = formatTxTime(tx.timestamp);
  const value = formatTxValue(tx.value, tx.type, tx);
  const amtColor = getTxDisplayColor(tx);

  return (
    <div className="flex items-center gap-2.5 group">
      {/* Type icon */}
      <div className={`w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[11px] shrink-0 ${style.bg} ${style.color}`}>
        {style.icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-text-primary">{label}</div>
        <div className="text-[10px] text-text-tertiary">{time}</div>
      </div>

      {/* Amount */}
      <div className={`text-xs font-mono font-medium ${amtColor}`}>
        {value}
      </div>

      {/* Status indicator */}
      {tx.isError && (
        <div className="w-1.5 h-1.5 rounded-full bg-loss-red shrink-0" title="Failed" />
      )}
    </div>
  );
}
