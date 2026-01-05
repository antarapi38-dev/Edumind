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
