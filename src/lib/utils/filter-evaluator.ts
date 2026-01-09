import type { KanboomCard, FilterGroup, FilterRule } from '@/lib/types/kanban';

export function evaluateFilter(card: KanboomCard, filters: { searchQuery: string; groups: FilterGroup[] }): boolean {
  // 1. Global Search
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    const titleMatch = card.title?.toLowerCase().includes(query);
    const descMatch = card.description?.toLowerCase().includes(query);

    // Also search in metadata values
    const metadataMatch = card.metadata && Object.values(card.metadata).some(val =>
      String(val).toLowerCase().includes(query)
    );

    if (!titleMatch && !descMatch && !metadataMatch) return false;
  }

  // 2. Advanced Filters (Groups)
  if (filters.groups.length === 0) return true;

  // Each group is combined with AND (top level)
  return filters.groups.every(group => {
    if (!group.enabled) return true;
    return evaluateGroup(card, group);
  });
}

function evaluateGroup(card: any, group: FilterGroup): boolean {
  const { conjunction, rules } = group;

  if (rules.length === 0) return true;

  if (conjunction === 'and') {
    return rules.every(rule => {
      if ('conjunction' in rule) return evaluateGroup(card, rule as FilterGroup);
      return evaluateRule(card, rule as FilterRule);
    });
  } else {
    return rules.some(rule => {
      if ('conjunction' in rule) return evaluateGroup(card, rule as FilterGroup);
      return evaluateRule(card, rule as FilterRule);
    });
  }
}

function evaluateRule(card: any, rule: FilterRule): boolean {
  if (!rule.field || !rule.enabled) return true;

  const value = getNestedValue(card, rule.field);
  const target = rule.value;

  switch (rule.operator) {
    case 'eq': return value === target;
    case 'neq': return value !== target;
    case 'contains':
      return String(value || '').toLowerCase().includes(String(target || '').toLowerCase());
    case 'notContains':
      return !String(value || '').toLowerCase().includes(String(target || '').toLowerCase());
    case 'gt': return Number(value) > Number(target);
    case 'gte': return Number(value) >= Number(target);
    case 'lt': return Number(value) < Number(target);
    case 'lte': return Number(value) <= Number(target);
    case 'isEmpty': return !value || (Array.isArray(value) && value.length === 0);
    case 'isNotEmpty': return !!value && (!Array.isArray(value) || value.length > 0);
    default: return true;
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
