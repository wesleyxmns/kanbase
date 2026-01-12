import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { memo } from 'react';
import { useKanbanColumn } from '../hooks/use-kanban-column';
import { useKanbanStore } from '../store/use-kanban-store';
import { cn } from '../utils/cn';
import { AddCardButton } from './add-card-button';
import { KanbanCard } from './kanban-card';
function KanbanColumnInner({ column, allCards, activeId, overId, overSide, config, dragHandleProps, isActiveColumnDragging, isDragging, isOverlay }) {
    const columnData = column;
    const { setAddingCardInColumnId, setEditingColumnId } = useKanbanStore();
    const { parentRef, rowVirtualizer } = useKanbanColumn({
        cardIds: columnData.cardIds,
        estimatedCardHeight: config.estimatedCardHeight,
        overscan: config.virtualOverscan
    });
    // isOver is now managed by the parent SortableVirtualColumn
    const isColumnOver = overId === columnData.id;
    const handleColumnClick = (e) => {
        e.stopPropagation();
        if (config.onColumnClick) {
            config.onColumnClick(column);
        }
        else if (config.allowColumnEdit) {
            config.onEditColumn?.(column); // Custom handler
            // or open default modal if no custom handler? 
            // Current design prefers Store control for default modals.
            // We'll also set Store ID for default behavior compatibility if no custom handler prevents it.
            setEditingColumnId(columnData.id);
        }
    };
    return (_jsxs("div", { onClick: handleColumnClick, style: {
            width: config.columnWidth,
            maxHeight: '100%',
            boxSizing: 'border-box'
        }, className: cn("flex flex-col group/column bg-column-bg rounded-column transition-all relative select-none h-fit max-h-full", "duration-250 ease-[cubic-bezier(0.18,0.67,0.6,1.22)]", // Spring-like transition
        isColumnOver && "bg-blue-50/50 ring-1 ring-blue-300 shadow-sm", isActiveColumnDragging && !isDragging && !isOverlay && "scale-[0.98] border border-slate-200 border-dashed opacity-50", // Other columns
        isDragging && !isOverlay && "opacity-20", // Placeholder
        isOverlay && "bg-slate-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] scale-[1.02] z-50 cursor-grabbing ring-1 ring-slate-300" // Overlay
        ), children: [overId === columnData.id && overSide === 'left' && (_jsx("div", { className: "absolute top-0 bottom-0 -left-[4px] w-[4px] bg-blue-500 rounded-full z-20 pointer-events-none shadow-sm" })), overId === columnData.id && overSide === 'right' && (_jsx("div", { className: "absolute top-0 bottom-0 -right-[4px] w-[4px] bg-blue-500 rounded-full z-20 pointer-events-none shadow-sm" })), _jsx("div", { onClick: (e) => e.stopPropagation(), children: config.renderColumnHeader({
                    column,
                    cardCount: columnData.cardIds.length,
                    isOver: isColumnOver,
                    dragHandleProps,
                    onAddCard: config.allowAdd ? () => setAddingCardInColumnId(columnData.id) : undefined,
                    onEditColumn: config.allowColumnEdit ? () => setEditingColumnId(columnData.id) : undefined
                }) }), _jsx("div", { className: cn("flex-1 flex flex-col min-h-0 transition-colors duration-200", isColumnOver && "bg-blue-50/30"), style: { minHeight: config.columnMinHeight }, children: columnData.cardIds.length === 0 ? (
                // Empty column - simple area with parentRef for eventual virtualizer stability
                _jsx("div", { ref: parentRef, className: cn("flex-1 px-3 pb-2 flex items-center justify-center border-2 border-dashed border-transparent rounded-b-lg transition-colors", isColumnOver && "border-blue-300"), children: _jsx("div", { className: "pointer-events-none select-none opacity-50", children: config.renderColumnEmpty({}) }) })) : (
                // Column with cards - use SortableContext for reordering
                _jsx(SortableContext, { items: columnData.cardIds, strategy: verticalListSortingStrategy, children: _jsx("div", { ref: parentRef, className: "flex-1 overflow-y-auto px-3 pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent", style: { minHeight: config.columnMinHeight }, children: _jsx("div", { style: {
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }, children: rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const cardId = columnData.cardIds[virtualRow.index];
                                const card = allCards[cardId];
                                if (!card)
                                    return null;
                                const isActive = cardId === activeId;
                                return (_jsx("div", { "data-index": virtualRow.index, "data-card-id": cardId, style: {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }, children: _jsx(KanbanCard, { card: card, isDragging: isActive, renderCard: config.renderCard, onClick: config.onCardClick, onEdit: config.onEditCard, allowEdit: config.allowEdit, index: virtualRow.index, columnId: columnData.id, overId: overId, overSide: overSide }) }, cardId));
                            }) }) }) })) }), config.allowAdd && (_jsx("div", { className: "p-3 border-t border-slate-200 shrink-0 relative z-20", onClick: (e) => e.stopPropagation(), children: config.renderAddButton ? (config.renderAddButton({
                    columnId: columnData.id,
                    onClick: () => setAddingCardInColumnId(columnData.id)
                })) : (_jsx(AddCardButton, { onClick: () => setAddingCardInColumnId(columnData.id) })) }))] }));
}
export const KanbanColumn = memo(KanbanColumnInner);
