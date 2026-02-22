
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, UtensilsCrossed, Info } from 'lucide-react';
import { getCuisineAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Howzit, my friend! I am Aunty Mzansi. Thinking about some lekker food today? Ask me for recommendations or about our culture!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getCuisineAdvice(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Oof, I got a bit of a brain freeze. Try asking again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-stone-900/20 backdrop-blur-[1px] z-50 md:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[450px] h-[100dvh] md:h-[650px] bg-white z-50 md:rounded-3xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-amber-500 p-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl leading-none">Aunty Mzansi</h3>
              <p className="text-white/80 text-xs mt-1 font-medium">South African Cuisine Expert</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat window */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth bg-stone-50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-stone-900 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 rounded-bl-none border border-stone-100'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest font-bold">
                {msg.role === 'user' ? 'You' : 'Aunty Mzansi'}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="bg-stone-200 w-16 h-8 rounded-full"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-stone-100 shrink-0">
          <div className="flex gap-3">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Bobotie or Bunny Chow..."
              className="flex-grow bg-stone-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all border-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-amber-500 text-white p-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 opacity-50">
            <Info className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Powered by Gemini</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
