import React from 'react';
import { PaletteColors } from '../types/catalog';

interface PalettePreviewProps {
  colors: PaletteColors;
  labelPt: string;
  device?: 'desktop' | 'mobile' | 'tablet';
}

// Mini-mockup de interface pintado com a paleta escolhida, para o usuário ver
// o resultado antes de copiar o prompt.
export const PalettePreview: React.FC<PalettePreviewProps> = ({ colors, labelPt, device = 'desktop' }) => {
  const c = colors;
  const isMobile = device === 'mobile';

  const mockup = (
    <div
      className="transition-colors duration-300"
      style={{ backgroundColor: c.background, color: c.text }}
    >
      {/* Mini menu do topo */}
      <div
        className="flex items-center justify-between px-3 py-2 transition-colors duration-300"
        style={{ borderBottom: `1px solid ${c.neutral}` }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm transition-colors duration-300"
            style={{ backgroundColor: c.accent }}
          />
          <span className="text-[8px] font-black uppercase tracking-widest">Logo</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: c.neutral }}
            />
          ))}
          <span
            className="h-3.5 w-10 rounded-sm transition-colors duration-300"
            style={{ backgroundColor: c.accent }}
          />
        </div>
      </div>

      {/* Mini hero */}
      <div className="px-3 py-3 space-y-1.5">
        <div
          className="h-2.5 w-3/4 rounded-sm transition-colors duration-300"
          style={{ backgroundColor: c.text, opacity: 0.92 }}
        />
        <div
          className="h-2.5 w-1/2 rounded-sm transition-colors duration-300"
          style={{ backgroundColor: c.text, opacity: 0.92 }}
        />
        <div
          className="h-1.5 w-2/3 rounded-full transition-colors duration-300"
          style={{ backgroundColor: c.neutral }}
        />
        <div
          className="h-1.5 w-1/3 rounded-full transition-colors duration-300"
          style={{ backgroundColor: c.neutral }}
        />
        <div className="flex gap-1.5 pt-1">
          <span
            className="h-4 px-2 rounded-sm text-[7px] font-black flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: c.accent, color: c.background }}
          >
            CTA
          </span>
          <span
            className="h-4 px-2 rounded-sm border text-[7px] font-black flex items-center justify-center transition-colors duration-300"
            style={{ borderColor: c.neutral, color: c.text }}
          >
            Saiba mais
          </span>
        </div>
      </div>

      {/* Mini cartões */}
      <div className={`grid gap-1.5 px-3 pb-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border p-1.5 space-y-1 transition-colors duration-300"
            style={{ borderColor: c.neutral, borderRadius: 3 }}
          >
            <div
              className="h-5 w-full transition-colors duration-300"
              style={{ backgroundColor: c.neutral, opacity: 0.55 }}
            />
            <div
              className="h-1 w-4/5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: c.text, opacity: 0.85 }}
            />
            <div
              className="h-1 w-3/5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: c.neutral }}
            />
            <div
              className="h-2.5 w-8 rounded-sm transition-colors duration-300"
              style={{ backgroundColor: c.accent, opacity: 0.9 }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-3 border-2 border-[#3F3F46] overflow-hidden rounded-none bg-[#18181B]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181B] border-b-2 border-[#3F3F46]">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#DFE104]">
          // PRÉVIA DA PALETA
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
          {labelPt}
        </span>
      </div>
      {isMobile ? (
        <div className="p-3 flex justify-center bg-[#18181B]">
          <div
            className="w-[240px] border-2 overflow-hidden transition-colors duration-300"
            style={{ borderColor: c.neutral, borderRadius: 12 }}
          >
            {mockup}
          </div>
        </div>
      ) : (
        mockup
      )}
    </div>
  );
};
