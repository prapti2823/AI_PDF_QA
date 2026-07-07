import { Bot } from 'lucide-react';

/* Typing indicator shown while AI is generating a response */
export const TypingIndicator = () => (
  <div className="flex gap-3 fade-in-up">
    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 shadow-sm">
      <Bot size={14} className="text-[#3795BD]" />
    </div>
    <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#3795BD]/50 block" />
        ))}
      </div>
    </div>
  </div>
);

/* Skeleton loader for initial loading states */
export const SkeletonLoader = () => (
  <div className="space-y-3 p-4">
    {[80, 60, 90].map((w, i) => (
      <div key={i} className={`skeleton h-4 rounded-lg`} style={{ width: `${w}%` }} />
    ))}
  </div>
);

/* Inline spinner */
export const Spinner = ({ size = 16 }) => (
  <span
    className="spin inline-block rounded-full border-2 border-white/30 border-t-white"
    style={{ width: size, height: size }}
  />
);

export default TypingIndicator;
