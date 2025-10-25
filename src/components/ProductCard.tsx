import { Link } from "react-router-dom"
import Badge from "./Badge"
import { LaptopProduct } from "@/types"

export default function ProductCard({ p }: { p: LaptopProduct }) {
  return (
    <Link
      to={"/product/" + p.slug}
      className="group block glass rounded-2xl p-4 hover:shadow-glow transition-shadow duration-200"
    >
      {/* Image du laptop */}
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

      {/* Informations principales */}
      <div className="mt-3 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{p.brand}</Badge>

          {p.ramExpandable && (
            <Badge className="bg-green-400/15 text-green-300 border-green-400/25">
              RAM upgradable
            </Badge>
          )}

          {p.storageExpandable && (
            <Badge className="bg-blue-400/15 text-blue-300 border-blue-400/25">
              Storage upgradable
            </Badge>
          )}
        </div>

        <h3 className="mt-1 text-lg font-semibold leading-tight">
          {p.title}
        </h3>

        <p className="text-sm text-white/70">
          {p.cpu} · {p.gpu}
        </p>

        <div className="mt-2 text-neon font-semibold text-lg">
          ${p.priceUSD}
        </div>
      </div>
    </Link>
  )
}
