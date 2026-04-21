import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '../hooks/useWallet';

export default function TopBar() {
  const { truncatedAddress, ensName, isConnected } = useWallet();

  return (
    <header className="h-[52px] bg-white flex items-center justify-between px-5 border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-[22px] h-[22px] bg-sidebar rounded-[6px] flex items-center justify-center">
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <circle cx="6" cy="6" r="4" stroke="#9FE1CB" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1.5" fill="#9FE1CB" />
          </svg>
        </div>
        <span className="text-sm font-medium text-text-primary">June Web3</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isConnected ? (
          <>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-gain-green animate-pulse-dot" />
              <span className="text-xs font-mono text-text-secondary">
                {ensName || truncatedAddress}
              </span>
            </div>
            <ConnectButton.Custom>
              {({ openAccountModal }) => (
                <button
                  onClick={openAccountModal}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CECBF6] to-[#9FE1CB] flex items-center justify-center text-[11px] font-medium text-[#3C3489] hover:scale-105 transition-transform"
                >
                  {truncatedAddress.slice(2, 4).toUpperCase()}
                </button>
              )}
            </ConnectButton.Custom>
          </>
        ) : (
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        )}
      </div>
    </header>
  );
}
