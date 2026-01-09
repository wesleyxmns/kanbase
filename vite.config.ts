import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true, // Gera a entrada de tipos no package.json
      include: ['src/lib/'],   // Só gera tipos para a pasta da lib
      exclude: ['src/lib/**/*.test.ts', 'src/lib/**/*.spec.ts', 'src/lib/mock/**'],
      rollupTypes: true, // Gera um único arquivo de tipos
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'Kanbase',
      formats: ['es', 'umd'], // ES Module (moderno) e UMD (compatibilidade)
      fileName: (format) => `kanbase.${format}.js`,
    },
    cssCodeSplit: false, // Incluir CSS no bundle principal
    sourcemap: true, // Gerar source maps para debugging
    minify: 'esbuild', // Minificar o código
    rollupOptions: {
      // Externalizar todas as dependências e peer dependencies
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'tailwindcss',
        // Dependências que devem ser externalizadas
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@dnd-kit/utilities',
        '@radix-ui/react-dialog',
        '@radix-ui/react-slot',
        '@tanstack/react-virtual',
        'class-variance-authority',
        'clsx',
        'lodash.get',
        'lucide-react',
        'tailwind-merge',
        'zustand',
        'zustand/middleware',
      ],
      output: {
        // Globals para UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          tailwindcss: 'tailwindcss',
          '@dnd-kit/core': 'DndKitCore',
          '@dnd-kit/sortable': 'DndKitSortable',
          '@dnd-kit/utilities': 'DndKitUtilities',
          '@radix-ui/react-dialog': 'RadixUIDialog',
          '@radix-ui/react-slot': 'RadixUISlot',
          '@tanstack/react-virtual': 'TanStackVirtual',
          'class-variance-authority': 'ClassVarianceAuthority',
          clsx: 'clsx',
          'lodash.get': 'lodashGet',
          'lucide-react': 'LucideReact',
          'tailwind-merge': 'tailwindMerge',
          zustand: 'Zustand',
        },
        // Nome dos arquivos de assets
        assetFileNames: (assetInfo) => {
          // Verificar se é CSS usando apenas a propriedade names (não depreciada)
          const isCSS = assetInfo.type === 'asset' && 
            assetInfo.names?.some((name: string) => name.endsWith('.css'));
          
          if (isCSS) {
            return 'kanbase.css';
          }
          // Para outros assets, usar o padrão do Rollup
          return '[name][extname]';
        },
        // Preservar nomes de módulos para melhor tree-shaking
        preserveModules: false,
      },
    },
  },
})
