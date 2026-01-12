import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from 'lucide-react';
export function AddCardButton({ onClick }) {
    return (_jsxs("button", { onClick: onClick, className: "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group", children: [_jsx("div", { className: "bg-slate-200 group-hover:bg-blue-600 group-hover:text-white p-0.5 rounded transition-colors", children: _jsx(Plus, { size: 14 }) }), _jsx("span", { children: "Adicionar card" })] }));
}
