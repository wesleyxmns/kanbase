import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, AlignLeft, Info } from 'lucide-react';
import type { ViewCardRenderProps, KanboomCard } from '@/lib/types/kanban';
import { memo } from 'react';
import { cn } from '@/lib/utils/cn';

export const DefaultCardView = memo(<TCard extends KanboomCard>(
  { card, onClose }: ViewCardRenderProps<TCard>
) => {
  const { priority, tags, members, dueDate, ...otherMetadata } = card.metadata || {};

  const priorityConfig: Record<string, { label: string, color: string, bg: string }> = {
    high: { label: 'Alta', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    medium: { label: 'Média', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    low: { label: 'Baixa', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  };

  const pConfig = priority && priorityConfig[priority];

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-white">
        {/* Header Color Strip (if priority exists) */}
        {pConfig && (
          <div className={cn("h-1.5 w-full", pConfig.bg.split(' ')[0], pConfig.bg.replace('bg-', 'bg-opacity-100'))} />
        )}

        <div className="flex flex-col h-full max-h-[85vh]">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-slate-100 rounded-lg text-slate-500">
                <AlignLeft size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">
                  {card.title}
                </DialogTitle>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {card.id}
                </p>
              </div>
              {pConfig && (
                <div className={cn("px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide", pConfig.color, pConfig.bg)}>
                  {pConfig.label}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-0 grid md:grid-cols-[1fr,240px] gap-8">
            {/* Main Content Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Descrição
                </h4>
                <div className={cn(
                  "text-sm text-slate-600 leading-relaxed p-4 rounded-lg border border-slate-100 bg-slate-50/50 min-h-[100px]",
                  !card.description && "italic text-slate-400 flex items-center justify-center"
                )}>
                  {card.description || "Nenhuma descrição fornecida."}
                </div>
              </div>

              {card.content && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">Conteúdo Detalhado</h4>
                  <pre className="text-xs font-mono bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto shadow-inner">
                    {typeof card.content === 'object' ? JSON.stringify(card.content, null, 2) : card.content}
                  </pre>
                </div>
              )}
            </div>

            {/* Sidebar Metadata Column */}
            <div className="space-y-6">
              {/* Status/Due Date */}
              {dueDate && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} /> Data de Entrega
                  </span>
                  <div className="text-sm font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-md border border-slate-200">
                    {new Date(dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Members */}
              {members && Array.isArray(members) && members.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} /> Membros
                  </span>
                  <div className="flex flex-col gap-2">
                    {members.map((m: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-1.5 rounded-md border border-slate-100 shadow-sm">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                          {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" /> : m.initials}
                        </div>
                        <span className="truncate">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags && Array.isArray(tags) && tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={12} /> Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag: any, i: number) => (
                      <span key={i} className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm",
                        tag.color ? `bg-${tag.color}-50 text-${tag.color}-700 border-${tag.color}-200` : "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Other Metadata */}
              {Object.keys(otherMetadata).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Info size={12} /> Outros Detalhes
                  </span>
                  <div className="grid gap-3">
                    {Object.entries(otherMetadata).map(([key, value]) => (
                      <div key={key} className="group">
                        <dt className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 group-hover:text-slate-600 transition-colors">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </dt>
                        <dd className="text-sm font-medium text-slate-800 break-words">
                          {typeof value === 'boolean' ? (
                            value ? <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Sim</span> : <span className="text-slate-400">Não</span>
                          ) : String(value)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <Button variant="outline" onClick={onClose} className="hover:bg-white hover:text-slate-900 transition-colors">
              Fechar Visualização
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
