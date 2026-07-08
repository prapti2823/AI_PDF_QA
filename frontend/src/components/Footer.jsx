import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-[#E5E7EB] bg-white mt-auto">
    <div className="w-full px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        Built using
        <span className="font-medium text-slate-500">React</span>,
        <span className="font-medium text-slate-500">FastAPI</span> and
        <span className="font-medium text-slate-500">AI</span>
        <Heart size={11} className="text-red-400 fill-red-400 ml-0.5" />
      </p>
      <p className="text-xs text-slate-300">© {new Date().getFullYear()} AI PDF Assistant</p>
    </div>
  </footer>
);

export default Footer;
