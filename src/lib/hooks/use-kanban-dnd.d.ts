import type { DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import type { MutableRefObject } from 'react';
interface UseKanbanDndProps {
    dragActivationDistance: number;
    touchActivationDelay: number;
    onDragStart: (id: string, type: 'Card' | 'Column') => void;
    onDragOver: (overId: string | null, side?: 'top' | 'bottom' | 'left' | 'right' | null) => void;
    onDragEnd: () => void;
    onCardMove: (cardId: string, sourceColumnId: string, targetColumnId: string, index: number) => void;
    onColumnMove: (columnId: string, index: number) => void;
    onCreateColumnWithCard?: (cardId: string, sourceColumnId: string) => void;
    columns: Record<string, any>;
    columnOrder: string[];
    recentlyMovedToNewContainer?: MutableRefObject<boolean>;
}
export declare function useKanbanDnd({ dragActivationDistance, touchActivationDelay, onDragStart, onDragOver, onDragEnd, onCardMove, onColumnMove, onCreateColumnWithCard, columns, columnOrder, recentlyMovedToNewContainer }: UseKanbanDndProps): {
    sensors: import("@dnd-kit/core").SensorDescriptor<import("@dnd-kit/core").SensorOptions>[];
    handleDragStart: (event: DragStartEvent) => void;
    handleDragOver: (event: DragOverEvent) => void;
    handleDragEnd: () => void;
};
export {};
//# sourceMappingURL=use-kanban-dnd.d.ts.map