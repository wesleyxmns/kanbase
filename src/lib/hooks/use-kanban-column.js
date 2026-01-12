import { useRef, useEffect, useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
// Cache de medições de altura por card ID
const heightCache = new Map();
export function useKanbanColumn({ cardIds, estimatedCardHeight, overscan: baseOverscan }) {
    const parentRef = useRef(null);
    const [scrollVelocity, setScrollVelocity] = useState(0);
    // NOTE: We removed useDroppable here because the column is already 
    // registered as a droppable via useSortable in SortableVirtualColumn.
    // Having two registrations with the same ID causes conflicts.
    useEffect(() => {
        const element = parentRef.current;
        if (!element)
            return;
        let lastScrollTop = 0;
        let lastTime = Date.now();
        let rafId;
        const handleScroll = () => {
            const now = Date.now();
            const scrollTop = element.scrollTop;
            const deltaTime = now - lastTime;
            const deltaScroll = Math.abs(scrollTop - lastScrollTop);
            if (deltaTime > 0) {
                const velocity = deltaScroll / deltaTime;
                setScrollVelocity(velocity);
            }
            lastScrollTop = scrollTop;
            lastTime = now;
        };
        const throttledScroll = () => {
            if (rafId)
                cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(handleScroll);
        };
        element.addEventListener('scroll', throttledScroll, { passive: true });
        return () => {
            element.removeEventListener('scroll', throttledScroll);
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, []);
    // Overscan dinâmico baseado em velocidade
    const dynamicOverscan = useMemo(() => {
        if (scrollVelocity > 2000)
            return baseOverscan * 3;
        if (scrollVelocity > 1000)
            return baseOverscan * 2;
        if (scrollVelocity > 500)
            return Math.ceil(baseOverscan * 1.5);
        return baseOverscan;
    }, [scrollVelocity, baseOverscan]);
    const rowVirtualizer = useVirtualizer({
        count: cardIds.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => {
            const cardId = cardIds[index];
            const cached = heightCache.get(cardId);
            if (cached)
                return cached;
            return estimatedCardHeight;
        },
        measureElement: (element) => {
            const height = element.getBoundingClientRect().height;
            const cardId = element.getAttribute('data-card-id');
            if (cardId) {
                heightCache.set(cardId, height);
            }
            return height;
        },
        overscan: dynamicOverscan,
    });
    return {
        parentRef,
        rowVirtualizer
    };
}
