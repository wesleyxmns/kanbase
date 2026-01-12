import type { KanboomCard, KanboomColumn, KanboomData } from "../types/kanban";

const PRODUCTS = [
  { name: "Motor V8 Turbo", sku: "ENG-V8-T" },
  { name: "Câmbio Automático 9V", sku: "TRN-AT-9" },
  { name: "Diferencial Traseiro", sku: "DIF-RR-01" },
  { name: "Suspensão Ativa X", sku: "SUS-ACT-X" },
  { name: "Eixo de Transmissão", sku: "DRV-SHAFT" },
  { name: "Unidade de Controle (ECU)", sku: "ECU-GEN3" },
  { name: "Bateria de Lítio 80kWh", sku: "BAT-LI-80" },
  { name: "Sistema de Infotenimento", sku: "INF-TOUCH-10" }
];

const COLLABORATORS = [
  { id: "colab_1", name: "João Silva", role: "Senior Mechanic", avatar: "JS" },
  { id: "colab_2", name: "Maria Santos", role: "Junior Technician", avatar: "MS" },
  { id: "colab_3", name: "Pedro Oliveira", role: "Specialist", avatar: "PO" },
  { id: "colab_4", name: "Ana Costa", role: "Quality Analyst", avatar: "AC" }
];

export const generateProductionData = (): KanboomData => {
  const data: KanboomData = {
    cards: {},
    columns: {},
    columnOrder: []
  };

  // 1. Coluna de Estoque (PI_STOCK)
  data.columns['PI_STOCK'] = {
    id: 'PI_STOCK',
    title: 'Estoque de PIs',
    cardIds: [],
    metadata: { type: 'stock' }
  };
  data.columnOrder.push('PI_STOCK');

  // 2. Colunas de Colaboradores
  COLLABORATORS.forEach(colab => {
    data.columns[colab.id] = {
      id: colab.id,
      title: colab.name,
      cardIds: [],
      metadata: { ...colab, type: 'collaborator' }
    };
    data.columnOrder.push(colab.id);
  });

  // 3. Gerar Produtos e Distribuir
  // Vamos gerar 20 produtos aleatórios
  for (let i = 0; i < 20; i++) {
    const prodTemplate = PRODUCTS[i % PRODUCTS.length];
    const cardId = `prod-${100 + i}`;

    // Aleatoriamente atribuir 40% dos produtos a colaboradores
    const shouldAssign = Math.random() > 0.6;
    const assignedColabId = shouldAssign
      ? COLLABORATORS[Math.floor(Math.random() * COLLABORATORS.length)].id
      : null;

    data.cards[cardId] = {
      id: cardId,
      title: `${prodTemplate.name} #${100 + i}`,
      description: prodTemplate.sku,
      metadata: {
        sku: prodTemplate.sku,
        assigned_to: assignedColabId,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        status: assignedColabId ? 'Assigned' : 'In Stock',
        tags: [
          assignedColabId ? { name: 'Assigned', color: 'bg-indigo-100 text-indigo-700' } : { name: 'Stock', color: 'bg-amber-100 text-amber-700' }
        ]
      }
    };

    if (assignedColabId) {
      data.columns[assignedColabId].cardIds.push(cardId);
    } else {
      data.columns['PI_STOCK'].cardIds.push(cardId);
    }
  }

  return data;
};

/**
 * Legay mock data generator, now using production items instead of food.
 */
export const generateMockData = (numColumns: number, cardsPerColumn: number): KanboomData => {
  const data: KanboomData = {
    cards: {},
    columns: {},
    columnOrder: []
  };

  const columnTitles = ["Ideias", "Preparo", "Montagem", "Revisão", "Finalizado"];

  for (let c = 0; c < numColumns; c++) {
    const columnId = `col-${c}`;
    const column: KanboomColumn = {
      id: columnId,
      title: columnTitles[c] || `Etapa ${c + 1}`,
      cardIds: []
    };

    for (let i = 0; i < cardsPerColumn; i++) {
      const cardId = `card-${c}-${i}`;
      const prodTemplate = PRODUCTS[(c * cardsPerColumn + i) % PRODUCTS.length];

      const card: KanboomCard = {
        id: cardId,
        title: `${prodTemplate.name} #${i}`,
        description: prodTemplate.sku,
        metadata: {
          priority: ['low', 'medium', 'high'][(c * i) % 3],
          tags: [
            { name: 'PI', color: 'bg-zinc-100 text-zinc-700' }
          ]
        }
      };

      data.cards[cardId] = card;
      column.cardIds.push(cardId);
    }

    data.columns[columnId] = column;
    data.columnOrder.push(columnId);
  }

  return data;
};