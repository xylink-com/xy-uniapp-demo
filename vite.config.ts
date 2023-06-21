import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import commonjs from '@rollup/plugin-commonjs';


const extensions = ['.js'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    commonjs({
      extensions,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/static/style/var.scss";`,
      },
    },
  },
});
