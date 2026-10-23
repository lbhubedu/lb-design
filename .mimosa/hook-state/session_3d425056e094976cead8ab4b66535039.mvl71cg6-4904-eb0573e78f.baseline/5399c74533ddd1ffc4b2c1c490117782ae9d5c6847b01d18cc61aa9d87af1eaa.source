import React, { useState } from 'react';
import {
  Palette,
  Search,
  Copy,
  Check,
  Download,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { DesignSystemItem } from '../types/catalog';

interface DesignSystemsViewProps {
  items: DesignSystemItem[];
  onCopySuccess: (title: string, sub?: string) => void;
}

export const DesignSystemsView: React.FC<DesignSystemsViewProps> = ({ items, onCopySuccess }) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedColorHex, setCopiedColorHex] = useState<string | null>(null);

  const filtered = items.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(search.toLowerCase()) ||
      (ds.namePt && ds.namePt.toLowerCase().includes(search.toLowerCase())) ||
      (ds.description && ds.description.toLowerCase().includes(search.toLowerCase()));

    const matchesMode =
      filterMode === 'all'
        ? true
        : filterMode === 'dark'
        ? ds.mode === 'dark'
        : ds.mode === 'light';

    return matchesSearch && matchesMode;
  });

  const generateDesignMdContent = (ds: DesignSystemItem): string => {
    let md = `# Design System: ${ds.namePt || ds.name}\n\n`;
    if (ds.description) md += `> ${ds.description}\n\n`;
    md += `## Theme Mode\n- **Mode**: ${ds.modeLabelPt || ds.mode}\n\n`;

    md += `## Color Palette Tokens\n`;
    md += `\`\`\`css\n:root {\n`;
    Object.entries(ds.colors || {}).forEach(([key, val]) => {
      md += `  --color-${key}: ${val};\n`;
    });
    md += `}\n\`\`\`\n\n`;

    if (ds.typography) {
      md += `## Typography\n`;
      if (ds.typography.fontFamilySans) md += `- **Sans**: \`${ds.typography.fontFamilySans}\`\n`;
      if (ds.typography.fontFamilySerif)
        md += `- **Serif**: \`${ds.typography.fontFamilySerif}\`\n`;
      if (ds.typography.fontFamilyMono) md += `- **Mono**: \`${ds.typography.fontFamilyMono}\`\n`;
      md += `\n`;
    }

    if (ds.rounded) md += `## Border Radius\n- \`${ds.rounded}\`\n\n`;
    if (ds.spacing) md += `## Spacing\n- \`${ds.spacing}\`\n\n`;

    md += `## Usage Directives\n`;
    md += `- Apply these color tokens consistently across all backgrounds, surfaces, text, borders, and interactive states.\n`;
    md += `- Maintain the specified contrast ratios for maximum readability and visual polish.\n`;

    return md;
  };

  const handleCopyDesignMd = async (ds: DesignSystemItem) => {
    const md = generateDesignMdContent(ds);
    await navigator.clipboard.writeText(md);
    setCopiedId(ds.id);
    onCopySuccess(`DESIGN SYSTEM "${(ds.namePt || ds.name).toUpperCase()}" COPIADO!`, 'ARQUIVO DESIGN.MD');
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleDownloadMd = (ds: DesignSystemItem) => {
    const md = generateDesignMdContent(ds);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ds.slug || 'design'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onCopySuccess(`DOWNLOAD INICIADO!`, `${ds.slug}.md`);
  };

  const handleCopyHex = async (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(hex);
    setCopiedColorHex(hex);
    onCopySuccess(`HEX ${hex} COPIADO!`);
    setTimeout(() => setCopiedColorHex(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Brutalist Header Banner */}
      <div className="bg-[#09090B] border-2 border-[#3F3F46] p-8 sm:p-12 relative overflow-hidden rounded-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-2vw] top-1/2 -translate-y-1/2 text-[14vw] font-black text-[#27272A]/20 leading-none font-heading uppercase select-none"
        >
          TOKENS
        </div>

        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#DFE104] text-black mb-4 rounded-none">
            <Palette className="w-3.5 h-3.5" />
            147 SISTEMAS DESIGN.MD // TOKENS & CORES
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[#FAFAFA] font-heading leading-tight">
            SISTEMAS DE DESIGN & PALETAS DE CORES
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] mt-3 uppercase tracking-wider font-medium max-w-2xl leading-relaxed">
            CORES HEXADECIMAIS VERIFICADAS, COMBINAÇÕES DE FONTES E REGRAS VISUAIS PRONTAS PARA COPIAR OU BAIXAR EM FORMATO <span className="text-[#DFE104] font-mono">DESIGN.MD</span>.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-[#09090B] border-2 border-[#3F3F46] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-none">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="BUSCAR POR NOME OU COR..."
            className="w-full pl-10 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#27272A] border-2 border-[#3F3F46] text-[#FAFAFA] placeholder:text-[#A1A1AA] focus:border-[#DFE104] focus:outline-none rounded-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mode filter */}
        <div className="flex items-center bg-[#27272A] p-0.5 border-2 border-[#3F3F46] text-xs font-bold uppercase tracking-wider w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#DFE104] text-black font-black'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            TODOS ({items.length})
          </button>
          <button
            onClick={() => setFilterMode('dark')}
            className={`flex items-center gap-1.5 px-4 py-2 transition cursor-pointer ${
              filterMode === 'dark'
                ? 'bg-[#DFE104] text-black font-black'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>ESCURO</span>
          </button>
          <button
            onClick={() => setFilterMode('light')}
            className={`flex items-center gap-1.5 px-4 py-2 transition cursor-pointer ${
              filterMode === 'light'
                ? 'bg-[#DFE104] text-black font-black'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>CLARO</span>
          </button>
        </div>
      </div>

      {/* Grid of design systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ds) => {
          const isCopied = copiedId === ds.id;
          const colorEntries = Object.entries(ds.colors || {}).slice(0, 7);

          return (
            <div
              key={ds.id}
              className="group bg-[#09090B] border-2 border-[#3F3F46] hover:border-[#DFE104] p-6 transition-all flex flex-col justify-between rounded-none"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      ds.mode === 'dark'
                        ? 'bg-[#27272A] text-[#DFE104] border border-[#3F3F46]'
                        : 'bg-[#DFE104] text-black'
                    }`}
                  >
                    {ds.modeLabelPt || (ds.mode === 'dark' ? 'MODO ESCURO' : 'MODO CLARO')}
                  </span>

                  {ds.sourceDomain && (
                    <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider truncate max-w-[140px]">
                      {ds.sourceDomain}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#FAFAFA] group-hover:text-[#DFE104] transition-colors mb-2">
                  {ds.namePt || ds.name}
                </h3>

                {ds.description && (
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 uppercase font-medium tracking-wide mb-4">
                    {ds.description}
                  </p>
                )}

                {/* Color swatches bar */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>PALETA DE CORES</span>
                    <span className="text-[9px] text-[#DFE104]">(CLIQUE P/ COPIAR HEX)</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-10 border-2 border-[#3F3F46] p-1 bg-[#27272A]">
                    {colorEntries.map(([name, hex]) => (
                      <button
                        key={name}
                        onClick={(e) => handleCopyHex(e, hex)}
                        style={{ backgroundColor: hex }}
                        className="h-full border border-black/40 transition hover:scale-110 relative group cursor-pointer"
                        title={`${name.toUpperCase()}: ${hex}`}
                      >
                        {copiedColorHex === hex && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[#DFE104]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography info */}
                {ds.typography?.fontFamilySans && (
                  <div className="text-xs text-[#A1A1AA] bg-[#27272A] p-3 border border-[#3F3F46] mb-4 font-mono">
                    <span className="font-bold text-[#DFE104]">FONTE SANS: </span>
                    <span className="text-white truncate block uppercase">
                      {ds.typography.fontFamilySans}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t-2 border-[#3F3F46] flex items-center gap-2">
                <button
                  onClick={() => handleCopyDesignMd(ds)}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition rounded-none cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#DFE104] text-black hover:scale-105 active:scale-95'
                  }`}
                  title="Copiar markdown design.md completo"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR TOKENS</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadMd(ds)}
                  className="h-12 px-4 border-2 border-[#3F3F46] text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-black transition rounded-none cursor-pointer flex items-center justify-center"
                  title="Baixar arquivo design.md"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
