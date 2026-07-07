import { useState } from 'react';
import { Send } from 'lucide-react';
import { Spinner } from './Loader';

const QuestionInput = ({ onAsk, isLoading, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || isLoading || disabled) return;
    onAsk(value.trim());
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-[#E5E7EB] bg-white">
      <div className={`flex items-end gap-2 bg-[#F8FAFC] border rounded-2xl px-4 py-3 transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'border-[#E5E7EB] focus-within:border-[#3795BD] focus-within:shadow-[0_0_0_3px_rgba(55,149,189,0.1)]'}`}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={disabled ? 'Upload a PDF to start asking questions…' : 'Ask a question about your PDF…'}
          rows={1}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 resize-none outline-none leading-relaxed max-h-32 disabled:cursor-not-allowed"
          style={{ minHeight: '24px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading || disabled}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3795BD] to-[#2563eb] flex items-center justify-center flex-shrink-0 transition-all duration-200
            hover:opacity-90 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          aria-label="Send message"
        >
          {isLoading ? <Spinner size={14} /> : <Send size={14} className="text-white" />}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-2">
        Press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send
      </p>
    </div>
  );
};

export default QuestionInput;
