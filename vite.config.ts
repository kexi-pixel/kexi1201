import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 强制 Vite 尝试这些扩展名，解决某些环境下找不到组件的问题
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 构建生产环境时关闭 sourcemap 以加快速度并减小体积
  },
  server: {
    port: 3000,
  }
});
