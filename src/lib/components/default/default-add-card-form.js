import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { cn } from '@/lib/utils/cn';
import { Plus } from 'lucide-react';
import { useState } from 'react';
export function DefaultAddCardForm({ columnId: _columnId, onAdd, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            title,
            description,
            metadata: { priority }
        });
    };
    return (_jsx(Dialog, { open: true, onOpenChange: (open) => !open && onCancel(), children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Adicionar Novo Card" }), _jsx(DialogDescription, { children: "Novo item para a coluna." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx("label", { htmlFor: "title", className: "text-sm font-medium leading-none", children: "T\u00EDtulo" }), _jsx("input", { id: "title", autoFocus: true, value: title, onChange: (e) => setTitle(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "O que precisa ser feito?" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium leading-none", children: "Prioridade" }), _jsx("div", { className: "flex gap-2", children: ['low', 'medium', 'high'].map((p) => (_jsx("button", { type: "button", onClick: () => setPriority(p), className: cn("flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all", priority === p
                                            ? p === 'high' ? "bg-red-100 border-red-500 text-red-700" :
                                                p === 'medium' ? "bg-amber-100 border-amber-500 text-amber-900" :
                                                    "bg-emerald-100 border-emerald-500 text-emerald-800"
                                            : "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50"), children: p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta' }, p))) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { htmlFor: "desc", className: "text-sm font-medium leading-none", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { id: "desc", value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "Detalhes adicionais..." })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }), _jsxs(Button, { type: "submit", className: "gap-2 bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(Plus, { size: 16 }), "Criar Card"] })] })] })] }) }));
}
