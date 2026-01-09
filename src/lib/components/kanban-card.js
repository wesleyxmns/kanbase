import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Lightweight sortable wrapper - only this re-renders during drag
function KanbanCardInner({ card, renderCard, onClick, onEdit, allowEdit, index, columnId, overId, overSide }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
            index,
            columnId
        }
    });
    const style = useMemo(() => ({
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.4 : 1,
    }), [transform, transition, isSortableDragging]);
    const handleClick = useMemo(() => {
        return (e) => {
            e.stopPropagation();
            if (onClick) {
                onClick(card);
            }
            else if (allowEdit) {
                onEdit?.(card);
            }
        };
    }, [onClick, onEdit, allowEdit, card]);
    // Render card content - memoized by DefaultCard component
    const cardContent = useMemo(() => renderCard({ card, isDragging: isSortableDragging }), [card, renderCard, isSortableDragging]);
    return (_jsxs("div", { ref: setNodeRef, style: style, ...attributes, ...listeners, onClick: handleClick, className: "relative cursor-grab active:cursor-grabbing touch-none group", children: [overId === card.id && overSide === 'top' && (_jsx("div", { className: "absolute -top-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" })), cardContent, overId === card.id && overSide === 'bottom' && (_jsx("div", { className: "absolute -bottom-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" }))] }));
}
export const KanbanCard = memo(KanbanCardInner, (prevProps, nextProps) => {
    return (prevProps.card === nextProps.card &&
        prevProps.index === nextProps.index &&
        prevProps.columnId === nextProps.columnId &&
        prevProps.overId === nextProps.overId &&
        prevProps.overSide === nextProps.overSide);
});
