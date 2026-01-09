import type { KanboomCard } from '../types/kanban';
export interface DiscoveredField {
    label: string;
    value: string;
    type: 'text' | 'number' | 'boolean' | 'other';
}
export declare function discoverFields(cards: Record<string, KanboomCard>): DiscoveredField[];
//# sourceMappingURL=data-discovery.d.ts.map