import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function DefaultEditColumnForm({ column, onSave, onCancel, onDelete }) {
    const [title, setTitle] = useState(column.title || '');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title });
    };
    return (_jsx(Dialog, { open: true, onOpenChange: (open) => !open && onCancel(), children: _jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Editar Coluna" }), _jsx(DialogDescription, { children: "Gerencie as configura\u00E7\u00F5es desta coluna." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx("label", { htmlFor: "col-title", className: "text-sm font-medium leading-none", children: "Nome da Coluna" }), _jsx("input", { id: "col-title", autoFocus: true, value: title, onChange: (e) => setTitle(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "Ex: A Fazer" })] }), _jsxs(DialogFooter, { className: "flex items-center justify-between w-full sm:justify-between", children: [onDelete ? (_jsxs(Button, { type: "button", variant: "destructive", size: "sm", onClick: () => {
                                        if (window.confirm("Tem certeza que deseja excluir esta coluna e mover seus cards para a anterior?")) {
                                            onDelete();
                                        }
                                    }, className: "gap-2", children: [_jsx(Trash2, { size: 14 }), "Excluir"] })) : _jsx("div", {}), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }), _jsxs(Button, { type: "submit", className: "gap-2", children: [_jsx(Save, { size: 14 }), "Salvar"] })] })] })] })] }) }));
}
