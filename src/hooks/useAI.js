import { useState, useCallback } from 'react';
import { chatCompletion, buildSystemPrompt } from '../lib/june';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Hi! I can analyze your wallet, explain DeFi protocols, find gas savings, or help you research any token. What would you like to know?",
  }
];

export function useAI({ address, balance, gas, ensName } = {}) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt({ address, balance, gas, ensName });
      
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const response = await chatCompletion(apiMessages);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I'm having trouble connecting right now. ${err.message?.includes('401') ? 'Please check your June API key in the .env file.' : 'Please try again in a moment.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [address, balance, gas, ensName, messages, isLoading]);

  const clearHistory = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! How can I help you with your Web3 journey?",
      },
    ]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearHistory,
  };
}
