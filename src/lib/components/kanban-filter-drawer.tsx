import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useKanbanStore } from '@/lib/store/use-kanban-store';
import type { FilterGroup as FilterGroupType } from '@/lib/types/kanban';
import { Filter, Plus } from 'lucide-react';
import { FilterGroup } from './filter-group';
import { discoverFields } from '../utils/data-discovery';
import { useMemo } from 'react';

export function KanbanFilterDrawer() {
  const { filters, addFilterGroup, cards } = useKanbanStore();

  const availableFields = useMemo(() => discoverFields(cards), [cards]);

  const handleAddGroup = () => {
    const newGroup: FilterGroupType = {
      id: crypto.randomUUID(),
      conjunction: 'and',
      rules: [],
      enabled: true
    };
    addFilterGroup(newGroup);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-slate-600 bg-white hover:bg-slate-50 border-slate-200 shadow-sm">
          <Filter className="h-4 w-4" />
          Filtros
          {filters.groups.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm">
              {filters.groups.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[600px] sm:max-w-none overflow-y-auto bg-white/95 backdrop-blur-sm border-l shadow-2xl">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold text-slate-800">Filtros Avançados</SheetTitle>
              <SheetDescription className="text-sm text-slate-500">
                Crie combinações de filtros para refinar sua visualização do board.
              </SheetDescription>
            </div>
            {filters.groups.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={useKanbanStore.getState().clearFilters}
                className="text-xs font-bold text-slate-400 hover:text-destructive h-8"
              >
                Limpar Tudo
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {filters.groups.length === 0 ? (
            <div className="text-center py-12 px-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
              <Filter className="mx-auto h-8 w-8 text-slate-300" />
              <p className="text-slate-600 font-medium">Nenhum filtro ativo.</p>
              <p className="text-xs text-slate-400">Adicione um grupo para começar a filtrar seus itens.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filters.groups.map(group => (
                <FilterGroup
                  key={group.id}
                  group={group}
                  availableFields={availableFields}
                />
              ))}
            </div>
          )}

          <Button onClick={handleAddGroup} className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Grupo de Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
