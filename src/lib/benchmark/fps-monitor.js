import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
export const useFPS = () => {
    const [fps, setFps] = useState(0);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    useEffect(() => {
        let animationFrameId;
        const measure = (time) => {
            frameCount.current++;
            const delta = time - lastTime.current;
            if (delta >= 1000) {
                setFps(Math.round((frameCount.current * 1000) / delta));
                frameCount.current = 0;
                lastTime.current = time;
            }
            animationFrameId = requestAnimationFrame(measure);
        };
        animationFrameId = requestAnimationFrame(measure);
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return fps;
};
export const BenchmarkStats = ({ cardCount, columnCount }) => {
    const fps = useFPS();
    const [minFps, setMinFps] = useState(60);
    const [maxFps, setMaxFps] = useState(0);
    const [isStressTesting, setIsStressTesting] = useState(false);
    useEffect(() => {
        if (fps > 0) {
            if (fps < minFps)
                setMinFps(fps);
            if (fps > maxFps)
                setMaxFps(fps);
        }
    }, [fps]);
    useEffect(() => {
        if (!isStressTesting)
            return;
        const columns = document.querySelectorAll('.overflow-y-auto');
        let direction = 1;
        let speed = 2;
        let animationId;
        const autoScroll = () => {
            columns.forEach(col => {
                col.scrollTop += speed * direction;
                if (col.scrollTop >= col.scrollHeight - col.clientHeight)
                    direction = -1;
                if (col.scrollTop <= 0)
                    direction = 1;
            });
            animationId = requestAnimationFrame(autoScroll);
        };
        animationId = requestAnimationFrame(autoScroll);
        return () => cancelAnimationFrame(animationId);
    }, [isStressTesting]);
    return (_jsxs("div", { className: "fixed bottom-4 right-4 bg-slate-900/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm z-50 font-mono text-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 gap-2", children: [_jsx("h3", { className: "font-bold text-blue-400", children: "\u26A1 Performance Stats" }), _jsx("button", { onClick: () => setIsStressTesting(!isStressTesting), className: `text-xs px-2 py-1 rounded ${isStressTesting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`, children: isStressTesting ? 'Stop Stress Test' : 'Start Stress Test' })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1", children: [_jsx("span", { className: "text-slate-400", children: "FPS:" }), _jsx("span", { className: `font-bold ${fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}`, children: fps }), _jsx("span", { className: "text-slate-400", children: "Min FPS:" }), _jsx("span", { className: "text-slate-200", children: minFps }), _jsx("span", { className: "text-slate-400", children: "Cards:" }), _jsx("span", { className: "text-slate-200", children: cardCount }), _jsx("span", { className: "text-slate-400", children: "Columns:" }), _jsx("span", { className: "text-slate-200", children: columnCount })] })] }));
};
