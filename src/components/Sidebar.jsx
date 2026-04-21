import { NavLink, useLocation } from 'react-router-dom';

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: 'dashboard' },
      { to: '/portfolio', label: 'Portfolio', icon: 'portfolio' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/swap', label: 'Swap', icon: 'swap', badge: 'New' },
      { to: '/nfts', label: 'NFTs', icon: 'nfts' },
      { to: '/portfolio#defi', label: 'DeFi', icon: 'defi' },
      { to: '/history', label: 'History', icon: 'history' },
    ],
  },
];

const icons = {
  dashboard: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor" />
      <rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor" />
      <rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity=".4" />
      <rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity=".4" />
    </svg>
  ),
  portfolio: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  swap: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4-3 4 3M4 10l4 3 4-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nfts: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  defi: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5.5V8l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  account: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[200px] min-h-screen bg-sidebar flex flex-col py-4 border-r border-white/[0.06]">
      {navSections.map((section) => (
        <div key={section.label} className="px-3 mb-3">
          <div className="text-[10px] font-medium text-white/30 tracking-[0.08em] uppercase px-2 mb-2">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '/');
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2.5 px-2.5 py-[8px] rounded-[7px] text-[13px] transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium'
                      : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                  }`}
                >
                  <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}>
                    {icons[item.icon]}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto text-[10px] px-[7px] py-[1px] rounded-[10px] bg-eth-blue-bg text-eth-blue font-medium">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto px-3">
        <div className="border-t border-white/[0.06] pt-3 mt-2 space-y-0.5">
          <button className="flex items-center gap-2.5 px-2.5 py-[8px] rounded-[7px] text-[13px] text-white/50 hover:bg-white/[0.04] hover:text-white/80 w-full transition-all duration-150">
            {icons.account}
            Account
          </button>
          <button className="flex items-center gap-2.5 px-2.5 py-[8px] rounded-[7px] text-[13px] text-white/50 hover:bg-white/[0.04] hover:text-white/80 w-full transition-all duration-150">
            {icons.settings}
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
}
