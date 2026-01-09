import type { KanboomCard, KanboomColumn, KanboomConfig } from '../types/kanban';
interface KanboomBoardProps<TCard extends {
    id: string;
} = KanboomCard, TColumn extends {
    id: string;
    title: string;
} = KanboomColumn> {
    config?: KanboomConfig<TCard, TColumn>;
}
export declare function KanboomBoard<TCard extends {
    id: string;
} = KanboomCard, TColumn extends {
    id: string;
    title: string;
} = KanboomColumn>({ config }: KanboomBoardProps<TCard, TColumn>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=kanboom-board.d.ts.map