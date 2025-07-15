import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '192.168.2.113', // ✅ Pon aquí la IP local de tu PC
        port: 5173,            // ✅ Puedes cambiar si ese puerto está ocupado
        strictPort: true,      // Error si el puerto está ocupado (evita confusión)
        hmr: {
            host: '192.168.2.113', // ✅ Igual que la IP de tu PC
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
