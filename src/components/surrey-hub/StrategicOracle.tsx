import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { generateChatResponse } from '../../lib/aiStub';
import { councils } from '../../data/surreyHubData';

export default function StrategicOracle() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([
    {
      type: 'ai',
      content: 'Welcome. I have analysed the full dataset for Surrey\'s Reorganisation. Ask me about specific risks, debt liabilities, or political friction points.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = councils.map(c => ({
        n: c.name,
        r: c.risk,
        a: c.asset,
        l: c.liability
      }));
      
      const response = await generateChatResponse(userMessage, context);
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[100] bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all hover:scale-110 active:scale-95 group"
        aria-label="Toggle Strategic Oracle chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-12 top-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask The Oracle
        </span>
      </button>

      <div
        className={`fixed bottom-20 right-5 z-[100] w-[380px] h-[500px] bg-slate-950/95 backdrop-blur-lg border border-slate-700 rounded-2xl flex flex-col shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-all'
            : 'translate-y-5 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-bold text-white">Strategic Oracle AI</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-sm chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.type === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-xl max-w-[85%] ${
                  msg.type === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-2">
              <div className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask strategic question..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
