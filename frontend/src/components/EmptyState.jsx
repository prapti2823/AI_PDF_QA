import { FileQuestion, ArrowUp } from 'lucide-react';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
    {/* Illustration */}
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-gradient-to-br from-[#EEF7FF] to-[#dbeafe] rounded-3xl flex items-center justify-center shadow-inner">
        <FileQuestion size={36} className="text-[#3795BD]/60" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#3795BD]/10 rounded-full flex items-center justify-center">
        <ArrowUp size={12} className="text-[#3795BD]" />
      </div>
    </div>

    <h3 className="text-base font-semibold text-slate-700 mb-2">No PDF Uploaded Yet</h3>
    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
      Upload a PDF to start asking questions. Your AI assistant will analyze the document and answer your queries instantly.
    </p>

    {/* Decorative dots */}
    <div className="flex gap-1.5 mt-6">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#3795BD]/20" />
      ))}
    </div>
  </div>
);

export default EmptyState;
