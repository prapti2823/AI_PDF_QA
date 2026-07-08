import { FileSearch, Zap, Shield } from 'lucide-react';

const features = [
  { icon: FileSearch, label: 'Smart Extraction' },
  { icon: Zap, label: 'Instant Answers' },
  { icon: Shield, label: 'Secure & Private' },
];

const Hero = () => (
  <section className="bg-gradient-to-br from-[#EEF7FF] via-white to-[#F8FAFC] border-b border-[#E5E7EB]">
    <div className="w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center gap-8">
      {/* Text */}
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-[#3795BD]/10 text-[#3795BD] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3795BD] animate-pulse" />
          Powered by AI
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mb-4">
          Chat with Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3795BD] to-[#2563eb]">
            PDF Documents
          </span>
        </h2>
        <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
          Upload any PDF and instantly ask questions. Get precise, AI-generated answers
          extracted directly from your document content.
        </p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E5E7EB]">
              <Icon size={15} className="text-[#3795BD]" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Illustration placeholder */}
      <div className="flex-shrink-0 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl bg-gradient-to-br from-[#3795BD]/10 to-[#2563eb]/10 border border-[#3795BD]/20 flex flex-col items-center justify-center gap-4 shadow-xl">
        <div className="relative">
          <div className="w-20 h-24 bg-white rounded-xl shadow-lg border border-[#E5E7EB] flex flex-col items-center justify-center gap-1.5 p-3">
            <div className="w-full h-1.5 bg-[#3795BD]/30 rounded" />
            <div className="w-4/5 h-1.5 bg-slate-200 rounded" />
            <div className="w-full h-1.5 bg-slate-200 rounded" />
            <div className="w-3/5 h-1.5 bg-slate-200 rounded" />
            <div className="w-full h-1.5 bg-slate-200 rounded" />
            <div className="w-4/5 h-1.5 bg-[#3795BD]/20 rounded" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#3795BD] to-[#2563eb] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 font-medium">PDF → Insights</p>
      </div>
    </div>
  </section>
);

export default Hero;
