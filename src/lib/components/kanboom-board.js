import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, DragOverlay, MeasuringStrategy, closestCenter, getFirstCollision, pointerWithin, rectIntersection, useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Plus } from 'lucide-react';
import { cloneElement, isValidElement, memo, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils/utils';
import { useKanban } from '../hooks/use-kanban';
import { CSS } from '@dnd-kit/utilities';
import { useKanbanDnd } from '../hooks/use-kanban-dnd';
import { evaluateFilter } from '../utils/filter-evaluator';
import { DefaultCard } from './default/default-card';
import { DefaultColumnEmpty } from './default/default-column-empty';
import { DefaultColumnHeader } from './default/default-column-header';
import { DefaultEditForm } from './default/default-edit-form';
import { DefaultCardView } from './default/default-card-view';
import { FilterChips } from './filter-chips';
import { KanbanColumn } from './kanban-column';
import { KanbanFilterDrawer } from './kanban-filter-drawer';
import { DefaultAddCardForm } from './default/default-add-card-form';
import { DefaultEditColumnForm } from './default/default-edit-column-form';
// Droppable Wrapper for New Column Button
const DroppableNewColumnButton = memo(({ children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'new-column-drop-target',
        data: { type: 'NewColumn' }
    });
    return (_jsx(_Fragment, { children: children(isOver, setNodeRef) }));
});
// Sortable Wrapper for Virtual Column
const SortableVirtualColumn = memo(({ id, start, width, children, allowReorder, cardIds }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
        id,
        disabled: !allowReorder,
        data: {
            type: 'Column',
            children: cardIds // CRITICAL: Pass card IDs for collision detection
        }
    });
    const style = {
        position: 'absolute',
        top: 0,
        left: `${start}px`, // Virtual positioning via left, NOT transform
        width: `${width}px`,
        transition: transition || 'transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        // Transform is now ONLY for dnd-kit's sorting logic
        transform: transform && !isSortableDragging
            ? CSS.Transform.toString(transform)
            : undefined,
        zIndex: isSortableDragging ? 50 : undefined,
        pointerEvents: (isSortableDragging ? 'none' : undefined),
        animation: isSortableDragging ? 'tilt 0.2s ease-in-out forwards' : undefined,
    };
    return (_jsx("div", { ref: setNodeRef, style: style, children: isValidElement(children) ? (cloneElement(children, {
            dragHandleProps: allowReorder ? { attributes, listeners } : undefined,
            isDragging: isSortableDragging
        })) : children }));
});
export function KanboomBoard({ config }) {
    const kanban = useKanban(config);
    const parentRef = useRef(null);
    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: kanban.columnOrder.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => kanban.config.columnWidth + kanban.config.gap,
        overscan: 5,
    });
    // Filter cards and columns
    const filteredData = useMemo(() => {
        const filteredCards = {};
        // 1. Filter cards
        Object.values(kanban.cards).forEach((card) => {
            if (evaluateFilter(card, kanban.filters)) {
                filteredCards[card.id] = card;
            }
        });
        // 2. Filter card IDs inside columns
        const filteredColumns = {};
        Object.values(kanban.columns).forEach(column => {
            filteredColumns[column.id] = {
                ...column,
                cardIds: column.cardIds.filter(id => filteredCards[id])
            };
        });
        return {
            cards: filteredCards,
            columns: filteredColumns,
        };
    }, [kanban.cards, kanban.columns, kanban.filters]);
    // Refs for collision detection fallback (from official dnd-kit pattern)
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    // Reset recentlyMovedToNewContainer after layout settles
    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [kanban.columnOrder, kanban.columns]);
    const dnd = useKanbanDnd({
        dragActivationDistance: kanban.config.dragActivationDistance,
        touchActivationDelay: kanban.config.touchActivationDelay,
        onDragStart: (id, _type) => {
            kanban.handleDragStart(id);
        },
        onDragOver: kanban.handleDragOver,
        onDragEnd: kanban.handleDragEnd,
        onCardMove: kanban.moveCard,
        onColumnMove: kanban.moveColumn,
        onCreateColumnWithCard: (cardId, sourceColumnId) => {
            kanban.addColumnWithCard(cardId, sourceColumnId, { title: 'Nova Coluna' });
        },
        columns: kanban.columns,
        columnOrder: kanban.columnOrder,
        recentlyMovedToNewContainer
    });
    const activeCard = kanban.activeId && kanban.cards[kanban.activeId] ? kanban.cards[kanban.activeId] : null;
    const activeColumn = kanban.activeId && kanban.columnOrder.includes(kanban.activeId) ? kanban.columns[kanban.activeId] : null;
    const viewingCard = kanban.viewingCardId ? kanban.cards[kanban.viewingCardId] : null;
    const editingColumn = kanban.editingColumnId ? kanban.columns[kanban.editingColumnId] : null;
    const finalConfig = {
        renderCard: config?.renderCard ?? ((props) => _jsx(DefaultCard, { ...props })),
        renderColumnHeader: config?.renderColumnHeader ?? ((props) => _jsx(DefaultColumnHeader, { ...props })),
        renderColumnEmpty: config?.renderColumnEmpty ?? (() => _jsx(DefaultColumnEmpty, {})),
        renderAddButton: config?.renderAddButton,
        renderAddForm: config?.renderAddForm,
        renderEditForm: config?.renderEditForm,
        renderAddColumnButton: config?.renderAddColumnButton,
        renderAddColumnForm: config?.renderAddColumnForm,
        renderEditColumnForm: config?.renderEditColumnForm,
        estimatedCardHeight: kanban.config.estimatedCardHeight,
        virtualOverscan: kanban.config.virtualOverscan,
        columnWidth: kanban.config.columnWidth,
        columnMinHeight: kanban.config.columnMinHeight,
        onCardClick: config?.onCardClick ?? ((card) => kanban.setViewingCardId(card.id)),
        onColumnClick: config?.onColumnClick,
        onEdit: kanban.config.allowEdit ? kanban.setEditingCardId : undefined,
        onEditColumn: (column) => kanban.setEditingColumnId(column.id),
        renderCardView: config?.renderCardView,
        allowAdd: kanban.config.allowAdd,
        allowColumnAdd: kanban.config.allowColumnAdd,
        allowColumnEdit: kanban.config.allowColumnEdit,
        allowColumnDelete: kanban.config.allowColumnDelete,
        allowColumnReorder: kanban.config.allowColumnReorder,
        allowFilters: kanban.config.allowFilters,
    };
    /**
     * Custom collision detection strategy optimized for multiple containers
     * Based on official dnd-kit MultipleContainers example
     */
    const customCollisionDetection = (args) => {
        const activeId = args.active.id;
        const isDraggingCard = activeId && !kanban.columnOrder.includes(activeId);
        // If dragging a column, use closestCenter (snappier for horizontal reordering)
        if (!isDraggingCard) {
            return closestCenter(args);
        }
        // 1. Explicit check for New Column target - HIGH PRIORITY
        const pointerCollisions = pointerWithin(args);
        if (activeId && pointerCollisions.length > 0) {
            const newColumnCollision = pointerCollisions.find(c => c.id === 'new-column-drop-target');
            if (newColumnCollision) {
                return [newColumnCollision];
            }
        }
        // 2. Dragging a card - use multi-container strategy
        // Find intersecting containers with the active draggable rect
        const intersections = pointerCollisions.length > 0
            ? pointerCollisions
            : rectIntersection(args);
        let overId = getFirstCollision(intersections, 'id');
        if (overId != null) {
            // If we found a container (column), get the closest item within it
            if (kanban.columnOrder.includes(overId)) {
                const column = kanban.columns[overId];
                if (column && column.cardIds.length > 0) {
                    // Return the closest droppable within that container
                    const containerItems = args.droppableContainers.filter((container) => container.id !== overId && column.cardIds.includes(container.id));
                    if (containerItems.length > 0) {
                        const closest = closestCenter({
                            ...args,
                            droppableContainers: containerItems,
                        });
                        overId = closest[0]?.id ?? overId;
                    }
                }
            }
            lastOverId.current = overId;
            return [{ id: overId }];
        }
        // 4. Fallback to normal collision detection
        const collisions = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => container.id !== activeId)
        });
        if (collisions.length > 0) {
            lastOverId.current = collisions[0].id;
            return collisions;
        }
        if (recentlyMovedToNewContainer.current) {
            lastOverId.current = activeId;
        }
        // If no droppable is matched, return the last match
        return lastOverId.current ? [{ id: lastOverId.current }] : [];
    };
    return (_jsx(DndContext, { sensors: dnd.sensors, collisionDetection: customCollisionDetection, measuring: {
            droppable: {
                strategy: MeasuringStrategy.Always,
            },
        }, onDragStart: dnd.handleDragStart, onDragOver: dnd.handleDragOver, onDragEnd: dnd.handleDragEnd, children: _jsxs("div", { className: "flex flex-col h-full bg-slate-50 relative group/board overflow-hidden", children: [kanban.config.allowFilters && (_jsx("div", { className: "absolute top-4 right-6 z-30 pointer-events-none", children: _jsx("div", { className: "pointer-events-auto transition-all duration-300 translate-y-[-10px] opacity-0 group-hover/board:translate-y-0 group-hover/board:opacity-100", children: _jsx(KanbanFilterDrawer, {}) }) })), kanban.config.allowFilters && _jsx(FilterChips, {}), _jsx("div", { ref: parentRef, className: "flex-1 overflow-x-auto overflow-y-hidden", children: _jsxs("div", { style: {
                            width: `${columnVirtualizer.getTotalSize() + (kanban.config.allowColumnAdd ? 200 : 0)}px`,
                            height: '100%',
                            position: 'relative',
                        }, children: [_jsx(SortableContext, { items: kanban.columnOrder, strategy: horizontalListSortingStrategy, children: columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                                    const columnId = kanban.columnOrder[virtualColumn.index];
                                    return (_jsx(SortableVirtualColumn, { id: columnId, start: virtualColumn.start, width: kanban.config.columnWidth, allowReorder: kanban.config.allowColumnReorder, cardIds: filteredData.columns[columnId]?.cardIds ?? [], children: _jsx(KanbanColumn, { column: filteredData.columns[columnId], allCards: filteredData.cards, activeId: kanban.activeId, overId: kanban.overId, overSide: kanban.overSide, config: finalConfig, isActiveColumnDragging: kanban.activeId ? kanban.columnOrder.includes(kanban.activeId) : false }) }, columnId));
                                }) }), kanban.config.allowColumnAdd && (_jsx(DroppableNewColumnButton, { children: (isOver, setNodeRef) => (_jsx("div", { ref: setNodeRef, className: "h-full z-10", style: {
                                        position: 'absolute',
                                        top: 0,
                                        left: `${columnVirtualizer.getTotalSize()}px`,
                                        width: kanban.config.columnWidth,
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        paddingRight: kanban.config.gap
                                    }, children: config?.renderAddColumnButton ? (config.renderAddColumnButton({ onClick: () => kanban.addColumn({ title: 'Nova Coluna' }) })) : (_jsxs("button", { onClick: () => kanban.addColumn({ title: 'Nova Coluna' }), className: cn("flex items-center gap-2 w-full p-4 bg-slate-100/50 hover:bg-slate-200 text-slate-600 rounded-lg border-2 border-dashed transition-all font-semibold h-[200px] justify-center", isOver ? "bg-blue-100 border-blue-400 text-blue-600 scale-[1.02] shadow-lg ring-4 ring-blue-500/20" : "border-slate-300"), children: [_jsx(Plus, { size: 20 }), isOver ? 'Soltar para criar' : 'Nova Coluna'] })) })) }))] }) }), kanban.editingCardId && kanban.config.allowEdit && ((() => {
                    const editingCard = kanban.cards[kanban.editingCardId];
                    if (!editingCard)
                        return null;
                    return config?.renderEditForm ? (config.renderEditForm({
                        card: editingCard,
                        onSave: (updates) => {
                            kanban.updateCard(kanban.editingCardId, updates);
                            kanban.clearEditingCardId();
                        },
                        onCancel: kanban.clearEditingCardId,
                        onDelete: () => {
                            kanban.deleteCard(kanban.editingCardId);
                            kanban.clearEditingCardId();
                        }
                    })) : (_jsx(DefaultEditForm, { card: editingCard, onSave: (updates) => {
                            kanban.updateCard(kanban.editingCardId, updates);
                            kanban.clearEditingCardId();
                        }, onCancel: kanban.clearEditingCardId, onDelete: () => {
                            kanban.deleteCard(kanban.editingCardId);
                            kanban.clearEditingCardId();
                        } }));
                })()), kanban.addingCardInColumnId && kanban.config.allowAdd && (config?.renderAddForm ? (config.renderAddForm({
                    columnId: kanban.addingCardInColumnId,
                    onAdd: (data) => {
                        kanban.addCard(kanban.addingCardInColumnId, data);
                        kanban.clearAddingCardInColumnId();
                    },
                    onCancel: kanban.clearAddingCardInColumnId
                })) : (_jsx(DefaultAddCardForm, { columnId: kanban.addingCardInColumnId, onAdd: (data) => {
                        kanban.addCard(kanban.addingCardInColumnId, data);
                        kanban.clearAddingCardInColumnId();
                    }, onCancel: kanban.clearAddingCardInColumnId }))), editingColumn && kanban.config.allowColumnEdit && (config?.renderEditColumnForm ? (config.renderEditColumnForm({
                    column: editingColumn,
                    onSave: (updates) => {
                        kanban.updateColumn(editingColumn.id, updates);
                        kanban.clearEditingColumnId();
                    },
                    onCancel: kanban.clearEditingColumnId,
                    onDelete: kanban.config.allowColumnDelete ? () => {
                        kanban.deleteColumn(editingColumn.id);
                        kanban.clearEditingColumnId();
                    } : undefined
                })) : (_jsx(DefaultEditColumnForm, { column: editingColumn, onSave: (updates) => {
                        kanban.updateColumn(editingColumn.id, updates);
                        kanban.clearEditingColumnId();
                    }, onCancel: kanban.clearEditingColumnId, onDelete: kanban.config.allowColumnDelete ? () => {
                        kanban.deleteColumn(editingColumn.id);
                        kanban.clearEditingColumnId();
                    } : undefined }))), viewingCard && (finalConfig.renderCardView ? (finalConfig.renderCardView({
                    card: viewingCard,
                    onClose: kanban.clearViewingCardId
                })) : (_jsx(DefaultCardView, { card: viewingCard, onClose: kanban.clearViewingCardId }))), _jsxs(DragOverlay, { dropAnimation: null, children: [activeCard && (_jsx("div", { className: "z-50 cursor-grabbing animate-tilt shadow-2xl rounded-card overflow-hidden", children: finalConfig.renderCard({
                                card: activeCard,
                                isDragging: true
                            }) })), activeColumn ? (_jsx(KanbanColumn, { column: activeColumn, allCards: kanban.cards, activeId: null, overId: null, overSide: null, config: finalConfig, isDragging: false, isOverlay: true, dragHandleProps: {
                                attributes: {},
                                listeners: {}
                            } })) : null] })] }) }));
}
