import type {
  FilterGroup as FilterGroupType,
  FilterRule as FilterRuleType,
  FilterOperator
} from '@/lib/types/kanban';
import { Trash2, Plus, X } from 'lucide-react';
import { useKanbanStore } from '@/lib/store/use-kanban-store';
import { Button } from '@/components/ui/button';

interface FilterGroupProps {
  group: FilterGroupType;
  availableFields: { label: string; value: string }[];
}

export function FilterGroup({ group, availableFields }: FilterGroupProps) {
  const { updateFilterGroup, removeFilterGroup } = useKanbanStore();

  const handleAddRule = () => {
    const newRule: FilterRuleType = {
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

  const handleRemoveRule = (ruleId: string) => {
    updateFilterGroup(group.id, {
      rules: group.rules.filter(r => 'id' in r && r.id !== ruleId)
    });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<FilterRuleType>) => {
    updateFilterGroup(group.id, {
      rules: group.rules.map(r => ('id' in r && r.id === ruleId) ? { ...r, ...updates } : r)
    });
  };

  const toggleConjunction = () => {
    updateFilterGroup(group.id, {
      conjunction: group.conjunction === 'and' ? 'or' : 'and'
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50/50 space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] uppercase font-bold tracking-wider hover:bg-white"
            onClick={toggleConjunction}
          >
            {group.conjunction}
          </Button>
          <span className="text-xs text-muted-foreground italic">dos seguintes critérios:</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => removeFilterGroup(group.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {group.rules.map((rule) => {
          if ('field' in rule) {
            return (
              <FilterRuleRow
                key={rule.id}
                rule={rule}
                availableFields={availableFields}
                onDelete={() => handleRemoveRule(rule.id)}
                onUpdate={(updates) => handleUpdateRule(rule.id, updates)}
              />
            );
          }
          return null; // Nested groups not supported in basic UI yet
        })}

        {group.rules.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed rounded-md bg-white/50 cursor-pointer hover:bg-white transition-colors" onClick={handleAddRule}>
            <p className="text-xs text-muted-foreground">Nenhuma regra definida. Clique para adicionar.</p>
          </div>
        )}
      </div>

      <Button variant="ghost" size="sm" className="w-full h-8 text-xs border-dashed border hover:border-solid mt-2 bg-white" onClick={handleAddRule}>
        <Plus className="mr-2 h-3 w-3" />
        Adicionar Regra
      </Button>
    </div>
  );
}

interface FilterRuleRowProps {
  rule: FilterRuleType;
  availableFields: { label: string; value: string }[];
  onDelete: () => void;
  onUpdate: (updates: Partial<FilterRuleType>) => void;
}

function FilterRuleRow({ rule, availableFields, onDelete, onUpdate }: FilterRuleRowProps) {

  const operators: { label: string; value: FilterOperator }[] = [
    { label: 'contém', value: 'contains' },
    { label: 'não contém', value: 'notContains' },
    { label: 'igual a', value: 'eq' },
    { label: 'diferente de', value: 'neq' },
    { label: 'maior que', value: 'gt' },
    { label: 'menor que', value: 'lt' },
    { label: 'está vazio', value: 'isEmpty' },
    { label: 'não está vazio', value: 'isNotEmpty' },
  ];

  return (
    <div className={`flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm transition-all duration-200 group/row ${!rule.enabled ? 'opacity-50 grayscale bg-slate-50' : 'hover:border-primary/30'}`}>
      <input
        type="checkbox"
        checked={rule.enabled}
        onChange={(e) => onUpdate({ enabled: e.target.checked })}
        className="h-3 w-3 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
        title={rule.enabled ? 'Desabilitar regra' : 'Habilitar regra'}
      />

      <select
        value={rule.field}
        onChange={(e) => onUpdate({ field: e.target.value })}
        className="flex-[1.5] min-w-[100px] bg-transparent text-[11px] font-semibold focus:outline-none truncate"
        disabled={!rule.enabled}
      >
        <option value="" disabled>Campo...</option>
        {availableFields.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        value={rule.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as FilterOperator })}
        className="flex-1 min-w-[90px] bg-transparent text-[11px] text-muted-foreground focus:outline-none border-x px-2"
        disabled={!rule.enabled}
      >
        {operators.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        type={availableFields.find(f => f.value === rule.field)?.type === 'number' ? 'number' : 'text'}
        value={rule.value as string || ''}
        onChange={(e) => onUpdate({ value: e.target.value })}
        placeholder="Valor..."
        disabled={!rule.enabled || rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty'}
        className="flex-[2] min-w-[100px] bg-transparent text-[11px] focus:outline-none placeholder:italic disabled:opacity-30 font-medium"
      />

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-row-hover/row:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
