import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils/cn';
import { memo } from 'react';
import { MoreHorizontal, Paperclip, MessageSquare, Calendar } from 'lucide-react';
export const DefaultCard = memo(({ card, isDragging }) => {
    const { tags, members, commentsCount, attachmentsCount, dueDate, priority } = card.metadata || {};
    // Priority Color Map
    const priorityColors = {
        high: 'bg-red-500',
        medium: 'bg-amber-500',
        low: 'bg-emerald-500',
    };
    return (_jsxs("div", { className: cn("group relative bg-card-bg rounded-card border border-card-border p-3", "shadow-card transition-all duration-200 cursor-pointer select-none", "hover:shadow-card-hover hover:-translate-y-0.5 hover:border-slate-300", isDragging && "opacity-50 grayscale-[0.5] scale-[1.02] shadow-xl border-blue-400 ring-1 ring-blue-400 rotate-2 z-50", 
        // Priority Indicator on Left
        priority && "pl-4"), children: [priority && (_jsx("div", { className: cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", priorityColors[priority] || "bg-slate-300") })), _jsxs("div", { className: "flex flex-col gap-2.5", children: [tags && tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mb-0.5", children: tags.map((tag, i) => (_jsx("span", { className: cn("px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight", tag.color || "bg-slate-100 text-slate-600"), children: tag.name }, i))) })), _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors", children: card.title }), _jsx("button", { className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 -mr-1 -mt-1", children: _jsx(MoreHorizontal, { size: 14 }) })] }), card.description && (_jsx("p", { className: "text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium", children: card.description })), (members || commentsCount || attachmentsCount || dueDate) && (_jsxs("div", { className: "flex items-center justify-between mt-1 pt-2.5 border-t border-slate-100/80", children: [_jsx("div", { className: "flex items-center", children: members && members.length > 0 ? (_jsxs("div", { className: "flex -space-x-2 overflow-hidden py-0.5 pl-0.5", children: [members.map((m, i) => (_jsx("div", { className: "h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 ring-1 ring-slate-100", title: m.name, children: m.avatar ? _jsx("img", { src: m.avatar, alt: m.name, className: "w-full h-full rounded-full object-cover" }) : m.initials }, i))), members.length > 3 && (_jsxs("div", { className: "h-6 w-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400", children: ["+", members.length - 3] }))] })) : _jsx("div", {}) }), _jsxs("div", { className: "flex items-center gap-3 text-slate-400", children: [dueDate && (_jsxs("div", { className: cn("flex items-center gap-1 text-[10px] font-medium", new Date(dueDate) < new Date() ? "text-red-500" : "text-slate-400"), children: [_jsx(Calendar, { size: 12 }), _jsx("span", { children: new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })] })), commentsCount > 0 && (_jsxs("div", { className: "flex items-center gap-1 text-[10px] font-medium hover:text-slate-600 transition-colors", children: [_jsx(MessageSquare, { size: 12 }), _jsx("span", { children: commentsCount })] })), attachmentsCount > 0 && (_jsxs("div", { className: "flex items-center gap-1 text-[10px] font-medium hover:text-slate-600 transition-colors", children: [_jsx(Paperclip, { size: 12 }), _jsx("span", { children: attachmentsCount })] }))] })] }))] })] }));
}, (prevProps, nextProps) => {
    // Deep comparison for metadata is risky but we'll check key props
    return (prevProps.card.id === nextProps.card.id &&
        prevProps.card.title === nextProps.card.title &&
        prevProps.card.description === nextProps.card.description &&
        prevProps.isDragging === nextProps.isDragging &&
        JSON.stringify(prevProps.card.metadata) === JSON.stringify(nextProps.card.metadata));
});
DefaultCard.displayName = 'DefaultCard';
