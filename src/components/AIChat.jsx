import { useState, useRef, useEffect } from 'react';

export default function AIChat({ messages, onSend, isLoading }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="bg-white border border-border rounded-xl p-4 flex flex-col animate-fade-in h-full" style={{ minHeight: 300 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-text-primary">June AI Assistant</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-[10px] bg-gain-green-bg text-gain-green font-medium">
          Powered by June API
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2.5 rounded-lg text-[12px] leading-[1.6] max-w-[88%] ${
              msg.role === 'assistant'
                ? 'bg-surface-secondary text-text-primary'
                : 'bg-sidebar text-[#E6F1FB] ml-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-surface-secondary rounded-lg px-3 py-2.5 max-w-[88%]">
            <div className="flex gap-1.5 items-center h-4">
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — show only on initial state */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {['Analyze my portfolio', 'Best time to swap?', 'Gas strategy', 'Explain yield farming'].map(s => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="text-[10px] px-2.5 py-1 rounded-full border border-border text-text-tertiary hover:text-text-primary hover:border-text-secondary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-auto">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your portfolio, gas, DeFi, NFTs…"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface-secondary text-xs text-text-primary outline-none focus:border-text-tertiary transition-colors placeholder:text-text-tertiary"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-lg border border-border bg-white text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-30"
        >
          Ask ↗
        </button>
      </form>
    </div>
  );
}
