import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import graphql from '@rollup/plugin-graphql';


export default defineConfig({
  plugins: [react(), graphql()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
    },
  },
})
