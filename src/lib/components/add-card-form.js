import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
export function AddCardForm({ onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const textareaRef = useRef(null);
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);
    const handleSubmit = (e) => {
        e?.preventDefault();
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-3 rounded-lg shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200", children: [_jsx("textarea", { ref: textareaRef, value: title, onChange: (e) => setTitle(e.target.value), onKeyDown: handleKeyDown, placeholder: "O que precisa ser feito?", className: "w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-slate-700 min-h-[60px] p-0" }), _jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-slate-100", children: [_jsxs("button", { type: "button", onClick: onCancel, className: "text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1", children: [_jsx(X, { size: 14 }), "Cancelar"] }), _jsxs("button", { type: "submit", disabled: !title.trim(), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 shadow-sm active:scale-95", children: [_jsx(Check, { size: 14 }), "Adicionar"] })] })] }));
}
