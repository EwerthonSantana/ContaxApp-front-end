import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' globalmente
    environment: "jsdom", // Simula o ambiente do navegador (DOM)
    include: ["**/*.test.ts"], // Define onde procurar os arquivos de teste
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
  },
});
