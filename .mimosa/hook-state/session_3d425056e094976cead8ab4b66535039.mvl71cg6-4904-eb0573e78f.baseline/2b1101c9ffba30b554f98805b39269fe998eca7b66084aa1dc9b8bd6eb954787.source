import React from 'react';
import Marquee from 'react-fast-marquee';

interface MarqueeBannerProps {
  variant?: 'dark' | 'acid';
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  promptsCount?: number;
  designSystemsCount?: number;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  variant = 'dark',
  speed = 80,
  direction = 'left',
  className = '',
  children,
  promptsCount,
  designSystemsCount,
}) => {
  const isAcid = variant === 'acid';

  return (
    <div
      className={`w-full overflow-hidden border-y-2 border-[#3F3F46] py-3 select-none ${
        isAcid ? 'bg-[#DFE104] text-[#000000]' : 'bg-[#09090B] text-[#FAFAFA]'
      } ${className}`}
    >
      <Marquee
        gradient={false}
        speed={speed}
        direction={direction}
        autoFill
        pauseOnHover={false}
      >
        {children || (
          <div className="flex items-center gap-8 px-4 text-sm sm:text-base md:text-lg font-bold tracking-tighter uppercase font-heading">
            <span className="flex items-center gap-2">
              <span className={isAcid ? 'text-black' : 'text-[#DFE104]'}>⚡</span>
              <span>{(promptsCount ?? 1317).toLocaleString('pt-BR')} PROMPTS DE UI DESBLOQUEADOS</span>
            </span>
            <span className={isAcid ? 'text-black/50' : 'text-[#3F3F46]'}>///</span>
            <span>{designSystemsCount ?? 148} SISTEMAS DESIGN.MD</span>
            <span className={isAcid ? 'text-black/50' : 'text-[#3F3F46]'}>///</span>
            <span>ARENA.AI • CODEX DESKTOP • ANTIGRAVITY • CHATGPT</span>
            <span className={isAcid ? 'text-black/50' : 'text-[#3F3F46]'}>///</span>
            <span className="flex items-center gap-2">
              <span className={isAcid ? 'text-black' : 'text-[#DFE104]'}>★</span>
              <span>REA // 100% EM PORTUGUÊS // ZERO PAYWALL</span>
            </span>
            <span className={isAcid ? 'text-black/50' : 'text-[#3F3F46]'}>///</span>
          </div>
        )}
      </Marquee>
    </div>
  );
};
