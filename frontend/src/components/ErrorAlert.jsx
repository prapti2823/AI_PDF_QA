import { AlertTriangle, X, RefreshCw } from 'lucide-react';

const ErrorAlert = ({ message, onRetry, onDismiss }) => (
  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 fade-in-up">
    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <AlertTriangle size={15} className="text-red-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-red-700 mb-0.5">Something went wrong</p>
      <p className="text-xs text-red-500 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <RefreshCw size={12} />
          Try again
        </button>
      )}
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
        aria-label="Dismiss error"
      >
        <X size={15} />
      </button>
    )}
  </div>
);

export default ErrorAlert;
