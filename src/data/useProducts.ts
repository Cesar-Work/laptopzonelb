import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import type { LaptopProduct } from "@/types"

export async function fetchAllProducts(): Promise<LaptopProduct[]> {
  const snap = await getDocs(collection(db, "products"))
  return snap.docs.map(d => d.data() as LaptopProduct)
}

export async function fetchBySlug(slug: string): Promise<LaptopProduct | null> {
  const q = query(collection(db, "products"), where("slug", "==", slug))
  const snap = await getDocs(q)
  return snap.empty ? null : (snap.docs[0].data() as LaptopProduct)
}
