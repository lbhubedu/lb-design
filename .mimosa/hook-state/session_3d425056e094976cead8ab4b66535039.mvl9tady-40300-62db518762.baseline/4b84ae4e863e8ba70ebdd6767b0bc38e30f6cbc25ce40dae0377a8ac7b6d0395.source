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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#DFE104] text-[#000000] px-5 py-3.5 border-2 border-black rounded-none shadow-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-8 h-8 bg-black text-[#DFE104] flex items-center justify-center shrink-0 rounded-none">
        <Check className="w-5 h-5 stroke-[3]" />
      </div>
      <div>
        <div className="text-xs font-black uppercase tracking-wider font-heading flex items-center gap-1.5">
          <span>{message}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        {subMessage && (
          <div className="text-[11px] font-mono font-bold uppercase tracking-wide text-black/80 mt-0.5">
            {subMessage}
          </div>
        )}
      </div>
    </div>
  );
};
