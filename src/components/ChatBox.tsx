import  { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  tableId: string;
}

const ChatBox = ({ tableId }: ChatBoxProps) => {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage } = useGame();
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && user) {
      sendChatMessage(message);
      setMessage('');
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col max-w-[80%] ${msg.playerId === user?.id ? 'ml-auto' : ''}`}
            >
              <div className={`px-3 py-2 rounded-lg ${
                msg.playerId === user?.id 
                  ? 'bg-accent text-primary ml-auto' 
                  : 'bg-secondary'
              }`}>
                {msg.playerId !== user?.id && (
                  <div className="text-xs font-semibold mb-1">{msg.playerName}</div>
                )}
                <p>{msg.message}</p>
              </div>
              <span className={`text-xs text-gray-500 mt-1 ${
                msg.playerId === user?.id ? 'text-right' : ''
              }`}>
                {formatTime(msg.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSend} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-primary rounded-l-lg px-3 py-2 focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-accent text-primary px-4 py-2 rounded-r-lg"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
 