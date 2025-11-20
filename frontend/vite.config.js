import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/search": "http://localhost:8000",
      "/ingest": "http://localhost:8000",
      "/event": "http://localhost:8000",
      "/compare": "http://localhost:8000",
      "/summary": "http://localhost:8000"
    }
  }
});
