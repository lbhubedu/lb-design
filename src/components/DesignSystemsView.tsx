import React, { useState } from 'react';
import {
  Palette,
  Search,
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  Layers,
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
    onCopySuccess(`Design System "${ds.namePt || ds.name}" copiado!`, 'Arquivo design.md copiado');
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
    onCopySuccess(`Download iniciado!`, `${ds.slug}.md`);
  };

  const handleCopyHex = async (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(hex);
    setCopiedColorHex(hex);
    onCopySuccess(`Cor ${hex} copiada!`);
    setTimeout(() => setCopiedColorHex(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <Palette className="w-3.5 h-3.5" />
            147 Sistemas de Design & Tokens
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Sistemas de Cores e Tokens de Design (design.md)
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Paletas de cores profissionais, tipografias combinadas e regras prontas para você copiar
            ou baixar em formato <code className="text-blue-300 font-mono">design.md</code> e
            colar no seu projeto ou agente de inteligência artificial.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome de sistema ou cor..."
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-100 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mode filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({items.length})
          </button>
          <button
            onClick={() => setFilterMode('dark')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
              filterMode === 'dark'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Escuro</span>
          </button>
          <button
            onClick={() => setFilterMode('light')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
              filterMode === 'light'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Claro</span>
          </button>
        </div>
      </div>

      {/* Grid of design systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ds) => {
          const isCopied = copiedId === ds.id;
          const colorEntries = Object.entries(ds.colors || {}).slice(0, 7);

          return (
            <div
              key={ds.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      ds.mode === 'dark'
                        ? 'bg-slate-900 text-slate-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ds.modeLabelPt || (ds.mode === 'dark' ? 'Modo Escuro' : 'Modo Claro')}
                  </span>

                  {ds.sourceDomain && (
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                      {ds.sourceDomain}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-slate-900 text-base mb-1">
                  {ds.namePt || ds.name}
                </h3>

                {ds.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{ds.description}</p>
                )}

                {/* Color swatches bar */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Paleta de Cores</span>
                    <span className="text-[10px] text-slate-400 lowercase">
                      (clique para copiar hex)
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-9 rounded-xl overflow-hidden p-0.5 bg-slate-100">
                    {colorEntries.map(([name, hex]) => (
                      <button
                        key={name}
                        onClick={(e) => handleCopyHex(e, hex)}
                        style={{ backgroundColor: hex }}
                        className="h-full rounded-md transition hover:scale-110 hover:shadow-md relative group"
                        title={`${name}: ${hex}`}
                      >
                        {copiedColorHex === hex && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography info */}
                {ds.typography?.fontFamilySans && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                    <span className="font-bold text-slate-700">Fonte Sans: </span>
                    <span className="font-mono text-slate-500 truncate block">
                      {ds.typography.fontFamilySans}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleCopyDesignMd(ds)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-blue-600 text-white'
                  }`}
                  title="Copiar markdown design.md completo"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Tokens</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadMd(ds)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
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
