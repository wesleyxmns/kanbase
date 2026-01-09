import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trash2, Plus, X } from 'lucide-react';
import { useKanbanStore } from '@/lib/store/use-kanban-store';
import { Button } from '@/components/ui/button';
export function FilterGroup({ group, availableFields }) {
    const { updateFilterGroup, removeFilterGroup } = useKanbanStore();
    const handleAddRule = () => {
        const newRule = {
            id: crypto.randomUUID(),
            field: '',
            operator: 'contains',
            value: '',
            enabled: true
        };
        updateFilterGroup(group.id, {
            rules: [...group.rules, newRule]
        });
    };
    const handleRemoveRule = (ruleId) => {
        updateFilterGroup(group.id, {
            rules: group.rules.filter(r => 'id' in r && r.id !== ruleId)
        });
    };
    const handleUpdateRule = (ruleId, updates) => {
        updateFilterGroup(group.id, {
            rules: group.rules.map(r => ('id' in r && r.id === ruleId) ? { ...r, ...updates } : r)
        });
    };
    const toggleConjunction = () => {
        updateFilterGroup(group.id, {
            conjunction: group.conjunction === 'and' ? 'or' : 'and'
        });
    };
    return (_jsxs("div", { className: "p-4 border rounded-lg bg-slate-50/50 space-y-4 relative group", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-[10px] uppercase font-bold tracking-wider hover:bg-white", onClick: toggleConjunction, children: group.conjunction }), _jsx("span", { className: "text-xs text-muted-foreground italic", children: "dos seguintes crit\u00E9rios:" })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => removeFilterGroup(group.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "space-y-3", children: [group.rules.map((rule) => {
                        if ('field' in rule) {
                            return (_jsx(FilterRuleRow, { rule: rule, availableFields: availableFields, onDelete: () => handleRemoveRule(rule.id), onUpdate: (updates) => handleUpdateRule(rule.id, updates) }, rule.id));
                        }
                        return null; // Nested groups not supported in basic UI yet
                    }), group.rules.length === 0 && (_jsx("div", { className: "text-center py-4 border-2 border-dashed rounded-md bg-white/50 cursor-pointer hover:bg-white transition-colors", onClick: handleAddRule, children: _jsx("p", { className: "text-xs text-muted-foreground", children: "Nenhuma regra definida. Clique para adicionar." }) }))] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "w-full h-8 text-xs border-dashed border hover:border-solid mt-2 bg-white", onClick: handleAddRule, children: [_jsx(Plus, { className: "mr-2 h-3 w-3" }), "Adicionar Regra"] })] }));
}
function FilterRuleRow({ rule, availableFields, onDelete, onUpdate }) {
    const operators = [
        { label: 'contém', value: 'contains' },
        { label: 'não contém', value: 'notContains' },
        { label: 'igual a', value: 'eq' },
        { label: 'diferente de', value: 'neq' },
        { label: 'maior que', value: 'gt' },
        { label: 'menor que', value: 'lt' },
        { label: 'está vazio', value: 'isEmpty' },
        { label: 'não está vazio', value: 'isNotEmpty' },
    ];
    return (_jsxs("div", { className: `flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm transition-all duration-200 group/row ${!rule.enabled ? 'opacity-50 grayscale bg-slate-50' : 'hover:border-primary/30'}`, children: [_jsx("input", { type: "checkbox", checked: rule.enabled, onChange: (e) => onUpdate({ enabled: e.target.checked }), className: "h-3 w-3 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer", title: rule.enabled ? 'Desabilitar regra' : 'Habilitar regra' }), _jsxs("select", { value: rule.field, onChange: (e) => onUpdate({ field: e.target.value }), className: "flex-[1.5] min-w-[100px] bg-transparent text-[11px] font-semibold focus:outline-none truncate", disabled: !rule.enabled, children: [_jsx("option", { value: "", disabled: true, children: "Campo..." }), availableFields.map(f => (_jsx("option", { value: f.value, children: f.label }, f.value)))] }), _jsx("select", { value: rule.operator, onChange: (e) => onUpdate({ operator: e.target.value }), className: "flex-1 min-w-[90px] bg-transparent text-[11px] text-muted-foreground focus:outline-none border-x px-2", disabled: !rule.enabled, children: operators.map(o => (_jsx("option", { value: o.value, children: o.label }, o.value))) }), _jsx("input", { type: (availableFields.find(f => f.value === rule.field)?.type ?? 'text') === 'number' ? 'number' : 'text', value: rule.value || '', onChange: (e) => onUpdate({ value: e.target.value }), placeholder: "Valor...", disabled: !rule.enabled || rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty', className: "flex-[2] min-w-[100px] bg-transparent text-[11px] focus:outline-none placeholder:italic disabled:opacity-30 font-medium" }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-row-hover/row:opacity-100 transition-opacity", onClick: onDelete, children: _jsx(X, { className: "h-3 w-3" }) })] }));
}
