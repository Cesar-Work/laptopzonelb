import { useState } from "react";
import { fetchAllProducts } from "@/data/useproducts";
import type { LaptopProduct } from "@/types";

/**
 * AI‑driven advisor page that helps customers choose the best laptop.
 *
 * This component collects a few simple preferences from the user (budget range,
 * CPU/GPU keywords and minimum RAM/storage requirements) and then fetches
 * all products from Firestore.  A basic scoring algorithm ranks laptops by
 * matching attributes.  The top results are displayed in a list with
 * links to their product pages.  This is intended to be a simple,
 * educational example – feel free to refine the scoring logic or the
 * user interface to better suit your needs.
 */
export default function Advisor() {
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(2000);
  const [cpuPref, setCpuPref] = useState<string>("");
  const [gpuPref, setGpuPref] = useState<string>("");
  const [ramMin, setRamMin] = useState<number>(0);
  const [storageMin, setStorageMin] = useState<number>(0);
  const [results, setResults] = useState<LaptopProduct[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handler invoked when the user clicks the "Recommend" button.
  async function handleRecommend() {
    setLoading(true);
    try {
      const products = await fetchAllProducts();
      // Compute a simple relevance score for each product based on the
      // supplied preferences.  Higher scores indicate a better match.
      const scored = products.map((p) => {
        let score = 0;
        // Budget range: award 1 point if the base price lies within the range.
        if (p.basePriceUSD >= minBudget && p.basePriceUSD <= maxBudget) {
          score++;
        }
        // CPU keyword: 1 point if the CPU string contains the preference.
        if (cpuPref && p.cpu.toLowerCase().includes(cpuPref.toLowerCase())) {
          score++;
        }
        // GPU keyword: 1 point if the GPU string contains the preference.
        if (gpuPref && p.gpu.toLowerCase().includes(gpuPref.toLowerCase())) {
          score++;
        }
        // Minimum RAM: 1 point if any available RAM option meets or exceeds it.
        if (
          ramMin > 0 &&
          p.ramOptions?.some((o) => o.available && o.sizeGB >= ramMin)
        ) {
          score++;
        }
        // Minimum storage: 1 point if any available storage option meets it.
        if (
          storageMin > 0 &&
          p.storageOptions?.some((o) => o.available && o.sizeGB >= storageMin)
        ) {
          score++;
        }
        return { product: p, score };
      });
      // Sort by descending score and then by lowest base price.
      const sorted = scored
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.product.basePriceUSD - b.product.basePriceUSD;
        })
        .map((x) => x.product);
      setResults(sorted);
    } catch (e) {
      console.error("Advisor recommendation failed:", e);
      // In a production app you might want to display an error message.
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assistant IA pour portables</h1>
        <p className="text-white/70">
          Indiquez vos préférences pour trouver l&apos;ordinateur portable idéal.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Budget range */}
        <div>
          <label className="block text-sm text-white/70 mb-1">Budget min (USD)</label>
          <input
            type="number"
            className="w-full bg-white/5 p-2 rounded"
            value={minBudget}
            onChange={(e) => setMinBudget(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Budget max (USD)</label>
          <input
            type="number"
            className="w-full bg-white/5 p-2 rounded"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
          />
        </div>
        {/* CPU & GPU preferences */}
        <div>
          <label className="block text-sm text-white/70 mb-1">Mot‑clé CPU</label>
          <input
            type="text"
            className="w-full bg-white/5 p-2 rounded"
            value={cpuPref}
            onChange={(e) => setCpuPref(e.target.value)}
            placeholder="ex: i7, Ryzen"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Mot‑clé GPU</label>
          <input
            type="text"
            className="w-full bg-white/5 p-2 rounded"
            value={gpuPref}
            onChange={(e) => setGpuPref(e.target.value)}
            placeholder="ex: RTX, Radeon"
          />
        </div>
        {/* Minimum RAM */}
        <div>
          <label className="block text-sm text-white/70 mb-1">RAM minimale (Go)</label>
          <input
            type="number"
            className="w-full bg-white/5 p-2 rounded"
            value={ramMin}
            onChange={(e) => setRamMin(Number(e.target.value))}
          />
        </div>
        {/* Minimum storage */}
        <div>
          <label className="block text-sm text-white/70 mb-1">
            Stockage minimum (Go)
          </label>
          <input
            type="number"
            className="w-full bg-white/5 p-2 rounded"
            value={storageMin}
            onChange={(e) => setStorageMin(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={handleRecommend}
          className="px-4 py-2 rounded bg-neon text-black font-semibold"
        >
          {loading ? "Recherche…" : "Recommander"}
        </button>
      </div>
      {results && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Résultats ({results.length})</h2>
          {results.length === 0 ? (
            <p className="text-white/70">Aucun portable ne correspond à vos critères.</p>
          ) : (
            <ul className="space-y-4">
              {results.map((p) => (
                <li key={p.id} className="p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{p.title}</div>
                      <div className="text-white/70 text-sm">
                        {p.brand} · {p.cpu} · {p.gpu} · {p.basePriceUSD}
                        $US
                      </div>
                    </div>
                    <a
                      href={`/product/${p.slug}`}
                      className="px-3 py-1 rounded bg-neon text-black text-sm"
                    >
                      Voir
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
