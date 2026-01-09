import type { KanboomCard, KanboomColumn, KanboomData, KanboomConfig, KanbanFilters, FilterGroup } from '../types/kanban';
export interface KanbanStore extends KanboomData {
    config: KanboomConfig;
    activeId: string | null;
    viewingCardId: string | null;
    editingCardId: string | null;
    addingCardInColumnId: string | null;
    editingColumnId: string | null;
    addCard: (columnId: string, card: Omit<KanboomCard, 'id'>) => string;
    updateCard: (cardId: string, updates: Partial<KanboomCard>) => void;
    deleteCard: (cardId: string) => void;
    duplicateCard: (cardId: string) => string;
    addColumn: (column: Omit<KanboomColumn, 'id' | 'cardIds'>, position?: number) => string;
    updateColumn: (columnId: string, updates: Partial<KanboomColumn>) => void;
    deleteColumn: (columnId: string, moveCardsTo?: string) => void;
    moveCard: (cardId: string, sourceColId: string, targetColId: string, newIndex: number) => void;
    moveColumn: (columnId: string, newIndex: number) => void;
    addColumnWithCard: (cardId: string, sourceColId: string, columnData: Omit<KanboomColumn, 'id' | 'cardIds'>) => void;
    filters: KanbanFilters;
    setSearchQuery: (query: string) => void;
    addFilterGroup: (group: FilterGroup) => void;
    updateFilterGroup: (groupId: string, updates: Partial<FilterGroup>) => void;
    removeFilterGroup: (groupId: string) => void;
    removeFilterRule: (groupId: string, ruleId: string) => void;
    setFilters: (filters: KanbanFilters) => void;
    clearFilters: () => void;
    setBoardData: (data: KanboomData) => void;
    setConfig: (config: Partial<KanboomConfig>) => void;
    setActiveId: (id: string | null) => void;
    setViewingCardId: (id: string | null) => void;
    clearViewingCardId: () => void;
    setEditingCardId: (id: string | null) => void;
    clearEditingCardId: () => void;
    setAddingCardInColumnId: (id: string | null) => void;
    clearAddingCardInColumnId: () => void;
    setEditingColumnId: (id: string | null) => void;
    clearEditingColumnId: () => void;
    clearBoard: () => void;
}
export declare const useKanbanStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<KanbanStore>, "setState" | "devtools"> & {
    setState(partial: KanbanStore | Partial<KanbanStore> | ((state: KanbanStore) => KanbanStore | Partial<KanbanStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: KanbanStore | ((state: KanbanStore) => KanbanStore), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}>;
//# sourceMappingURL=use-kanban-store.d.ts.map