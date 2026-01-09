const CUISINES = ["Brasileira", "Italiana", "Japonesa", "Francesa", "Mexicana", "Árabe", "Indiana", "Tailandesa"];
const DIFFICULTIES = ["Fácil", "Médio", "Difícil"];
const CHEFS = ["Alex Atala", "Paola Carosella", "Érick Jacquin", "Helena Rizzo", "Rodrigo Oliveira", "Claude Troisgros"];
const DISH_NAMES = [
    "Feijoada Completa", "Moqueca Baiana", "Pão de Queijo", "Coxinha de Frango",
    "Lasanha à Bolonhesa", "Risoto de Cogumelos", "Pizza Margherita", "Gnocchi de Batata",
    "Sushi Variado", "Ramen Shoyu", "Sashimi de Salmão", "Tempurá de Legumes",
    "Ratatouille", "Boeuf Bourguignon", "Quiche Lorraine", "Crème Brûlée",
    "Taco Al Pastor", "Guacamole com Nachos", "Enchiladas Verdes", "Quesadilla de Queijo",
    "Hummus Clássico", "Falafel no prato", "Tabule Fresco", "Kibe Assado",
    "Curry de Grão de Bico", "Samosa Vegetariana", "Butter Chicken", "Naan de Alho",
    "Pad Thai", "Tom Kha Gai", "Som Tum", "Mango Sticky Rice"
];
const DESCRIPTIONS = [
    "Um prato clássico cheio de sabor e tradição.",
    "Preparado com ingredientes frescos e selecionados.",
    "Receita assinada pelo chef com um toque especial.",
    "Equilíbrio perfeito entre temperos e texturas.",
    "Uma explosão de sabores em cada garfada.",
    "Ideal para quem busca uma refeição leve e nutritiva.",
    "O sabor autêntico da culinária regional.",
    "Transforme seu jantar em uma experiência gastronômica."
];
export const generateMockData = (numColumns, cardsPerColumn) => {
    const data = {
        cards: {},
        columns: {},
        columnOrder: []
    };
    const columnTitles = ["Ideias", "Preparo", "Cozimento", "Revisão", "Servido"];
    for (let c = 0; c < numColumns; c++) {
        const columnId = `col-${c}`;
        const column = {
            id: columnId,
            title: columnTitles[c] || `Etapa ${c + 1}`,
            cardIds: []
        };
        for (let i = 0; i < cardsPerColumn; i++) {
            const cardId = `card-${c}-${i}`;
            const dishIndex = (c * cardsPerColumn + i) % DISH_NAMES.length;
            const descIndex = (c * cardsPerColumn + i) % DESCRIPTIONS.length;
            const card = {
                id: cardId,
                title: DISH_NAMES[dishIndex],
                description: DESCRIPTIONS[descIndex],
                metadata: {
                    cuisine: CUISINES[(c + i) % CUISINES.length],
                    difficulty: DIFFICULTIES[(c + i) % DIFFICULTIES.length],
                    prepTime: 15 + ((c * i * 7) % 105), // 15 to 120 min
                    calories: 150 + ((c * i * 31) % 850), // 150 to 1000 kcal
                    rating: 1 + ((c + i) % 5), // 1 to 5 stars
                    isVegetarian: (c + i) % 3 === 0,
                    spiciness: (c + i) % 4, // 0 to 3
                    chef: CHEFS[(c + i) % CHEFS.length],
                    // Premium UI Configs
                    priority: ['low', 'medium', 'high'][(c * i) % 3],
                    tags: [
                        c % 2 === 0 ? { name: 'Frontend', color: 'bg-indigo-100 text-indigo-700' } : null,
                        i % 3 === 0 ? { name: 'Bug', color: 'bg-red-100 text-red-700' } : null,
                        (c + i) % 4 === 0 ? { name: 'Design', color: 'bg-pink-100 text-pink-700' } : null
                    ].filter(Boolean),
                    members: [
                        { name: CHEFS[(c + i) % CHEFS.length], initials: CHEFS[(c + i) % CHEFS.length].split(' ').map((n) => n[0]).join('').substring(0, 2) },
                        (c + i) % 5 === 0 ? { name: 'Guest', initials: 'GU' } : null
                    ].filter(Boolean),
                    commentsCount: (c * i) % 6,
                    attachmentsCount: (c + i) % 4,
                    dueDate: (c + i) % 3 === 0 ? new Date(Date.now() + (Math.random() * 10 - 2) * 86400000).toISOString() : null,
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
