import type { ColumnHeaderRenderProps } from '@/lib/types/kanban';
import { cn } from '@/lib/utils/cn';
import { GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import { memo } from 'react';

export const DefaultColumnHeader = memo(<TColumn extends { id: string; title: string }>(
  { column, cardCount, isOver, dragHandleProps, onAddCard, onEditColumn }: ColumnHeaderRenderProps<TColumn>
) => {
  return (
    <div className={cn(
      "px-3 py-3 flex items-center justify-between transition-colors mb-2 rounded-t-xl select-none group/header",
      isOver ? "bg-blue-50/80" : "bg-transparent"
    )}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {dragHandleProps && (
          <div
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-200/50 transition-colors"
          >
            <GripVertical size={14} />
          </div>
        )}
        <h3 className="font-semibold text-sm text-slate-700 truncate tracking-tight flex-1">
          {column.title}
        </h3>
        <span className="text-[10px] bg-slate-200/50 border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 font-bold tabular-nums">
          {cardCount}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
        {onAddCard && (
          <button
            onClick={onAddCard}
            className="p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Adicionar Card"
          >
            <Plus size={14} />
          </button>
        )}
        {onEditColumn && (
          <button
            onClick={onEditColumn}
            className="p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Editar Coluna"
          >
            <MoreHorizontal size={14} />
          </button>
        )}
      </div>
    </div>
  );
});

DefaultColumnHeader.displayName = 'DefaultColumnHeader';