import { memo } from 'react';

export const DefaultColumnEmpty = memo(() => {
  return (
    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
      Arraste cards aqui
    </div>
  );
});

DefaultColumnEmpty.displayName = 'DefaultColumnEmpty';