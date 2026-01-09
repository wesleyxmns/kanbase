interface UseKanbanColumnProps {
    cardIds: string[];
    estimatedCardHeight: number;
    overscan: number;
}
export declare function useKanbanColumn({ cardIds, estimatedCardHeight, overscan: baseOverscan }: UseKanbanColumnProps): {
    parentRef: import("react").RefObject<HTMLDivElement | null>;
    rowVirtualizer: import("@tanstack/react-virtual").Virtualizer<HTMLDivElement, Element>;
};
export {};
//# sourceMappingURL=use-kanban-column.d.ts.map