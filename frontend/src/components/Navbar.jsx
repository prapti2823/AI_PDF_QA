import { FileText, Sparkles } from 'lucide-react';

const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm">
    <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3795BD] to-[#2563eb] flex items-center justify-center shadow-md">
          <FileText size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 leading-tight">AI PDF Assistant</h1>
          <p className="text-xs text-slate-400 leading-tight">Ask Questions from Your PDF</p>
        </div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-1.5 bg-[#EEF7FF] text-[#3795BD] text-xs font-medium px-3 py-1.5 rounded-full border border-[#3795BD]/20">
        <Sparkles size={12} />
        <span>AI Powered</span>
      </div>
    </div>
  </nav>
);

export default Navbar;
