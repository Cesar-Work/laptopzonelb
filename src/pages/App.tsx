import { Outlet, Link } from "react-router-dom"
import { Laptop, Search, ShoppingCart } from "lucide-react"
import { useStore } from "@/store"

export default function App(){
  const cartCount = useStore(s=>s.cart.length)
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-ink">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-midnight/70">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center shadow-glow">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">LaptopZoneLB</div>
              <div className="text-xs text-white/60">Laptops & IT Solutions</div>
            </div>
          </Link>
          <div className="ml-auto relative w-[420px] max-w-[55vw] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input placeholder="Search model, CPU, GPU..." className="w-full bg-white/5 rounded-xl pl-9 pr-3 py-2 outline-none ring-1 ring-white/10 focus:ring-white/20" onChange={(e)=>useStore.getState().setQuery(e.target.value)} />
          </div>
      
                <Link to="/advisor" className="ml-3 flex items-center gap-1 text-sm">
        <span role="img" aria-label="Advisor">🤖</span>
        Advisor
      </Link>
<Link to="/" className="ml-3 relative">
            <ShoppingCart />
            {cartCount>0 && <span className="absolute -right-2 -top-2 text-xs bg-green-400 text-black px-1.5 py-0.5 rounded">{cartCount}</span>}
          </Link>
        </div>
      </header>
      <Outlet />
      <footer className="mt-12 py-10 text-center text-white/60">Â© LaptopZoneLB â€” Built with â¤ï¸</footer>
    </div>
  )
}
