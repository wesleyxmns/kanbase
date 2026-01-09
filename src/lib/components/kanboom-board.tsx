import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useDroppable
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Plus } from 'lucide-react';
import { cloneElement, isValidElement, memo, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils/utils';
import { useKanban } from '../hooks/use-kanban';
import { CSS } from '@dnd-kit/utilities';
import { useKanbanDnd } from '../hooks/use-kanban-dnd';
import type { KanboomCard, KanboomColumn, KanboomConfig } from '../types/kanban';
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
const DroppableNewColumnButton = memo(({
  children
}: {
  children: (isOver: boolean, setNodeRef: (element: HTMLElement | null) => void) => React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'new-column-drop-target',
    data: { type: 'NewColumn' }
  });

  return (
    <>
      {children(isOver, setNodeRef)}
    </>
  );
});

// Sortable Wrapper for Virtual Column
const SortableVirtualColumn = memo(({
  id,
  start,
  width,
  children,
  allowReorder,
  cardIds
}: {
  id: string,
  start: number,
  width: number,
  children: React.ReactNode,
  allowReorder: boolean,
  cardIds: string[]
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id,
    disabled: !allowReorder,
    data: {
      type: 'Column',
      children: cardIds  // CRITICAL: Pass card IDs for collision detection
    }
  });

  const style = {
    position: 'absolute' as const,
    top: 0,
    left: `${start}px`, // Virtual positioning via left, NOT transform
    width: `${width}px`,
    transition: transition || 'transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)',
    // Transform is now ONLY for dnd-kit's sorting logic
    transform: transform && !isSortableDragging
      ? CSS.Transform.toString(transform)
      : undefined,
    zIndex: isSortableDragging ? 50 : undefined,
    pointerEvents: (isSortableDragging ? 'none' : undefined) as React.CSSProperties['pointerEvents'],
    animation: isSortableDragging ? 'tilt 0.2s ease-in-out forwards' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {isValidElement(children) ? (
        cloneElement(children as any, {
          dragHandleProps: allowReorder ? { attributes, listeners } : undefined,
          isDragging: isSortableDragging
        })
      ) : children}
    </div>
  );
});

interface KanboomBoardProps<TCard extends { id: string } = KanboomCard, TColumn extends { id: string; title: string } = KanboomColumn> {
  config?: KanboomConfig<TCard, TColumn>;
}

export function KanboomBoard<TCard extends { id: string } = KanboomCard, TColumn extends { id: string; title: string } = KanboomColumn>({
  config
}: KanboomBoardProps<TCard, TColumn>) {
  const kanban = useKanban<TCard, TColumn>(config);
  const parentRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: kanban.columnOrder.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => kanban.config.columnWidth + kanban.config.gap,
    overscan: 5,
  });

  // Filter cards and columns
  const filteredData = useMemo(() => {
    const filteredCards: Record<string, KanboomCard> = {};

    // 1. Filter cards
    Object.values(kanban.cards).forEach(card => {
      if (evaluateFilter(card, kanban.filters)) {
        filteredCards[card.id] = card;
      }
    });

    // 2. Filter card IDs inside columns
    const filteredColumns: Record<string, KanboomColumn> = {};
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
  const lastOverId = useRef<string | null>(null);
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
    onDragStart: (id: string, _type: 'Card' | 'Column') => {
      kanban.handleDragStart(id);
    },
    onDragOver: kanban.handleDragOver,
    onDragEnd: kanban.handleDragEnd,
    onCardMove: kanban.moveCard,
    onColumnMove: kanban.moveColumn,
    onCreateColumnWithCard: (cardId: string, sourceColumnId: string) => {
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
    renderCard: config?.renderCard ?? ((props: any) => <DefaultCard {...props} />),
    renderColumnHeader: config?.renderColumnHeader ?? ((props: any) => <DefaultColumnHeader {...props} />),
    renderColumnEmpty: config?.renderColumnEmpty ?? (() => <DefaultColumnEmpty />),
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
    onCardClick: config?.onCardClick ?? ((card: TCard) => kanban.setViewingCardId(card.id)),
    onColumnClick: config?.onColumnClick,
    onEdit: kanban.config.allowEdit ? kanban.setEditingCardId : undefined,
    onEditColumn: (column: TColumn) => kanban.setEditingColumnId((column as any).id),
    renderCardView: config?.renderCardView,
    allowAdd: kanban.config.allowAdd,
    allowColumnAdd: kanban.config.allowColumnAdd,
    allowColumnEdit: kanban.config.allowColumnEdit,
    allowColumnDelete: kanban.config.allowColumnDelete,
    allowColumnReorder: kanban.config.allowColumnReorder,
    allowFilters: (kanban.config as any).allowFilters,
  };

  /**
   * Custom collision detection strategy optimized for multiple containers
   * Based on official dnd-kit MultipleContainers example
   */
  const customCollisionDetection = (args: any) => {
    const activeId = args.active.id;
    const isDraggingCard = activeId && !kanban.columnOrder.includes(activeId as string);

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
      if (kanban.columnOrder.includes(overId as string)) {
        const column = kanban.columns[overId as string];
        if (column && column.cardIds.length > 0) {
          // Return the closest droppable within that container
          const containerItems = args.droppableContainers.filter(
            (container: any) =>
              container.id !== overId && column.cardIds.includes(container.id)
          );
          if (containerItems.length > 0) {
            const closest = closestCenter({
              ...args,
              droppableContainers: containerItems,
            });
            overId = closest[0]?.id ?? overId;
          }
        }
      }

      lastOverId.current = overId as string;
      return [{ id: overId }];
    }


    // 4. Fallback to normal collision detection
    const collisions = closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container: any) => container.id !== activeId
      )
    });

    if (collisions.length > 0) {
      lastOverId.current = collisions[0].id as string;
      return collisions;
    }

    if (recentlyMovedToNewContainer.current) {
      lastOverId.current = activeId as string;
    }

    // If no droppable is matched, return the last match
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  };

  return (
    <DndContext
      sensors={dnd.sensors}
      collisionDetection={customCollisionDetection}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={dnd.handleDragStart}
      onDragOver={dnd.handleDragOver}
      onDragEnd={dnd.handleDragEnd}
    >
      <div className="flex flex-col h-full bg-slate-50 relative group/board overflow-hidden">
        {/* Floating Controls */}
        {kanban.config.allowFilters && (
          <div className="absolute top-4 right-6 z-30 pointer-events-none">
            <div className="pointer-events-auto transition-all duration-300 translate-y-[-10px] opacity-0 group-hover/board:translate-y-0 group-hover/board:opacity-100">
              <KanbanFilterDrawer />
            </div>
          </div>
        )}

        {kanban.config.allowFilters && <FilterChips />}

        <div
          ref={parentRef}
          className="flex-1 overflow-x-auto overflow-y-hidden"
        >

          <div
            style={{
              width: `${columnVirtualizer.getTotalSize() + (kanban.config.allowColumnAdd ? 200 : 0)}px`,
              height: '100%',
              position: 'relative',
            }}
          >
            <SortableContext items={kanban.columnOrder} strategy={horizontalListSortingStrategy}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                const columnId = kanban.columnOrder[virtualColumn.index];
                return (
                  <SortableVirtualColumn
                    key={columnId}
                    id={columnId}
                    start={virtualColumn.start}
                    width={kanban.config.columnWidth}
                    allowReorder={kanban.config.allowColumnReorder}
                    cardIds={filteredData.columns[columnId]?.cardIds ?? []}
                  >
                    <KanbanColumn<TCard, TColumn>
                      column={filteredData.columns[columnId] as unknown as TColumn}
                      allCards={filteredData.cards as unknown as Record<string, TCard>}
                      activeId={kanban.activeId}
                      overId={kanban.overId}
                      overSide={kanban.overSide}
                      config={finalConfig as any}
                      isActiveColumnDragging={kanban.activeId ? kanban.columnOrder.includes(kanban.activeId) : false}
                    />
                  </SortableVirtualColumn>
                );
              })}
            </SortableContext>

            {/* Add Column Section at the end */}
            {kanban.config.allowColumnAdd && (
              <DroppableNewColumnButton>
                {(isOver, setNodeRef) => (
                  <div
                    ref={setNodeRef}
                    className="h-full z-10"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `${columnVirtualizer.getTotalSize()}px`,
                      width: kanban.config.columnWidth,
                      height: '100%',
                      boxSizing: 'border-box',
                      paddingRight: kanban.config.gap
                    }}
                  >
                    {config?.renderAddColumnButton ? (
                      config.renderAddColumnButton({ onClick: () => kanban.addColumn({ title: 'Nova Coluna' }) })
                    ) : (
                      <button
                        onClick={() => kanban.addColumn({ title: 'Nova Coluna' })}
                        className={cn(
                          "flex items-center gap-2 w-full p-4 bg-slate-100/50 hover:bg-slate-200 text-slate-600 rounded-lg border-2 border-dashed transition-all font-semibold h-[200px] justify-center",
                          isOver ? "bg-blue-100 border-blue-400 text-blue-600 scale-[1.02] shadow-lg ring-4 ring-blue-500/20" : "border-slate-300"
                        )}
                      >
                        <Plus size={20} />
                        {isOver ? 'Soltar para criar' : 'Nova Coluna'}
                      </button>
                    )}
                  </div>
                )}
              </DroppableNewColumnButton>
            )}
          </div>
        </div>

        {/* Editing Card Form */}
        {kanban.editingCardId && kanban.config.allowEdit && (
          (() => {
            const editingCard = kanban.cards[kanban.editingCardId!];
            if (!editingCard) return null;

            return config?.renderEditForm ? (
              config.renderEditForm({
                card: editingCard as unknown as TCard,
                onSave: (updates) => {
                  kanban.updateCard(kanban.editingCardId!, updates);
                  kanban.clearEditingCardId();
                },
                onCancel: kanban.clearEditingCardId,
                onDelete: () => {
                  kanban.deleteCard(kanban.editingCardId!);
                  kanban.clearEditingCardId();
                }
              })
            ) : (
              <DefaultEditForm
                card={editingCard}
                onSave={(updates) => {
                  kanban.updateCard(kanban.editingCardId!, updates);
                  kanban.clearEditingCardId();
                }}
                onCancel={kanban.clearEditingCardId}
                onDelete={() => {
                  kanban.deleteCard(kanban.editingCardId!);
                  kanban.clearEditingCardId();
                }}
              />
            );
          })()
        )}

        {/* Add Card Modal */}
        {kanban.addingCardInColumnId && kanban.config.allowAdd && (
          config?.renderAddForm ? (
            config.renderAddForm({
              columnId: kanban.addingCardInColumnId,
              onAdd: (data) => {
                kanban.addCard(kanban.addingCardInColumnId!, data as any);
                kanban.clearAddingCardInColumnId();
              },
              onCancel: kanban.clearAddingCardInColumnId
            })
          ) : (
            <DefaultAddCardForm
              columnId={kanban.addingCardInColumnId}
              onAdd={(data) => {
                kanban.addCard(kanban.addingCardInColumnId!, data);
                kanban.clearAddingCardInColumnId();
              }}
              onCancel={kanban.clearAddingCardInColumnId}
            />
          )
        )}

        {/* Editing Column Form */}
        {editingColumn && kanban.config.allowColumnEdit && (
          config?.renderEditColumnForm ? (
            config.renderEditColumnForm({
              column: editingColumn as unknown as TColumn,
              onSave: (updates) => {
                kanban.updateColumn((editingColumn as any).id, updates);
                kanban.clearEditingColumnId();
              },
              onCancel: kanban.clearEditingColumnId,
              onDelete: kanban.config.allowColumnDelete ? () => {
                kanban.deleteColumn((editingColumn as any).id);
                kanban.clearEditingColumnId();
              } : undefined
            })
          ) : (
            <DefaultEditColumnForm
              column={editingColumn}
              onSave={(updates) => {
                kanban.updateColumn((editingColumn as any).id, updates);
                kanban.clearEditingColumnId();
              }}
              onCancel={kanban.clearEditingColumnId}
              onDelete={kanban.config.allowColumnDelete ? () => {
                kanban.deleteColumn((editingColumn as any).id);
                kanban.clearEditingColumnId();
              } : undefined}
            />
          )
        )}
        {/* Card View Modal */}
        {viewingCard && (
          finalConfig.renderCardView ? (
            finalConfig.renderCardView({
              card: viewingCard as unknown as TCard,
              onClose: kanban.clearViewingCardId
            })
          ) : (
            <DefaultCardView
              card={viewingCard as unknown as KanboomCard}
              onClose={kanban.clearViewingCardId}
            />
          )
        )}

        <DragOverlay dropAnimation={null}>
          {activeCard && (
            <div className="z-50 cursor-grabbing animate-tilt shadow-2xl rounded-card overflow-hidden">
              {finalConfig.renderCard({
                card: activeCard as unknown as TCard,
                isDragging: true
              })}
            </div>
          )}
          {activeColumn ? (
            <KanbanColumn<TCard, TColumn>
              column={activeColumn as unknown as TColumn}
              allCards={kanban.cards as unknown as Record<string, TCard>}
              activeId={null}
              overId={null}
              overSide={null}
              config={finalConfig as any}
              isDragging={false}
              isOverlay={true}
              dragHandleProps={{
                attributes: {},
                listeners: {}
              }}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}