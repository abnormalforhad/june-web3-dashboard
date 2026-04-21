export default function MetricCard({ label, value, sub, subType = 'neutral', icon }) {
  const subColors = {
    up: 'text-gain-green',
    down: 'text-loss-red',
    neutral: 'text-text-tertiary',
  };

  return (
    <div className="bg-white border border-border rounded-xl p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200 animate-fade-in">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-text-tertiary font-medium">{label}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <div className="text-[22px] font-medium text-text-primary font-mono leading-tight">{value}</div>
      {sub && (
        <div className={`text-[11px] mt-1.5 font-medium ${subColors[subType]}`}>
          {sub}
        </div>
      )}
    </div>
  );
}
