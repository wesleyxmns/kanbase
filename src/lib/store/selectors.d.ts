import type { KanbanStore } from './use-kanban-store';
import type { KanboomCard, KanboomColumn } from '../types/kanban';
/**
 * Zustand selectors for optimized component subscriptions
 * Components should use these instead of subscribing to the entire store
 */
export declare const selectCard: (cardId: string) => (state: KanbanStore) => KanboomCard | undefined;
export declare const selectAllCards: (state: KanbanStore) => Record<string, KanboomCard>;
export declare const selectCardsByIds: (cardIds: string[]) => (state: KanbanStore) => KanboomCard[];
export declare const selectColumn: (columnId: string) => (state: KanbanStore) => KanboomColumn | undefined;
export declare const selectAllColumns: (state: KanbanStore) => Record<string, KanboomColumn>;
export declare const selectColumnOrder: (state: KanbanStore) => string[];
export declare const selectColumnCards: (columnId: string) => (state: KanbanStore) => KanboomCard[];
export declare const selectColumnCardIds: (columnId: string) => (state: KanbanStore) => string[];
export declare const selectMoveCard: (state: KanbanStore) => (cardId: string, sourceColId: string, targetColId: string, newIndex: number) => void;
export declare const selectMoveColumn: (state: KanbanStore) => (columnId: string, newIndex: number) => void;
export declare const selectSetBoardData: (state: KanbanStore) => (data: import("..").KanboomData) => void;
export declare const selectBoardData: (state: KanbanStore) => {
    cards: Record<string, KanboomCard>;
    columns: Record<string, KanboomColumn>;
    columnOrder: string[];
};
export declare const selectCardCount: (state: KanbanStore) => number;
export declare const selectColumnCount: (state: KanbanStore) => number;
//# sourceMappingURL=selectors.d.ts.map