/**
 * Zustand selectors for optimized component subscriptions
 * Components should use these instead of subscribing to the entire store
 */
// === CARD SELECTORS ===
export const selectCard = (cardId) => (state) => state.cards[cardId];
export const selectAllCards = (state) => state.cards;
export const selectCardsByIds = (cardIds) => (state) => cardIds.map(id => state.cards[id]).filter(Boolean);
// === COLUMN SELECTORS ===
export const selectColumn = (columnId) => (state) => state.columns[columnId];
export const selectAllColumns = (state) => state.columns;
export const selectColumnOrder = (state) => state.columnOrder;
export const selectColumnCards = (columnId) => (state) => {
    const column = state.columns[columnId];
    if (!column)
        return [];
    return column.cardIds.map(id => state.cards[id]).filter(Boolean);
};
export const selectColumnCardIds = (columnId) => (state) => {
    const column = state.columns[columnId];
    return column?.cardIds || [];
};
// === ACTIONS SELECTORS ===
// Note: CRUD actions will be added in future implementation
export const selectMoveCard = (state) => state.moveCard;
export const selectMoveColumn = (state) => state.moveColumn;
export const selectSetBoardData = (state) => state.setBoardData;
// === UTILITY SELECTORS ===
export const selectBoardData = (state) => ({
    cards: state.cards,
    columns: state.columns,
    columnOrder: state.columnOrder,
});
export const selectCardCount = (state) => Object.keys(state.cards).length;
export const selectColumnCount = (state) => state.columnOrder.length;
