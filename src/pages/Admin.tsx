import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import type { LaptopProduct, RamOption, StorageOption } from "@/types"

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState<Partial<LaptopProduct>>({
    brand: "Dell",
    title: "",
    slug: "",
    description: "",
    basePriceUSD: 0,
    cpu: "",
    gpu: "",
    thumbnail: "/assets/placeholder.png",
    storageType: "NVMe",
    specs: [],
    ramOptions: [{ sizeGB: 16, priceDeltaUSD: 0, available: true }],
    storageOptions: [{ sizeGB: 256, priceDeltaUSD: 0, available: true }],
  })

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  async function login(e: any) {
    e.preventDefault()
    const email = e.target.email.value
    const pass = e.target.password.value
    await signInWithEmailAndPassword(auth, email, pass)
  }
  async function logout() {
    await signOut(auth)
  }

  async function addProduct() {
    if (!form.slug || !form.title) return alert("slug et title requis")
    const payload: any = { ...form }
    // valeur par défaut au cas où
    payload.basePriceUSD = Number(payload.basePriceUSD || 0)
    payload.specs = payload.specs || []
    payload.ramOptions = (payload.ramOptions || []).map(normalizeOpt)
    payload.storageOptions = (payload.storageOptions || []).map(normalizeOpt)

    const res = await addDoc(collection(db, "products"), payload)
    await updateDoc(doc(db, "products", res.id), { id: res.id })
    alert("Product added: " + res.id)
  }

  return !user ? (
    <LoginForm onSubmit={login} />
  ) : (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="px-3 py-2 rounded bg-white text-black">Logout</button>
      </div>

      <section className="glass p-4 rounded-2xl space-y-3">
        <Field label="Title">
          <input className="w-full bg-white/5 p-2 rounded"
            value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Slug (URL)">
          <input className="w-full bg-white/5 p-2 rounded"
            value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="Brand">
          <input className="w-full bg-white/5 p-2 rounded"
            value={(form.brand as string) || ""} onChange={(e) => setForm({ ...form, brand: e.target.value as any })} />
        </Field>
        <Field label="Description">
          <textarea className="w-full bg-white/5 p-2 rounded"
            value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="CPU">
            <input className="bg-white/5 p-2 rounded"
              value={form.cpu || ""} onChange={(e) => setForm({ ...form, cpu: e.target.value })} />
          </Field>
          <Field label="GPU">
            <input className="bg-white/5 p-2 rounded"
              value={form.gpu || ""} onChange={(e) => setForm({ ...form, gpu: e.target.value })} />
          </Field>
          <Field label="Base Price (USD)">
            <input type="number" className="bg-white/5 p-2 rounded"
              value={form.basePriceUSD || 0} onChange={(e) => setForm({ ...form, basePriceUSD: +e.target.value })} />
          </Field>
          <Field label="Thumbnail (/assets/xxx.png ou URL)">
            <input className="bg-white/5 p-2 rounded"
              value={form.thumbnail || ""} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          </Field>
        </div>

        {/* Options RAM */}
        <OptionsEditor<RamOption>
          title="RAM options"
          items={(form.ramOptions || []) as RamOption[]}
          setItems={(v) => setForm({ ...form, ramOptions: v })}
          placeholderSize="GB"
        />

        {/* Options Storage */}
        <OptionsEditor<StorageOption>
          title="Storage options"
          items={(form.storageOptions || []) as StorageOption[]}
          setItems={(v) => setForm({ ...form, storageOptions: v })}
          placeholderSize="GB"
        />

        <button onClick={addProduct} className="px-3 py-2 rounded bg-neon text-black font-semibold">
          Save product
        </button>
      </section>
    </main>
  )
}

function LoginForm({ onSubmit }: { onSubmit: (e: any) => void }) {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" className="w-full bg-white/5 p-2 rounded" placeholder="Email" />
        <input name="password" type="password" className="w-full bg-white/5 p-2 rounded" placeholder="Password" />
        <button className="px-3 py-2 rounded bg-white text-black">Sign in</button>
      </form>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm text-white/70 mb-1">{label}</div>
      {children}
    </label>
  )
}

function OptionsEditor<T extends { sizeGB: number; priceDeltaUSD: number; available: boolean }>(
  { title, items, setItems, placeholderSize }:
  { title: string; items: T[]; setItems: (v: T[]) => void; placeholderSize: string }
) {
  return (
    <div>
      <div className="font-medium mb-1">{title}</div>
      {items.map((o, idx) => (
        <div key={idx} className="flex flex-wrap gap-2 mb-2">
          <input
            type="number"
            className="w-24 bg-white/5 p-2 rounded"
            value={o.sizeGB}
            onChange={(e) => {
              const v = [...items]; v[idx] = { ...o, sizeGB: +e.target.value } as T; setItems(v)
            }}
            placeholder={placeholderSize}
          />
          <input
            type="number"
            className="w-28 bg-white/5 p-2 rounded"
            value={o.priceDeltaUSD}
            onChange={(e) => {
              const v = [...items]; v[idx] = { ...o, priceDeltaUSD: +e.target.value } as T; setItems(v)
            }}
            placeholder="+$"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={o.available}
              onChange={(e) => {
                const v = [...items]; v[idx] = { ...o, available: e.target.checked } as T; setItems(v)
              }}
            />
            available
          </label>
          <button
            type="button"
            className="px-2 rounded bg-white/10"
            onClick={() => {
              const v = [...items]; v.splice(idx, 1); setItems(v)
            }}
          >
            remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="px-2 py-1 rounded bg-white text-black text-sm"
        onClick={() => setItems([...items, { sizeGB: 8, priceDeltaUSD: 0, available: true } as T])}
      >
        + add option
      </button>
    </div>
  )
}

function normalizeOpt<T extends { sizeGB: any; priceDeltaUSD: any; available: any }>(o: T): T {
  return {
    ...o,
    sizeGB: Number(o.sizeGB || 0),
    priceDeltaUSD: Number(o.priceDeltaUSD || 0),
    available: Boolean(o.available),
  }
}
