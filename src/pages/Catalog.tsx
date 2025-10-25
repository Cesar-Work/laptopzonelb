import { products } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { useStore } from "@/store"
import { useMemo, useState } from "react"

export default function Catalog(){
  const query = useStore(s=>s.query).toLowerCase()
  const [brand, setBrand] = useState<string>("All")

  const filtered = useMemo(()=>{
    return products.filter(p=>{
      const hay = (p.title + " " + p.cpu + " " + p.gpu + " " + p.brand).toLowerCase()
      const byQuery = hay.includes(query)
      const byBrand = brand==="All" || p.brand===brand
      return byQuery && byBrand
    })
  }, [query, brand])

  return (
    <main className="mx-auto max-w-7xl px-4">
      <section className="py-10">
        <h1 className="text-3xl font-bold tracking-tight">Find your next laptop</h1>
        <p className="text-white/70">Modern, creative, teen-approved. Configure RAM and storage your way.</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {["All","Dell","HP","Fujitsu","Lenovo","Apple","Other"].map(b=>(
            <button key={b} onClick={()=>setBrand(b)} className={`px-3 py-1.5 rounded-xl border ${brand===b?'border-white/30 bg-white/10':'border-white/10 bg-white/5'} hover:bg-white/10`}>{b}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map(p=> <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </main>
  )
}