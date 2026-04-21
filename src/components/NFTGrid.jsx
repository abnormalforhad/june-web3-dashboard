const PLACEHOLDER_COLORS = [
  'from-[#7F77DD] to-[#CECBF6]',
  'from-[#185FA5] to-[#9FE1CB]',
  'from-[#EF9F27] to-[#FAEEDA]',
  'from-[#1D9E75] to-[#E1F5EE]',
  'from-[#D85A30] to-[#FDEEE8]',
  'from-[#3C3489] to-[#EEEDFE]',
];

function NFTCard({ nft, index }) {
  const gradient = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <div className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center ${nft.image ? 'hidden' : 'flex'}`}
        >
          <span className="text-white/80 text-2xl">⬡</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <div className="text-[11px] text-text-tertiary truncate">{nft.collection}</div>
        <div className="text-[13px] font-medium text-text-primary truncate mt-0.5">{nft.name}</div>
        <div className="text-[10px] text-text-tertiary font-mono mt-1">#{nft.tokenId}</div>
      </div>
    </div>
  );
}

export default function NFTGrid({ nfts = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-2.5 space-y-1.5">
              <div className="h-3 skeleton w-16" />
              <div className="h-4 skeleton w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <span className="text-3xl mb-3 block">🖼️</span>
        <p className="text-sm">No NFTs found</p>
        <p className="text-xs mt-1">Connect your wallet to see your collection</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {nfts.map((nft, i) => (
        <NFTCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} index={i} />
      ))}
    </div>
  );
}
