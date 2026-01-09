import type { KanboomCard, KanboomColumn, KanboomConfig } from '../types/kanban';
interface KanbanColumnProps<TCard = KanboomCard, TColumn = KanboomColumn> {
    column: TColumn;
    allCards: Record<string, TCard>;
    activeId: string | null;
    overId: string | null;
    overSide: 'top' | 'bottom' | 'left' | 'right' | null;
    config: Required<Pick<KanboomConfig<TCard, TColumn>, 'renderCard' | 'renderColumnHeader' | 'renderColumnEmpty' | 'estimatedCardHeight' | 'virtualOverscan' | 'columnWidth' | 'columnMinHeight'>> & Pick<KanboomConfig<TCard, TColumn>, 'onCardClick' | 'onEditCard' | 'onColumnClick' | 'onEditColumn' | 'renderAddButton' | 'renderAddForm' | 'renderEditForm' | 'allowAdd' | 'allowEdit' | 'allowColumnEdit'>;
    dragHandleProps?: {
        attributes: any;
        listeners: any;
    };
    isActiveColumnDragging?: boolean;
    isDragging?: boolean;
    isOverlay?: boolean;
}
export declare const KanbanColumn: <TCard extends {
    id: string;
}, TColumn extends {
    id: string;
    title: string;
}>(props: KanbanColumnProps<TCard, TColumn>) => React.ReactElement;
export {};
//# sourceMappingURL=kanban-column.d.ts.map