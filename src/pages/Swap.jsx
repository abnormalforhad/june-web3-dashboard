import SwapPanel from '../components/SwapPanel';
import GasWidget from '../components/GasWidget';

export default function Swap() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-medium text-text-primary">Token Swap</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Swap tokens at the best rates</p>
      </div>

      <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 items-start">
        <SwapPanel />
        <div className="space-y-3">
          <GasWidget />
          <div className="bg-white border border-border rounded-xl p-4">
            <h3 className="text-[13px] font-medium text-text-primary mb-3">Swap Tips</h3>
            <ul className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
              <li className="flex gap-2.5 items-start">
                <span className="text-sm mt-[-1px]">💡</span>
                <span>Gas is lowest between <span className="font-medium text-text-primary">2–5 AM UTC</span></span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-sm mt-[-1px]">💡</span>
                <span>Split large swaps to reduce price impact</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-sm mt-[-1px]">💡</span>
                <span>Check slippage tolerance before confirming</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-sm mt-[-1px]">💡</span>
                <span>Use limit orders for better rates on volatile pairs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
