import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { KanboomBoard, useKanbanStore } from './lib';
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
    const kanbanConfig = {
        allowAdd: true,
        allowEdit: true,
        allowColumnAdd: true,
        allowColumnEdit: true,
        allowColumnDelete: true,
        allowColumnReorder: true,
        showURLSync: true,
    };
    return (_jsx("div", { className: "w-full h-screen flex flex-col", children: _jsx("div", { className: "flex-1 min-h-0 overflow-hidden p-6", children: _jsx(KanboomBoard, { config: kanbanConfig }) }) }));
}
export default App;
