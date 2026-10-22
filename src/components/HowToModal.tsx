import React, { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Laptop, Wand2, Copy, Heart } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Guia Rápido para Iniciantes
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading">
            Como criar seu site ou aplicativo em 3 minutos
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
            Você não precisa saber programação ou design. Siga este passo a passo simples para
            transformar qualquer modelo desta biblioteca no seu projeto real.
          </p>
        </div>

        {/* Steps */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Escolha o visual que você mais gostou
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Navegue pelas 10 categorias na barra lateral (Páginas de Vendas, Painéis, Lojas,
                Portfólios, etc.) ou use a barra de busca para encontrar o nicho da sua empresa (ex:
                clínica, restaurante, imobiliária, academia).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Personalize com o nome da sua empresa (Personalizador Mágico)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Clique no card para abrir o estúdio. Na aba{' '}
                <strong className="text-indigo-600">Personalizador Mágico</strong>, digite o nome do
                seu negócio e o que você vende. Nossa IA adapta todos os títulos, textos e chamadas
                para o seu contexto em português!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Copie o prompt e cole na ferramenta de sua preferência
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Clique em <strong className="text-emerald-600">Copiar Prompt Personalizado</strong>{' '}
                e cole em uma dessas ferramentas gratuitas:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                <a
                  href="https://lovable.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition text-left group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>Lovable (lovable.dev)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Gera a página inteira navegável com 1 clique.
                  </div>
                </a>

                <a
                  href="https://bolt.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition text-left group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>Bolt.new</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Cria e roda no navegador em segundos.
                  </div>
                </a>

                <a
                  href="https://v0.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition text-left group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>v0 da Vercel (v0.dev)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Design limpo e moderno com React e Tailwind.
                  </div>
                </a>

                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition text-left group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>ChatGPT ou Claude</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Peça o código completo e tire dúvidas.
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Dicas Finais */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Dicas de ouro para o melhor resultado:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                Salve seus modelos favoritos clicando no ícone de <strong>Coração ❤️</strong>. Eles
                ficam salvos no seu computador.
              </li>
              <li>
                Se você precisa de uma identidade visual completa (paleta de cores, tipografia e
                modo escuro), use a aba <strong>Sistemas de Cores & Design</strong> e copie o
                arquivo <code className="bg-slate-200 px-1 py-0.5 rounded">design.md</code>.
              </li>
              <li>
                Esta biblioteca é 100% gratuita, sem limites e sem necessidade de login.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
          >
            Entendi, quero começar!
          </button>
        </div>
      </div>
    </div>
  );
};
