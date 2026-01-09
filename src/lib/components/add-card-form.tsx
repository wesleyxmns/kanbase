import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface AddCardFormProps {
  onSave: (title: string) => void;
  onCancel: () => void;
}

export function AddCardForm({ onSave, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="O que precisa ser feito?"
        className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-slate-700 min-h-[60px] p-0"
      />

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
        >
          <X size={14} />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={!title.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 shadow-sm active:scale-95"
        >
          <Check size={14} />
          Adicionar
        </button>
      </div>
    </form>
  );
}
