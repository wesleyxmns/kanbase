import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useKanbanStore } from '@/lib/store/use-kanban-store';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
export function FilterChips() {
    const { filters, removeFilterRule, clearFilters } = useKanbanStore();
    const activeRules = filters.groups.flatMap(group => group.rules
        .filter(rule => !('conjunction' in rule) && rule.enabled)
        .map(rule => ({ groupId: group.id, rule: rule })));
    if (activeRules.length === 0 && !filters.searchQuery)
        return null;
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2 px-4 py-2 bg-slate-50/50 border-b min-h-[48px] animate-in fade-in slide-in-from-top-1 duration-300", children: [_jsxs("div", { className: "flex items-center gap-1.5 mr-2", children: [_jsx("div", { className: "h-2 w-2 rounded-full bg-primary animate-pulse" }), _jsx("span", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-tight", children: "Filtros Ativos:" })] }), filters.searchQuery && (_jsxs("div", { className: "flex items-center gap-1 bg-white border border-primary/20 rounded-full px-3 py-1 text-[11px] shadow-sm", children: [_jsx("span", { className: "text-slate-500", children: "Busca:" }), _jsx("span", { className: "font-semibold text-primary", children: filters.searchQuery }), _jsx("button", { onClick: () => useKanbanStore.getState().setSearchQuery(''), className: "ml-1 hover:text-destructive transition-colors", children: _jsx(X, { className: "h-3 w-3" }) })] })), activeRules.map(({ groupId, rule }) => (_jsxs("div", { className: "flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1 text-[11px] shadow-sm hover:border-primary/30 transition-colors group", children: [_jsxs("span", { className: "text-slate-400 capitalize", children: [rule.field.split('.').pop(), ":"] }), _jsx("span", { className: "font-semibold text-slate-700", children: rule.value || '(vazio)' }), _jsx("button", { onClick: () => removeFilterRule(groupId, rule.id), className: "ml-1 text-slate-300 group-hover:text-destructive transition-colors", children: _jsx(X, { className: "h-3 w-3" }) })] }, rule.id))), _jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-[10px] font-bold text-slate-400 hover:text-destructive gap-1 px-2 border-l ml-auto rounded-none", onClick: clearFilters, children: [_jsx(RotateCcw, { className: "h-3 w-3" }), "LIMPAR TUDO"] })] }));
}
