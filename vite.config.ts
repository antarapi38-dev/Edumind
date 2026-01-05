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
