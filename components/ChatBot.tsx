
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
      <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[450px] h-[92dvh] md:h-[650px] bg-black z-50 rounded-t-[32px] md:rounded-[32px] shadow-2xl shadow-lime/5 border border-white/10 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out] transition-all duration-500">
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />
        
        {/* Header */}
        <div className="bg-lime p-6 flex items-center justify-between text-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-lime" />
            </div>
            <div>
              <h3 className="font-bold text-xl leading-none uppercase tracking-tighter">Aunty Mzansi</h3>
              <p className="text-black/60 text-[10px] mt-1 font-bold uppercase tracking-widest">Cuisine Expert</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat window */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth bg-black">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] px-5 py-4 rounded-[24px] text-xs font-bold leading-relaxed border ${
                msg.role === 'user' 
                  ? 'bg-lime text-black border-lime' 
                  : 'bg-white/5 text-white border-white/10'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-white/20 mt-2 uppercase tracking-widest font-bold">
                {msg.role === 'user' ? 'You' : 'Aunty Mzansi'}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="bg-white/5 w-16 h-8 rounded-xl border border-white/10"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-black border-t border-white/5 shrink-0">
          <div className="flex gap-3">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ASK SOMETHING..."
              className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-lime transition-all text-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-lime text-black p-4 rounded-full hover:bg-lime/90 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 opacity-20 text-white">
            <Info className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Powered by Gemini</span>
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
