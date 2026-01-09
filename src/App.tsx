import { useEffect, useState } from 'react';
import { KanboomBoard, useKanbanStore, type KanboomConfig } from './lib';
import { generateMockData } from './lib/mock/generate-mock-data';

function App() {
  const { setBoardData } = useKanbanStore();
  const [cardCount] = useState(10);
  const columnCount = 5;

  useEffect(() => {
    const cardsPerCol = Math.ceil(cardCount / columnCount);
    const data = generateMockData(columnCount, cardsPerCol);
    setBoardData(data);
  }, [cardCount, setBoardData]);

  const kanbanConfig: KanboomConfig = {
    allowAdd: true,
    allowEdit: true,
    allowColumnAdd: true,
    allowColumnEdit: true,
    allowColumnDelete: true,
    allowColumnReorder: true,
    showURLSync: true,
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