/**
 * Kanbase - Main Entry Point
 *
 * This file exports all public APIs of the Kanbase library.
 * Import from 'kanbase' to use the library.
 */
// Injetar estilos automaticamente - não requer import manual do CSS
import './inject-styles';
// === MAIN COMPONENT ===
export { KanboomBoard as Kanbase, KanboomBoard as Kanban, KanboomBoard } from './components/kanboom-board';
// === STORE ===
export { useKanbanStore, } from './store/use-kanban-store';
// === HOOKS ===
export { useKanban } from './hooks/use-kanban';
// === SELECTORS ===
export { 
// Card Selectors
selectCard, selectAllCards, selectCardsByIds, 
// Column Selectors
selectColumn, selectAllColumns, selectColumnOrder, selectColumnCards, selectColumnCardIds, 
// Action Selectors
selectMoveCard, selectMoveColumn, selectSetBoardData, 
// Utility Selectors
selectBoardData, selectCardCount, selectColumnCount, } from './store/selectors';
// === UTILITIES ===
export { discoverFields } from './utils/data-discovery';
export { evaluateFilter } from './utils/filter-evaluator';
// === BENCHMARK (Optional - for development/testing) ===
export { useFPS, BenchmarkStats } from './benchmark/fps-monitor';
