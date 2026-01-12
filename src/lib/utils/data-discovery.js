export function discoverFields(cards) {
    const fields = {
        title: { label: 'Título', value: 'title', type: 'text' },
        description: { label: 'Descrição', value: 'description', type: 'text' },
    };
    Object.values(cards).forEach((card) => {
        if (card.metadata && typeof card.metadata === 'object') {
            Object.entries(card.metadata).forEach(([key, value]) => {
                const path = `metadata.${key}`;
                if (!fields[path]) {
                    let type = 'other';
                    if (typeof value === 'string')
                        type = 'text';
                    else if (typeof value === 'number')
                        type = 'number';
                    else if (typeof value === 'boolean')
                        type = 'boolean';
                    fields[path] = {
                        label: `${key.charAt(0).toUpperCase() + key.slice(1)} (Meta)`,
                        value: path,
                        type,
                    };
                }
            });
        }
    });
    return Object.values(fields);
}
