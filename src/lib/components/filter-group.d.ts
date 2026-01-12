import type { FilterGroup as FilterGroupType } from '@/lib/types/kanban';
import type { DiscoveredField } from '@/lib/utils/data-discovery';
interface FilterGroupProps {
    group: FilterGroupType;
    availableFields: DiscoveredField[];
}
export declare function FilterGroup({ group, availableFields }: FilterGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=filter-group.d.ts.map