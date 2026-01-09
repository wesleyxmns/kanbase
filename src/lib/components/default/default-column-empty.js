import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
export const DefaultColumnEmpty = memo(() => {
    return (_jsx("div", { className: "flex items-center justify-center h-32 text-slate-400 text-sm", children: "Arraste cards aqui" }));
});
DefaultColumnEmpty.displayName = 'DefaultColumnEmpty';
