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
    allowColumnAdd: true,
    allowColumnEdit: true,
    allowColumnDelete: true,
    allowColumnReorder: true,
    showURLSync: true,
    onCardMove: (cardId, _fromColId, toColId) => {
      console.log(`Logística: Movendo ${cardId} para ${toColId}`);
      // Aqui você dispararia seu toast ou API (api.assignProduct({ productId: cardId, collaboratorId: toColId }))
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden p-6">
        <KanboomBoard config={kanbanConfig} />
      </div>
    </div>
  );
}

export default App;