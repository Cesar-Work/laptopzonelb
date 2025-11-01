// src/pages/Admin.tsx
import { useEffect, useState, type ChangeEvent } from "react"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import {
  collection, addDoc, doc, updateDoc, getDoc, serverTimestamp
} from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import type { LaptopProduct, RamOption, StorageOption } from "@/types"

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // upload state
  const [uploadPct, setUploadPct] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

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

  // Auth + check admin
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setError(null)
      if (!u) { setIsAdmin(false); return }
      try {
        const adm = await getDoc(doc(db, "admins", u.uid))
        const active = adm.exists() && adm.data()?.active === true
        setIsAdmin(active)
        console.log("[admin-check]", u.uid, "isAdmin:", active)
      } catch (e: any) {
        console.error("[admin-check] failed:", e)
        setError("Admin check failed: " + (e.message || e.code))
        setIsAdmin(false)
      }
    })
  }, [])

  async function login(e: any) {
    e.preventDefault()
    setError(null)
    const email = e.target.email.value
    const pass = e.target.password.value
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (e: any) {
      console.error(e)
      setError("Login failed: " + (e.message || e.code))
      alert("Login failed: " + (e.message || e.code))
    }
  }
  async function logout() { await signOut(auth) }

  // === NEW: handle thumbnail file upload to Firebase Storage ===
  async function handleThumbnailFile(e: ChangeEvent<HTMLInputElement>) {
    try {
      setUploadError(null)
      setUploadPct(0)

      const file = e.target.files?.[0]
      if (!file) return

      if (!auth.currentUser) {
        alert("You must sign in first.")
        return
      }
      if (!isAdmin) {
        alert(`You are signed in (UID ${auth.currentUser.uid}) but not an admin.
Create Firestore doc: admins/${auth.currentUser.uid} = { active: true }`)
        return
      }

      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.")
        return
      }
      const maxMB = 5
      if (file.size > maxMB * 1024 * 1024) {
        setUploadError(`Image is too large. Max ${maxMB}MB.`)
        return
      }

      const storage = getStorage() // uses your initialized Firebase app
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const safeSlug = String(form.slug || "no-slug")
        .toLowerCase().replace(/[^a-z0-9\-]+/g, "-")
      // user-scoped path; public read via Storage rules; good cache headers
      const path = `uploads/${auth.currentUser.uid}/${Date.now()}_${safeSlug}.${ext}`
      const storageRef = ref(storage, path)

      const metadata = {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      }

      const task = uploadBytesResumable(storageRef, file, metadata)

      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          setUploadPct(pct)
        },
        (err) => {
          console.error("[upload] failed:", err)
          setUploadError(err.message || "Upload failed")
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          setForm((f) => ({ ...f, thumbnail: url }))
          setUploadPct(100)
        }
      )
    } catch (err: any) {
      console.error(err)
      setUploadError(err.message || "Upload error")
    }
  }

  async function addProduct() {
    try {
      setSaving(true)
      setError(null)

      if (!auth.currentUser) {
        alert("You must sign in first."); return
      }
      if (!isAdmin) {
        alert(`You are signed in (UID ${auth.currentUser.uid}) but not an admin.
Create Firestore doc: admins/${auth.currentUser.uid} = { active: true }`);
        return
      }
      if (!form.slug || !form.title) {
        alert("slug et title requis"); return
      }

      const payload: any = { ...form }
      // normalisation
      payload.slug = String(payload.slug)
        .toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/\s+/g, "-")
      payload.basePriceUSD = Number(payload.basePriceUSD || 0)
      payload.specs = payload.specs || []
      payload.ramOptions = (payload.ramOptions || []).map(normalizeOpt)
      payload.storageOptions = (payload.storageOptions || []).map(normalizeOpt)
      payload.createdAt = serverTimestamp()
      payload.updatedAt = serverTimestamp()

      console.log("[addProduct] payload:", payload)

      const res = await addDoc(collection(db, "products"), payload)
      await updateDoc(doc(db, "products", res.id), { id: res.id, updatedAt: serverTimestamp() })
      alert("Product added ✅ ID: " + res.id)
    } catch (e: any) {
      console.error("[addProduct] failed:", e)
      setError("Save failed: " + (e.message || e.code || e))
      alert("Save failed: " + (e.message || e.code || e))
    } finally {
      setSaving(false)
    }
  }

  return !user ? (
    <LoginForm onSubmit={login} error={error} />
  ) : (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-xs opacity-60">
            UID: {user?.uid} · email: {user?.email || "n/a"} · isAdmin: {String(isAdmin)}
          </div>
        </div>
        <button onClick={logout} className="px-3 py-2 rounded bg-white text-black">Logout</button>
      </div>

      {!isAdmin && (
        <div className="text-red-400">
          Not admin. Create Firestore doc <code>admins/{user.uid}</code> with <code>{`{ active: true }`}</code>.
        </div>
      )}

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

          {/* === CHANGED: Thumbnail field with URL, file upload, progress, preview === */}
          <Field label="Thumbnail (URL or upload)">
            <div className="space-y-2">
              <input
                className="w-full bg-white/5 p-2 rounded"
                placeholder="/assets/xxx.png or https://..."
                value={form.thumbnail || ""}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFile}
                  className="bg-white/5 p-2 rounded"
                />
                {uploadPct > 0 && uploadPct < 100 && (
                  <div className="text-xs opacity-70">{uploadPct}%</div>
                )}
                {uploadError && <div className="text-red-400 text-xs">{uploadError}</div>}
              </div>
              {form.thumbnail && (
                <img
                  src={form.thumbnail}
                  alt="thumbnail preview"
                  className="mt-2 h-24 w-24 object-cover rounded"
                />
              )}
            </div>
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

        <button
          type="button"
          onClick={addProduct}
          disabled={!isAdmin || saving}
          className="px-3 py-2 rounded bg-neon text-black font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save product"}
        </button>

        {error && <div className="text-red-400 text-sm">{error}</div>}
      </section>
    </main>
  )
}

function LoginForm({ onSubmit, error }: { onSubmit: (e: any) => void; error?: string | null }) {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" className="w-full bg-white/5 p-2 rounded" placeholder="Email" />
        <input name="password" type="password" className="w-full bg-white/5 p-2 rounded" placeholder="Password" />
        <button className="px-3 py-2 rounded bg-white text-black">Sign in</button>
      </form>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
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
          <input type="number" className="w-24 bg-white/5 p-2 rounded" value={o.sizeGB}
            onChange={(e) => { const v = [...items]; v[idx] = { ...o, sizeGB: +e.target.value } as T; setItems(v) }}
            placeholder={placeholderSize} />
          <input type="number" className="w-28 bg-white/5 p-2 rounded" value={o.priceDeltaUSD}
            onChange={(e) => { const v = [...items]; v[idx] = { ...o, priceDeltaUSD: +e.target.value } as T; setItems(v) }}
            placeholder="+$" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={o.available}
              onChange={(e) => { const v = [...items]; v[idx] = { ...o, available: e.target.checked } as T; setItems(v) }} />
            available
          </label>
          <button type="button" className="px-2 rounded bg-white/10"
            onClick={() => { const v = [...items]; v.splice(idx, 1); setItems(v) }}>
            remove
          </button>
        </div>
      ))}
      <button type="button" className="px-2 py-1 rounded bg-white text-black text-sm"
        onClick={() => setItems([...items, { sizeGB: 8, priceDeltaUSD: 0, available: true } as T])}>
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
