import { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CardRenderProps } from '../types/kanban';

interface KanbanCardProps<TCard> {
  card: TCard;
  isDragging: boolean;
  renderCard: (props: CardRenderProps<TCard>) => React.ReactNode;
  onClick?: (card: TCard) => void;
  onEdit?: (card: TCard) => void;
  allowEdit?: boolean;
  index: number;
  columnId: string;
  overId: string | null;
  overSide: 'top' | 'bottom' | 'left' | 'right' | null;
}

// Lightweight sortable wrapper - only this re-renders during drag
function KanbanCardInner<TCard extends { id: string }>({
  card,
  renderCard,
  onClick,
  onEdit,
  allowEdit,
  index,
  columnId,
  overId,
  overSide
}: KanbanCardProps<TCard>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
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
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClick) {
        onClick(card);
      } else if (allowEdit) {
        onEdit?.(card);
      }
    };
  }, [onClick, onEdit, allowEdit, card]);

  // Render card content - memoized by DefaultCard component
  const cardContent = useMemo(
    () => renderCard({ card, isDragging: isSortableDragging }),
    [card, renderCard, isSortableDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="relative cursor-grab active:cursor-grabbing touch-none group"
    >
      {overId === card.id && overSide === 'top' && (
        <div className="absolute -top-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" />
      )}

      {cardContent}

      {overId === card.id && overSide === 'bottom' && (
        <div className="absolute -bottom-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" />
      )}
    </div>
  );
}

export const KanbanCard = memo(KanbanCardInner, (prevProps, nextProps) => {
  return (
    prevProps.card === nextProps.card &&
    prevProps.index === nextProps.index &&
    prevProps.columnId === nextProps.columnId &&
    prevProps.overId === nextProps.overId &&
    prevProps.overSide === nextProps.overSide
  );
}) as <TCard extends { id: string }>(props: KanbanCardProps<TCard>) => React.ReactElement;