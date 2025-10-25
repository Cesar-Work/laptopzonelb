
# LaptopZoneLB-Installer.ps1
# All-in-one Windows 11 installer for LaptopZoneLB
# - Checks/installs Node.js (winget) if missing
# - Writes project files (Vite + React + TS + Tailwind + 3D viewer)
# - npm install
# - Launches dev server and opens http://localhost:5173

param(
  [string]$AppName = "LaptopZoneLB",
  [switch]$NoLaunch
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Banner([string]$t){ Write-Host "`n=== $t ===" -ForegroundColor Cyan }
function Info([string]$t){ Write-Host $t -ForegroundColor Gray }
function Good([string]$t){ Write-Host $t -ForegroundColor Green }
function Bad([string]$t){ Write-Host $t -ForegroundColor Red }

function Write-File($Root, $RelPath, [string]$Content) {
  $p = Join-Path $Root $RelPath
  $dir = Split-Path $p
  if(-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllText($p,$Content,$Utf8NoBom)
}

function Ensure-Node {
  Banner "Checking Node.js"
  $nodeVer = (node -v) 2>$null
  if($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($nodeVer)){
    Info "Node.js not found. Trying winget to install LTS..."
    $winget = (Get-Command winget -ErrorAction SilentlyContinue)
    if($null -eq $winget){
      Bad "winget not found. Install Node.js LTS from https://nodejs.org and re-run this installer."
      throw "Missing Node.js and winget."
    }
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements | Out-Null
    Start-Sleep -Seconds 5
    $nodeVer = (node -v) 2>$null
    if($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($nodeVer)){
      Bad "Node installation failed. Please install Node 18+ manually, then re-run."
      throw "Node install failed"
    }
    Good "Installed Node $nodeVer"
  } else {
    Good "Found Node $nodeVer"
  }
  Info "npm: $(npm -v)"
}

function Create-Project {
  param([string]$Root)
  Banner "Creating project files at $Root"

  if (Test-Path $Root) { Remove-Item $Root -Recurse -Force }
  New-Item -ItemType Directory -Path $Root | Out-Null

  Write-File $Root "package.json" @'
{
  "name": "laptopzonelb",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host"
  },
  "dependencies": {
    "@react-three/drei": "^9.106.0",
    "@react-three/fiber": "^8.17.10",
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "three": "^0.170.0",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
'@

  Write-File $Root "tsconfig.json" @'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "esModuleInterop": true,
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
'@

  Write-File $Root "vite.config.ts" @'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: { alias: { "@": "/src" } }
})
'@

  Write-File $Root "tailwind.config.js" @'
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink:"#0a0a0a", midnight:"#0d1117", neon:"#86efac" },
      boxShadow: { glow:"0 0 30px rgba(134,239,172,0.35)" }
    }
  },
  plugins: []
}
'@

  Write-File $Root "postcss.config.js" @'
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
'@

  Write-File $Root "index.html" @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LaptopZoneLB</title>
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body class="bg-midnight text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

  New-Item -ItemType Directory -Path (Join-Path $Root "public/assets") -Force | Out-Null
  New-Item -Path (Join-Path $Root "public/favicon.ico") -ItemType File -Force | Out-Null

  Write-File $Root "src/index.css" @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --card:#0f141b; --card-2:#111827; }
.glass{
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);
}
'@

  Write-File $Root "src/main.tsx" @'
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import App from "./pages/App"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"

const router = createBrowserRouter([{
  path: "/", element: <App />,
  children: [
    { index: true, element: <Catalog /> },
    { path: "product/:slug", element: <Product /> }
  ]
}])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
'@

  Write-File $Root "src/store.ts" @'
import { create } from "zustand"
import type { LaptopProduct } from "./types"
type State = { cart: LaptopProduct[], query: string, setQuery: (q:string)=>void, addToCart:(p:LaptopProduct)=>void }
export const useStore = create<State>((set)=> ({
  cart: [], query: "", setQuery: (q)=>set({query:q}), addToCart: (p)=>set(s=>({cart:[...s.cart,p]}))
}))
'@

  Write-File $Root "src/types.ts" @'
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
'@

  Write-File $Root "src/utils/cn.ts" @'
export const cn = (...c:(string|false|undefined|null)[]) => c.filter(Boolean).join(" ")
'@

  Write-File $Root "src/components/Badge.tsx" @'
import { cn } from "@/utils/cn"
export default function Badge({children,className}:{children:React.ReactNode,className?:string}){
  return <span className={cn("px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/10",className)}>{children}</span>
}
'@

  Write-File $Root "src/components/Product3D.tsx" @'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei"
import { Suspense } from "react"
function Model({url}:{url:string}){ const {scene}=useGLTF(url); return <primitive object={scene}/> }
function Placeholder(){ return (<mesh rotation={[0.3,0.6,0]}><boxGeometry args={[2.2,0.2,1.5]}/><meshStandardMaterial metalness={0.7} roughness={0.2}/></mesh>) }
export default function Product3D({url}:{url?:string}){
  return (
  <div className="h-72 w-full rounded-xl overflow-hidden bg-[#0b0f14] ring-1 ring-white/10">
    <Canvas camera={{position:[3,2,3]}}>
      <Suspense fallback={<Html center>Loading 3D…</Html>}>
        {url ? <Model url={url}/> : <Placeholder/>}
        <ambientLight intensity={0.5}/><directionalLight position={[5,5,5]} intensity={1}/>
        <Environment preset="city"/><OrbitControls enablePan={false}/>
      </Suspense>
    </Canvas>
  </div>)
}
'@

  Write-File $Root "src/components/ActionButtons.tsx" @'
import { OptionButton } from "@/types"
import { cn } from "@/utils/cn"
const styles:Record<NonNullable<OptionButton["kind"]>,string>={
  primary:"bg-white text-black hover:opacity-90",
  secondary:"bg-white/10 text-white hover:bg-white/15",
  whatsapp:"bg-[#25D366] text-black hover:opacity-90",
  call:"bg-blue-400 text-black hover:opacity-90"
}
export default function ActionButtons({buttons}:{buttons?:OptionButton[]}){
  if(!buttons?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((b,i)=>(
        <a key={i} href={b.href||"#"} className={cn("px-3 py-2 rounded-xl text-sm transition",styles[b.kind||"secondary"])} target={b.href?.startsWith("http")?"_blank":undefined}>{b.label}</a>
      ))}
    </div>
  )
}
'@

  Write-File $Root "src/components/ProductCard.tsx" @'
import { Link } from "react-router-dom"
import Badge from "./Badge"
import { LaptopProduct } from "@/types"

export default function ProductCard({p}:{p:LaptopProduct}){
  return (
    <Link to={"/product/"+p.slug} className="group block glass rounded-2xl p-4 hover:shadow-glow transition-shadow">
      <div className="aspect-video bg-black/30 rounded-xl overflow-hidden grid place-items-center">
        <img src={p.thumbnail} alt={p.title} className="object-contain max-h-full"/>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <Badge>{p.brand}</Badge>
          {p.ramExpandable && <Badge className='bg-green-400/15 text-green-300 border-green-400/25'>RAM upgradable</Badge>}
          {p.storageExpandable && <Badge className='bg-green-400/15 text-green-300 border-green-400/25'>Storage upgradable</Badge>}
        </div>
        <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
        <p className="text-sm text-white/70">{p.cpu} · {p.gpu}</p>
        <div className="mt-2 text-neon font-semibold">${p.priceUSD}</div>
      </div>
    </Link>
  )
}
'@

  Write-File $Root "src/pages/App.tsx" @'
import { Outlet, Link } from "react-router-dom"
import { Laptop, Search, ShoppingCart } from "lucide-react"
import { useStore } from "@/store"

export default function App(){
  const cartCount = useStore(s=>s.cart.length)
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-ink">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-midnight/70">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center shadow-glow">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">LaptopZoneLB</div>
              <div className="text-xs text-white/60">Laptops & IT Solutions</div>
            </div>
          </Link>
          <div className="ml-auto relative w-[420px] max-w-[55vw] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input placeholder="Search model, CPU, GPU..." className="w-full bg-white/5 rounded-xl pl-9 pr-3 py-2 outline-none ring-1 ring-white/10 focus:ring-white/20" onChange={(e)=>useStore.getState().setQuery(e.target.value)} />
          </div>
          <Link to="/" className="ml-3 relative">
            <ShoppingCart />
            {cartCount>0 && <span className="absolute -right-2 -top-2 text-xs bg-green-400 text-black px-1.5 py-0.5 rounded">{cartCount}</span>}
          </Link>
        </div>
      </header>
      <Outlet />
      <footer className="mt-12 py-10 text-center text-white/60">© LaptopZoneLB — Built with ❤️</footer>
    </div>
  )
}
'@

  Write-File $Root "src/pages/Catalog.tsx" @'
import { products } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { useStore } from "@/store"
import { useMemo, useState } from "react"

export default function Catalog(){
  const query = useStore(s=>s.query).toLowerCase()
  const [brand, setBrand] = useState<string>("All")

  const filtered = useMemo(()=>{
    return products.filter(p=>{
      const hay = (p.title + " " + p.cpu + " " + p.gpu + " " + p.brand).toLowerCase()
      const byQuery = hay.includes(query)
      const byBrand = brand==="All" || p.brand===brand
      return byQuery && byBrand
    })
  }, [query, brand])

  return (
    <main className="mx-auto max-w-7xl px-4">
      <section className="py-10">
        <h1 className="text-3xl font-bold tracking-tight">Find your next laptop</h1>
        <p className="text-white/70">Modern, creative, teen-approved. Configure RAM and storage your way.</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {["All","Dell","HP","Fujitsu","Lenovo","Apple","Other"].map(b=>(
            <button key={b} onClick={()=>setBrand(b)} className={`px-3 py-1.5 rounded-xl border ${brand===b?'border-white/30 bg-white/10':'border-white/10 bg-white/5'} hover:bg-white/10`}>{b}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map(p=> <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </main>
  )
}
'@

  Write-File $Root "src/pages/Product.tsx" @'
import { useParams } from "react-router-dom"
import { products } from "@/data/products"
import Product3D from "@/components/Product3D"
import ActionButtons from "@/components/ActionButtons"
import { useState } from "react"
import Badge from "@/components/Badge"

export default function Product(){
  const { slug } = useParams()
  const p = products.find(x=>x.slug===slug)!
  const [ram, setRam] = useState<number>(p.ramGB)
  const [storage, setStorage] = useState<number>(p.storageGB)

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="grid lg:grid-cols-2 gap-8 py-10">
        <div>
          <div className="aspect-video rounded-2xl overflow-hidden bg-black/30 grid place-items-center ring-1 ring-white/10">
            <img src={p.thumbnail} alt={p.title} className="object-contain max-h-full" />
          </div>
          <div className="mt-4">
            <Product3D url={p.gltfUrl} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge>{p.brand}</Badge>
            {p.ramExpandable && <Badge className="bg-green-400/15 text-green-300 border-green-400/25">RAM upgradable</Badge>}
            {p.storageExpandable && <Badge className="bg-green-400/15 text-green-300 border-green-400/25">Storage upgradable</Badge>}
          </div>
          <h1 className="mt-2 text-3xl font-bold">{p.title}</h1>
          <p className="text-white/70">{p.description}</p>
          <div className="mt-4 text-neon text-3xl font-extrabold">${p.priceUSD}</div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Spec k="CPU" v={p.cpu} />
              <Spec k="GPU" v={p.gpu} />
              <Spec k="RAM" v={`${p.ramGB} GB`} />
              <Spec k="Storage" v={`${p.storageGB} ${p.storageType}`} />
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="font-medium mb-2">Customize</div>
              <div className="flex flex-wrap gap-4">
                {p.options?.ram && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">RAM</div>
                    <div className="flex gap-2">
                      {p.options.ram.map(r=>(
                        <button key={r} onClick={()=>setRam(r)} className={btnCls(ram===r)}>{r} GB</button>
                      ))}
                    </div>
                  </div>
                )}
                {p.options?.storage && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Storage</div>
                    <div className="flex gap-2">
                      {p.options.storage.map(s=>(
                        <button key={s} onClick={()=>setStorage(s)} className={btnCls(storage===s)}>{s} GB</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 mt-2">Selected: {ram} GB RAM, {storage} GB storage.</p>
            </div>
            <ActionButtons buttons={p.customButtons} />
          </div>
        </div>
      </div>
    </main>
  )
}

function Spec({k,v}:{k:string,v:string}){
  return (
    <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="text-xs text-white/60">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  )
}
function btnCls(active:boolean){
  return `px-3 py-1.5 rounded-xl border ${active?'border-white bg-white text-black':'border-white/10 bg-white/5 hover:bg-white/10'}`
}
'@

  Write-File $Root "README.md" @'
# LaptopZoneLB
- Vite + React + Tailwind + react-three-fiber
- Catalog + Product page + 3D + customizable buttons + RAM/Storage options.
- Add/modify products in **src/data/products.ts**. Images go in **public/assets/**.
'@

  $svgBase = @"
<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#0d1117'/>
      <stop offset='100%' stop-color='#0a0a0a'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <g fill='none' stroke='#86efac' stroke-width='6' opacity='0.9'>
    <rect x='220' y='170' rx='16' ry='16' width='760' height='420'/>
    <path d='M260 170 h680 v-30 q0-20 -20-20 H280 q-20 0 -20 20z' fill='none'/>
  </g>
  <text x='50%' y='60' text-anchor='middle' font-size='42' fill='#86efac' font-family='Segoe UI, Roboto, Arial'>LaptopZoneLB</text>
  <text id='brand' x='50%' y='120' text-anchor='middle' font-size='28' fill='#ffffff99' font-family='Segoe UI, Roboto, Arial'>BRAND MODEL</text>
</svg>
"@
  ($svgBase -replace "BRAND MODEL","FUJITSU H780") | Set-Content -Path (Join-Path $Root "public/assets/fujitsu-h780.svg") -Encoding UTF8
  ($svgBase -replace "BRAND MODEL","DELL 7320")   | Set-Content -Path (Join-Path $Root "public/assets/dell-7320.svg") -Encoding UTF8
  ($svgBase -replace "BRAND MODEL","HP 830 G5")   | Set-Content -Path (Join-Path $Root "public/assets/hp-830-g5.svg") -Encoding UTF8
}

function Run-Install {
  param([string]$Root, [switch]$NoLaunch)

  Banner "Installing npm dependencies"
  Push-Location $Root
  npm install

  Banner "Starting dev server"
  if(-not $NoLaunch){
    Start-Process "powershell" -WorkingDirectory $Root -ArgumentList "-NoExit","-Command","npm run dev" | Out-Null
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
  } else {
    Info "Run 'npm run dev' in $Root"
  }
  Pop-Location
  Good "DONE. Project at $Root"
}

$Root = Join-Path (Get-Location) $AppName
Ensure-Node
Create-Project -Root $Root
Run-Install -Root $Root -NoLaunch:$NoLaunch
