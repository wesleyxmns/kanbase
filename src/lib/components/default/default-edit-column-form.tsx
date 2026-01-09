import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DefaultEditColumnFormProps {
  column: any;
  onSave: (updates: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function DefaultEditColumnForm({ column, onSave, onCancel, onDelete }: DefaultEditColumnFormProps) {
  const [title, setTitle] = useState(column.title || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Coluna</DialogTitle>
          <DialogDescription>
            Gerencie as configurações desta coluna.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="col-title" className="text-sm font-medium leading-none">
              Nome da Coluna
            </label>
            <input
              id="col-title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Ex: A Fazer"
            />
          </div>

          <DialogFooter className="flex items-center justify-between w-full sm:justify-between">
            {onDelete ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja excluir esta coluna e mover seus cards para a anterior?")) {
                    onDelete();
                  }
                }}
                className="gap-2"
              >
                <Trash2 size={14} />
                Excluir
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="gap-2">
                <Save size={14} />
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
