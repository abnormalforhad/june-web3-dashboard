import { useWallet } from '../hooks/useWallet';
import { useNFTs } from '../hooks/useNFTs';
import NFTGrid from '../components/NFTGrid';

export default function NFTs() {
  const { address } = useWallet();
  const { nfts, isLoading } = useNFTs(address);

  const collections = [...new Set(nfts.map(n => n.collection))];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-text-primary">NFT Gallery</h1>
          <p className="text-xs text-text-tertiary mt-0.5">{nfts.length} NFTs across {collections.length} collections</p>
        </div>
      </div>

      {/* Collection pills */}
      <div className="flex gap-2 flex-wrap">
        <button className="px-3 py-1 rounded-full text-xs bg-sidebar text-white">
          All ({nfts.length})
        </button>
        {collections.slice(0, 6).map(c => (
          <button key={c} className="px-3 py-1 rounded-full text-xs border border-border text-text-secondary hover:bg-surface-secondary transition-colors">
            {c}
          </button>
        ))}
      </div>

      <NFTGrid nfts={nfts} isLoading={isLoading} />
    </div>
  );
}
