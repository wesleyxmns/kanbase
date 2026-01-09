/**
 * Injeta os estilos do Kanbase automaticamente no documento
 * Isso garante que os estilos estejam disponíveis sem necessidade de import manual
 */

let stylesInjected = false;

export function injectKanbaseStyles() {
  if (stylesInjected) return;
  if (typeof document === 'undefined') return; // SSR check

  // Verificar se os estilos já foram injetados
  const existingStyle = document.getElementById('kanbase-styles');
  if (existingStyle) {
    stylesInjected = true;
    return;
  }

  // Criar elemento style
  const style = document.createElement('style');
  style.id = 'kanbase-styles';
  style.textContent = `
    :root {
      --color-board-bg: #f8fafc;
      --color-column-bg: rgba(241, 245, 249, 0.5);
      --color-card-bg: #ffffff;
      --color-card-border: rgba(226, 232, 240, 0.8);
      --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-card-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --radius-card: 0.5rem;
      --radius-column: 0.75rem;
    }
    .dark {
      --color-board-bg: #0f172a;
      --color-column-bg: rgba(30, 41, 59, 0.5);
      --color-card-bg: #1e293b;
      --color-card-border: rgba(51, 65, 85, 0.8);
    }
    @keyframes tilt {
      0% { transform: rotate(0deg) scale(1); }
      100% { transform: rotate(2deg) scale(1.02); }
    }
    .bg-board-bg { background-color: var(--color-board-bg); }
    .bg-column-bg { background-color: var(--color-column-bg); }
    .bg-card-bg { background-color: var(--color-card-bg); }
    .border-card-border { border-color: var(--color-card-border); }
    .rounded-card { border-radius: var(--radius-card); }
    .rounded-column { border-radius: var(--radius-column); }
    .shadow-card { box-shadow: var(--shadow-card); }
    .shadow-card-hover { box-shadow: var(--shadow-card-hover); }
    .animate-tilt { animation: tilt 0.2s ease-in-out forwards; }
  `;

  // Injetar no head
  document.head.appendChild(style);
  stylesInjected = true;
}

// Injetar automaticamente quando o módulo é carregado
if (typeof document !== 'undefined') {
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectKanbaseStyles);
  } else {
    injectKanbaseStyles();
  }
}
