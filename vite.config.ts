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
      insertTypesEntry: true,
      include: ['src/lib/**/*.{ts,tsx}'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/lib/mock/**', '**/*.stories.tsx'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
      outDir: 'dist',
      entryRoot: 'src/lib',
      staticImport: true
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
      formats: ['es', 'umd'],
      fileName: (format) => `kanbase.${format}.js`,
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'tailwindcss',
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
        assetFileNames: (assetInfo) => {
          const isCSS = assetInfo.type === 'asset' &&
            assetInfo.names?.some((name: string) => name.endsWith('.css'));

          if (isCSS) {
            return 'kanbase.css';
          }
          return '[name][extname]';
        },
        preserveModules: false,
      },
    },
  },
})