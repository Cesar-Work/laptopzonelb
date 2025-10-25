import { useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { fetchBySlug } from "@/data/useproducts"
import Product3D from "@/components/Product3D"
import ActionButtons from "@/components/ActionButtons"
import Badge from "@/components/Badge"
import type { LaptopProduct } from "@/types"

export default function Product() {
  const { slug } = useParams()
  const [p, setP] = useState<LaptopProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetchBySlug(slug).then((res: LaptopProduct | null) => {
      setP(res)
      setLoading(false)
    })
  }, [slug])

  const [ram, setRam] = useState<number | null>(null)
  const [storage, setStorage] = useState<number | null>(null)

  useEffect(() => {
    if (!p) return
    const defaultRam = p.ramOptions?.find((o) => o.available)?.sizeGB ?? null
    const defaultStorage = p.storageOptions?.find((o) => o.available)?.sizeGB ?? null
    setRam(defaultRam)
    setStorage(defaultStorage)
  }, [p])

  const priceDelta = useMemo(() => {
    if (!p) return 0
    const ramDelta = p.ramOptions?.find((o) => o.sizeGB === ram)?.priceDeltaUSD ?? 0
    const storageDelta = p.storageOptions?.find((o) => o.sizeGB === storage)?.priceDeltaUSD ?? 0
    return ramDelta + storageDelta
  }, [p, ram, storage])

  if (loading || !p) {
    return <main className="p-6 mx-auto max-w-7xl">Loadingâ€¦</main>
  }

  const finalPrice = p.basePriceUSD + priceDelta

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="grid lg:grid-cols-2 gap-8 py-10">
        <div>
          <div className="aspect-video rounded-2xl overflow-hidden bg-black/30 grid place-items-center ring-1 ring-white/10">
            <img
              src={p.thumbnail}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/fallback.svg"
              }}
              alt={p.title}
              className="object-contain max-h-full"
            />
          </div>
          <div className="mt-4">
            <Product3D url={p.gltfUrl} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Badge>{p.brand}</Badge>
          </div>
          <h1 className="mt-2 text-3xl font-bold">{p.title}</h1>
          {p.description && <p className="text-white/70">{p.description}</p>}

          <div className="mt-4 text-neon text-3xl font-extrabold">${finalPrice}</div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Spec k="CPU" v={p.cpu} />
              <Spec k="GPU" v={p.gpu} />
              <Spec k="Storage type" v={p.storageType} />
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="font-medium mb-2">Customize</div>
              <div className="flex flex-wrap gap-6">
                {p.ramOptions?.length ? (
                  <div>
                    <div className="text-sm text-white/60 mb-1">RAM</div>
                    <div className="flex flex-wrap gap-2">
                      {p.ramOptions.filter(o=>o.available).map((o)=>(
                        <button key={o.sizeGB} onClick={()=>setRam(o.sizeGB)} className={btnCls(ram===o.sizeGB)}>
                          {o.sizeGB} GB {o.priceDeltaUSD ? `(+$${o.priceDeltaUSD})` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {p.storageOptions?.length ? (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Storage</div>
                    <div className="flex flex-wrap gap-2">
                      {p.storageOptions.filter(o=>o.available).map((o)=>(
                        <button key={o.sizeGB} onClick={()=>setStorage(o.sizeGB)} className={btnCls(storage===o.sizeGB)}>
                          {o.sizeGB} GB {o.priceDeltaUSD ? `(+$${o.priceDeltaUSD})` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-white/50 mt-2">Selected: {ram ?? "â€”"} GB RAM, {storage ?? "â€”"} GB storage.</p>
            </div>

            <ActionButtons buttons={p.customButtons} />
          </div>
        </div>
      </div>
    </main>
  )
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="text-xs text-white/60">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  )
}
function btnCls(active: boolean) {
  return `px-3 py-1.5 rounded-xl border ${
    active ? "border-white bg-white text-black" : "border-white/10 bg-white/5 hover:bg-white/10"
  }`
}
