<p align="center">
  <img src="https://raw.githubusercontent.com/wesleyxmns/kanbase/main/assets/kanbase.png" alt="Kanbase Logo" width="280" />
</p>

<p align="center">
  <strong>Precisão Fluida para Workflows Modernos</strong>
</p>

<p align="center">
  <strong>Kanbase</strong> é um componente Kanban de alto desempenho e nível empresarial para React, projetado para lidar com workflows complexos sem comprometer velocidade ou estética. Construído para escala, capaz de renderizar milhares de cards a <strong>60 FPS</strong> graças à virtualização, oferecendo uma experiência premium com física e interações de "Precisão Fluida".
</p>

---

## 📦 Instalação

```bash
npm install kanbase
# ou
pnpm add kanbase
# ou
yarn add kanbase
```

**Dependências Peer:**
Certifique-se de ter as seguintes dependências instaladas (seu projeto provavelmente já as possui):
```bash
npm install react react-dom tailwindcss
```

**✨ Estilos Automáticos:**
Os estilos do Kanbase são injetados automaticamente quando você importa o componente. Não é necessário importar CSS manualmente!

---

## 🚀 Início Rápido

### Uso Básico

```tsx
import { KanboomBoard, useKanbanStore, type KanboomData, type KanboomConfig } from 'kanbase';
// Estilos são injetados automaticamente - não precisa importar CSS!

function App() {
  const { setBoardData } = useKanbanStore();

  // Inicializar dados do board
  useEffect(() => {
    const data: KanboomData = {
      cards: {
        'c1': {
          id: 'c1',
          title: 'Pesquisar Competidores',
          description: 'Analisar os 3 principais líderes de mercado',
          metadata: { priority: 'high' }
        },
        'c2': {
          id: 'c2',
          title: 'Criar Protótipo',
          description: 'Desenvolver MVP da funcionalidade',
          metadata: { priority: 'medium' }
        }
      },
      columns: {
        'col1': {
          id: 'col1',
          title: 'Backlog',
          cardIds: ['c1', 'c2']
        },
        'col2': {
          id: 'col2',
          title: 'Em Progresso',
          cardIds: []
        }
      },
      columnOrder: ['col1', 'col2']
    };

    setBoardData(data);
  }, []);

  const config: KanboomConfig = {
    allowAdd: true,
    allowEdit: true,
    allowColumnAdd: true,
    allowColumnEdit: true,
    allowColumnDelete: true,
    allowColumnReorder: true,
    allowFilters: true,
    onCardMove: (cardId, fromCol, toCol, index) => {
      console.log('Card movido:', { cardId, fromCol, toCol, index });
      // Sincronizar com sua API aqui
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50">
      <KanboomBoard config={config} />
    </div>
  );
}
```

---

## 📚 Tipos e Interfaces

### `KanboomCard`

Representa um card individual no board.

```typescript
interface KanboomCard {
  id: string;                    // ID único do card (obrigatório)
  title: string;                 // Título do card (obrigatório)
  description?: string;           // Descrição opcional
  content?: any;                  // Conteúdo customizado
  metadata?: any;                 // Metadados customizados (tags, prioridade, etc.)
  previousColumnId?: string;     // ID da coluna anterior (usado para restauração)
}
```

**Exemplo:**
```typescript
const card: KanboomCard = {
  id: 'card-1',
  title: 'Implementar Autenticação',
  description: 'Adicionar login com OAuth2',
  metadata: {
    priority: 'high',
    tags: [{ name: 'Backend', color: 'bg-blue-100' }],
    members: [{ name: 'João', initials: 'JS' }],
    dueDate: '2024-12-31',
    commentsCount: 3,
    attachmentsCount: 2
  }
};
```

### `KanboomColumn`

Representa uma coluna no board.

```typescript
interface KanboomColumn {
  id: string;                    // ID único da coluna (obrigatório)
  title: string;                 // Título da coluna (obrigatório)
  cardIds: string[];             // Array de IDs dos cards nesta coluna
  metadata?: any;                 // Metadados customizados da coluna
}
```

**Exemplo:**
```typescript
const column: KanboomColumn = {
  id: 'col-1',
  title: 'To Do',
  cardIds: ['card-1', 'card-2', 'card-3'],
  metadata: {
    limit: 10,
    color: '#3b82f6'
  }
};
```

### `KanboomData`

Estrutura completa de dados do board.

```typescript
interface KanboomData<TCard = KanboomCard> {
  cards: Record<string, TCard>;              // Mapa de cards por ID
  columns: Record<string, KanboomColumn>;    // Mapa de colunas por ID
  columnOrder: string[];                     // Ordem das colunas (IDs)
}
```

**Exemplo:**
```typescript
const boardData: KanboomData = {
  cards: {
    'c1': { id: 'c1', title: 'Card 1', ... },
    'c2': { id: 'c2', title: 'Card 2', ... }
  },
  columns: {
    'col1': { id: 'col1', title: 'Backlog', cardIds: ['c1', 'c2'] },
    'col2': { id: 'col2', title: 'Doing', cardIds: [] }
  },
  columnOrder: ['col1', 'col2']
};
```

### `KanboomConfig`

Configuração completa do componente, incluindo feature flags, callbacks e renderers customizados.

```typescript
interface KanboomConfig<TCard = KanboomCard, TColumn = KanboomColumn> {
  // === RENDERERS CUSTOMIZADOS ===
  renderCard?: (props: CardRenderProps<TCard>) => React.ReactNode;
  renderColumnHeader?: (props: ColumnHeaderRenderProps<TColumn>) => React.ReactNode;
  renderColumnEmpty?: (props: ColumnEmptyRenderProps) => React.ReactNode;
  renderAddButton?: (props: { onClick: () => void; columnId: string }) => React.ReactNode;
  renderAddForm?: (props: AddCardRenderProps<TCard>) => React.ReactNode;
  renderEditForm?: (props: EditCardRenderProps<TCard>) => React.ReactNode;
  renderAddColumnButton?: (props: { onClick: () => void }) => React.ReactNode;
  renderAddColumnForm?: (props: AddColumnRenderProps<TColumn>) => React.ReactNode;
  renderEditColumnForm?: (props: EditColumnRenderProps<TColumn>) => React.ReactNode;
  renderCardView?: (props: ViewCardRenderProps<TCard>) => React.ReactNode;

  // === FEATURE FLAGS ===
  allowAdd?: boolean;              // Permite adicionar cards (padrão: false)
  allowEdit?: boolean;              // Permite editar cards (padrão: false)
  allowColumnAdd?: boolean;         // Permite adicionar colunas (padrão: false)
  allowColumnEdit?: boolean;        // Permite editar colunas (padrão: false)
  allowColumnDelete?: boolean;      // Permite deletar colunas (padrão: false)
  allowColumnReorder?: boolean;     // Permite reordenar colunas (padrão: false)
  allowFilters?: boolean;           // Habilita drawer de filtros (padrão: true)
  showURLSync?: boolean;            // Sincroniza estado com URL (padrão: false)

  // === CONFIGURAÇÕES DE DRAG & DROP ===
  dragActivationDistance?: number;  // Distância para ativar drag (padrão: 10px)
  touchActivationDelay?: number;    // Delay para touch (padrão: 250ms)

  // === CONFIGURAÇÕES DE VIRTUALIZAÇÃO ===
  virtualOverscan?: number;        // Cards extras renderizados (padrão: 5)
  estimatedCardHeight?: number;    // Altura estimada do card (padrão: 90px)

  // === CONFIGURAÇÕES DE LAYOUT ===
  columnWidth?: number;             // Largura das colunas (padrão: 320px)
  columnMinHeight?: number;         // Altura mínima das colunas (padrão: 500px)
  gap?: number;                     // Espaçamento entre colunas (padrão: 16px)

  // === CALLBACKS ===
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, index: number) => void;
  onCardClick?: (card: TCard) => void;
  onEditCard?: (card: TCard) => void;
  onColumnClick?: (column: TColumn) => void;
  onEditColumn?: (column: TColumn) => void;
}
```

---

## 🎨 Estilos e Theming

### Injeção Automática de Estilos

O Kanbase injeta seus estilos automaticamente quando você importa o componente. **Não é necessário importar CSS manualmente!**

```tsx
// ✅ Isso é tudo que você precisa fazer
import { KanboomBoard } from 'kanbase';

// ❌ Não precisa fazer isso mais
// import 'kanbase/style.css';
```

Os estilos são injetados no `<head>` do documento automaticamente quando o módulo é carregado. Isso garante que:

- ✅ Funciona imediatamente sem configuração adicional
- ✅ Não há conflitos de ordem de importação
- ✅ Funciona em todos os ambientes (Vite, Webpack, etc.)

### Importação Manual (Opcional)

Se você preferir ter controle total sobre quando e como os estilos são carregados, você ainda pode importar o CSS manualmente:

```tsx
import { KanboomBoard } from 'kanbase';
import 'kanbase/style.css'; // Opcional - apenas se quiser controle manual
```

**Nota:** Se você importar manualmente, os estilos não serão injetados automaticamente (evita duplicação).

---

## 🎨 Render Props e Customização

### Renderizar Card Customizado

```tsx
const config: KanboomConfig = {
  renderCard: ({ card, isDragging }) => (
    <div className={`p-4 border rounded-lg ${isDragging ? 'shadow-2xl rotate-2' : ''}`}>
      <h3 className="font-bold text-lg">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 mt-2">{card.description}</p>
      )}
      {card.metadata?.priority && (
        <span className={`px-2 py-1 rounded text-xs ${
          card.metadata.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          {card.metadata.priority}
        </span>
      )}
    </div>
  )
};
```

### Renderizar Formulário de Adição Customizado

```tsx
const config: KanboomConfig = {
  renderAddForm: ({ columnId, onAdd, onCancel }) => (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onAdd({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            metadata: { priority: formData.get('priority') as string }
          });
        }}>
          <input name="title" placeholder="Título" required />
          <textarea name="description" placeholder="Descrição" />
          <select name="priority">
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <button type="submit">Adicionar</button>
        </form>
      </DialogContent>
    </Dialog>
  )
};
```

### Renderizar Header de Coluna Customizado

```tsx
const config: KanboomConfig = {
  renderColumnHeader: ({ column, cardCount, isOver, dragHandleProps, onAddCard, onEditColumn }) => (
    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-t-lg">
      <div className="flex items-center gap-2">
        {dragHandleProps && (
          <div {...dragHandleProps.attributes} {...dragHandleProps.listeners}>
            <GripVertical className="cursor-grab" />
          </div>
        )}
        <h2 className="font-bold">{column.title}</h2>
        <span className="text-sm text-gray-600">({cardCount})</span>
      </div>
      <div className="flex gap-2">
        {onAddCard && (
          <button onClick={onAddCard} className="p-1 hover:bg-blue-200 rounded">
            <Plus size={16} />
          </button>
        )}
        {onEditColumn && (
          <button onClick={onEditColumn} className="p-1 hover:bg-blue-200 rounded">
            <Settings size={16} />
          </button>
        )}
      </div>
    </div>
  )
};
```

---

## 🔧 Store e Gerenciamento de Estado

O Kanbase usa **Zustand** para gerenciamento de estado. Você pode acessar e manipular o estado diretamente através do hook `useKanbanStore`.

### Hook `useKanbanStore`

```tsx
import { useKanbanStore } from 'kanbase';

function MyComponent() {
  const {
    // Estado
    cards,
    columns,
    columnOrder,
    filters,
    
    // Ações de Cards
    addCard,
    updateCard,
    deleteCard,
    duplicateCard,
    
    // Ações de Colunas
    addColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    
    // Movimentação
    moveCard,
    
    // Filtros
    setSearchQuery,
    addFilterGroup,
    updateFilterGroup,
    removeFilterGroup,
    clearFilters,
    
    // Utilitários
    setBoardData,
    setConfig,
    clearBoard
  } = useKanbanStore();
}
```

### Exemplos de Uso da Store

#### Adicionar Card Programaticamente

```tsx
const { addCard } = useKanbanStore();

const handleAddCard = () => {
  const cardId = addCard('col-1', {
    title: 'Novo Card',
    description: 'Descrição do card',
    metadata: { priority: 'high' }
  });
  console.log('Card criado com ID:', cardId);
};
```

#### Atualizar Card

```tsx
const { updateCard } = useKanbanStore();

updateCard('card-1', {
  title: 'Título Atualizado',
  metadata: { ...existingMetadata, priority: 'low' }
});
```

#### Mover Card Programaticamente

```tsx
const { moveCard } = useKanbanStore();

// Mover card 'c1' da coluna 'col1' para 'col2' na posição 0
moveCard('c1', 'col1', 'col2', 0);
```

#### Adicionar Coluna

```tsx
const { addColumn } = useKanbanStore();

const columnId = addColumn({
  title: 'Nova Coluna',
  metadata: { color: '#3b82f6' }
}, 1); // Insere na posição 1
```

#### Gerenciar Filtros

```tsx
const { addFilterGroup, setSearchQuery, clearFilters } = useKanbanStore();

// Adicionar busca global
setSearchQuery('react');

// Adicionar grupo de filtros
addFilterGroup({
  id: 'group-1',
  conjunction: 'and',
  enabled: true,
  rules: [
    {
      id: 'rule-1',
      field: 'metadata.priority',
      operator: 'eq',
      value: 'high',
      enabled: true
    }
  ]
});

// Limpar todos os filtros
clearFilters();
```

---

## 🔍 Sistema de Filtros Avançado

O Kanbase inclui um sistema de filtros poderoso que suporta:

- **Busca Global**: Pesquisa em título, descrição e metadados
- **Filtros Complexos**: Grupos aninhados com lógica AND/OR
- **Descoberta Automática**: Detecta automaticamente campos disponíveis nos cards
- **Operadores Múltiplos**: `eq`, `neq`, `contains`, `gt`, `lt`, `between`, etc.

### Tipos de Filtros

```typescript
type FilterOperator =
  | 'eq' | 'neq'                    // Igual / Diferente
  | 'contains' | 'notContains'      // Contém / Não contém
  | 'in' | 'notIn'                  // Em / Não em
  | 'gt' | 'gte' | 'lt' | 'lte'     // Maior que, Maior ou igual, Menor que, Menor ou igual
  | 'between'                        // Entre dois valores
  | 'isEmpty' | 'isNotEmpty';       // Vazio / Não vazio

interface FilterRule {
  id: string;
  field: string;                     // Caminho do campo (ex: 'metadata.priority')
  operator: FilterOperator;
  value: any;
  enabled: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
}

interface FilterGroup {
  id: string;
  conjunction: 'and' | 'or';         // Lógica do grupo
  rules: (FilterRule | FilterGroup)[]; // Regras ou grupos aninhados
  enabled: boolean;
}
```

### Exemplo de Uso de Filtros

```tsx
import { useKanbanStore } from 'kanbase';

function FilterExample() {
  const { addFilterGroup, setSearchQuery } = useKanbanStore();

  // Busca global
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filtro por prioridade
  const filterByPriority = (priority: string) => {
    addFilterGroup({
      id: crypto.randomUUID(),
      conjunction: 'and',
      enabled: true,
      rules: [
        {
          id: crypto.randomUUID(),
          field: 'metadata.priority',
          operator: 'eq',
          value: priority,
          enabled: true,
          type: 'select'
        }
      ]
    });
  };

  return (
    <div>
      <input 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar cards..."
      />
      <button onClick={() => filterByPriority('high')}>
        Filtrar Alta Prioridade
      </button>
    </div>
  );
}
```

### Filtros Aninhados (AND/OR)

```tsx
// Exemplo: (priority = 'high' OR priority = 'medium') AND tags contains 'urgent'
addFilterGroup({
  id: 'group-1',
  conjunction: 'and',
  enabled: true,
  rules: [
    {
      id: 'subgroup-1',
      conjunction: 'or',
      enabled: true,
      rules: [
        {
          id: 'rule-1',
          field: 'metadata.priority',
          operator: 'eq',
          value: 'high',
          enabled: true
        },
        {
          id: 'rule-2',
          field: 'metadata.priority',
          operator: 'eq',
          value: 'medium',
          enabled: true
        }
      ]
    },
    {
      id: 'rule-3',
      field: 'metadata.tags',
      operator: 'contains',
      value: 'urgent',
      enabled: true
    }
  ]
});
```

---

## 🎯 Funcionalidades Principais

### ✨ Performance e Virtualização

- **Virtualização de Colunas**: Renderiza apenas colunas visíveis usando `@tanstack/react-virtual`
- **Virtualização de Cards**: Renderiza apenas cards visíveis dentro de cada coluna
- **60 FPS Garantido**: Mantém performance mesmo com milhares de cards
- **Overscan Configurável**: Controla quantos itens extras são renderizados

### 🎨 Drag & Drop Avançado

- **Drag & Drop Suave**: Usa `@dnd-kit` com algoritmos de detecção de colisão otimizados
- **Reordenação de Cards**: Arraste cards dentro e entre colunas
- **Reordenação de Colunas**: Arraste colunas para reordenar horizontalmente
- **Criar Coluna ao Arrastar**: Arraste um card para a área "Nova Coluna" para criar uma coluna automaticamente
- **Feedback Visual**: Indicadores visuais durante o arraste (top/bottom/left/right)
- **Touch Support**: Suporte completo para dispositivos touch

### 🔍 Filtros e Busca

- **Busca Global**: Pesquisa em todos os campos do card
- **Filtros Complexos**: Grupos aninhados com lógica AND/OR
- **Descoberta Automática**: Detecta campos disponíveis automaticamente
- **Filtros Ativos**: Chips visuais mostrando filtros aplicados
- **Múltiplos Operadores**: Suporte a 12+ operadores diferentes

### 🎭 Customização Total

- **Render Props**: Customize qualquer parte da UI
- **Componentes Default**: Vem com componentes prontos baseados em Shadcn UI
- **Type-Safe**: Totalmente tipado com TypeScript
- **CSS Variables**: Temas via variáveis CSS padrão

### 📱 Modais e Formulários

- **Modal de Visualização**: Visualize detalhes completos do card
- **Formulário de Edição**: Edite cards com formulário padrão ou customizado
- **Formulário de Adição**: Adicione novos cards facilmente
- **Edição de Colunas**: Renomeie ou delete colunas
- **Todos Customizáveis**: Substitua qualquer modal por sua própria implementação

---

## 🎨 Theming e Customização Visual

O Kanbase usa variáveis CSS para theming. Defina estas variáveis no seu CSS global:

```css
:root {
  /* Cores do Board */
  --color-board-bg: #f8fafc;              /* Slate-50 */
  --color-column-bg: rgba(241, 245, 249, 0.5); /* Slate-100 (Glass) */

  /* Aparência dos Cards */
  --color-card-bg: #ffffff;
  --color-card-border: rgba(226, 232, 240, 0.8);
  --radius-card: 8px;
  --shadow-card: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-card-hover: 0 4px 6px -1px rgba(0,0,0,0.1);

  /* Física de Animação */
  --animate-tilt: tilt 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Suporte a Dark Mode */
.dark {
  --color-board-bg: #0f172a;
  --color-card-bg: #1e293b;
  --color-column-bg: rgba(30, 41, 59, 0.5);
}
```

### Classes CSS Úteis

O Kanbase expõe classes utilitárias que você pode usar:

- `bg-board-bg`: Background do board
- `bg-column-bg`: Background das colunas
- `bg-card-bg`: Background dos cards
- `border-card-border`: Borda dos cards
- `rounded-card`: Border radius dos cards
- `rounded-column`: Border radius das colunas
- `shadow-card`: Sombra dos cards
- `shadow-card-hover`: Sombra no hover dos cards

---

## 📖 Exemplos Completos

### Exemplo 1: Board Básico com Sincronização de API

```tsx
import { useEffect } from 'react';
import { KanboomBoard, useKanbanStore, type KanboomConfig } from 'kanbase';
// Estilos são injetados automaticamente!

function App() {
  const { setBoardData, moveCard } = useKanbanStore();

  // Carregar dados iniciais
  useEffect(() => {
    fetch('/api/kanban')
      .then(res => res.json())
      .then(data => setBoardData(data));
  }, []);

  const config: KanboomConfig = {
    allowAdd: true,
    allowEdit: true,
    allowColumnAdd: true,
    allowColumnReorder: true,
    allowFilters: true,
    
    onCardMove: async (cardId, fromCol, toCol, index) => {
      // Sincronizar com API
      try {
        await fetch('/api/cards/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId, fromCol, toCol, index })
        });
      } catch (error) {
        console.error('Erro ao mover card:', error);
        // Reverter movimento em caso de erro
      }
    }
  };

  return (
    <div className="h-screen w-full">
      <KanboomBoard config={config} />
    </div>
  );
}
```

### Exemplo 2: Board com Cards Customizados

```tsx
import { KanboomBoard, type KanboomConfig, type CardRenderProps } from 'kanbase';
import { Badge } from '@/components/ui/badge';

function CustomCard({ card, isDragging }: CardRenderProps) {
  return (
    <div className={`p-4 bg-white rounded-lg border shadow-sm ${
      isDragging ? 'opacity-50 scale-105' : 'hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{card.title}</h3>
        {card.metadata?.priority && (
          <Badge variant={card.metadata.priority === 'high' ? 'destructive' : 'default'}>
            {card.metadata.priority}
          </Badge>
        )}
      </div>
      {card.description && (
        <p className="text-sm text-gray-600">{card.description}</p>
      )}
      {card.metadata?.tags && (
        <div className="flex gap-1 mt-2">
          {card.metadata.tags.map((tag: string, i: number) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

const config: KanboomConfig = {
  allowAdd: true,
  allowEdit: true,
  renderCard: CustomCard
};

function App() {
  return <KanboomBoard config={config} />;
}
```

### Exemplo 3: Integração com Estado Global (Redux/Zustand)

```tsx
import { useEffect } from 'react';
import { KanboomBoard, useKanbanStore } from 'kanbase';
import { useSelector, useDispatch } from 'react-redux';
import { syncKanbanData, moveCardAction } from './kanbanSlice';

function App() {
  const dispatch = useDispatch();
  const kanbanData = useSelector(state => state.kanban);
  const { setBoardData } = useKanbanStore();

  // Sincronizar store do Kanbase com Redux
  useEffect(() => {
    setBoardData(kanbanData);
  }, [kanbanData, setBoardData]);

  // Sincronizar mudanças do Kanbase com Redux
  const config = {
    allowAdd: true,
    allowEdit: true,
    onCardMove: (cardId, fromCol, toCol, index) => {
      dispatch(moveCardAction({ cardId, fromCol, toCol, index }));
    }
  };

  return <KanboomBoard config={config} />;
}
```

### Exemplo 4: Board com Permissões por Usuário

```tsx
import { useAuth } from './auth';
import { KanboomBoard, type KanboomConfig } from 'kanbase';

function App() {
  const { user, hasPermission } = useAuth();

  const config: KanboomConfig = {
    // Habilitar features baseado em permissões
    allowAdd: hasPermission('kanban:create'),
    allowEdit: hasPermission('kanban:edit'),
    allowColumnAdd: hasPermission('kanban:columns:create'),
    allowColumnEdit: hasPermission('kanban:columns:edit'),
    allowColumnDelete: hasPermission('kanban:columns:delete'),
    allowColumnReorder: hasPermission('kanban:columns:reorder'),
    
    onCardMove: (cardId, fromCol, toCol, index) => {
      if (!hasPermission('kanban:move')) {
        alert('Você não tem permissão para mover cards');
        return;
      }
      // Lógica de movimento
    }
  };

  return <KanboomBoard config={config} />;
}
```

---

## 🔌 Formas de Importação

### Importação Padrão (ES Modules)

```tsx
import { KanboomBoard, useKanbanStore, type KanboomData, type KanboomConfig } from 'kanbase';
// Estilos são injetados automaticamente - não precisa importar CSS!
```

### Importação de Tipos

```tsx
import type {
  KanboomCard,
  KanboomColumn,
  KanboomData,
  KanboomConfig,
  CardRenderProps,
  FilterGroup,
  FilterRule
} from 'kanbase';
```

### Importação de Selectors

```tsx
import {
  selectCard,
  selectAllCards,
  selectColumn,
  selectColumnCards
} from 'kanbase';
```

### Importação de Utilitários

```tsx
import { evaluateFilter, discoverFields } from 'kanbase';
```

### Importação UMD (para uso em navegadores)

```html
<script src="https://unpkg.com/kanbase/dist/kanbase.umd.js"></script>
<!-- Estilos são injetados automaticamente pelo JavaScript -->
<script>
  const { KanboomBoard } = Kanbase;
</script>
```

---

## 🎯 Propriedades e Configurações Detalhadas

### Feature Flags

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `allowAdd` | `boolean` | `false` | Mostra botões (+) para adicionar cards |
| `allowEdit` | `boolean` | `false` | Permite editar cards (menu de contexto) |
| `allowColumnAdd` | `boolean` | `false` | Mostra placeholder "Nova Coluna" |
| `allowColumnEdit` | `boolean` | `false` | Permite editar colunas |
| `allowColumnDelete` | `boolean` | `false` | Permite deletar colunas |
| `allowColumnReorder` | `boolean` | `false` | Habilita drag handles para reordenar colunas |
| `allowFilters` | `boolean` | `true` | Habilita drawer de filtros (FAB) |
| `showURLSync` | `boolean` | `false` | Sincroniza estado com query params da URL |

### Configurações de Drag & Drop

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `dragActivationDistance` | `number` | `10` | Distância em pixels para ativar drag (mouse) |
| `touchActivationDelay` | `number` | `250` | Delay em ms para ativar drag (touch) |

### Configurações de Virtualização

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `virtualOverscan` | `number` | `5` | Número de cards extras renderizados fora da viewport |
| `estimatedCardHeight` | `number` | `90` | Altura estimada do card em pixels (para virtualização) |

### Configurações de Layout

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `columnWidth` | `number` | `320` | Largura das colunas em pixels |
| `columnMinHeight` | `number` | `500` | Altura mínima das colunas em pixels |
| `gap` | `number` | `16` | Espaçamento entre colunas em pixels |

### Callbacks

| Callback | Assinatura | Descrição |
|----------|-----------|-----------|
| `onCardMove` | `(cardId: string, fromColumn: string, toColumn: string, index: number) => void` | Chamado quando um card é movido |
| `onCardClick` | `(card: TCard) => void` | Chamado quando um card é clicado |
| `onEditCard` | `(card: TCard) => void` | Chamado quando edição de card é iniciada |
| `onColumnClick` | `(column: TColumn) => void` | Chamado quando uma coluna é clicada |
| `onEditColumn` | `(column: TColumn) => void` | Chamado quando edição de coluna é iniciada |

---

## 🛠️ API da Store

### Métodos de Cards

```typescript
// Adicionar card
addCard(columnId: string, card: Omit<KanboomCard, 'id'>): string

// Atualizar card
updateCard(cardId: string, updates: Partial<KanboomCard>): void

// Deletar card
deleteCard(cardId: string): void

// Duplicar card
duplicateCard(cardId: string): string
```

### Métodos de Colunas

```typescript
// Adicionar coluna
addColumn(column: Omit<KanboomColumn, 'id' | 'cardIds'>, position?: number): string

// Atualizar coluna
updateColumn(columnId: string, updates: Partial<KanboomColumn>): void

// Deletar coluna
deleteColumn(columnId: string, moveCardsTo?: string): void

// Mover coluna
moveColumn(columnId: string, newIndex: number): void

// Criar coluna com card
addColumnWithCard(cardId: string, sourceColId: string, columnData: Omit<KanboomColumn, 'id' | 'cardIds'>): void
```

### Métodos de Movimentação

```typescript
// Mover card
moveCard(cardId: string, sourceColId: string, targetColId: string, newIndex: number): void
```

### Métodos de Filtros

```typescript
// Definir busca global
setSearchQuery(query: string): void

// Adicionar grupo de filtros
addFilterGroup(group: FilterGroup): void

// Atualizar grupo de filtros
updateFilterGroup(groupId: string, updates: Partial<FilterGroup>): void

// Remover grupo de filtros
removeFilterGroup(groupId: string): void

// Remover regra de filtro
removeFilterRule(groupId: string, ruleId: string): void

// Definir filtros completos
setFilters(filters: KanbanFilters): void

// Limpar todos os filtros
clearFilters(): void
```

### Métodos Utilitários

```typescript
// Definir dados completos do board
setBoardData(data: KanboomData): void

// Atualizar configuração
setConfig(config: Partial<KanboomConfig>): void

// Limpar board completamente
clearBoard(): void
```

---

## 🎨 Componentes Default

O Kanbase vem com componentes prontos para uso:

- **DefaultCard**: Card padrão com suporte a tags, membros, datas, etc.
- **DefaultColumnHeader**: Header de coluna com contador de cards e ações
- **DefaultColumnEmpty**: Estado vazio para colunas sem cards
- **DefaultAddCardForm**: Formulário para adicionar novos cards
- **DefaultEditForm**: Formulário para editar cards existentes
- **DefaultCardView**: Modal de visualização detalhada do card
- **DefaultEditColumnForm**: Formulário para editar colunas

Todos esses componentes podem ser substituídos usando render props.

---

## 📝 Boas Práticas

### 1. Gerenciamento de Estado

```tsx
// ✅ BOM: Use a store do Kanbase para estado local
const { cards, addCard } = useKanbanStore();

// ✅ BOM: Sincronize com sua API nos callbacks
onCardMove: async (cardId, fromCol, toCol, index) => {
  await syncWithAPI({ cardId, fromCol, toCol, index });
}

// ❌ EVITE: Não misture estado do Kanbase com estado externo desnecessariamente
const [cards, setCards] = useState(); // Use a store do Kanbase
```

### 2. Performance

```tsx
// ✅ BOM: Use virtualização para muitos cards
const config = {
  virtualOverscan: 5,
  estimatedCardHeight: 90
};

// ✅ BOM: Memoize render props customizados
const renderCard = useMemo(() => ({ card, isDragging }) => (
  <CustomCard card={card} isDragging={isDragging} />
), []);
```

### 3. Customização

```tsx
// ✅ BOM: Comece com componentes default e customize gradualmente
const config = {
  allowAdd: true,
  // Adicione render props apenas quando necessário
  renderCard: customCardNeeded ? CustomCard : undefined
};
```

### 4. Tipos

```tsx
// ✅ BOM: Estenda tipos para seus casos de uso
interface MyCard extends KanboomCard {
  metadata: {
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    sprint: number;
  };
}

const config: KanboomConfig<MyCard> = {
  // ...
};
```

---

## 🐛 Troubleshooting

### Cards não aparecem

- Verifique se `setBoardData` foi chamado com dados válidos
- Confirme que `cardIds` nas colunas correspondem aos IDs em `cards`
- Verifique se `columnOrder` inclui todas as colunas

### Drag & Drop não funciona

- Verifique se `allowAdd`, `allowEdit`, etc. estão habilitados conforme necessário
- Confirme que não há erros no console
- Verifique se o container tem altura definida (`h-screen` ou similar)

### Filtros não funcionam

- Confirme que `allowFilters: true` está na config
- Verifique se os campos nos filtros correspondem aos campos dos cards
- Use caminhos completos para campos aninhados: `metadata.priority` não `priority`

### Performance lenta

- Aumente `virtualOverscan` se necessário
- Ajuste `estimatedCardHeight` para corresponder à altura real dos cards
- Verifique se há muitos re-renders (use React DevTools)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

## 📄 Licença

[Adicione sua licença aqui]

---

<p align="center">
  Construído com ❤️ para equipes obcecadas por performance.
</p>
