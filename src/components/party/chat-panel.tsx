import React, { useRef, useEffect } from 'react';
import { useChat } from '@livekit/components-react';
import { Send } from 'lucide-react';

export default function ChatPanel({ roomId }: { roomId: string }) {
  const { chatMessages, send } = useChat();
  const [input, setInput] = React.useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    send(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-shadow-sm">
        {chatMessages.length === 0 && (
          <div className="text-center text-neutral-500 text-sm mt-10">
            Say hi to the watch party! 👋
          </div>
        )}
        
        {chatMessages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className="font-bold text-indigo-400">{msg.from?.name || 'User'}: </span>
            <span className="text-white/90 break-words">{msg.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex items-center gap-2 bg-black/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/40"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
