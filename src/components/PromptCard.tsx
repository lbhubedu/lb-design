import React, { useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Eye,
  Laptop,
  Smartphone,
  Sparkles,
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
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
        {item.thumbnailUrl ? (
          item.thumbnailType === 'video' ? (
            <video
              src={item.thumbnailUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img
              src={item.thumbnailUrl}
              alt={item.titlePt || item.title}
              loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-8 h-8 text-blue-400 mb-2 opacity-60" />
            <span className="text-xs font-semibold text-slate-300">
              {item.titlePt || item.title}
            </span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          <span className="text-white text-xs font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Clique para Testar & Personalizar
          </span>
          {item.previewUrl && (
            <span className="p-1 rounded-md bg-white/20 text-white backdrop-blur-sm">
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isMobile
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-950/80 text-slate-200 border border-slate-700/50'
            }`}
          >
            {isMobile ? (
              <>
                <Smartphone className="w-3 h-3" />
                Mobile
              </>
            ) : (
              <>
                <Laptop className="w-3 h-3" />
                Desktop
              </>
            )}
          </span>

          {item.themeLabelPt && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
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
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-xl backdrop-blur-md transition ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category subtitle */}
          <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold mb-1">
            <span>{item.categoryLabelPt}</span>
            {item.componentCount > 0 && (
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {item.componentCount} blocos
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.titlePt || item.title}
          </h3>

          {/* Layman summary */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.idealForPt || item.summaryPt || item.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {item.stats?.uses ? (
              <span>⚡ {item.stats.uses.toLocaleString('pt-BR')} usos</span>
            ) : (
              <span>⚡ Modelo verificado</span>
            )}
          </div>

          {/* Quick Copy Button */}
          <button
            onClick={handleQuickCopy}
            disabled={loadingCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
            }`}
            title="Copiar prompt completo para a área de transferência"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
