import { useEffect } from 'react';
import { KanboomBoard, useKanbanStore, type KanboomConfig } from './lib';
import { generateProductionData } from './lib/mock/generate-mock-data';
import { Badge } from './components/ui/badge';
import { User, Package, Briefcase, AlertCircle } from 'lucide-react';

function App() {
  const { setBoardData } = useKanbanStore();

  useEffect(() => {
    const data = generateProductionData();
    setBoardData(data);
  }, [setBoardData]);

  const kanbanConfig: KanboomConfig = {
    allowAdd: true,
    allowEdit: true,
    allowColumnAdd: false,
    allowColumnEdit: true,
    allowColumnDelete: false,
    allowColumnReorder: true,
    showURLSync: true,

    // Customização de Cards (Produtos)
    renderCard: ({ card }) => {
      const priorityColors: Record<string, string> = {
        high: 'bg-red-500/10 text-red-500 border-red-500/20',
        medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      };

      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{card.description}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[card.metadata?.priority || 'low']}`}>
              {card.metadata?.priority?.toUpperCase()}
            </Badge>
          </div>

          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {card.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
              <Package size={12} />
              <span>PI-PROD</span>
            </div>
            {card.metadata?.assigned_to && (
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                <User size={12} />
                <span>Atribuído</span>
              </div>
            )}
          </div>

          <div className="absolute right-0 bottom-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1 translate-y-1">
            <Package size={48} />
          </div>
        </div>
      );
    },

    // Customização de Colunas (Colaboradores ou Estoque)
    renderColumnHeader: ({ column }) => {
      const isStock = column.id === 'PI_STOCK';

      return (
        <div className="flex items-center justify-between py-2 px-1 group">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isStock ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'} transition-transform group-hover:scale-110`}>
              {isStock ? <Briefcase size={20} /> : <User size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                {column.title}
              </h3>
              {!isStock && (
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                  {column.metadata?.role || 'Colaborador'}
                </p>
              )}
            </div>
          </div>

          <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5">
            {column.cardIds.length}
          </Badge>
        </div>
      );
    },

    onCardMove: (cardId, _fromColId, toColId) => {
      console.log(`Logística: Movendo ${cardId} para ${toColId}`);
      // Aqui você dispararia seu toast ou API (api.assignProduct({ productId: cardId, collaboratorId: toColId }))
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-zinc-50/50 dark:bg-black">
      <header className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Kanbase <span className="text-indigo-600">Production</span>
          </h1>
          <p className="text-xs text-zinc-500 font-medium italic">Assignment Flow: Drag PI to Collaborators</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/50">
            <AlertCircle size={14} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-500 underline decoration-amber-500/30">MOCK ENVIRONMENT</span>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden px-6 pt-6">
        <KanboomBoard config={kanbanConfig} />
      </div>
    </div>
  );
}

export default App;