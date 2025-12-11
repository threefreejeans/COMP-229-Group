import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // use default SPA behavior; no custom rollupOptions
  build: {
    outDir: "dist", // optional (default is "dist" anyway)
  },
});
