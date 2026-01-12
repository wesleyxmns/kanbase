import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useRef } from 'react';
export function useKanbanDnd({ dragActivationDistance, touchActivationDelay, onDragStart, onDragOver, onDragEnd, onCardMove, onColumnMove, onCreateColumnWithCard, columns, columnOrder, recentlyMovedToNewContainer }) {
    // Use refs to avoid stale closures in dnd-kit handlers
    const columnsRef = useRef(columns);
    const columnOrderRef = useRef(columnOrder);
    useEffect(() => {
        columnsRef.current = columns;
        columnOrderRef.current = columnOrder;
    }, [columns, columnOrder]);
    const dragPositionRef = useRef(null);
    const sensors = useSensors(useSensor(MouseSensor, {
        activationConstraint: { distance: dragActivationDistance },
    }), useSensor(TouchSensor, {
        activationConstraint: { delay: touchActivationDelay, tolerance: 5 },
    }), useSensor(KeyboardSensor));
    const handleDragStart = (event) => {
        const data = event.active.data.current;
        const type = data?.type || 'Card';
        dragPositionRef.current = null;
        onDragStart(event.active.id, type);
    };
    const handleDragOver = (event) => {
        const { active, over } = event;
        const activeData = active.data.current;
        const type = activeData?.type || 'Card';
        const currentColumns = columnsRef.current;
        const currentOrder = columnOrderRef.current;
        if (!over) {
            onDragOver(null);
            dragPositionRef.current = null;
            return;
        }
        const activeId = active.id;
        const overId = over.id;
        // Detecção de lado (Top/Bottom ou Left/Right)
        const overRect = over.rect;
        // Obter coordenadas do mouse/toque dinâmicamente do dnd-kit se possível,
        // mas o simpler é usar o active rect vs over rect.
        const activeRect = active.rect.current.translated;
        let side = null;
        if (activeRect && overRect) {
            if (type === 'Column') {
                const overCenterX = overRect.left + overRect.width / 2;
                side = activeRect.left + activeRect.width / 2 < overCenterX ? 'left' : 'right';
            }
            else {
                const overCenterY = overRect.top + overRect.height / 2;
                side = activeRect.top + activeRect.height / 2 < overCenterY ? 'top' : 'bottom';
            }
        }
        onDragOver(overId, side);
        // --- COLUMN REORDERING ---
        if (type === 'Column') {
            let targetColumnId = overId;
            if (!currentColumns[overId]) {
                const overCol = Object.values(currentColumns).find(col => col.cardIds.includes(overId));
                if (overCol) {
                    targetColumnId = overCol.id;
                }
            }
            const overIndex = currentOrder.indexOf(targetColumnId);
            const currentIndex = currentOrder.indexOf(activeId);
            if (overIndex !== -1 && currentIndex !== -1 && currentIndex !== overIndex) {
                // Live reorder: simple index swap is more stable for horizontal sorting
                onColumnMove(activeId, overIndex);
                if (dragPositionRef.current) {
                    dragPositionRef.current.targetIndex = overIndex;
                }
            }
            return;
        }
        // --- CARD MOVEMENT ---
        // Check if dropping on the "New Column" target
        if (overId === 'new-column-drop-target') {
            const activeColumn = Object.values(currentColumns).find(col => col.cardIds.includes(activeId));
            if (activeColumn) {
                dragPositionRef.current = {
                    type: 'NewColumn',
                    activeId,
                    sourceColumnId: activeColumn.id,
                    targetIndex: 0
                };
            }
            return;
        }
        const activeColumn = Object.values(currentColumns).find(col => col.cardIds.includes(activeId));
        if (!activeColumn)
            return;
        if (currentColumns[overId]) {
            if (activeColumn.id !== overId) {
                // Signal that we're moving to a new container
                if (recentlyMovedToNewContainer) {
                    recentlyMovedToNewContainer.current = true;
                }
                dragPositionRef.current = {
                    type: 'Card',
                    activeId,
                    sourceColumnId: activeColumn.id,
                    targetColumnId: overId,
                    targetIndex: currentColumns[overId].cardIds.length,
                    side: 'bottom' // Default para coluna vazia/header
                };
            }
            else {
                dragPositionRef.current = null;
            }
            return;
        }
        const overColumn = Object.values(currentColumns).find(col => col.cardIds.includes(overId));
        if (!overColumn)
            return;
        const overIndex = overColumn.cardIds.indexOf(overId);
        // Cálculo do index final baseado no lado
        const finalIndex = side === 'bottom' ? overIndex + 1 : overIndex;
        if (activeColumn.id !== overColumn.id) {
            // Signal that we're moving to a new container
            if (recentlyMovedToNewContainer) {
                recentlyMovedToNewContainer.current = true;
            }
            dragPositionRef.current = {
                type: 'Card',
                activeId,
                sourceColumnId: activeColumn.id,
                targetColumnId: overColumn.id,
                targetIndex: finalIndex,
                side: side
            };
        }
        else {
            const oldIndex = activeColumn.cardIds.indexOf(activeId);
            // Na mesma coluna, dnd-kit lida bem com sorting, mas para nossa store:
            if (oldIndex !== overIndex) {
                dragPositionRef.current = {
                    type: 'Card',
                    activeId,
                    sourceColumnId: activeColumn.id,
                    targetColumnId: activeColumn.id,
                    targetIndex: overIndex, // Para mesma coluna, dnd-kit prefere swap direto ou splice
                    side: side
                };
            }
        }
    };
    const handleDragEnd = () => {
        if (dragPositionRef.current) {
            const pos = dragPositionRef.current;
            if (pos.type === 'NewColumn' && pos.sourceColumnId && onCreateColumnWithCard) {
                onCreateColumnWithCard(pos.activeId, pos.sourceColumnId);
            }
            else if (pos.type === 'Card' && pos.sourceColumnId && pos.targetColumnId) {
                onCardMove(pos.activeId, pos.sourceColumnId, pos.targetColumnId, pos.targetIndex);
            }
            else if (pos.type === 'Column') {
                onColumnMove(pos.activeId, pos.targetIndex);
            }
        }
        dragPositionRef.current = null;
        onDragEnd();
    };
    return {
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
}
