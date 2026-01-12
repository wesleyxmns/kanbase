import { JSX } from 'react/jsx-runtime';
import { StoreApi } from 'zustand';
import { UseBoundStore } from 'zustand';

export declare interface AddCardRenderProps<TCard = KanboomCard> {
    columnId: string;
    onAdd: (data: Omit<TCard, 'id'>) => void;
    onCancel: () => void;
}

export declare interface AddColumnRenderProps<TColumn = KanboomColumn> {
    onAdd: (data: Omit<TColumn, 'id' | 'cardIds'>) => void;
    onCancel: () => void;
}

export declare const BenchmarkStats: ({ cardCount, columnCount }: BenchmarkStatsProps) => JSX.Element;

declare interface BenchmarkStatsProps {
    cardCount: number;
    columnCount: number;
}

export declare interface CardRenderProps<TCard = KanboomCard> {
    card: TCard;
    isDragging: boolean;
}

export declare interface ColumnEmptyRenderProps {
}

export declare interface ColumnHeaderRenderProps<TColumn = KanboomColumn> {
    column: TColumn;
    cardCount: number;
    isOver: boolean;
    dragHandleProps?: {
        attributes: any;
        listeners: any;
    };
    onAddCard?: () => void;
    onEditColumn?: () => void;
}

export declare interface DiscoveredField {
    label: string;
    value: string;
    type: 'text' | 'number' | 'boolean' | 'other';
}

export declare function discoverFields(cards: Record<string, KanboomCard>): DiscoveredField[];

export declare interface EditCardRenderProps<TCard = KanboomCard> {
    card: TCard;
    onSave: (updates: Partial<TCard>) => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export declare interface EditColumnRenderProps<TColumn = KanboomColumn> {
    column: TColumn;
    onSave: (updates: Partial<TColumn>) => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export declare function evaluateFilter(card: KanboomCard, filters: {
    searchQuery: string;
    groups: FilterGroup[];
}): boolean;

export declare interface FilterDefinition {
    field: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    options?: {
        label: string;
        value: any;
    }[];
    getFieldValue?: (card: any) => any;
}

export declare interface FilterGroup {
    id: string;
    conjunction: 'and' | 'or';
    rules: (FilterRule | FilterGroup)[];
    enabled: boolean;
}

export declare type FilterOperator = 'eq' | 'neq' | 'contains' | 'notContains' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'isEmpty' | 'isNotEmpty';

export declare interface FilterRule {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    enabled: boolean;
    type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
}

export declare interface KanbanFilters {
    searchQuery: string;
    groups: FilterGroup[];
    quickFilters: string[];
}

export declare interface KanbanStore extends KanboomData {
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

declare function KanboomBoard<TCard extends {
    id: string;
} = KanboomCard, TColumn extends {
    id: string;
    title: string;
} = KanboomColumn>({ config }: KanboomBoardProps<TCard, TColumn>): JSX.Element;
export { KanboomBoard as Kanban }
export { KanboomBoard as Kanbase }
export { KanboomBoard }

declare interface KanboomBoardProps<TCard extends {
    id: string;
} = KanboomCard, TColumn extends {
    id: string;
    title: string;
} = KanboomColumn> {
    config?: KanboomConfig<TCard, TColumn>;
}

export declare interface KanboomCard {
    id: string;
    title: string;
    description?: string;
    content?: any;
    metadata?: any;
    previousColumnId?: string;
}

export declare interface KanboomColumn {
    id: string;
    title: string;
    cardIds: string[];
    metadata?: any;
}

export declare interface KanboomConfig<TCard = KanboomCard, TColumn = KanboomColumn> {
    renderCard?: (props: CardRenderProps<TCard>) => React.ReactNode;
    renderColumnHeader?: (props: ColumnHeaderRenderProps<TColumn>) => React.ReactNode;
    renderColumnEmpty?: (props: ColumnEmptyRenderProps) => React.ReactNode;
    renderAddButton?: (props: {
        onClick: () => void;
        columnId: string;
    }) => React.ReactNode;
    renderAddForm?: (props: AddCardRenderProps<TCard>) => React.ReactNode;
    renderEditForm?: (props: EditCardRenderProps<TCard>) => React.ReactNode;
    renderAddColumnButton?: (props: {
        onClick: () => void;
    }) => React.ReactNode;
    renderAddColumnForm?: (props: AddColumnRenderProps<TColumn>) => React.ReactNode;
    renderEditColumnForm?: (props: EditColumnRenderProps<TColumn>) => React.ReactNode;
    renderCardView?: (props: ViewCardRenderProps<TCard>) => React.ReactNode;
    allowAdd?: boolean;
    allowEdit?: boolean;
    allowColumnAdd?: boolean;
    allowColumnEdit?: boolean;
    allowColumnDelete?: boolean;
    allowColumnReorder?: boolean;
    allowFilters?: boolean;
    showURLSync?: boolean;
    dragActivationDistance?: number;
    touchActivationDelay?: number;
    virtualOverscan?: number;
    estimatedCardHeight?: number;
    columnWidth?: number;
    columnMinHeight?: number;
    gap?: number;
    onCardMove?: (cardId: string, fromColumn: string, toColumn: string, index: number) => void;
    onCardClick?: (card: TCard) => void;
    onEditCard?: (card: TCard) => void;
    onColumnClick?: (column: TColumn) => void;
    onEditColumn?: (column: TColumn) => void;
}

export declare interface KanboomData<TCard = KanboomCard> {
    cards: Record<string, TCard>;
    columns: Record<string, KanboomColumn>;
    columnOrder: string[];
}

export declare const selectAllCards: (state: KanbanStore) => Record<string, KanboomCard>;

export declare const selectAllColumns: (state: KanbanStore) => Record<string, KanboomColumn>;

export declare const selectBoardData: (state: KanbanStore) => {
    cards: Record<string, KanboomCard>;
    columns: Record<string, KanboomColumn>;
    columnOrder: string[];
};

/**
 * Zustand selectors for optimized component subscriptions
 * Components should use these instead of subscribing to the entire store
 */
export declare const selectCard: (cardId: string) => (state: KanbanStore) => KanboomCard | undefined;

export declare const selectCardCount: (state: KanbanStore) => number;

export declare const selectCardsByIds: (cardIds: string[]) => (state: KanbanStore) => KanboomCard[];

export declare const selectColumn: (columnId: string) => (state: KanbanStore) => KanboomColumn | undefined;

export declare const selectColumnCardIds: (columnId: string) => (state: KanbanStore) => string[];

export declare const selectColumnCards: (columnId: string) => (state: KanbanStore) => KanboomCard[];

export declare const selectColumnCount: (state: KanbanStore) => number;

export declare const selectColumnOrder: (state: KanbanStore) => string[];

export declare const selectMoveCard: (state: KanbanStore) => (cardId: string, sourceColId: string, targetColId: string, newIndex: number) => void;

export declare const selectMoveColumn: (state: KanbanStore) => (columnId: string, newIndex: number) => void;

export declare const selectSetBoardData: (state: KanbanStore) => (data: KanboomData) => void;

export declare const useFPS: () => number;

export declare function useKanban<TCard = any, TColumn = any>(config?: KanboomConfig<TCard, TColumn>): {
    activeId: string | null;
    overId: string | null;
    overSide: "top" | "bottom" | "left" | "right" | null;
    viewingCardId: string | null;
    editingCardId: string | null;
    addingCardInColumnId: string | null;
    editingColumnId: string | null;
    setViewingCardId: (id: string | null) => void;
    clearViewingCardId: () => void;
    handleDragStart: (cardId: string) => void;
    handleDragOver: (id: string | null, side?: "top" | "bottom" | "left" | "right" | null) => void;
    handleDragEnd: () => void;
    moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, index: number) => void;
    addCard: (columnId: string, card: Omit< KanboomCard, "id">) => string;
    updateCard: (cardId: string, updates: Partial< KanboomCard>) => void;
    deleteCard: (cardId: string) => void;
    duplicateCard: (cardId: string) => string;
    setEditingCardId: (id: string | null) => void;
    clearEditingCardId: () => void;
    setAddingCardInColumnId: (id: string | null) => void;
    clearAddingCardInColumnId: () => void;
    addColumn: (column: Omit< KanboomColumn, "id" | "cardIds">, position?: number) => string;
    addColumnWithCard: (cardId: string, sourceColId: string, columnData: Omit< KanboomColumn, "id" | "cardIds">) => void;
    updateColumn: (columnId: string, updates: Partial< KanboomColumn>) => void;
    deleteColumn: (columnId: string, moveCardsTo?: string) => void;
    moveColumn: (columnId: string, newIndex: number) => void;
    setEditingColumnId: (id: string | null) => void;
    clearEditingColumnId: () => void;
    clearBoard: () => void;
    config: {
        dragActivationDistance: number;
        touchActivationDelay: number;
        virtualOverscan: number;
        estimatedCardHeight: number;
        columnWidth: number;
        columnMinHeight: number;
        gap: number;
        allowAdd: boolean;
        allowEdit: boolean;
        allowColumnAdd: boolean;
        allowColumnEdit: boolean;
        allowColumnDelete: boolean;
        allowColumnReorder: boolean;
        allowFilters: boolean;
        showURLSync: boolean;
    };
    filters: KanbanFilters;
    setSearchQuery: (query: string) => void;
    addFilterGroup: (group: FilterGroup) => void;
    updateFilterGroup: (groupId: string, updates: Partial< FilterGroup>) => void;
    removeFilterGroup: (groupId: string) => void;
    removeFilterRule: (groupId: string, ruleId: string) => void;
    setFilters: (filters: KanbanFilters) => void;
    clearFilters: () => void;
    setBoardData: (data: KanboomData) => void;
    setConfig: (config: Partial<KanboomConfig>) => void;
    setActiveId: (id: string | null) => void;
    cards: Record<string, KanboomCard>;
    columns: Record<string, KanboomColumn>;
    columnOrder: string[];
};

export declare const useKanbanStore: UseBoundStore<Omit< StoreApi<KanbanStore>, "setState" | "devtools"> & {
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

export declare interface ViewCardRenderProps<TCard = KanboomCard> {
    card: TCard;
    onClose: () => void;
}

export { }
