import { Bot, User } from 'lucide-react';

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
        ${isUser
          ? 'bg-gradient-to-br from-[#3795BD] to-[#2563eb]'
          : 'bg-white border border-[#E5E7EB]'}`}
      >
        {isUser
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-[#3795BD]" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] sm:max-w-[65%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser
            ? 'bg-gradient-to-br from-[#3795BD] to-[#2563eb] text-white rounded-tr-sm'
            : 'bg-white border border-[#E5E7EB] text-slate-700 rounded-tl-sm'}`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
