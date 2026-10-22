import React, { useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Eye,
  Laptop,
  Smartphone,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PromptItem } from '../types/catalog';
import { fetchPromptDetail } from '../services/api';

interface PromptCardProps {
  item: PromptItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (item: PromptItem) => void;
  onCopySuccess: (title: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoadingCopy(true);
      const detail = await fetchPromptDetail(item.id);
      await navigator.clipboard.writeText(detail.prompt);
      setCopied(true);
      onCopySuccess(item.titlePt || item.title);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Falha ao copiar prompt:', err);
    } finally {
      setLoadingCopy(false);
    }
  };

  const isMobile = item.previewDevice === 'mobile';

  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative bg-[#09090B] border-2 border-[#3F3F46] hover:border-[#DFE104] hover:bg-[#DFE104] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer rounded-none"
    >
      <div>
        {/* Thumbnail area */}
        <div className="relative aspect-video bg-[#000000] border-b-2 border-[#3F3F46] overflow-hidden flex items-center justify-center">
          {item.thumbnailUrl && !imgError ? (
            item.thumbnailType === 'video' ? (
              <video
                src={item.thumbnailUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <img
                src={item.thumbnailUrl}
                alt={item.titlePt || item.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            )
          ) : (
            <div className="w-full h-full bg-[#18181B] flex flex-col items-center justify-center p-4 text-center">
              <span className="text-3xl font-black text-[#DFE104] font-heading uppercase mb-1">
                UI PROMPT
              </span>
              <span className="text-xs uppercase font-bold text-[#A1A1AA] line-clamp-1">
                {item.titlePt || item.title}
              </span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-none ${
                isMobile
                  ? 'bg-emerald-500 text-black'
                  : 'bg-black text-[#DFE104] border border-[#DFE104]'
              }`}
            >
              {isMobile ? (
                <>
                  <Smartphone className="w-3 h-3" />
                  MOBILE
                </>
              ) : (
                <>
                  <Laptop className="w-3 h-3" />
                  DESKTOP
                </>
              )}
            </span>

            {item.themeLabelPt && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white border border-[#3F3F46]">
                {item.themeLabelPt.split('(')[0].trim()}
              </span>
            )}
          </div>

          {/* Favorite heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`absolute top-2 right-2 p-1.5 border transition rounded-none cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-black/80 text-white border-[#3F3F46] hover:bg-black hover:border-[#DFE104]'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5">
          {/* Category subtitle */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#DFE104] group-hover:text-black mb-1.5 font-mono">
            <span>{item.categoryLabelPt}</span>
            {item.componentCount > 0 && (
              <span className="text-[#A1A1AA] group-hover:text-black/80 flex items-center gap-1 font-mono">
                <Layers className="w-3 h-3" />
                {item.componentCount} BLOCOS
              </span>
            )}
          </div>

          {/* Title - ALL UPPERCASE */}
          <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-[#FAFAFA] group-hover:text-black line-clamp-1 transition-colors">
            {item.titlePt || item.title}
          </h3>

          {/* Layman summary */}
          <p className="text-xs text-[#A1A1AA] group-hover:text-black/90 mt-2 line-clamp-2 leading-relaxed font-medium">
            {item.idealForPt || item.summaryPt || item.description}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t-2 border-[#3F3F46] group-hover:border-black flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-[#A1A1AA] group-hover:text-black/80 font-bold uppercase">
            ⚡ {item.stats?.uses ? `${item.stats.uses.toLocaleString('pt-BR')} USOS` : 'VERIFICADO'}
          </div>

          {/* Quick Copy Button */}
          <button
            onClick={handleQuickCopy}
            disabled={loadingCopy}
            className={`h-10 px-4 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider rounded-none transition-all cursor-pointer ${
              copied
                ? 'bg-black text-[#DFE104] border-2 border-black'
                : 'bg-[#27272A] group-hover:bg-black text-white group-hover:text-[#DFE104] border-2 border-[#3F3F46] group-hover:border-black'
            }`}
            title="Copiar prompt completo para a área de transferência"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>COPIADO!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPIAR PROMPT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
