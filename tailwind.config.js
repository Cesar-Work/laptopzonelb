export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink:"#0a0a0a", midnight:"#0d1117", neon:"#86efac" },
      boxShadow: { glow:"0 0 30px rgba(134,239,172,0.35)" }
    }
  },
  plugins: []
}