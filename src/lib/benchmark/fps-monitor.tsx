import { useEffect, useState, useRef } from 'react';

export const useFPS = () => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const measure = (time: number) => {
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

interface BenchmarkStatsProps {
  cardCount: number;
  columnCount: number;
}

export const BenchmarkStats = ({ cardCount, columnCount }: BenchmarkStatsProps) => {
  const fps = useFPS();
  const [minFps, setMinFps] = useState(60);
  const [maxFps, setMaxFps] = useState(0);

  const [isStressTesting, setIsStressTesting] = useState(false);

  useEffect(() => {
    if (fps > 0) {
      if (fps < minFps) setMinFps(fps);
      if (fps > maxFps) setMaxFps(fps);
    }
  }, [fps]);

  useEffect(() => {
    if (!isStressTesting) return;

    const columns = document.querySelectorAll('.overflow-y-auto');
    let direction = 1;
    let speed = 2;
    let animationId: number;

    const autoScroll = () => {
      columns.forEach(col => {
        col.scrollTop += speed * direction;
        if (col.scrollTop >= col.scrollHeight - col.clientHeight) direction = -1;
        if (col.scrollTop <= 0) direction = 1;
      });
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationId);
  }, [isStressTesting]);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm z-50 font-mono text-sm">
      <div className="flex items-center justify-between mb-2 gap-2">
        <h3 className="font-bold text-blue-400">⚡ Performance Stats</h3>
        <button
          onClick={() => setIsStressTesting(!isStressTesting)}
          className={`text-xs px-2 py-1 rounded ${isStressTesting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isStressTesting ? 'Stop Stress Test' : 'Start Stress Test'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-slate-400">FPS:</span>
        <span className={`font-bold ${fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
          {fps}
        </span>

        <span className="text-slate-400">Min FPS:</span>
        <span className="text-slate-200">{minFps}</span>

        <span className="text-slate-400">Cards:</span>
        <span className="text-slate-200">{cardCount}</span>

        <span className="text-slate-400">Columns:</span>
        <span className="text-slate-200">{columnCount}</span>
      </div>
    </div>
  );
};
