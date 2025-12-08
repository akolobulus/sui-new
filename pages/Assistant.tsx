import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToAssistant } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial State: Welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi there! I am your SuiCare Health Assistant. I can help you understand your insurance policy, check drug interactions, or guide you on how to file a claim. How can I help today?',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    // Optimistic Update
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Prepare History (Current state of messages before the new userMsg)
      const history = messages.map(m => ({ 
        role: m.role, 
        text: m.text 
      }));

      // 3. Call AI Service
      const responseText = await sendMessageToAssistant(userMsg.text, history);

      // 4. Add AI Response
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto p-4 md:p-6">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">SuiCare Assistant</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Powered by Gemini 1.5 Flash
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary/10 text-primary'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
               <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
              <Loader2 className="animate-spin text-slate-400" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-b-2xl border-t border-slate-100 shadow-sm">
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your health records or insurance..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-[50px] max-h-[100px] text-slate-800"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;