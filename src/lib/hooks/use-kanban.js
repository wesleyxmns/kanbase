import { useState, useCallback } from 'react';
import { useKanbanStore } from '../store/use-kanban-store';
export function useKanban(config) {
    const store = useKanbanStore();
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [overSide, setOverSide] = useState(null);
    const handleDragStart = useCallback((cardId) => {
        setActiveId(cardId);
    }, []);
    const handleDragOver = useCallback((id, side) => {
        setOverId(id);
        setOverSide(side ?? null);
    }, []);
    const handleDragEnd = useCallback(() => {
        setActiveId(null);
        setOverId(null);
        setOverSide(null);
    }, []);
    const moveCard = useCallback((cardId, sourceColumnId, targetColumnId, index) => {
        store.moveCard(cardId, sourceColumnId, targetColumnId, index);
        config?.onCardMove?.(cardId, sourceColumnId, targetColumnId, index);
    }, [store, config]);
    return {
        // Estado
        ...store,
        activeId,
        overId,
        overSide,
        viewingCardId: store.viewingCardId,
        editingCardId: store.editingCardId,
        addingCardInColumnId: store.addingCardInColumnId,
        editingColumnId: store.editingColumnId, // Use store version
        setViewingCardId: store.setViewingCardId,
        clearViewingCardId: store.clearViewingCardId,
        // Ações de Cards
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        moveCard,
        addCard: store.addCard,
        updateCard: store.updateCard,
        deleteCard: store.deleteCard,
        duplicateCard: store.duplicateCard,
        setEditingCardId: store.setEditingCardId,
        clearEditingCardId: store.clearEditingCardId,
        setAddingCardInColumnId: store.setAddingCardInColumnId,
        clearAddingCardInColumnId: store.clearAddingCardInColumnId,
        // Ações de Colunas
        addColumn: store.addColumn,
        addColumnWithCard: store.addColumnWithCard,
        updateColumn: store.updateColumn,
        deleteColumn: store.deleteColumn,
        moveColumn: store.moveColumn,
        setEditingColumnId: store.setEditingColumnId,
        clearEditingColumnId: store.clearEditingColumnId,
        // Utilitários
        clearBoard: store.clearBoard,
        // Configurações
        config: {
            dragActivationDistance: config?.dragActivationDistance ?? 10,
            touchActivationDelay: config?.touchActivationDelay ?? 250,
            virtualOverscan: config?.virtualOverscan ?? 5,
            estimatedCardHeight: config?.estimatedCardHeight ?? 90,
            columnWidth: config?.columnWidth ?? 320,
            columnMinHeight: config?.columnMinHeight ?? 500,
            gap: config?.gap ?? 16,
            allowAdd: config?.allowAdd ?? false,
            allowEdit: config?.allowEdit ?? false,
            allowColumnAdd: config?.allowColumnAdd ?? false,
            allowColumnEdit: config?.allowColumnEdit ?? false,
            allowColumnDelete: config?.allowColumnDelete ?? false,
            allowColumnReorder: config?.allowColumnReorder ?? false,
            allowFilters: config?.allowFilters ?? true,
            showURLSync: config?.showURLSync ?? false,
        }
    };
}
