import { create } from "zustand"
import type { LaptopProduct } from "./types"
type State = { cart: LaptopProduct[], query: string, setQuery: (q:string)=>void, addToCart:(p:LaptopProduct)=>void }
export const useStore = create<State>((set)=> ({
  cart: [], query: "", setQuery: (q)=>set({query:q}), addToCart: (p)=>set(s=>({cart:[...s.cart,p]}))
}))