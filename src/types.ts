export type OptionButton = { label:string; href?:string; kind?: "primary"|"secondary"|"whatsapp"|"call" }
export type SpecKV = { k:string, v:string }
export type LaptopProduct = {
  id:string; slug:string; brand:"Dell"|"HP"|"Fujitsu"|"Lenovo"|"Apple"|"Other"
  title:string; priceUSD:number; thumbnail:string; gallery?:string[]
  gltfUrl?:string; description?:string; specs:SpecKV[]
  cpu:string; gpu:string; ramGB:number; storageGB:number; storageType:"NVMe"|"SSD"|"HDD"
  ramExpandable?:boolean; storageExpandable?:boolean
  customButtons?: OptionButton[]
  options?: { ram?:number[]; storage?:number[] }
}