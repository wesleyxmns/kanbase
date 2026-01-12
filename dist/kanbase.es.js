import { jsxs as i, jsx as r, Fragment as Re } from "react/jsx-runtime";
import { useSensors as Te, useSensor as ne, MouseSensor as Me, TouchSensor as Ve, KeyboardSensor as Be, DndContext as He, MeasuringStrategy as qe, DragOverlay as $e, closestCenter as ae, pointerWithin as Le, rectIntersection as Ge, getFirstCollision as Ke, useDroppable as We } from "@dnd-kit/core";
import { useSortable as ge, SortableContext as he, verticalListSortingStrategy as Qe, horizontalListSortingStrategy as Ue } from "@dnd-kit/sortable";
import { useVirtualizer as fe } from "@tanstack/react-virtual";
import { MoreHorizontal as be, Calendar as Ce, MessageSquare as Pe, Paperclip as _e, GripVertical as Je, Plus as G, X as Q, Trash2 as oe, Save as xe, AlignLeft as Xe, User as Ye, Tag as Ze, Info as et, RotateCcw as tt, Filter as ce } from "lucide-react";
import * as R from "react";
import { useState as D, useCallback as Y, useRef as j, useEffect as L, memo as M, useMemo as $, cloneElement as rt, isValidElement as nt } from "react";
import { clsx as ve } from "clsx";
import { twMerge as we } from "tailwind-merge";
import { create as at } from "zustand";
import { devtools as lt } from "zustand/middleware";
import { CSS as ye } from "@dnd-kit/utilities";
import * as v from "@radix-ui/react-dialog";
import { Slot as ot } from "@radix-ui/react-slot";
import { cva as Ne } from "class-variance-authority";
function S(...t) {
  return we(ve(t));
}
const Z = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, B = at()(lt((t) => ({
  cards: {},
  columns: {},
  columnOrder: [],
  config: {},
  activeId: null,
  viewingCardId: null,
  editingCardId: null,
  addingCardInColumnId: null,
  editingColumnId: null,
  // Initial Filter State
  filters: {
    searchQuery: "",
    groups: [],
    quickFilters: []
  },
  // === CARDS ===
  addCard: (e, n) => {
    const a = Z(), o = {
      id: a,
      ...n
    };
    return t((l) => {
      const c = l.columns[e];
      return c ? {
        cards: { ...l.cards, [a]: o },
        columns: {
          ...l.columns,
          [e]: {
            ...c,
            cardIds: [...c.cardIds, a]
          }
        }
      } : l;
    }), a;
  },
  updateCard: (e, n) => t((a) => {
    const o = a.cards[e];
    return o ? {
      cards: {
        ...a.cards,
        [e]: { ...o, ...n }
      }
    } : a;
  }),
  deleteCard: (e) => t((n) => {
    const { [e]: a, ...o } = n.cards, l = { ...n.columns };
    return Object.keys(l).forEach((c) => {
      l[c] = {
        ...l[c],
        cardIds: l[c].cardIds.filter((p) => p !== e)
      };
    }), {
      cards: o,
      columns: l
    };
  }),
  duplicateCard: (e) => {
    let n = "";
    return t((a) => {
      const o = a.cards[e];
      if (!o)
        return a;
      const l = Object.keys(a.columns).find((d) => a.columns[d].cardIds.includes(e));
      if (!l)
        return a;
      n = Z();
      const c = {
        ...o,
        id: n,
        title: `${o.title} (copy)`
      }, p = a.columns[l], u = p.cardIds.indexOf(e), s = [...p.cardIds];
      return s.splice(u + 1, 0, n), {
        cards: { ...a.cards, [n]: c },
        columns: {
          ...a.columns,
          [l]: {
            ...p,
            cardIds: s
          }
        }
      };
    }), n;
  },
  // === COLUMNS ===
  addColumn: (e, n) => {
    const a = Z(), o = {
      id: a,
      ...e,
      cardIds: []
    };
    return t((l) => {
      const c = [...l.columnOrder], p = n ?? c.length;
      return c.splice(p, 0, a), {
        columns: { ...l.columns, [a]: o },
        columnOrder: c
      };
    }), a;
  },
  updateColumn: (e, n) => t((a) => {
    const o = a.columns[e];
    return o ? {
      columns: {
        ...a.columns,
        [e]: { ...o, ...n }
      }
    } : a;
  }),
  deleteColumn: (e, n) => t((a) => {
    const o = a.columns[e];
    if (!o)
      return a;
    const { [e]: l, ...c } = a.columns, p = a.columnOrder.filter((d) => d !== e);
    let u = { ...a.cards }, s = { ...c };
    if (n && s[n]) {
      const d = s[n];
      s[n] = {
        ...d,
        cardIds: [...d.cardIds, ...o.cardIds]
      }, o.cardIds.forEach((g) => {
        u[g] && (u[g] = { ...u[g], previousColumnId: e });
      });
    } else {
      const d = p.length > 0 ? p[0] : null;
      o.cardIds.forEach((g) => {
        const h = u[g];
        if (!h)
          return;
        const f = h.previousColumnId && s[h.previousColumnId] ? h.previousColumnId : d;
        if (f && s[f]) {
          const m = s[f];
          s[f] = {
            ...m,
            cardIds: [...m.cardIds, g]
          }, u[g] = { ...h };
        } else
          delete u[g];
      });
    }
    return {
      cards: u,
      columns: s,
      columnOrder: p
    };
  }),
  // === MOVEMENT ===
  moveCard: (e, n, a, o) => t((l) => {
    const c = l.columns[n], p = l.columns[a];
    if (!c || !p)
      return l;
    const u = c.cardIds.filter((g) => g !== e);
    if (n === a)
      return u.splice(o, 0, e), {
        ...l,
        columns: {
          ...l.columns,
          [n]: { ...c, cardIds: u }
        }
      };
    const s = [...p.cardIds];
    s.splice(o, 0, e);
    const d = { ...l.cards[e], previousColumnId: n };
    return {
      ...l,
      cards: { ...l.cards, [e]: d },
      columns: {
        ...l.columns,
        [n]: { ...c, cardIds: u },
        [a]: { ...p, cardIds: s }
      }
    };
  }),
  moveColumn: (e, n) => t((a) => {
    const o = a.columnOrder.filter((l) => l !== e);
    return o.splice(n, 0, e), { ...a, columnOrder: o };
  }),
  addColumnWithCard: (e, n, a) => t((o) => {
    const l = o.columns[n], c = o.cards[e];
    if (!l || !c)
      return o;
    const p = Z(), u = {
      id: p,
      ...a,
      cardIds: [e]
    }, s = l.cardIds.filter((h) => h !== e), d = Array.from(o.columnOrder);
    d.push(p);
    const g = { ...c, previousColumnId: n };
    return {
      ...o,
      cards: { ...o.cards, [e]: g },
      columns: {
        ...o.columns,
        [n]: { ...l, cardIds: s },
        [p]: u
      },
      columnOrder: d
    };
  }),
  // === FILTERS ===
  setSearchQuery: (e) => t((n) => ({
    filters: { ...n.filters, searchQuery: e }
  })),
  addFilterGroup: (e) => t((n) => ({
    filters: { ...n.filters, groups: [...n.filters.groups, e] }
  })),
  updateFilterGroup: (e, n) => t((a) => ({
    filters: {
      ...a.filters,
      groups: a.filters.groups.map((o) => o.id === e ? { ...o, ...n } : o)
    }
  })),
  removeFilterGroup: (e) => t((n) => ({
    filters: { ...n.filters, groups: n.filters.groups.filter((a) => a.id !== e) }
  })),
  removeFilterRule: (e, n) => t((a) => ({
    filters: {
      ...a.filters,
      groups: a.filters.groups.map((o) => o.id !== e ? o : {
        ...o,
        rules: o.rules.filter((l) => !("id" in l) || l.id !== n)
      })
    }
  })),
  setFilters: (e) => t({ filters: e }),
  clearFilters: () => t((e) => ({
    filters: { ...e.filters, groups: [], searchQuery: "" }
  })),
  // === UTILITY ===
  setBoardData: (e) => t({ ...e }),
  setConfig: (e) => t((n) => ({ config: { ...n.config, ...e } })),
  setActiveId: (e) => t({ activeId: e }),
  setViewingCardId: (e) => t({ viewingCardId: e }),
  clearViewingCardId: () => t({ viewingCardId: null }),
  setEditingCardId: (e) => t({ editingCardId: e }),
  clearEditingCardId: () => t({ editingCardId: null }),
  setAddingCardInColumnId: (e) => t({ addingCardInColumnId: e }),
  clearAddingCardInColumnId: () => t({ addingCardInColumnId: null }),
  setEditingColumnId: (e) => t({ editingColumnId: e }),
  clearEditingColumnId: () => t({ editingColumnId: null }),
  clearBoard: () => t({
    cards: {},
    columns: {},
    columnOrder: [],
    filters: { searchQuery: "", groups: [], quickFilters: [] }
  })
})));
function it(t) {
  const e = B(), [n, a] = D(null), [o, l] = D(null), [c, p] = D(null), u = Y((h) => {
    a(h);
  }, []), s = Y((h, f) => {
    l(h), p(f ?? null);
  }, []), d = Y(() => {
    a(null), l(null), p(null);
  }, []), g = Y((h, f, m, b) => {
    e.moveCard(h, f, m, b), t?.onCardMove?.(h, f, m, b);
  }, [e, t]);
  return {
    // Estado
    ...e,
    activeId: n,
    overId: o,
    overSide: c,
    viewingCardId: e.viewingCardId,
    editingCardId: e.editingCardId,
    addingCardInColumnId: e.addingCardInColumnId,
    editingColumnId: e.editingColumnId,
    // Use store version
    setViewingCardId: e.setViewingCardId,
    clearViewingCardId: e.clearViewingCardId,
    // Ações de Cards
    handleDragStart: u,
    handleDragOver: s,
    handleDragEnd: d,
    moveCard: g,
    addCard: e.addCard,
    updateCard: e.updateCard,
    deleteCard: e.deleteCard,
    duplicateCard: e.duplicateCard,
    setEditingCardId: e.setEditingCardId,
    clearEditingCardId: e.clearEditingCardId,
    setAddingCardInColumnId: e.setAddingCardInColumnId,
    clearAddingCardInColumnId: e.clearAddingCardInColumnId,
    // Ações de Colunas
    addColumn: e.addColumn,
    addColumnWithCard: e.addColumnWithCard,
    updateColumn: e.updateColumn,
    deleteColumn: e.deleteColumn,
    moveColumn: e.moveColumn,
    setEditingColumnId: e.setEditingColumnId,
    clearEditingColumnId: e.clearEditingColumnId,
    // Utilitários
    clearBoard: e.clearBoard,
    // Configurações
    config: {
      dragActivationDistance: t?.dragActivationDistance ?? 10,
      touchActivationDelay: t?.touchActivationDelay ?? 250,
      virtualOverscan: t?.virtualOverscan ?? 5,
      estimatedCardHeight: t?.estimatedCardHeight ?? 90,
      columnWidth: t?.columnWidth ?? 320,
      columnMinHeight: t?.columnMinHeight ?? 500,
      gap: t?.gap ?? 16,
      allowAdd: t?.allowAdd ?? !1,
      allowEdit: t?.allowEdit ?? !1,
      allowColumnAdd: t?.allowColumnAdd ?? !1,
      allowColumnEdit: t?.allowColumnEdit ?? !1,
      allowColumnDelete: t?.allowColumnDelete ?? !1,
      allowColumnReorder: t?.allowColumnReorder ?? !1,
      allowFilters: t?.allowFilters ?? !0,
      showURLSync: t?.showURLSync ?? !1
    }
  };
}
function dt({ dragActivationDistance: t, touchActivationDelay: e, onDragStart: n, onDragOver: a, onDragEnd: o, onCardMove: l, onColumnMove: c, onCreateColumnWithCard: p, columns: u, columnOrder: s, recentlyMovedToNewContainer: d }) {
  const g = j(u), h = j(s);
  L(() => {
    g.current = u, h.current = s;
  }, [u, s]);
  const f = j(null);
  return {
    sensors: Te(ne(Me, {
      activationConstraint: { distance: t }
    }), ne(Ve, {
      activationConstraint: { delay: e, tolerance: 5 }
    }), ne(Be)),
    handleDragStart: (C) => {
      const A = C.active.data.current?.type || "Card";
      f.current = null, n(C.active.id, A);
    },
    handleDragOver: (C) => {
      const { active: y, over: A } = C, V = y.data.current?.type || "Card", F = g.current, ie = h.current;
      if (!A) {
        a(null), f.current = null;
        return;
      }
      const z = y.id, O = A.id, K = A.rect, W = y.rect.current.translated;
      let H = null;
      if (W && K)
        if (V === "Column") {
          const I = K.left + K.width / 2;
          H = W.left + W.width / 2 < I ? "left" : "right";
        } else {
          const I = K.top + K.height / 2;
          H = W.top + W.height / 2 < I ? "top" : "bottom";
        }
      if (a(O, H), V === "Column") {
        let I = O;
        if (!F[O]) {
          const se = Object.values(F).find((je) => je.cardIds.includes(O));
          se && (I = se.id);
        }
        const q = ie.indexOf(I), de = ie.indexOf(z);
        q !== -1 && de !== -1 && de !== q && (c(z, q), f.current && (f.current.targetIndex = q));
        return;
      }
      if (O === "new-column-drop-target") {
        const I = Object.values(F).find((q) => q.cardIds.includes(z));
        I && (f.current = {
          type: "NewColumn",
          activeId: z,
          sourceColumnId: I.id,
          targetIndex: 0
        });
        return;
      }
      const T = Object.values(F).find((I) => I.cardIds.includes(z));
      if (!T)
        return;
      if (F[O]) {
        T.id !== O ? (d && (d.current = !0), f.current = {
          type: "Card",
          activeId: z,
          sourceColumnId: T.id,
          targetColumnId: O,
          targetIndex: F[O].cardIds.length,
          side: "bottom"
          // Default para coluna vazia/header
        }) : f.current = null;
        return;
      }
      const J = Object.values(F).find((I) => I.cardIds.includes(O));
      if (!J)
        return;
      const X = J.cardIds.indexOf(O), ze = H === "bottom" ? X + 1 : X;
      T.id !== J.id ? (d && (d.current = !0), f.current = {
        type: "Card",
        activeId: z,
        sourceColumnId: T.id,
        targetColumnId: J.id,
        targetIndex: ze,
        side: H
      }) : T.cardIds.indexOf(z) !== X && (f.current = {
        type: "Card",
        activeId: z,
        sourceColumnId: T.id,
        targetColumnId: T.id,
        targetIndex: X,
        // Para mesma coluna, dnd-kit prefere swap direto ou splice
        side: H
      });
    },
    handleDragEnd: () => {
      if (f.current) {
        const C = f.current;
        C.type === "NewColumn" && C.sourceColumnId && p ? p(C.activeId, C.sourceColumnId) : C.type === "Card" && C.sourceColumnId && C.targetColumnId ? l(C.activeId, C.sourceColumnId, C.targetColumnId, C.targetIndex) : C.type === "Column" && c(C.activeId, C.targetIndex);
      }
      f.current = null, o();
    }
  };
}
function st(t, e) {
  if (e.searchQuery) {
    const n = e.searchQuery.toLowerCase(), a = t.title?.toLowerCase().includes(n), o = t.description?.toLowerCase().includes(n), l = t.metadata && Object.values(t.metadata).some((c) => String(c).toLowerCase().includes(n));
    if (!a && !o && !l)
      return !1;
  }
  return e.groups.length === 0 ? !0 : e.groups.every((n) => n.enabled ? le(t, n) : !0);
}
function le(t, e) {
  const { conjunction: n, rules: a } = e;
  return a.length === 0 ? !0 : n === "and" ? a.every((o) => "conjunction" in o ? le(t, o) : ue(t, o)) : a.some((o) => "conjunction" in o ? le(t, o) : ue(t, o));
}
function ue(t, e) {
  if (!e.field || !e.enabled)
    return !0;
  const n = ct(t, e.field), a = e.value;
  switch (e.operator) {
    case "eq":
      return n === a;
    case "neq":
      return n !== a;
    case "contains":
      return String(n || "").toLowerCase().includes(String(a || "").toLowerCase());
    case "notContains":
      return !String(n || "").toLowerCase().includes(String(a || "").toLowerCase());
    case "gt":
      return Number(n) > Number(a);
    case "gte":
      return Number(n) >= Number(a);
    case "lt":
      return Number(n) < Number(a);
    case "lte":
      return Number(n) <= Number(a);
    case "isEmpty":
      return !n || Array.isArray(n) && n.length === 0;
    case "isNotEmpty":
      return !!n && (!Array.isArray(n) || n.length > 0);
    default:
      return !0;
  }
}
function ct(t, e) {
  return e.split(".").reduce((n, a) => n && n[a], t);
}
function E(...t) {
  return we(ve(t));
}
const Ie = M(({ card: t, isDragging: e }) => {
  const { tags: n, members: a, commentsCount: o, attachmentsCount: l, dueDate: c, priority: p } = t.metadata || {}, u = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500"
  };
  return i("div", { className: E(
    "group relative bg-card-bg rounded-card border border-card-border p-3",
    "shadow-card transition-all duration-200 cursor-pointer select-none",
    "hover:shadow-card-hover hover:-translate-y-0.5 hover:border-slate-300",
    e && "opacity-50 grayscale-[0.5] scale-[1.02] shadow-xl border-blue-400 ring-1 ring-blue-400 rotate-2 z-50",
    // Priority Indicator on Left
    p && "pl-4"
  ), children: [p && r("div", { className: E("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", u[p] || "bg-slate-300") }), i("div", { className: "flex flex-col gap-2.5", children: [n && n.length > 0 && r("div", { className: "flex flex-wrap gap-1 mb-0.5", children: n.map((s, d) => r("span", { className: E("px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight", s.color || "bg-slate-100 text-slate-600"), children: s.name }, d)) }), i("div", { className: "flex items-start justify-between gap-2", children: [r("h4", { className: "text-sm font-semibold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors", children: t.title }), r("button", { className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 -mr-1 -mt-1", children: r(be, { size: 14 }) })] }), t.description && r("p", { className: "text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium", children: t.description }), (a || o || l || c) && i("div", { className: "flex items-center justify-between mt-1 pt-2.5 border-t border-slate-100/80", children: [r("div", { className: "flex items-center", children: a && a.length > 0 ? i("div", { className: "flex -space-x-2 overflow-hidden py-0.5 pl-0.5", children: [a.map((s, d) => r("div", { className: "h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 ring-1 ring-slate-100", title: s.name, children: s.avatar ? r("img", { src: s.avatar, alt: s.name, className: "w-full h-full rounded-full object-cover" }) : s.initials }, d)), a.length > 3 && i("div", { className: "h-6 w-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400", children: ["+", a.length - 3] })] }) : r("div", {}) }), i("div", { className: "flex items-center gap-3 text-slate-400", children: [c && i("div", { className: E("flex items-center gap-1 text-[10px] font-medium", new Date(c) < /* @__PURE__ */ new Date() ? "text-red-500" : "text-slate-400"), children: [r(Ce, { size: 12 }), r("span", { children: new Date(c).toLocaleDateString(void 0, { month: "short", day: "numeric" }) })] }), o > 0 && i("div", { className: "flex items-center gap-1 text-[10px] font-medium hover:text-slate-600 transition-colors", children: [r(Pe, { size: 12 }), r("span", { children: o })] }), l > 0 && i("div", { className: "flex items-center gap-1 text-[10px] font-medium hover:text-slate-600 transition-colors", children: [r(_e, { size: 12 }), r("span", { children: l })] })] })] })] })] });
}, (t, e) => t.card.id === e.card.id && t.card.title === e.card.title && t.card.description === e.card.description && t.isDragging === e.isDragging && JSON.stringify(t.card.metadata) === JSON.stringify(e.card.metadata));
Ie.displayName = "DefaultCard";
const De = M(() => r("div", { className: "flex items-center justify-center h-32 text-slate-400 text-sm", children: "Arraste cards aqui" }));
De.displayName = "DefaultColumnEmpty";
const Ee = M(({ column: t, cardCount: e, isOver: n, dragHandleProps: a, onAddCard: o, onEditColumn: l }) => i("div", { className: E("px-3 py-3 flex items-center justify-between transition-colors mb-2 rounded-t-xl select-none group/header", n ? "bg-blue-50/80" : "bg-transparent"), children: [i("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [a && r("div", { ...a.attributes, ...a.listeners, onClick: (c) => c.stopPropagation(), className: "cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-200/50 transition-colors", children: r(Je, { size: 14 }) }), r("h3", { className: "font-semibold text-sm text-slate-700 truncate tracking-tight flex-1", children: t.title }), r("span", { className: "text-[10px] bg-slate-200/50 border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 font-bold tabular-nums", children: e })] }), i("div", { className: "flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity", children: [o && r("button", { onClick: o, className: "p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors", title: "Adicionar Card", children: r(G, { size: 14 }) }), l && r("button", { onClick: l, className: "p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors", title: "Editar Coluna", children: r(be, { size: 14 }) })] })] }));
Ee.displayName = "DefaultColumnHeader";
const ee = v.Root, ut = v.Portal, Se = R.forwardRef(({ className: t, ...e }, n) => r(v.Overlay, { ref: n, className: S("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", t), ...e }));
Se.displayName = v.Overlay.displayName;
const U = R.forwardRef(({ className: t, children: e, ...n }, a) => i(ut, { children: [r(Se, {}), i(v.Content, { ref: a, className: S("fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-48% data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-48% sm:rounded-lg", t), ...n, children: [e, i(v.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [r(Q, { className: "h-4 w-4" }), r("span", { className: "sr-only", children: "Close" })] })] })] }));
U.displayName = v.Content.displayName;
const P = ({ className: t, ...e }) => r("div", { className: S("flex flex-col space-y-1.5 text-center sm:text-left", t), ...e });
P.displayName = "DialogHeader";
const te = ({ className: t, ...e }) => r("div", { className: S("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", t), ...e });
te.displayName = "DialogFooter";
const _ = R.forwardRef(({ className: t, ...e }, n) => r(v.Title, { ref: n, className: S("text-lg font-semibold leading-none tracking-tight", t), ...e }));
_.displayName = v.Title.displayName;
const re = R.forwardRef(({ className: t, ...e }, n) => r(v.Description, { ref: n, className: S("text-sm text-muted-foreground", t), ...e }));
re.displayName = v.Description.displayName;
const mt = Ne("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
}), w = R.forwardRef(({ className: t, variant: e, size: n, asChild: a = !1, ...o }, l) => r(a ? ot : "button", { className: S(mt({ variant: e, size: n, className: t })), ref: l, ...o }));
w.displayName = "Button";
function pt({ card: t, onSave: e, onCancel: n, onDelete: a }) {
  const [o, l] = D(t.title || ""), [c, p] = D(t.description || ""), u = (s) => {
    s.preventDefault(), e({ title: o, description: c });
  };
  return r(ee, { open: !0, onOpenChange: (s) => !s && n(), children: i(U, { className: "sm:max-w-[425px]", children: [i(P, { children: [r(_, { children: "Editar Card" }), r(re, { children: "Faça alterações no card aqui. Clique em salvar quando terminar." })] }), i("form", { onSubmit: u, className: "grid gap-4 py-4", children: [i("div", { className: "grid gap-2", children: [r("label", { htmlFor: "title", className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Título" }), r("input", { id: "title", autoFocus: !0, value: o, onChange: (s) => l(s.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Digite o título..." })] }), i("div", { className: "grid gap-2", children: [r("label", { htmlFor: "desc", className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Descrição" }), r("textarea", { id: "desc", value: c, onChange: (s) => p(s.target.value), rows: 4, className: "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none", placeholder: "Adicione uma descrição..." })] }), i(te, { className: "flex items-center justify-between w-full sm:justify-between", children: [a && i(w, { type: "button", variant: "destructive", size: "sm", onClick: a, className: "gap-2", children: [r(oe, { size: 14 }), "Excluir"] }), i("div", { className: "flex gap-2", children: [r(w, { type: "button", variant: "outline", onClick: n, children: "Cancelar" }), i(w, { type: "submit", className: "gap-2", children: [r(xe, { size: 14 }), "Salvar"] })] })] })] })] }) });
}
const gt = M(({ card: t, onClose: e }) => {
  const { priority: n, tags: a, members: o, dueDate: l, ...c } = t.metadata || {}, u = n && {
    high: { label: "Alta", color: "text-red-700", bg: "bg-red-50 border-red-200" },
    medium: { label: "Média", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    low: { label: "Baixa", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
  }[n];
  return r(ee, { open: !0, onOpenChange: (s) => !s && e(), children: i(U, { className: "sm:max-w-2xl p-0 gap-0 overflow-hidden bg-white", children: [u && r("div", { className: E("h-1.5 w-full", u.bg.split(" ")[0], u.bg.replace("bg-", "bg-opacity-100")) }), i("div", { className: "flex flex-col h-full max-h-[85vh]", children: [r(P, { className: "p-6 pb-4", children: i("div", { className: "flex items-start gap-4", children: [r("div", { className: "mt-1 p-2 bg-slate-100 rounded-lg text-slate-500", children: r(Xe, { size: 20 }) }), i("div", { className: "space-y-1 flex-1", children: [r(_, { className: "text-xl font-bold text-slate-900 leading-tight", children: t.title }), r("p", { className: "text-xs text-slate-400 font-medium uppercase tracking-wider", children: t.id })] }), u && r("div", { className: E("px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide", u.color, u.bg), children: u.label })] }) }), i("div", { className: "flex-1 overflow-y-auto p-6 pt-0 grid md:grid-cols-[1fr,240px] gap-8", children: [i("div", { className: "space-y-6", children: [i("div", { className: "space-y-3", children: [r("h4", { className: "text-sm font-semibold text-slate-900 flex items-center gap-2", children: "Descrição" }), r("div", { className: E("text-sm text-slate-600 leading-relaxed p-4 rounded-lg border border-slate-100 bg-slate-50/50 min-h-[100px]", !t.description && "italic text-slate-400 flex items-center justify-center"), children: t.description || "Nenhuma descrição fornecida." })] }), t.content && i("div", { className: "space-y-3", children: [r("h4", { className: "text-sm font-semibold text-slate-900", children: "Conteúdo Detalhado" }), r("pre", { className: "text-xs font-mono bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto shadow-inner", children: typeof t.content == "object" ? JSON.stringify(t.content, null, 2) : t.content })] })] }), i("div", { className: "space-y-6", children: [l && i("div", { className: "space-y-1.5", children: [i("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [r(Ce, { size: 12 }), " Data de Entrega"] }), r("div", { className: "text-sm font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-md border border-slate-200", children: new Date(l).toLocaleDateString() })] }), o && Array.isArray(o) && o.length > 0 && i("div", { className: "space-y-2", children: [i("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [r(Ye, { size: 12 }), " Membros"] }), r("div", { className: "flex flex-col gap-2", children: o.map((s, d) => i("div", { className: "flex items-center gap-2 text-sm text-slate-700 bg-white p-1.5 rounded-md border border-slate-100 shadow-sm", children: [r("div", { className: "h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0", children: s.avatar ? r("img", { src: s.avatar, alt: s.name, className: "w-full h-full object-cover" }) : s.initials }), r("span", { className: "truncate", children: s.name })] }, d)) })] }), a && Array.isArray(a) && a.length > 0 && i("div", { className: "space-y-2", children: [i("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [r(Ze, { size: 12 }), " Tags"] }), r("div", { className: "flex flex-wrap gap-1.5", children: a.map((s, d) => r("span", { className: E("px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm", s.color ? `bg-${s.color}-50 text-${s.color}-700 border-${s.color}-200` : "bg-slate-100 text-slate-700 border-slate-200"), children: s.name }, d)) })] }), Object.keys(c).length > 0 && i("div", { className: "space-y-3 pt-4 border-t border-slate-100", children: [i("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [r(et, { size: 12 }), " Outros Detalhes"] }), r("div", { className: "grid gap-3", children: Object.entries(c).map(([s, d]) => i("div", { className: "group", children: [r("dt", { className: "text-[10px] font-bold text-slate-400 uppercase mb-0.5 group-hover:text-slate-600 transition-colors", children: s.replace(/([A-Z])/g, " $1") }), r("dd", { className: "text-sm font-medium text-slate-800 break-words", children: typeof d == "boolean" ? d ? r("span", { className: "inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs", children: "Sim" }) : r("span", { className: "text-slate-400", children: "Não" }) : String(d) })] }, s)) })] })] })] }), r("div", { className: "p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end", children: r(w, { variant: "outline", onClick: e, className: "hover:bg-white hover:text-slate-900 transition-colors", children: "Fechar Visualização" }) })] })] }) });
});
function ht() {
  const { filters: t, removeFilterRule: e, clearFilters: n } = B(), a = t.groups.flatMap((o) => o.rules.filter((l) => !("conjunction" in l) && l.enabled).map((l) => ({ groupId: o.id, rule: l })));
  return a.length === 0 && !t.searchQuery ? null : i("div", { className: "flex flex-wrap items-center gap-2 px-4 py-2 bg-slate-50/50 border-b min-h-[48px] animate-in fade-in slide-in-from-top-1 duration-300", children: [i("div", { className: "flex items-center gap-1.5 mr-2", children: [r("div", { className: "h-2 w-2 rounded-full bg-primary animate-pulse" }), r("span", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-tight", children: "Filtros Ativos:" })] }), t.searchQuery && i("div", { className: "flex items-center gap-1 bg-white border border-primary/20 rounded-full px-3 py-1 text-[11px] shadow-sm", children: [r("span", { className: "text-slate-500", children: "Busca:" }), r("span", { className: "font-semibold text-primary", children: t.searchQuery }), r("button", { onClick: () => B.getState().setSearchQuery(""), className: "ml-1 hover:text-destructive transition-colors", children: r(Q, { className: "h-3 w-3" }) })] }), a.map(({ groupId: o, rule: l }) => i("div", { className: "flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1 text-[11px] shadow-sm hover:border-primary/30 transition-colors group", children: [i("span", { className: "text-slate-400 capitalize", children: [l.field.split(".").pop(), ":"] }), r("span", { className: "font-semibold text-slate-700", children: l.value || "(vazio)" }), r("button", { onClick: () => e(o, l.id), className: "ml-1 text-slate-300 group-hover:text-destructive transition-colors", children: r(Q, { className: "h-3 w-3" }) })] }, l.id)), i(w, { variant: "ghost", size: "sm", className: "h-7 text-[10px] font-bold text-slate-400 hover:text-destructive gap-1 px-2 border-l ml-auto rounded-none", onClick: n, children: [r(tt, { className: "h-3 w-3" }), "LIMPAR TUDO"] })] });
}
const me = /* @__PURE__ */ new Map();
function ft({ cardIds: t, estimatedCardHeight: e, overscan: n }) {
  const a = j(null), [o, l] = D(0);
  L(() => {
    const u = a.current;
    if (!u)
      return;
    let s = 0, d = Date.now(), g;
    const h = () => {
      const m = Date.now(), b = u.scrollTop, N = m - d, x = Math.abs(b - s);
      if (N > 0) {
        const C = x / N;
        l(C);
      }
      s = b, d = m;
    }, f = () => {
      g && cancelAnimationFrame(g), g = requestAnimationFrame(h);
    };
    return u.addEventListener("scroll", f, { passive: !0 }), () => {
      u.removeEventListener("scroll", f), g && cancelAnimationFrame(g);
    };
  }, []);
  const c = $(() => o > 2e3 ? n * 3 : o > 1e3 ? n * 2 : o > 500 ? Math.ceil(n * 1.5) : n, [o, n]), p = fe({
    count: t.length,
    getScrollElement: () => a.current,
    estimateSize: (u) => {
      const s = t[u], d = me.get(s);
      return d || e;
    },
    measureElement: (u) => {
      const s = u.getBoundingClientRect().height, d = u.getAttribute("data-card-id");
      return d && me.set(d, s), s;
    },
    overscan: c
  });
  return {
    parentRef: a,
    rowVirtualizer: p
  };
}
function bt({ onClick: t }) {
  return i("button", { onClick: t, className: "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group", children: [r("div", { className: "bg-slate-200 group-hover:bg-blue-600 group-hover:text-white p-0.5 rounded transition-colors", children: r(G, { size: 14 }) }), r("span", { children: "Adicionar card" })] });
}
function Ct({ card: t, renderCard: e, onClick: n, onEdit: a, allowEdit: o, index: l, columnId: c, overId: p, overSide: u }) {
  const { attributes: s, listeners: d, setNodeRef: g, transform: h, transition: f, isDragging: m } = ge({
    id: t.id,
    data: {
      type: "Card",
      card: t,
      index: l,
      columnId: c
    }
  }), b = $(() => ({
    transform: ye.Translate.toString(h),
    transition: f,
    opacity: m ? 0.4 : 1
  }), [h, f, m]), N = $(() => (C) => {
    C.stopPropagation(), n ? n(t) : o && a?.(t);
  }, [n, a, o, t]), x = $(() => e({ card: t, isDragging: m }), [t, e, m]);
  return i("div", { ref: g, style: b, ...s, ...d, onClick: N, className: "relative cursor-grab active:cursor-grabbing touch-none group", children: [p === t.id && u === "top" && r("div", { className: "absolute -top-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" }), x, p === t.id && u === "bottom" && r("div", { className: "absolute -bottom-[2px] left-0 right-0 h-[4px] bg-blue-500 rounded-full z-10 pointer-events-none shadow-sm" })] });
}
const xt = M(Ct, (t, e) => t.card === e.card && t.index === e.index && t.columnId === e.columnId && t.overId === e.overId && t.overSide === e.overSide);
function vt({ column: t, allCards: e, activeId: n, overId: a, overSide: o, config: l, dragHandleProps: c, isActiveColumnDragging: p, isDragging: u, isOverlay: s }) {
  const d = t, { setAddingCardInColumnId: g, setEditingColumnId: h } = B(), { parentRef: f, rowVirtualizer: m } = ft({
    cardIds: d.cardIds,
    estimatedCardHeight: l.estimatedCardHeight,
    overscan: l.virtualOverscan
  }), b = a === d.id;
  return i("div", { onClick: (x) => {
    x.stopPropagation(), l.onColumnClick ? l.onColumnClick(t) : l.allowColumnEdit && (l.onEditColumn?.(t), h(d.id));
  }, style: {
    width: l.columnWidth,
    maxHeight: "100%",
    boxSizing: "border-box"
  }, className: E(
    "flex flex-col group/column bg-column-bg rounded-column transition-all relative select-none h-fit max-h-full",
    "duration-250 ease-[cubic-bezier(0.18,0.67,0.6,1.22)]",
    // Spring-like transition
    b && "bg-blue-50/50 ring-1 ring-blue-300 shadow-sm",
    p && !u && !s && "scale-[0.98] border border-slate-200 border-dashed opacity-50",
    // Other columns
    u && !s && "opacity-20",
    // Placeholder
    s && "bg-slate-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] scale-[1.02] z-50 cursor-grabbing ring-1 ring-slate-300"
    // Overlay
  ), children: [a === d.id && o === "left" && r("div", { className: "absolute top-0 bottom-0 -left-[4px] w-[4px] bg-blue-500 rounded-full z-20 pointer-events-none shadow-sm" }), a === d.id && o === "right" && r("div", { className: "absolute top-0 bottom-0 -right-[4px] w-[4px] bg-blue-500 rounded-full z-20 pointer-events-none shadow-sm" }), r("div", { onClick: (x) => x.stopPropagation(), children: l.renderColumnHeader({
    column: t,
    cardCount: d.cardIds.length,
    isOver: b,
    dragHandleProps: c,
    onAddCard: l.allowAdd ? () => g(d.id) : void 0,
    onEditColumn: l.allowColumnEdit ? () => h(d.id) : void 0
  }) }), r("div", { className: E("flex-1 flex flex-col min-h-0 transition-colors duration-200", b && "bg-blue-50/30"), style: { minHeight: l.columnMinHeight }, children: d.cardIds.length === 0 ? (
    // Empty column - simple area with parentRef for eventual virtualizer stability
    r("div", { ref: f, className: E("flex-1 px-3 pb-2 flex items-center justify-center border-2 border-dashed border-transparent rounded-b-lg transition-colors", b && "border-blue-300"), children: r("div", { className: "pointer-events-none select-none opacity-50", children: l.renderColumnEmpty({}) }) })
  ) : (
    // Column with cards - use SortableContext for reordering
    r(he, { items: d.cardIds, strategy: Qe, children: r("div", { ref: f, className: "flex-1 overflow-y-auto px-3 pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent", style: { minHeight: l.columnMinHeight }, children: r("div", { style: {
      height: `${m.getTotalSize()}px`,
      width: "100%",
      position: "relative"
    }, children: m.getVirtualItems().map((x) => {
      const C = d.cardIds[x.index], y = e[C];
      if (!y)
        return null;
      const A = C === n;
      return r("div", { "data-index": x.index, "data-card-id": C, style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${x.size}px`,
        transform: `translateY(${x.start}px)`
      }, children: r(xt, { card: y, isDragging: A, renderCard: l.renderCard, onClick: l.onCardClick, onEdit: l.onEditCard, allowEdit: l.allowEdit, index: x.index, columnId: d.id, overId: a, overSide: o }) }, C);
    }) }) }) })
  ) }), l.allowAdd && r("div", { className: "p-3 border-t border-slate-200 shrink-0 relative z-20", onClick: (x) => x.stopPropagation(), children: l.renderAddButton ? l.renderAddButton({
    columnId: d.id,
    onClick: () => g(d.id)
  }) : r(bt, { onClick: () => g(d.id) }) })] });
}
const pe = M(vt), wt = v.Root, yt = v.Trigger, Nt = v.Portal, It = R.forwardRef(({ className: t, ...e }, n) => r(v.Overlay, { className: S("fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", t), ...e, ref: n }));
It.displayName = v.Overlay.displayName;
const Dt = Ne("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
    }
  },
  defaultVariants: {
    side: "right"
  }
}), Ae = R.forwardRef(({ side: t = "right", className: e, children: n, ...a }, o) => r(Nt, { children: i(v.Content, { ref: o, className: S(Dt({ side: t }), "bg-white shadow-2xl", e), ...a, children: [n, i(v.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [r(Q, { className: "h-4 w-4" }), r("span", { className: "sr-only", children: "Close" })] })] }) }));
Ae.displayName = v.Content.displayName;
const Fe = ({ className: t, ...e }) => r("div", { className: S("flex flex-col space-y-2 text-center sm:text-left", t), ...e });
Fe.displayName = "SheetHeader";
const Oe = R.forwardRef(({ className: t, ...e }, n) => r(v.Title, { ref: n, className: S("text-lg font-semibold text-foreground", t), ...e }));
Oe.displayName = v.Title.displayName;
const ke = R.forwardRef(({ className: t, ...e }, n) => r(v.Description, { ref: n, className: S("text-sm text-muted-foreground", t), ...e }));
ke.displayName = v.Description.displayName;
function Et({ group: t, availableFields: e }) {
  const { updateFilterGroup: n, removeFilterGroup: a } = B(), o = () => {
    const u = {
      id: crypto.randomUUID(),
      field: "",
      operator: "contains",
      value: "",
      enabled: !0
    };
    n(t.id, {
      rules: [...t.rules, u]
    });
  }, l = (u) => {
    n(t.id, {
      rules: t.rules.filter((s) => "id" in s && s.id !== u)
    });
  }, c = (u, s) => {
    n(t.id, {
      rules: t.rules.map((d) => "id" in d && d.id === u ? { ...d, ...s } : d)
    });
  };
  return i("div", { className: "p-4 border rounded-lg bg-slate-50/50 space-y-4 relative group", children: [i("div", { className: "flex items-center justify-between", children: [i("div", { className: "flex items-center gap-2", children: [r(w, { variant: "ghost", size: "sm", className: "h-7 text-[10px] uppercase font-bold tracking-wider hover:bg-white", onClick: () => {
    n(t.id, {
      conjunction: t.conjunction === "and" ? "or" : "and"
    });
  }, children: t.conjunction }), r("span", { className: "text-xs text-muted-foreground italic", children: "dos seguintes critérios:" })] }), r(w, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => a(t.id), children: r(oe, { className: "h-4 w-4" }) })] }), i("div", { className: "space-y-3", children: [t.rules.map((u) => "field" in u ? r(St, { rule: u, availableFields: e, onDelete: () => l(u.id), onUpdate: (s) => c(u.id, s) }, u.id) : null), t.rules.length === 0 && r("div", { className: "text-center py-4 border-2 border-dashed rounded-md bg-white/50 cursor-pointer hover:bg-white transition-colors", onClick: o, children: r("p", { className: "text-xs text-muted-foreground", children: "Nenhuma regra definida. Clique para adicionar." }) })] }), i(w, { variant: "ghost", size: "sm", className: "w-full h-8 text-xs border-dashed border hover:border-solid mt-2 bg-white", onClick: o, children: [r(G, { className: "mr-2 h-3 w-3" }), "Adicionar Regra"] })] });
}
function St({ rule: t, availableFields: e, onDelete: n, onUpdate: a }) {
  const o = [
    { label: "contém", value: "contains" },
    { label: "não contém", value: "notContains" },
    { label: "igual a", value: "eq" },
    { label: "diferente de", value: "neq" },
    { label: "maior que", value: "gt" },
    { label: "menor que", value: "lt" },
    { label: "está vazio", value: "isEmpty" },
    { label: "não está vazio", value: "isNotEmpty" }
  ];
  return i("div", { className: `flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm transition-all duration-200 group/row ${t.enabled ? "hover:border-primary/30" : "opacity-50 grayscale bg-slate-50"}`, children: [r("input", { type: "checkbox", checked: t.enabled, onChange: (l) => a({ enabled: l.target.checked }), className: "h-3 w-3 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer", title: t.enabled ? "Desabilitar regra" : "Habilitar regra" }), i("select", { value: t.field, onChange: (l) => a({ field: l.target.value }), className: "flex-[1.5] min-w-[100px] bg-transparent text-[11px] font-semibold focus:outline-none truncate", disabled: !t.enabled, children: [r("option", { value: "", disabled: !0, children: "Campo..." }), e.map((l) => r("option", { value: l.value, children: l.label }, l.value))] }), r("select", { value: t.operator, onChange: (l) => a({ operator: l.target.value }), className: "flex-1 min-w-[90px] bg-transparent text-[11px] text-muted-foreground focus:outline-none border-x px-2", disabled: !t.enabled, children: o.map((l) => r("option", { value: l.value, children: l.label }, l.value)) }), r("input", { type: (e.find((l) => l.value === t.field)?.type ?? "text") === "number" ? "number" : "text", value: t.value || "", onChange: (l) => a({ value: l.target.value }), placeholder: "Valor...", disabled: !t.enabled || t.operator === "isEmpty" || t.operator === "isNotEmpty", className: "flex-[2] min-w-[100px] bg-transparent text-[11px] focus:outline-none placeholder:italic disabled:opacity-30 font-medium" }), r(w, { variant: "ghost", size: "icon", className: "h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-row-hover/row:opacity-100 transition-opacity", onClick: n, children: r(Q, { className: "h-3 w-3" }) })] });
}
function At(t) {
  const e = {
    title: { label: "Título", value: "title", type: "text" },
    description: { label: "Descrição", value: "description", type: "text" }
  };
  return Object.values(t).forEach((n) => {
    n.metadata && typeof n.metadata == "object" && Object.entries(n.metadata).forEach(([a, o]) => {
      const l = `metadata.${a}`;
      if (!e[l]) {
        let c = "other";
        typeof o == "string" ? c = "text" : typeof o == "number" ? c = "number" : typeof o == "boolean" && (c = "boolean"), e[l] = {
          label: `${a.charAt(0).toUpperCase() + a.slice(1)} (Meta)`,
          value: l,
          type: c
        };
      }
    });
  }), Object.values(e);
}
function Ft() {
  const { filters: t, addFilterGroup: e, cards: n } = B(), a = $(() => At(n), [n]), o = () => {
    const l = {
      id: crypto.randomUUID(),
      conjunction: "and",
      rules: [],
      enabled: !0
    };
    e(l);
  };
  return i(wt, { children: [r(yt, { asChild: !0, children: i(w, { variant: "outline", size: "sm", className: "gap-2 text-slate-600 bg-white hover:bg-slate-50 border-slate-200 shadow-sm", children: [r(ce, { className: "h-4 w-4" }), "Filtros", t.groups.length > 0 && r("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm", children: t.groups.length })] }) }), i(Ae, { className: "w-full sm:w-[600px] sm:max-w-none overflow-y-auto bg-white/95 backdrop-blur-sm border-l shadow-2xl", children: [r(Fe, { className: "pb-6 border-b", children: i("div", { className: "flex items-center justify-between", children: [i("div", { children: [r(Oe, { className: "text-xl font-bold text-slate-800", children: "Filtros Avançados" }), r(ke, { className: "text-sm text-slate-500", children: "Crie combinações de filtros para refinar sua visualização do board." })] }), t.groups.length > 0 && r(w, { variant: "ghost", size: "sm", onClick: B.getState().clearFilters, className: "text-xs font-bold text-slate-400 hover:text-destructive h-8", children: "Limpar Tudo" })] }) }), i("div", { className: "mt-8 space-y-6", children: [t.groups.length === 0 ? i("div", { className: "text-center py-12 px-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl space-y-2", children: [r(ce, { className: "mx-auto h-8 w-8 text-slate-300" }), r("p", { className: "text-slate-600 font-medium", children: "Nenhum filtro ativo." }), r("p", { className: "text-xs text-slate-400", children: "Adicione um grupo para começar a filtrar seus itens." })] }) : r("div", { className: "space-y-6", children: t.groups.map((l) => r(Et, { group: l, availableFields: a }, l.id)) }), i(w, { onClick: o, className: "w-full", variant: "outline", children: [r(G, { className: "mr-2 h-4 w-4" }), "Adicionar Grupo de Filtros"] })] })] })] });
}
function Ot({ columnId: t, onAdd: e, onCancel: n }) {
  const [a, o] = D(""), [l, c] = D(""), [p, u] = D("medium"), s = (d) => {
    d.preventDefault(), e({
      title: a,
      description: l,
      metadata: { priority: p }
    });
  };
  return r(ee, { open: !0, onOpenChange: (d) => !d && n(), children: i(U, { className: "sm:max-w-[425px]", children: [i(P, { children: [r(_, { children: "Adicionar Novo Card" }), r(re, { children: "Novo item para a coluna." })] }), i("form", { onSubmit: s, className: "grid gap-4 py-4", children: [i("div", { className: "grid gap-2", children: [r("label", { htmlFor: "title", className: "text-sm font-medium leading-none", children: "Título" }), r("input", { id: "title", autoFocus: !0, value: a, onChange: (d) => o(d.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "O que precisa ser feito?" })] }), i("div", { className: "grid gap-2", children: [r("label", { className: "text-sm font-medium leading-none", children: "Prioridade" }), r("div", { className: "flex gap-2", children: ["low", "medium", "high"].map((d) => r("button", { type: "button", onClick: () => u(d), className: E("flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all", p === d ? d === "high" ? "bg-red-100 border-red-500 text-red-700" : d === "medium" ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-emerald-100 border-emerald-500 text-emerald-800" : "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50"), children: d === "low" ? "Baixa" : d === "medium" ? "Média" : "Alta" }, d)) })] }), i("div", { className: "grid gap-2", children: [r("label", { htmlFor: "desc", className: "text-sm font-medium leading-none", children: "Descrição" }), r("textarea", { id: "desc", value: l, onChange: (d) => c(d.target.value), rows: 3, className: "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "Detalhes adicionais..." })] }), i(te, { children: [r(w, { type: "button", variant: "outline", onClick: n, children: "Cancelar" }), i(w, { type: "submit", className: "gap-2 bg-blue-600 hover:bg-blue-700 text-white", children: [r(G, { size: 16 }), "Criar Card"] })] })] })] }) });
}
function kt({ column: t, onSave: e, onCancel: n, onDelete: a }) {
  const [o, l] = D(t.title || ""), c = (p) => {
    p.preventDefault(), e({ title: o });
  };
  return r(ee, { open: !0, onOpenChange: (p) => !p && n(), children: i(U, { className: "sm:max-w-[400px]", children: [i(P, { children: [r(_, { children: "Editar Coluna" }), r(re, { children: "Gerencie as configurações desta coluna." })] }), i("form", { onSubmit: c, className: "grid gap-4 py-4", children: [i("div", { className: "grid gap-2", children: [r("label", { htmlFor: "col-title", className: "text-sm font-medium leading-none", children: "Nome da Coluna" }), r("input", { id: "col-title", autoFocus: !0, value: o, onChange: (p) => l(p.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", placeholder: "Ex: A Fazer" })] }), i(te, { className: "flex items-center justify-between w-full sm:justify-between", children: [a ? i(w, { type: "button", variant: "destructive", size: "sm", onClick: () => {
    window.confirm("Tem certeza que deseja excluir esta coluna e mover seus cards para a anterior?") && a();
  }, className: "gap-2", children: [r(oe, { size: 14 }), "Excluir"] }) : r("div", {}), i("div", { className: "flex gap-2", children: [r(w, { type: "button", variant: "outline", onClick: n, children: "Cancelar" }), i(w, { type: "submit", className: "gap-2", children: [r(xe, { size: 14 }), "Salvar"] })] })] })] })] }) });
}
const zt = M(({ children: t }) => {
  const { setNodeRef: e, isOver: n } = We({
    id: "new-column-drop-target",
    data: { type: "NewColumn" }
  });
  return r(Re, { children: t(n, e) });
}), jt = M(({ id: t, start: e, width: n, children: a, allowReorder: o, cardIds: l }) => {
  const { attributes: c, listeners: p, setNodeRef: u, transform: s, transition: d, isDragging: g } = ge({
    id: t,
    disabled: !o,
    data: {
      type: "Column",
      children: l
      // CRITICAL: Pass card IDs for collision detection
    }
  }), h = {
    position: "absolute",
    top: 0,
    left: `${e}px`,
    // Virtual positioning via left, NOT transform
    width: `${n}px`,
    transition: d || "transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    // Transform is now ONLY for dnd-kit's sorting logic
    transform: s && !g ? ye.Transform.toString(s) : void 0,
    zIndex: g ? 50 : void 0,
    pointerEvents: g ? "none" : void 0,
    animation: g ? "tilt 0.2s ease-in-out forwards" : void 0
  };
  return r("div", { ref: u, style: h, children: nt(a) ? rt(a, {
    dragHandleProps: o ? { attributes: c, listeners: p } : void 0,
    isDragging: g
  }) : a });
});
function Pt({ config: t }) {
  const e = it(t), n = j(null), a = fe({
    horizontal: !0,
    count: e.columnOrder.length,
    getScrollElement: () => n.current,
    estimateSize: () => e.config.columnWidth + e.config.gap,
    overscan: 5
  }), o = $(() => {
    const m = {};
    Object.values(e.cards).forEach((N) => {
      st(N, e.filters) && (m[N.id] = N);
    });
    const b = {};
    return Object.values(e.columns).forEach((N) => {
      b[N.id] = {
        ...N,
        cardIds: N.cardIds.filter((x) => m[x])
      };
    }), {
      cards: m,
      columns: b
    };
  }, [e.cards, e.columns, e.filters]), l = j(null), c = j(!1);
  L(() => {
    requestAnimationFrame(() => {
      c.current = !1;
    });
  }, [e.columnOrder, e.columns]);
  const p = dt({
    dragActivationDistance: e.config.dragActivationDistance,
    touchActivationDelay: e.config.touchActivationDelay,
    onDragStart: (m, b) => {
      e.handleDragStart(m);
    },
    onDragOver: e.handleDragOver,
    onDragEnd: e.handleDragEnd,
    onCardMove: e.moveCard,
    onColumnMove: e.moveColumn,
    onCreateColumnWithCard: (m, b) => {
      e.addColumnWithCard(m, b, { title: "Nova Coluna" });
    },
    columns: e.columns,
    columnOrder: e.columnOrder,
    recentlyMovedToNewContainer: c
  }), u = e.activeId && e.cards[e.activeId] ? e.cards[e.activeId] : null, s = e.activeId && e.columnOrder.includes(e.activeId) ? e.columns[e.activeId] : null, d = e.viewingCardId ? e.cards[e.viewingCardId] : null, g = e.editingColumnId ? e.columns[e.editingColumnId] : null, h = {
    renderCard: t?.renderCard ?? ((m) => r(Ie, { ...m })),
    renderColumnHeader: t?.renderColumnHeader ?? ((m) => r(Ee, { ...m })),
    renderColumnEmpty: t?.renderColumnEmpty ?? (() => r(De, {})),
    renderAddButton: t?.renderAddButton,
    renderAddForm: t?.renderAddForm,
    renderEditForm: t?.renderEditForm,
    renderAddColumnButton: t?.renderAddColumnButton,
    renderAddColumnForm: t?.renderAddColumnForm,
    renderEditColumnForm: t?.renderEditColumnForm,
    estimatedCardHeight: e.config.estimatedCardHeight,
    virtualOverscan: e.config.virtualOverscan,
    columnWidth: e.config.columnWidth,
    columnMinHeight: e.config.columnMinHeight,
    onCardClick: t?.onCardClick ?? ((m) => e.setViewingCardId(m.id)),
    onColumnClick: t?.onColumnClick,
    onEdit: e.config.allowEdit ? e.setEditingCardId : void 0,
    onEditColumn: (m) => e.setEditingColumnId(m.id),
    renderCardView: t?.renderCardView,
    allowAdd: e.config.allowAdd,
    allowColumnAdd: e.config.allowColumnAdd,
    allowColumnEdit: e.config.allowColumnEdit,
    allowColumnDelete: e.config.allowColumnDelete,
    allowColumnReorder: e.config.allowColumnReorder,
    allowFilters: e.config.allowFilters
  }, f = (m) => {
    const b = m.active.id;
    if (!(b && !e.columnOrder.includes(b)))
      return ae(m);
    const x = Le(m);
    if (b && x.length > 0) {
      const k = x.find((V) => V.id === "new-column-drop-target");
      if (k)
        return [k];
    }
    const C = x.length > 0 ? x : Ge(m);
    let y = Ke(C, "id");
    if (y != null) {
      if (e.columnOrder.includes(y)) {
        const k = e.columns[y];
        if (k && k.cardIds.length > 0) {
          const V = m.droppableContainers.filter((F) => F.id !== y && k.cardIds.includes(F.id));
          V.length > 0 && (y = ae({
            ...m,
            droppableContainers: V
          })[0]?.id ?? y);
        }
      }
      return l.current = y, [{ id: y }];
    }
    const A = ae({
      ...m,
      droppableContainers: m.droppableContainers.filter((k) => k.id !== b)
    });
    return A.length > 0 ? (l.current = A[0].id, A) : (c.current && (l.current = b), l.current ? [{ id: l.current }] : []);
  };
  return r(He, { sensors: p.sensors, collisionDetection: f, measuring: {
    droppable: {
      strategy: qe.Always
    }
  }, onDragStart: p.handleDragStart, onDragOver: p.handleDragOver, onDragEnd: p.handleDragEnd, children: i("div", { className: "flex flex-col h-full bg-slate-50 relative group/board overflow-hidden", children: [e.config.allowFilters && r("div", { className: "absolute top-4 right-6 z-30 pointer-events-none", children: r("div", { className: "pointer-events-auto transition-all duration-300 translate-y-[-10px] opacity-0 group-hover/board:translate-y-0 group-hover/board:opacity-100", children: r(Ft, {}) }) }), e.config.allowFilters && r(ht, {}), r("div", { ref: n, className: "flex-1 overflow-x-auto overflow-y-hidden", children: i("div", { style: {
    width: `${a.getTotalSize() + (e.config.allowColumnAdd ? 200 : 0)}px`,
    height: "100%",
    position: "relative"
  }, children: [r(he, { items: e.columnOrder, strategy: Ue, children: a.getVirtualItems().map((m) => {
    const b = e.columnOrder[m.index];
    return r(jt, { id: b, start: m.start, width: e.config.columnWidth, allowReorder: e.config.allowColumnReorder, cardIds: o.columns[b]?.cardIds ?? [], children: r(pe, { column: o.columns[b], allCards: o.cards, activeId: e.activeId, overId: e.overId, overSide: e.overSide, config: h, isActiveColumnDragging: e.activeId ? e.columnOrder.includes(e.activeId) : !1 }) }, b);
  }) }), e.config.allowColumnAdd && r(zt, { children: (m, b) => r("div", { ref: b, className: "h-full z-10", style: {
    position: "absolute",
    top: 0,
    left: `${a.getTotalSize()}px`,
    width: e.config.columnWidth,
    height: "100%",
    boxSizing: "border-box",
    paddingRight: e.config.gap
  }, children: t?.renderAddColumnButton ? t.renderAddColumnButton({ onClick: () => e.addColumn({ title: "Nova Coluna" }) }) : i("button", { onClick: () => e.addColumn({ title: "Nova Coluna" }), className: S("flex items-center gap-2 w-full p-4 bg-slate-100/50 hover:bg-slate-200 text-slate-600 rounded-lg border-2 border-dashed transition-all font-semibold h-[200px] justify-center", m ? "bg-blue-100 border-blue-400 text-blue-600 scale-[1.02] shadow-lg ring-4 ring-blue-500/20" : "border-slate-300"), children: [r(G, { size: 20 }), m ? "Soltar para criar" : "Nova Coluna"] }) }) })] }) }), e.editingCardId && e.config.allowEdit && (() => {
    const m = e.cards[e.editingCardId];
    return m ? t?.renderEditForm ? t.renderEditForm({
      card: m,
      onSave: (b) => {
        e.updateCard(e.editingCardId, b), e.clearEditingCardId();
      },
      onCancel: e.clearEditingCardId,
      onDelete: () => {
        e.deleteCard(e.editingCardId), e.clearEditingCardId();
      }
    }) : r(pt, { card: m, onSave: (b) => {
      e.updateCard(e.editingCardId, b), e.clearEditingCardId();
    }, onCancel: e.clearEditingCardId, onDelete: () => {
      e.deleteCard(e.editingCardId), e.clearEditingCardId();
    } }) : null;
  })(), e.addingCardInColumnId && e.config.allowAdd && (t?.renderAddForm ? t.renderAddForm({
    columnId: e.addingCardInColumnId,
    onAdd: (m) => {
      e.addCard(e.addingCardInColumnId, m), e.clearAddingCardInColumnId();
    },
    onCancel: e.clearAddingCardInColumnId
  }) : r(Ot, { columnId: e.addingCardInColumnId, onAdd: (m) => {
    e.addCard(e.addingCardInColumnId, m), e.clearAddingCardInColumnId();
  }, onCancel: e.clearAddingCardInColumnId })), g && e.config.allowColumnEdit && (t?.renderEditColumnForm ? t.renderEditColumnForm({
    column: g,
    onSave: (m) => {
      e.updateColumn(g.id, m), e.clearEditingColumnId();
    },
    onCancel: e.clearEditingColumnId,
    onDelete: e.config.allowColumnDelete ? () => {
      e.deleteColumn(g.id), e.clearEditingColumnId();
    } : void 0
  }) : r(kt, { column: g, onSave: (m) => {
    e.updateColumn(g.id, m), e.clearEditingColumnId();
  }, onCancel: e.clearEditingColumnId, onDelete: e.config.allowColumnDelete ? () => {
    e.deleteColumn(g.id), e.clearEditingColumnId();
  } : void 0 })), d && (h.renderCardView ? h.renderCardView({
    card: d,
    onClose: e.clearViewingCardId
  }) : r(gt, { card: d, onClose: e.clearViewingCardId })), i($e, { dropAnimation: null, children: [u && r("div", { className: "z-50 cursor-grabbing animate-tilt shadow-2xl rounded-card overflow-hidden", children: h.renderCard({
    card: u,
    isDragging: !0
  }) }), s ? r(pe, { column: s, allCards: e.cards, activeId: null, overId: null, overSide: null, config: h, isDragging: !1, isOverlay: !0, dragHandleProps: {
    attributes: {},
    listeners: {}
  } }) : null] })] }) });
}
const _t = (t) => (e) => e.cards[t], Jt = (t) => t.cards, Xt = (t) => (e) => t.map((n) => e.cards[n]).filter(Boolean), Yt = (t) => (e) => e.columns[t], Zt = (t) => t.columns, er = (t) => t.columnOrder, tr = (t) => (e) => {
  const n = e.columns[t];
  return n ? n.cardIds.map((a) => e.cards[a]).filter(Boolean) : [];
}, rr = (t) => (e) => e.columns[t]?.cardIds || [], nr = (t) => t.moveCard, ar = (t) => t.moveColumn, lr = (t) => t.setBoardData, or = (t) => ({
  cards: t.cards,
  columns: t.columns,
  columnOrder: t.columnOrder
}), ir = (t) => Object.keys(t.cards).length, dr = (t) => t.columnOrder.length, Rt = () => {
  const [t, e] = D(0), n = j(0), a = j(performance.now());
  return L(() => {
    let o;
    const l = (c) => {
      n.current++;
      const p = c - a.current;
      p >= 1e3 && (e(Math.round(n.current * 1e3 / p)), n.current = 0, a.current = c), o = requestAnimationFrame(l);
    };
    return o = requestAnimationFrame(l), () => {
      cancelAnimationFrame(o);
    };
  }, []), t;
}, sr = ({ cardCount: t, columnCount: e }) => {
  const n = Rt(), [a, o] = D(60), [l, c] = D(0), [p, u] = D(!1);
  return L(() => {
    n > 0 && (n < a && o(n), n > l && c(n));
  }, [n]), L(() => {
    if (!p)
      return;
    const s = document.querySelectorAll(".overflow-y-auto");
    let d = 1, g = 2, h;
    const f = () => {
      s.forEach((m) => {
        m.scrollTop += g * d, m.scrollTop >= m.scrollHeight - m.clientHeight && (d = -1), m.scrollTop <= 0 && (d = 1);
      }), h = requestAnimationFrame(f);
    };
    return h = requestAnimationFrame(f), () => cancelAnimationFrame(h);
  }, [p]), i("div", { className: "fixed bottom-4 right-4 bg-slate-900/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm z-50 font-mono text-sm", children: [i("div", { className: "flex items-center justify-between mb-2 gap-2", children: [r("h3", { className: "font-bold text-blue-400", children: "⚡ Performance Stats" }), r("button", { onClick: () => u(!p), className: `text-xs px-2 py-1 rounded ${p ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`, children: p ? "Stop Stress Test" : "Start Stress Test" })] }), i("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1", children: [r("span", { className: "text-slate-400", children: "FPS:" }), r("span", { className: `font-bold ${n < 30 ? "text-red-400" : n < 50 ? "text-yellow-400" : "text-green-400"}`, children: n }), r("span", { className: "text-slate-400", children: "Min FPS:" }), r("span", { className: "text-slate-200", children: a }), r("span", { className: "text-slate-400", children: "Cards:" }), r("span", { className: "text-slate-200", children: t }), r("span", { className: "text-slate-400", children: "Columns:" }), r("span", { className: "text-slate-200", children: e })] })] });
};
export {
  sr as BenchmarkStats,
  Pt as Kanban,
  Pt as Kanbase,
  Pt as KanboomBoard,
  At as discoverFields,
  st as evaluateFilter,
  Jt as selectAllCards,
  Zt as selectAllColumns,
  or as selectBoardData,
  _t as selectCard,
  ir as selectCardCount,
  Xt as selectCardsByIds,
  Yt as selectColumn,
  rr as selectColumnCardIds,
  tr as selectColumnCards,
  dr as selectColumnCount,
  er as selectColumnOrder,
  nr as selectMoveCard,
  ar as selectMoveColumn,
  lr as selectSetBoardData,
  Rt as useFPS,
  it as useKanban,
  B as useKanbanStore
};
//# sourceMappingURL=kanbase.es.js.map
