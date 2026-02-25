import { X, AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ message, onDismiss, type = 'error' }: ErrorMessageProps) {
  const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' 
    : type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700'
    : 'bg-blue-50 border-blue-200 text-blue-700';

  return (
    <div className={`${bgColor} border rounded-lg px-4 py-3 flex items-start gap-3`} role="alert">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-current hover:opacity-70 transition-opacity"
          aria-label="Dismiss error message"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
