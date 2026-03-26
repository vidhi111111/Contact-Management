import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev convenience: allow http://localhost:5173/contacts to hit backend API
      '/contacts': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

