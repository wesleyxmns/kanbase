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
export declare const KanbanCard: <TCard extends {
    id: string;
}>(props: KanbanCardProps<TCard>) => React.ReactElement;
export {};
//# sourceMappingURL=kanban-card.d.ts.map