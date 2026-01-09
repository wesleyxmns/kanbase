# Use Case: Gestão de PIs e Colaboradores

Este guia detalha a implementação do cenário onde **Produtos Intermediários (PIs)** são arrastados para colunas de **Colaboradores** para realizar uma atribuição (assignment).

## 1. O Cenário de Dados (Backend)

Vamos assumir que seu backend possui duas rotas principais. O desafio é unir essas duas fontes de dados em um único Board.

### `GET /api/collaborators` (As Colunas)
```json
[
  { "id": "colab_1", "name": "João Silva", "role": "Senior" },
  { "id": "colab_2", "name": "Maria Santos", "role": "Junior" }
]
```

### `GET /api/products` (Os Cards)
Note que o produto tem um campo `assigned_to` que diz a quem ele pertence. Se for `null`, ele é um PI não alocado.
```json
[
  { "id": "prod_101", "name": "Motor V8", "sku": "ENG-V8", "assigned_to": null },
  { "id": "prod_102", "name": "Cambio Auto", "sku": "TRN-AT", "assigned_to": "colab_1" },
  { "id": "prod_103", "name": "Suspensão", "sku": "SUS-X", "assigned_to": null }
]
```

---

## 2. A Estratégia de Mapeamento

Precisamos transformar esses dois arrays no objeto `KanboomData`.
Lógica:
1. Criar uma **Coluna Fixa** chamada "Estoque de PIs".
2. Criar uma **Coluna Dinâmica** para cada Colaborador.
3. Distribuir os Produtos nas colunas baseando-se no `assigned_to`.

### O Código do Mapeador (Exemplificado)

```typescript
// Função que junta Colaboradores + Produtos e cria o Board
function buildProductionBoard(collaborators: Collab[], products: Product[]): KanboomData {
  const data: KanboomData = {
    cards: {},
    columns: {},
    columnOrder: []
  };

  // PASSO 1: Criar a Coluna de PIs (Estoque)
  // Esta coluna é fixa e sempre será a primeira
  data.columns['PI_STOCK'] = {
    id: 'PI_STOCK',
    title: 'Estoque de PIs',
    cardIds: [] // Vamos preencher depois
  };
  data.columnOrder.push('PI_STOCK');

  // PASSO 2: Criar Colunas para cada Colaborador
  collaborators.forEach(colab => {
    data.columns[colab.id] = {
      id: colab.id,
      title: colab.name, // Nome do Colaborador no topo da coluna
      cardIds: [],
      metadata: { ...colab } // Guardamos os dados do colaborador (cargo, etc)
    };
    data.columnOrder.push(colab.id);
  });

  // PASSO 3: Distribuir os Produtos (Cards)
  products.forEach(prod => {
    const cardId = String(prod.id);
    
    // Preparar o objeto do Card
    data.cards[cardId] = {
      id: cardId,
      title: prod.name,
      description: prod.sku,
      metadata: { ...prod } // Guardamos o dado original do produto
    };

    // Decidir em qual coluna ele entra
    if (prod.assigned_to) {
      // Se já tem dono, vai para a coluna do colaborador
      // (Verificamos se a coluna existe para evitar erro)
      if (data.columns[prod.assigned_to]) {
        data.columns[prod.assigned_to].cardIds.push(cardId);
      }
    } else {
      // Se não tem dono, vai para o Estoque de PIs
      data.columns['PI_STOCK'].cardIds.push(cardId);
    }
  });

  return data;
}
```

---

## 3. Rastreando Movimentos e Lógica de Negócio

Você perguntou: *"Preciso saber quais cards estão sendo renderizados em quais colunas para lógica de transferência"*.

O Kanboom expõe o evento `onCardMove`. É aqui que sua regra de negócio acontece.

### Exemplo de Implementação no Componente

```tsx
const ProductionBoard = () => {
  const { setBoardData } = useKanban();

  // Carregamento inicial (usando o mapper acima)
  useEffect(() => {
    Promise.all([api.getCollaborators(), api.getProducts()])
      .then(([colabs, prods]) => {
        const board = buildProductionBoard(colabs, prods);
        setBoardData(board);
      });
  }, []);

  // LÓGICA DE TRANSFERÊNCIA
  const handleCardMove = async (cardId, fromColId, toColId) => {
    console.log(`Movendo Produto ${cardId} de ${fromColId} para ${toColId}`);

    // Cenário 1: Assignar Produto a Colaborador
    if (fromColId === 'PI_STOCK' && toColId !== 'PI_STOCK') {
      await api.assignProduct({ productId: cardId, collaboratorId: toColId });
      toast.success("Produto atribuído com sucesso!");
    }

    // Cenário 2: Devolver Produto ao Estoque (Des-assignar)
    if (toColId === 'PI_STOCK' && fromColId !== 'PI_STOCK') {
      await api.unassignProduct({ productId: cardId });
      toast.info("Produto devolvido ao estoque.");
    }

    // Cenário 3: Transferir entre Colaboradores
    if (fromColId !== 'PI_STOCK' && toColId !== 'PI_STOCK') {
      await api.transferProduct({ productId: cardId, fromUserId: fromColId, toUserId: toColId });
    }
  };

  return (
    <KanboomBoard 
      config={{
        onCardMove: handleCardMove // Conecta sua lógica aqui
      }}
    />
  );
};
```

## Resumo

1.  **Montagem**: O dado do Kanban é montado misturando seus Colaboradores (Colunas) e Produtos (Cards).
2.  **Identificação**: O ID da coluna É o ID do colaborador. Isso facilita muito saber "pra quem" você arrastou.
3.  **Controle**: O evento `onCardMove` te dá exatamente **O Que** (cardId), **De Onde** (fromColId) e **Para Onde** (toColId) foi movido, permitindo disparar suas requisições de API imediatamente.
