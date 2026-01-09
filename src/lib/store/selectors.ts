import type { KanbanStore } from './use-kanban-store';
import type { KanboomCard, KanboomColumn } from '../types/kanban';

/**
 * Zustand selectors for optimized component subscriptions
 * Components should use these instead of subscribing to the entire store
 */

// === CARD SELECTORS ===

export const selectCard = (cardId: string) => (state: KanbanStore): KanboomCard | undefined =>
  state.cards[cardId];

export const selectAllCards = (state: KanbanStore): Record<string, KanboomCard> =>
  state.cards;

export const selectCardsByIds = (cardIds: string[]) => (state: KanbanStore): KanboomCard[] =>
  cardIds.map(id => state.cards[id]).filter(Boolean);

// === COLUMN SELECTORS ===

export const selectColumn = (columnId: string) => (state: KanbanStore): KanboomColumn | undefined =>
  state.columns[columnId];

export const selectAllColumns = (state: KanbanStore): Record<string, KanboomColumn> =>
  state.columns;

export const selectColumnOrder = (state: KanbanStore): string[] =>
  state.columnOrder;

export const selectColumnCards = (columnId: string) => (state: KanbanStore): KanboomCard[] => {
  const column = state.columns[columnId];
  if (!column) return [];
  return column.cardIds.map(id => state.cards[id]).filter(Boolean);
};

export const selectColumnCardIds = (columnId: string) => (state: KanbanStore): string[] => {
  const column = state.columns[columnId];
  return column?.cardIds || [];
};

// === ACTIONS SELECTORS ===
// Note: CRUD actions will be added in future implementation

export const selectMoveCard = (state: KanbanStore) => state.moveCard;
export const selectMoveColumn = (state: KanbanStore) => state.moveColumn;
export const selectSetBoardData = (state: KanbanStore) => state.setBoardData;

// === UTILITY SELECTORS ===

export const selectBoardData = (state: KanbanStore) => ({
  cards: state.cards,
  columns: state.columns,
  columnOrder: state.columnOrder,
});

export const selectCardCount = (state: KanbanStore): number =>
  Object.keys(state.cards).length;

export const selectColumnCount = (state: KanbanStore): number =>
  state.columnOrder.length;
