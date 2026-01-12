import { useState, useCallback } from 'react';
import { useKanbanStore } from '../store/use-kanban-store';
import type { KanboomConfig } from '../types/kanban';

export function useKanban<TCard = any, TColumn = any>(config?: KanboomConfig<TCard, TColumn>) {
  const store = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overSide, setOverSide] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null);

  const handleDragStart = useCallback((cardId: string) => {
    setActiveId(cardId);
  }, []);

  const handleDragOver = useCallback((id: string | null, side?: 'top' | 'bottom' | 'left' | 'right' | null) => {
    setOverId(id);
    setOverSide(side ?? null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setOverSide(null);
  }, []);


  const moveCard = useCallback((
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    index: number
  ) => {
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