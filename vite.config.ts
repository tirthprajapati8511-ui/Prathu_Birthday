import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://tirthprajapati8511-ui.github.io/Prathu_Birthday/
  base: '/Prathu_Birthday/',
  plugins: [react()],
  server: { host: true, port: 5173 },
});
