import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "./lib/index.ts",
      name: "QuerySafe",
      fileName: "querysafe",
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-query"],
    },
  },
});
