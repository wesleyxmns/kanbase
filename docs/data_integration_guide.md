# Guia de Integração de Dados - Kanboom

Este guia explica como o Kanboom organiza os dados internamente e como você deve formatar seus dados (vindos de uma API ou mock) para serem renderizados corretamente.

## 1. Arquitetura de Dados Normalizada

O Kanboom utiliza um padrão de **Normalização de Dados**. Em vez de uma árvore aninhada (columns -> cards), usamos tabelas de busca (Records). Isso é o que garante a performance de 60 FPS mesmo com milhares de itens, pois o acesso a qualquer card é instantâneo $O(1)$.

### O Formato Esperado (`KanboomData`)

Tudo o que o Kanban precisa para funcionar deve estar dentro deste objeto:

```typescript
interface KanboomData {
  cards: Record<string, KanboomCard>;
  columns: Record<string, KanboomColumn>;
  columnOrder: string[];
}
```

---

## 2. O Tradutor de Dados (Fluent API Builder)

Para tornar a integração de dados a mais clara e intuitiva possível, propomos o **Kanboom Mapper**. Em vez de uma função com muitos parâmetros, usamos um "Builder" que te guia passo a passo.

### Exemplo de Uso: "Modo Fluente"

Imagine que sua API retorna um array de itens complexos. Veja como você "explica" para o Kanban como ler esses dados:

```tsx
const kanbanData = Kanboom.map(meusDadosDaAPI)
  .intoColumnsUsing('status') // 1. Qual campo do seu JSON vira as colunas?
  .withCardFields({           // 2. Como preencher o Card?
     id: 'id_externo',         // Mapeia UID para ID do Kanban
     title: 'nome_tarefa',     // Mapeia campo de nome para Título
     description: (item) => (  // Mapeia com lógica customizada
       `Cliente: ${item.cliente} - Prioridade: ${item.prio}`
     )
  })
  .withColumnTitles({         // 3. (Opcional) Nomes legíveis para as colunas
     'todo': 'A Fazer',
     'in_progress': 'Executando',
     'done': 'Finalizado'
  })
  .build();                   // 4. Gera o KanboomData pronto para o Store
```

### Por que esta abordagem é superior?

1.  **Leitura Natural**: O código parece uma frase: "Mapeie os dados, divida em colunas usando 'status', defina os campos do card e construa".
2.  **Auto-Completar (Intellisense)**: Por ser orientado a métodos, seu editor (VS Code) vai te sugerir quais passos faltam.
3.  **Flexibilidade Máxima**: Toda a informação original é preservada no campo `metadata` por padrão.

---

## 3. Integrando com o Ciclo do React

A maneira profissional de usar o Mapper com uma API é dentro de um `useEffect`:

```tsx
const { setBoardData } = useKanban();

useEffect(() => {
  api.get('/os/lista').then(response => {
    const data = Kanboom.map(response.data)
      .intoColumnsUsing('fase_id')
      .withCardFields({
        id: 'os_numero',
        title: 'os_descricao'
      })
      .build();

    setBoardData(data);
  });
}, []);
```

---

## 4. Por que usar `metadata`?

Como você tem controle total sobre o que renderiza no card, o objeto `KanboomCard` possui um campo genérico chamado `metadata`. É lá que você deve colocar os dados da sua regra de negócio (ex: tags, autor, etc).

---

## 5. Como o Kanban recebe o dado atualizado?

O `KanboomBoard` lê os dados do **Store**. Para atualizar o board, use a função `setBoardData` do hook `useKanban`. Isso faz o Kanban refletir as mudanças instantaneamente sem re-renderizar a página inteira.
