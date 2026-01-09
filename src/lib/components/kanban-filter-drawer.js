import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from '@/components/ui/sheet';
import { useKanbanStore } from '@/lib/store/use-kanban-store';
import { Filter, Plus } from 'lucide-react';
import { FilterGroup } from './filter-group';
import { discoverFields } from '../utils/data-discovery';
import { useMemo } from 'react';
export function KanbanFilterDrawer() {
    const { filters, addFilterGroup, cards } = useKanbanStore();
    const availableFields = useMemo(() => discoverFields(cards), [cards]);
    const handleAddGroup = () => {
        const newGroup = {
            id: crypto.randomUUID(),
            conjunction: 'and',
            rules: [],
            enabled: true
        };
        addFilterGroup(newGroup);
    };
    return (_jsxs(Sheet, { children: [_jsx(SheetTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 text-slate-600 bg-white hover:bg-slate-50 border-slate-200 shadow-sm", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filtros", filters.groups.length > 0 && (_jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm", children: filters.groups.length }))] }) }), _jsxs(SheetContent, { className: "w-full sm:w-[600px] sm:max-w-none overflow-y-auto bg-white/95 backdrop-blur-sm border-l shadow-2xl", children: [_jsx(SheetHeader, { className: "pb-6 border-b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(SheetTitle, { className: "text-xl font-bold text-slate-800", children: "Filtros Avan\u00E7ados" }), _jsx(SheetDescription, { className: "text-sm text-slate-500", children: "Crie combina\u00E7\u00F5es de filtros para refinar sua visualiza\u00E7\u00E3o do board." })] }), filters.groups.length > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: useKanbanStore.getState().clearFilters, className: "text-xs font-bold text-slate-400 hover:text-destructive h-8", children: "Limpar Tudo" }))] }) }), _jsxs("div", { className: "mt-8 space-y-6", children: [filters.groups.length === 0 ? (_jsxs("div", { className: "text-center py-12 px-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl space-y-2", children: [_jsx(Filter, { className: "mx-auto h-8 w-8 text-slate-300" }), _jsx("p", { className: "text-slate-600 font-medium", children: "Nenhum filtro ativo." }), _jsx("p", { className: "text-xs text-slate-400", children: "Adicione um grupo para come\u00E7ar a filtrar seus itens." })] })) : (_jsx("div", { className: "space-y-6", children: filters.groups.map(group => (_jsx(FilterGroup, { group: group, availableFields: availableFields }, group.id))) })), _jsxs(Button, { onClick: handleAddGroup, className: "w-full", variant: "outline", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Adicionar Grupo de Filtros"] })] })] })] }));
}
