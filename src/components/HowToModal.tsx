import React, { useEffect } from 'react';
import { X, Sparkles, ArrowRight, Wand2, Copy, Check } from 'lucide-react';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToModal: React.FC<HowToModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#09090B] w-full max-w-4xl border-2 border-[#3F3F46] rounded-none overflow-hidden flex flex-col shadow-none"
      >
        {/* Header */}
        <div className="bg-[#DFE104] text-black p-6 sm:p-8 relative border-b-2 border-black">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-black text-[#DFE104] hover:bg-black/80 transition rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#DFE104] text-xs font-black uppercase tracking-widest mb-3 rounded-none">
            <Sparkles className="w-3.5 h-3.5" />
            GUIA RÁPIDO PARA LEIGOS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase tracking-tighter">
            COMO CRIAR SUA INTERFACE EM 3 MINUTOS
          </h2>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-2 max-w-2xl text-black/80">
            VOCÊ NÃO PRECISA SABER PROGRAMAÇÃO OU DESIGN. APENAS SIGA ESTES 3 PASSOS SIMPLES.
          </p>
        </div>

        {/* Steps */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[70vh] bg-[#09090B]">
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row gap-5 items-start border-b-2 border-[#3F3F46] pb-6">
            <div className="text-6xl sm:text-7xl font-black text-[#DFE104] font-heading leading-none shrink-0">
              01
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#FAFAFA] font-heading">
                ESCOLHA O MODELO IDEAL PARA SUA IDEIA
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed uppercase tracking-wide font-medium">
                NAVEGUE PELAS 10 CATEGORIAS (PÁGINAS DE VENDAS, PAINÉIS, APPS, COMPONENTES) OU USE O CAMPO DE BUSCA PARA ENCONTRAR O NICHO DA SUA EMPRESA (EX: ODONTOLOGIA, RESTAURANTE, BARBEARIA).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row gap-5 items-start border-b-2 border-[#3F3F46] pb-6">
            <div className="text-6xl sm:text-7xl font-black text-[#DFE104] font-heading leading-none shrink-0">
              02
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#FAFAFA] font-heading">
                PERSONALIZE O PROMPT NO PERSONALIZADOR MÁGICO
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed uppercase tracking-wide font-medium">
                CLIQUE NO CARD PARA ABRIR O ESTÚDIO. NA ABA <strong className="text-[#DFE104]">PERSONALIZADOR MÁGICO</strong>, DIGITE O NOME DO SEU NEGÓCIO E O QUE ELE FAZ. O PROMPT É CONVERTIDO AUTOMATICAMENTE EM PORTUGUÊS COM SEU CONTEXTO REAL. VOCÊ TAMBÉM PODE ESCOLHER UMA <strong className="text-[#DFE104]">PALETA DE CORES</strong> PRONTA (OU PERSONALIZAR AS SUAS) PARA A IA SEGUIR À RISCA.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row gap-5 items-start border-b-2 border-[#3F3F46] pb-6">
            <div className="text-6xl sm:text-7xl font-black text-[#DFE104] font-heading leading-none shrink-0">
              03
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#FAFAFA] font-heading">
                COPIE E COLE NA SUA FERRAMENTA PREFERIDA
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed uppercase tracking-wide font-medium">
                CLIQUE EM <strong className="text-[#DFE104]">COPIAR PROMPT PERSONALIZADO</strong> E COLE EM QUALQUER UMA DESSAS PLATAFORMAS:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="p-4 border-2 border-[#3F3F46] bg-[#27272A] hover:bg-[#DFE104] hover:text-black hover:border-[#DFE104] transition group rounded-none">
                  <div className="font-black text-xs uppercase tracking-wider flex items-center justify-between text-[#FAFAFA] group-hover:text-black">
                    <span>ARENA.AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] group-hover:text-black/80 mt-1 uppercase font-medium">
                    PROMPTS AUTO-CONTIDOS EM COMPONENTE ÚNICO PARA COMPARAÇÃO.
                  </div>
                </div>

                <div className="p-4 border-2 border-[#3F3F46] bg-[#27272A] hover:bg-[#DFE104] hover:text-black hover:border-[#DFE104] transition group rounded-none">
                  <div className="font-black text-xs uppercase tracking-wider flex items-center justify-between text-[#FAFAFA] group-hover:text-black">
                    <span>CODEX DESKTOP</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] group-hover:text-black/80 mt-1 uppercase font-medium">
                    ESTRUTURADO PARA PROJETOS REAIS NO CODEX DESKTOP E CHATGPT.
                  </div>
                </div>

                <div className="p-4 border-2 border-[#3F3F46] bg-[#27272A] hover:bg-[#DFE104] hover:text-black hover:border-[#DFE104] transition group rounded-none">
                  <div className="font-black text-xs uppercase tracking-wider flex items-center justify-between text-[#FAFAFA] group-hover:text-black">
                    <span>ANTIGRAVITY DESKTOP</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] group-hover:text-black/80 mt-1 uppercase font-medium">
                    INSTRUÇÕES DIRETAS PARA O AGENTE DE CÓDIGO NO WORKSPACE.
                  </div>
                </div>

                <div className="p-4 border-2 border-[#3F3F46] bg-[#27272A] hover:bg-[#DFE104] hover:text-black hover:border-[#DFE104] transition group rounded-none">
                  <div className="font-black text-xs uppercase tracking-wider flex items-center justify-between text-[#FAFAFA] group-hover:text-black">
                    <span>CHATGPT (GPT-4O)</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] group-hover:text-black/80 mt-1 uppercase font-medium">
                    GERAÇÃO DE CÓDIGO FONTE COMPLETO E EXPLICAÇÕES PASSO A PASSO.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas Finais */}
          <div className="bg-[#27272A] border-2 border-[#3F3F46] p-5 text-xs text-[#FAFAFA] uppercase font-mono tracking-wider space-y-2 rounded-none">
            <div className="font-black text-[#DFE104] flex items-center gap-1.5">
              // REGRAS DE OURO:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#A1A1AA]">
              <li>SALVE SEUS PROMPTS FAVORITOS CLICANDO NO ÍCONE DE CORAÇÃO.</li>
              <li>USE A ABA "SISTEMAS DESIGN.MD" SE QUISER UMA PALETA DE CORES COMPLETA.</li>
              <li>100% GRÁTIS, ILIMITADO E SEM NECESSIDADE DE CADASTRO.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09090B] border-t-2 border-[#3F3F46] flex justify-end">
          <button
            onClick={onClose}
            className="h-12 px-8 bg-[#DFE104] hover:scale-105 active:scale-95 text-black font-black text-xs uppercase tracking-widest transition rounded-none cursor-pointer"
          >
            ENTENDI // COMEÇAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
};
