import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify("AIzaSyBrnpybfgOa2ZkyACpBXPQUl5M4iw3GDH8"),
      'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyBrnpybfgOa2ZkyACpBXPQUl5M4iw3GDH8"),
      'process.env.OPENROUTER_API_KEY': JSON.stringify("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")
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
