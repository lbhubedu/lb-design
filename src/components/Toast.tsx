import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  subMessage?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, subMessage, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/60 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <Check className="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <span>{message}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        {subMessage && (
          <div className="text-xs text-slate-400 mt-0.5">{subMessage}</div>
        )}
      </div>
    </div>
  );
};
