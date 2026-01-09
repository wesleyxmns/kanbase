export interface KanboomCard {
  id: string;
  title: string;
  description?: string;
  content?: any;
  metadata?: any;
  previousColumnId?: string; // For restoring cards when column is deleted
}

export interface KanboomColumn {
  id: string;
  title: string;
  cardIds: string[];
  metadata?: any;
}

export interface KanboomData<TCard = KanboomCard> {
  cards: Record<string, TCard>;
  columns: Record<string, KanboomColumn>;
  columnOrder: string[];
}

export interface CardRenderProps<TCard = KanboomCard> {
  card: TCard;
  isDragging: boolean;
}

export interface ColumnHeaderRenderProps<TColumn = KanboomColumn> {
  column: TColumn;
  cardCount: number;
  isOver: boolean;
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
  onAddCard?: () => void;
  onEditColumn?: () => void;
}

export interface AddCardRenderProps<TCard = KanboomCard> {
  columnId: string;
  onAdd: (data: Omit<TCard, 'id'>) => void;
  onCancel: () => void;
}

export interface EditCardRenderProps<TCard = KanboomCard> {
  card: TCard;
  onSave: (updates: Partial<TCard>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export interface AddColumnRenderProps<TColumn = KanboomColumn> {
  onAdd: (data: Omit<TColumn, 'id' | 'cardIds'>) => void;
  onCancel: () => void;
}

export interface EditColumnRenderProps<TColumn = KanboomColumn> {
  column: TColumn;
  onSave: (updates: Partial<TColumn>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export interface ColumnEmptyRenderProps {
  // Vazio propositalmente - pode ser extendido no futuro
}

export interface ViewCardRenderProps<TCard = KanboomCard> {
  card: TCard;
  onClose: () => void;
}

export interface KanboomConfig<TCard = KanboomCard, TColumn = KanboomColumn> {
  renderCard?: (props: CardRenderProps<TCard>) => React.ReactNode;
  renderColumnHeader?: (props: ColumnHeaderRenderProps<TColumn>) => React.ReactNode;
  renderColumnEmpty?: (props: ColumnEmptyRenderProps) => React.ReactNode;

  // Custom Add/Edit UI
  renderAddButton?: (props: { onClick: () => void; columnId: string }) => React.ReactNode;
  renderAddForm?: (props: AddCardRenderProps<TCard>) => React.ReactNode;
  renderEditForm?: (props: EditCardRenderProps<TCard>) => React.ReactNode;

  // Custom Column Add/Edit UI
  renderAddColumnButton?: (props: { onClick: () => void }) => React.ReactNode;
  renderAddColumnForm?: (props: AddColumnRenderProps<TColumn>) => React.ReactNode;
  renderEditColumnForm?: (props: EditColumnRenderProps<TColumn>) => React.ReactNode;

  // Card View UI
  renderCardView?: (props: ViewCardRenderProps<TCard>) => React.ReactNode;

  // Feature Flags
  allowAdd?: boolean;
  allowEdit?: boolean;

  allowColumnAdd?: boolean;
  allowColumnEdit?: boolean;
  allowColumnDelete?: boolean;
  allowColumnReorder?: boolean;
  allowFilters?: boolean;
  showURLSync?: boolean;

  dragActivationDistance?: number;
  touchActivationDelay?: number;
  virtualOverscan?: number;
  estimatedCardHeight?: number;

  columnWidth?: number;
  columnMinHeight?: number;
  gap?: number;

  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, index: number) => void;
  onCardClick?: (card: TCard) => void;
  onEditCard?: (card: TCard) => void;
  onColumnClick?: (column: TColumn) => void;
  onEditColumn?: (column: TColumn) => void;
}

// --- ADVANCED FILTERING TYPES ---

export type FilterOperator =
  | 'eq' | 'neq' | 'contains' | 'notContains'
  | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'between' | 'isEmpty' | 'isNotEmpty';

export interface FilterRule {
  id: string;
  field: string; // Dynamic path like 'metadata.priority' or 'title'
  operator: FilterOperator;
  value: any;
  enabled: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean'; // UI hint
}

export interface FilterDefinition {
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: any }[]; // For 'select' type
  getFieldValue?: (card: any) => any; // Custom extractor
}

export interface FilterGroup {
  id: string;
  conjunction: 'and' | 'or';
  rules: (FilterRule | FilterGroup)[];
  enabled: boolean;
}

export interface KanbanFilters {
  searchQuery: string;
  groups: FilterGroup[];
  quickFilters: string[];
}