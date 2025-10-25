// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  base: "/",                // important pour un domaine custom
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
