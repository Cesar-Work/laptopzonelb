export type OptionButton = {
  label: string
  href?: string
  // ajoute d'autres styles si tu veux (instagram, maps, etc.)
  kind?: "primary" | "secondary" | "whatsapp" | "call"
}

export type SpecKV = { k: string; v: string }

export type RamOption = { sizeGB: number; priceDeltaUSD: number; available: boolean }
export type StorageOption = { sizeGB: number; priceDeltaUSD: number; available: boolean }

export type LaptopProduct = {
  id: string
  slug: string
  brand: "Dell" | "HP" | "Fujitsu" | "Lenovo" | "Apple" | "Other"
  title: string
  description?: string
  basePriceUSD: number
  thumbnail: string
  cpu: string
  gpu: string
  storageType: "NVMe" | "SSD" | "HDD"
  specs: SpecKV[]
  ramOptions?: RamOption[]
  storageOptions?: StorageOption[]
  customButtons?: OptionButton[]
  gltfUrl?: string
}
