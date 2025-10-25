import { Link } from "react-router-dom"
import Badge from "./Badge"
import type { LaptopProduct } from "@/types"

export default function ProductCard({ p }: { p: LaptopProduct }) {
  return (
    <Link
      to={"/product/" + p.slug}
      className="group block glass rounded-2xl p-4 hover:shadow-glow transition-shadow duration-200"
    >
      <div className="aspect-video bg-black/30 rounded-xl overflow-hidden grid place-items-center">
        <img
          src={p.thumbnail}
          alt={p.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/assets/fallback.svg"
          }}
          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{p.brand}</Badge>
        </div>

        <h3 className="mt-1 text-lg font-semibold leading-tight">{p.title}</h3>

        <p className="text-sm text-white/70">
          {p.cpu} · {p.gpu}
        </p>

        {/* Affiche le prix de base (les deltas d’options s’ajoutent sur la page produit) */}
        <div className="mt-2 text-neon font-semibold text-lg">
          ${p.basePriceUSD}
        </div>
      </div>
    </Link>
  )
}
