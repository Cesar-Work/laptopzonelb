import { useParams } from "react-router-dom"
import { products } from "@/data/products"
import Product3D from "@/components/Product3D"
import ActionButtons from "@/components/ActionButtons"
import { useState } from "react"
import Badge from "@/components/Badge"

export default function Product(){
  const { slug } = useParams()
  const p = products.find(x=>x.slug===slug)!
  const [ram, setRam] = useState<number>(p.ramGB)
  const [storage, setStorage] = useState<number>(p.storageGB)

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="grid lg:grid-cols-2 gap-8 py-10">
        <div>
          <div className="aspect-video rounded-2xl overflow-hidden bg-black/30 grid place-items-center ring-1 ring-white/10">
            <img src={p.thumbnail} alt={p.title} className="object-contain max-h-full" />
          </div>
          <div className="mt-4">
            <Product3D url={p.gltfUrl} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge>{p.brand}</Badge>
            {p.ramExpandable && <Badge className="bg-green-400/15 text-green-300 border-green-400/25">RAM upgradable</Badge>}
            {p.storageExpandable && <Badge className="bg-green-400/15 text-green-300 border-green-400/25">Storage upgradable</Badge>}
          </div>
          <h1 className="mt-2 text-3xl font-bold">{p.title}</h1>
          <p className="text-white/70">{p.description}</p>
          <div className="mt-4 text-neon text-3xl font-extrabold">${p.priceUSD}</div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Spec k="CPU" v={p.cpu} />
              <Spec k="GPU" v={p.gpu} />
              <Spec k="RAM" v={`${p.ramGB} GB`} />
              <Spec k="Storage" v={`${p.storageGB} ${p.storageType}`} />
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="font-medium mb-2">Customize</div>
              <div className="flex flex-wrap gap-4">
                {p.options?.ram && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">RAM</div>
                    <div className="flex gap-2">
                      {p.options.ram.map(r=>(
                        <button key={r} onClick={()=>setRam(r)} className={btnCls(ram===r)}>{r} GB</button>
                      ))}
                    </div>
                  </div>
                )}
                {p.options?.storage && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Storage</div>
                    <div className="flex gap-2">
                      {p.options.storage.map(s=>(
                        <button key={s} onClick={()=>setStorage(s)} className={btnCls(storage===s)}>{s} GB</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 mt-2">Selected: {ram} GB RAM, {storage} GB storage.</p>
            </div>
            <ActionButtons buttons={p.customButtons} />
          </div>
        </div>
      </div>
    </main>
  )
}

function Spec({k,v}:{k:string,v:string}){
  return (
    <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="text-xs text-white/60">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  )
}
function btnCls(active:boolean){
  return `px-3 py-1.5 rounded-xl border ${active?'border-white bg-white text-black':'border-white/10 bg-white/5 hover:bg-white/10'}`
}