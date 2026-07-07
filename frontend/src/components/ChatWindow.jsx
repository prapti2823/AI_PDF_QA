import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { TypingIndicator } from './Loader';
import EmptyState from './EmptyState';
import QuestionInput from './QuestionInput';

const ChatWindow = ({ messages, isAsking, sessionId, onAsk }) => {
  const bottomRef = useRef(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const hasMessages = messages.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="w-7 h-7 rounded-lg bg-[#3795BD]/10 flex items-center justify-center">
          <MessageSquare size={14} className="text-[#3795BD]" />
        </div>
        <span className="text-sm font-semibold text-slate-700">Conversation</span>
        {hasMessages && (
          <span className="ml-auto text-xs text-slate-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {!sessionId ? (
          <EmptyState />
        ) : !hasMessages && !isAsking ? (
          /* PDF uploaded but no messages yet */
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 bg-[#EEF7FF] rounded-2xl flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-[#3795BD]" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">PDF ready!</p>
            <p className="text-xs text-slate-400">Ask your first question below.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isAsking && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <QuestionInput onAsk={onAsk} isLoading={isAsking} disabled={!sessionId} />
    </div>
  );
};

export default ChatWindow;
