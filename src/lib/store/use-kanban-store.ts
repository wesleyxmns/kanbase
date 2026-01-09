import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  KanboomCard,
  KanboomColumn,
  KanboomData,
  KanboomConfig,
  KanbanFilters,
  FilterGroup
} from '../types/kanban';

export interface KanbanStore extends KanboomData {
  config: KanboomConfig;
  activeId: string | null;
  viewingCardId: string | null;
  editingCardId: string | null;
  addingCardInColumnId: string | null; // For "Add Card" modal
  editingColumnId: string | null; // For "Edit Column" modal

  // === CARDS ===
  addCard: (columnId: string, card: Omit<KanboomCard, 'id'>) => string;
  updateCard: (cardId: string, updates: Partial<KanboomCard>) => void;
  deleteCard: (cardId: string) => void;
  duplicateCard: (cardId: string) => string;

  // === COLUMNS ===
  addColumn: (column: Omit<KanboomColumn, 'id' | 'cardIds'>, position?: number) => string;
  updateColumn: (columnId: string, updates: Partial<KanboomColumn>) => void;
  deleteColumn: (columnId: string, moveCardsTo?: string) => void;

  // === MOVEMENT ===
  moveCard: (
    cardId: string,
    sourceColId: string,
    targetColId: string,
    newIndex: number
  ) => void;
  moveColumn: (columnId: string, newIndex: number) => void;
  addColumnWithCard: (cardId: string, sourceColId: string, columnData: Omit<KanboomColumn, 'id' | 'cardIds'>) => void;

  // === FILTERS ===
  filters: KanbanFilters;
  setSearchQuery: (query: string) => void;
  addFilterGroup: (group: FilterGroup) => void;
  updateFilterGroup: (groupId: string, updates: Partial<FilterGroup>) => void;
  removeFilterGroup: (groupId: string) => void;
  removeFilterRule: (groupId: string, ruleId: string) => void;
  setFilters: (filters: KanbanFilters) => void;
  clearFilters: () => void;

  // === UTILITY ===
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

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useKanbanStore = create<KanbanStore>()(
  devtools((set) => ({
    cards: {},
    columns: {},
    columnOrder: [],
    config: {},
    activeId: null,
    viewingCardId: null,
    editingCardId: null,
    addingCardInColumnId: null,
    editingColumnId: null,

    // Initial Filter State
    filters: {
      searchQuery: '',
      groups: [],
      quickFilters: []
    },

    // === CARDS ===
    addCard: (columnId, cardData) => {
      const cardId = generateId();
      const newCard: KanboomCard = {
        id: cardId,
        ...cardData,
      };

      set((state) => {
        const column = state.columns[columnId];
        if (!column) return state;

        return {
          cards: { ...state.cards, [cardId]: newCard },
          columns: {
            ...state.columns,
            [columnId]: {
              ...column,
              cardIds: [...column.cardIds, cardId],
            },
          },
        };
      });

      return cardId;
    },

    updateCard: (cardId, updates) =>
      set((state) => {
        const card = state.cards[cardId];
        if (!card) return state;

        return {
          cards: {
            ...state.cards,
            [cardId]: { ...card, ...updates },
          },
        };
      }),

    deleteCard: (cardId) =>
      set((state) => {
        const { [cardId]: deletedCard, ...remainingCards } = state.cards;

        const updatedColumns = { ...state.columns };
        Object.keys(updatedColumns).forEach((colId) => {
          updatedColumns[colId] = {
            ...updatedColumns[colId],
            cardIds: updatedColumns[colId].cardIds.filter((id) => id !== cardId),
          };
        });

        return {
          cards: remainingCards,
          columns: updatedColumns,
        };
      }),

    duplicateCard: (cardId) => {
      let newCardId = '';

      set((state) => {
        const card = state.cards[cardId];
        if (!card) return state;

        const columnId = Object.keys(state.columns).find((colId) =>
          state.columns[colId].cardIds.includes(cardId)
        );

        if (!columnId) return state;

        newCardId = generateId();
        const duplicatedCard: KanboomCard = {
          ...card,
          id: newCardId,
          title: `${card.title} (copy)`,
        };

        const column = state.columns[columnId];
        const cardIndex = column.cardIds.indexOf(cardId);

        const newCardIds = [...column.cardIds];
        newCardIds.splice(cardIndex + 1, 0, newCardId);

        return {
          cards: { ...state.cards, [newCardId]: duplicatedCard },
          columns: {
            ...state.columns,
            [columnId]: {
              ...column,
              cardIds: newCardIds,
            },
          },
        };
      });

      return newCardId;
    },

    // === COLUMNS ===
    addColumn: (columnData, position) => {
      const columnId = generateId();
      const newColumn: KanboomColumn = {
        id: columnId,
        ...columnData,
        cardIds: [],
      };

      set((state) => {
        const newColumnOrder = [...state.columnOrder];
        const insertPosition = position ?? newColumnOrder.length;
        newColumnOrder.splice(insertPosition, 0, columnId);

        return {
          columns: { ...state.columns, [columnId]: newColumn },
          columnOrder: newColumnOrder,
        };
      });

      return columnId;
    },

    updateColumn: (columnId, updates) =>
      set((state) => {
        const column = state.columns[columnId];
        if (!column) return state;

        return {
          columns: {
            ...state.columns,
            [columnId]: { ...column, ...updates },
          },
        };
      }),

    deleteColumn: (columnId, moveCardsTo) =>
      set((state) => {
        const column = state.columns[columnId];
        if (!column) return state;

        const { [columnId]: deletedColumn, ...remainingColumns } = state.columns;
        const newColumnOrder = state.columnOrder.filter((id) => id !== columnId);

        let updatedCards = { ...state.cards };
        let updatedColumns = { ...remainingColumns };

        if (moveCardsTo && updatedColumns[moveCardsTo]) {
          // Explicit move requested
          const targetCol = updatedColumns[moveCardsTo];
          updatedColumns[moveCardsTo] = {
            ...targetCol,
            cardIds: [...targetCol.cardIds, ...column.cardIds],
          };
          // Update local card previousColumnId just in case
          column.cardIds.forEach(cardId => {
            if (updatedCards[cardId]) {
              updatedCards[cardId] = { ...updatedCards[cardId], previousColumnId: columnId };
            }
          });
        } else {
          // SAFE DELETE: Return cards to previous column or first available
          const firstColumnId = newColumnOrder.length > 0 ? newColumnOrder[0] : null;

          column.cardIds.forEach((cardId) => {
            const card = updatedCards[cardId];
            if (!card) return;

            const targetColId = (card.previousColumnId && updatedColumns[card.previousColumnId])
              ? card.previousColumnId
              : firstColumnId;

            if (targetColId && updatedColumns[targetColId]) {
              const targetCol = updatedColumns[targetColId];
              updatedColumns[targetColId] = {
                ...targetCol,
                cardIds: [...targetCol.cardIds, cardId]
              };
              // Keep the existing provenance? Or update?
              // Attempts to point to the deleted column are useless since it's gone.
              // Better to leave it pointing to the *original* source if possible, 
              // or just don't update it, effectively behaving like it was always in the target.
              updatedCards[cardId] = { ...card };
            } else {
              // No place to go, sadly delete (or safeguard in 'Unsorted' if requested, but logic implies delete if no cols)
              delete updatedCards[cardId];
            }
          });
        }

        return {
          cards: updatedCards,
          columns: updatedColumns,
          columnOrder: newColumnOrder,
        };
      }),

    // === MOVEMENT ===
    moveCard: (cardId, sourceColId, targetColId, newIndex) => set((state) => {
      const sourceCol = state.columns[sourceColId];
      const targetCol = state.columns[targetColId];

      if (!sourceCol || !targetCol) return state;

      const newSourceCardIds = sourceCol.cardIds.filter(id => id !== cardId);

      if (sourceColId === targetColId) {
        newSourceCardIds.splice(newIndex, 0, cardId);
        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColId]: { ...sourceCol, cardIds: newSourceCardIds }
          }
        };
      }

      const newTargetCardIds = [...targetCol.cardIds];
      newTargetCardIds.splice(newIndex, 0, cardId);

      // Track previous column for recovery
      const updatedCard = { ...state.cards[cardId], previousColumnId: sourceColId };

      return {
        ...state,
        cards: { ...state.cards, [cardId]: updatedCard },
        columns: {
          ...state.columns,
          [sourceColId]: { ...sourceCol, cardIds: newSourceCardIds },
          [targetColId]: { ...targetCol, cardIds: newTargetCardIds }
        }
      };
    }),

    moveColumn: (columnId, newIndex) => set((state) => {
      const newOrder = state.columnOrder.filter(id => id !== columnId);
      newOrder.splice(newIndex, 0, columnId);
      return { ...state, columnOrder: newOrder };
    }),

    addColumnWithCard: (cardId, sourceColId, columnData) => set((state) => {
      const sourceCol = state.columns[sourceColId];
      const card = state.cards[cardId];
      if (!sourceCol || !card) return state;

      const columnId = generateId();
      const newColumn: KanboomColumn = {
        id: columnId,
        ...columnData,
        cardIds: [cardId],
      };

      const newSourceCardIds = sourceCol.cardIds.filter(id => id !== cardId);

      // Strict append to ensuring it goes to the end
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.push(columnId);

      const updatedCard = { ...card, previousColumnId: sourceColId };

      return {
        ...state,
        cards: { ...state.cards, [cardId]: updatedCard },
        columns: {
          ...state.columns,
          [sourceColId]: { ...sourceCol, cardIds: newSourceCardIds },
          [columnId]: newColumn
        },
        columnOrder: newColumnOrder
      };
    }),

    // === FILTERS ===
    setSearchQuery: (query) => set((state) => ({
      filters: { ...state.filters, searchQuery: query }
    })),

    addFilterGroup: (group) => set((state) => ({
      filters: { ...state.filters, groups: [...state.filters.groups, group] }
    })),

    updateFilterGroup: (groupId, updates) => set((state) => ({
      filters: {
        ...state.filters,
        groups: state.filters.groups.map(g => g.id === groupId ? { ...g, ...updates } : g)
      }
    })),

    removeFilterGroup: (groupId: string) => set((state) => ({
      filters: { ...state.filters, groups: state.filters.groups.filter(g => g.id !== groupId) }
    })),

    removeFilterRule: (groupId, ruleId) => set((state) => ({
      filters: {
        ...state.filters,
        groups: state.filters.groups.map(g => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            rules: g.rules.filter(r => !('id' in r) || r.id !== ruleId)
          };
        })
      }
    })),

    setFilters: (filters) => set({ filters }),

    clearFilters: () => set((state) => ({
      filters: { ...state.filters, groups: [], searchQuery: '' }
    })),

    // === UTILITY ===
    setBoardData: (data) => set({ ...data }),
    setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
    setActiveId: (activeId) => set({ activeId }),
    setViewingCardId: (viewingCardId) => set({ viewingCardId }),
    clearViewingCardId: () => set({ viewingCardId: null }),
    setEditingCardId: (editingCardId) => set({ editingCardId }),
    clearEditingCardId: () => set({ editingCardId: null }),
    setAddingCardInColumnId: (addingCardInColumnId) => set({ addingCardInColumnId }),
    clearAddingCardInColumnId: () => set({ addingCardInColumnId: null }),
    setEditingColumnId: (editingColumnId) => set({ editingColumnId }),
    clearEditingColumnId: () => set({ editingColumnId: null }),

    clearBoard: () => set({
      cards: {},
      columns: {},
      columnOrder: [],
      filters: { searchQuery: '', groups: [], quickFilters: [] }
    }),
  }))
);