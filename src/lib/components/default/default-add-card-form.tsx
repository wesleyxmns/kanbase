import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils/cn';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface DefaultAddCardFormProps {
  columnId: string;
  onAdd: (data: any) => void;
  onCancel: () => void;
}

export function DefaultAddCardForm({ columnId, onAdd, onCancel }: DefaultAddCardFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      metadata: { priority }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Card</DialogTitle>
          <DialogDescription>
            Novo item para a coluna.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Título
            </label>
            <input
              id="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="O que precisa ser feito?"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">Prioridade</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all",
                    priority === p
                      ? p === 'high' ? "bg-red-100 border-red-500 text-red-700" :
                        p === 'medium' ? "bg-amber-100 border-amber-500 text-amber-900" :
                          "bg-emerald-100 border-emerald-500 text-emerald-800"
                      : "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="desc" className="text-sm font-medium leading-none">
              Descrição
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Detalhes adicionais..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={16} />
              Criar Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
