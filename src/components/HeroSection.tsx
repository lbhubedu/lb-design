import React from 'react';
import { ArrowDown, Sparkles, Wand2, Terminal } from 'lucide-react';

interface HeroSectionProps {
  totalPrompts: number;
  totalDesignSystems: number;
  onExploreClick: () => void;
  onOpenHowTo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalPrompts,
  totalDesignSystems,
  onExploreClick,
  onOpenHowTo,
}) => {
  return (
    <section className="relative w-full border-b-2 border-[#3F3F46] bg-[#09090B] pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Decorative massive background outline watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5vw] top-1/2 -translate-y-1/2 select-none text-[22vw] font-black tracking-tighter text-[#27272A]/20 leading-none font-heading whitespace-nowrap"
      >
        PROMPTS
      </div>

      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Tagline Pill */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DFE104] text-[#000000] text-xs font-bold uppercase tracking-widest rounded-none">
            <span className="w-2 h-2 bg-black animate-ping" />
            BIBLIOTECA PESSOAL DESBLOQUEADA
          </span>
          <span className="text-xs uppercase tracking-widest text-[#A1A1AA] font-mono hidden sm:inline-block">
            // VERSÃO BRASIL 2026
          </span>
        </div>

        {/* Massive Viewport Headline */}
        <div className="mb-8">
          <h1 className="text-[clamp(2.8rem,9.5vw,10.5rem)] font-extrabold uppercase leading-[0.82] tracking-tighter text-[#FAFAFA] font-heading">
            SUPERDESIGN
            <br />
            <span className="text-[#DFE104]">BRASIL.</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#A1A1AA] font-medium tracking-tight max-w-4xl uppercase font-heading">
            BIBLIOTECA ESPECIALIZADA EM APPS, CRMS, DASHBOARDS E FERRAMENTAS DE IA.
            CONSTRUA TELAS PROFISSIONAIS NO{' '}
            <span className="text-[#FAFAFA] underline decoration-[#DFE104] decoration-2">
              ARENA.AI
            </span>
            ,{' '}
            <span className="text-[#FAFAFA] underline decoration-[#DFE104] decoration-2">
              CODEX DESKTOP
            </span>
            ,{' '}
            <span className="text-[#FAFAFA] underline decoration-[#DFE104] decoration-2">
              ANTIGRAVITY
            </span>{' '}
            E{' '}
            <span className="text-[#FAFAFA] underline decoration-[#DFE104] decoration-2">
              CHATGPT
            </span>
            .
          </p>
        </div>

        {/* CTA Buttons & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-4">
          {/* Buttons */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExploreClick}
              className="h-14 px-8 bg-[#DFE104] text-[#000000] font-bold text-sm uppercase tracking-tighter rounded-none hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-none"
            >
              <span>EXPLORAR OS PROMPTS</span>
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenHowTo}
              className="h-14 px-8 border-2 border-[#3F3F46] bg-transparent text-[#FAFAFA] font-bold text-sm uppercase tracking-tighter rounded-none hover:bg-[#FAFAFA] hover:text-[#000000] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>COMO USAR (GUIA LEIGO)</span>
            </button>
          </div>

          {/* Connected hairline stats grid */}
          <div className="lg:col-span-7 grid grid-cols-3 bg-[#3F3F46] gap-px border-2 border-[#3F3F46]">
            <div className="bg-[#09090B] p-5 hover:bg-[#27272A] transition-colors">
              <div className="text-3xl sm:text-5xl font-black text-[#DFE104] tracking-tighter font-heading">
                {totalPrompts}
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[#A1A1AA] font-bold mt-1">
                PROMPTS DE UI
              </div>
            </div>

            <div className="bg-[#09090B] p-5 hover:bg-[#27272A] transition-colors">
              <div className="text-3xl sm:text-5xl font-black text-[#FAFAFA] tracking-tighter font-heading">
                {totalDesignSystems}
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[#A1A1AA] font-bold mt-1">
                DESIGN SYSTEMS
              </div>
            </div>

            <div className="bg-[#09090B] p-5 hover:bg-[#27272A] transition-colors">
              <div className="text-3xl sm:text-5xl font-black text-[#DFE104] tracking-tighter font-heading">
                0%
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[#A1A1AA] font-bold mt-1">
                PAYWALL / LIMITES
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
