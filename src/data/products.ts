import type { LaptopProduct } from "@/types"

export const products: LaptopProduct[] = [
  {
    id: "fujitsu-celsius-h780",
    slug: "fujitsu-celsius-h780",
    brand: "Fujitsu",
    title: "FUJITSU Workstation CELSIUS H780",
    priceUSD: 500,
    thumbnail: "/assets/fujitsu-h780.png",
    description: "Mobile workstation with Quadro graphics.",
    cpu: "Intel Core i7-8820H 2.6GHz",
    gpu: "NVIDIA Quadro P600 4GB + Intel HD 630",
    ramGB: 32,
    storageGB: 512,
    storageType: "NVMe",
    ramExpandable: false,
    storageExpandable: false,
    specs: [
      {k:"CPU", v:"Core i7-8820H 2.6GHz"},
      {k:"GPU", v:"Quadro P600 4GB + Intel HD 630"},
      {k:"RAM", v:"32GB"},
      {k:"Storage", v:"512GB NVMe"}
    ],
    options: { ram: [32], storage: [512] },
    customButtons: [
      { label: "WhatsApp 1", kind: "whatsapp", href: "https://wa.me/96170269583" },
      { label: "WhatsApp 2", kind: "call", href: "https://wa.me/9613824875" }
    ]
  },
  {
    id: "dell-latitude-7320",
    slug: "dell-latitude-7320",
    brand: "Dell",
    title: "Dell Latitude 7320",
    priceUSD: 350,
    thumbnail: "/assets/dell-7320.png",
    description: "Compact business ultrabook (11th-gen + Iris Xe).",
    cpu: "Intel Core i5-1145G7 2.6GHz",
    gpu: "Intel Iris Xe",
    ramGB: 16,
    storageGB: 512,
    storageType: "NVMe",
    ramExpandable: false,
    storageExpandable: false,
    specs: [
      {k:"CPU", v:"Core i5-1145G7 2.6GHz"},
      {k:"GPU", v:"Intel Iris Xe"},
      {k:"RAM", v:"16GB"},
      {k:"Storage", v:"512GB NVMe"}
    ],
    options: { storage: [512] },
    customButtons: [
      { label: "WhatsApp 1", kind: "whatsapp", href: "https://wa.me/96170269583" },
      { label: "WhatsApp 2", kind: "call", href: "https://wa.me/9613824875" }
    ]
  },
  {
    id: "hp-elitebook-830-g5",
    slug: "hp-elitebook-830-g5",
    brand: "HP",
    title: "HP EliteBook 830 G5",
    priceUSD: 285,
    thumbnail: "/assets/hp-830-g5.png",
    description: "Sturdy 13-inch business laptop.",
    cpu: "Intel Core i5-8350U",
    gpu: "Intel HD 620",
    ramGB: 16,
    storageGB: 256,
    storageType: "NVMe",
    ramExpandable: false,
    storageExpandable: false,
    specs: [
      {k:"CPU", v:"Core i5-8350U"},
      {k:"GPU", v:"Intel HD 620"},
      {k:"RAM", v:"16GB"},
      {k:"Storage", v:"256GB NVMe"}
    ],
    options: { ram: [16], storage: [256] },
    customButtons: [
      { label: "WhatsApp 1", kind: "whatsapp", href: "https://wa.me/96170269583" },
      { label: "WhatsApp 2", kind: "call", href: "https://wa.me/9613824875" }
    ]
  },
  {
  id: "lenovo-thinkpad-x1-carbon-g6",
  slug: "lenovo-thinkpad-x1-carbon-g6",
  brand: "Lenovo",
  title: "Lenovo ThinkPad X1 Carbon Gen 6",
  priceUSD: 320,
  thumbnail: "/assets/lenovo-x1-carbon-g6.png", // place this file in public/assets/
  description: "Ultra-light business flagship. Solid keyboard, premium build.",
  cpu: "Intel Core i5-8250U",
  gpu: "Intel UHD Graphics 620",
  ramGB: 8,
  storageGB: 256,
  storageType: "NVMe",
  ramExpandable: false,
  storageExpandable: false,
  specs: [
    { k: "CPU", v: "Core i5-8250U" },
    { k: "GPU", v: "Intel UHD 620" },
    { k: "RAM", v: "8GB" },
    { k: "Storage", v: "256GB NVMe" }
  ],
  options: { ram: [8], storage: [256] },
  customButtons: [
    { label: "WhatsApp — X1 Carbon", kind: "whatsapp", href: "https://wa.me/96170269583?text=Interested%20in%20Lenovo%20X1%20Carbon%20Gen%206" },
    { label: "Call 03-824875", kind: "call", href: "tel:+9613824875" }
  ]
},

{
  id: "hp-probook-440-g5",
  slug: "hp-probook-440-g5",
  brand: "HP",
  title: "HP ProBook 440 G5",
  priceUSD: 220,
  thumbnail: "/assets/hp-probook-440-g5.png", // place this file in public/assets/
  description: "Reliable 14\" ProBook. Dual-drive config (NVMe + HDD).",
  cpu: "Intel Core i5-7200U",
  gpu: "Intel HD Graphics 620",
  ramGB: 8,
  storageGB: 128,            // primary drive shown here
  storageType: "NVMe",
  ramExpandable: false,
  storageExpandable: false,
  specs: [
    { k: "CPU", v: "Core i5-7200U" },
    { k: "GPU", v: "Intel HD 620" },
    { k: "RAM", v: "8GB" },
    { k: "Storage", v: "128GB NVMe + 500GB HDD" }
  ],
  options: { ram: [8], storage: [128] },
  customButtons: [
    { label: "WhatsApp — ProBook", kind: "whatsapp", href: "https://wa.me/96170269583?text=Interested%20in%20HP%20ProBook%20440%20G5" },
    { label: "Call 70-269583", kind: "call", href: "tel:+96170269583" }
  ]
},

{
  id: "lenovo-thinkpad-t14s-gen1-touch",
  slug: "lenovo-thinkpad-t14s-gen1-touch",
  brand: "Lenovo",
  title: "Lenovo ThinkPad T14s Gen 1 (Touch)",
  priceUSD: 450,
  thumbnail: "/assets/lenovo-t14s-gen1.png", // place this file in public/assets/
  description: "Slim T-series with touchscreen and Ryzen 7 Pro performance.",
  cpu: "AMD Ryzen 7 Pro 4750U",
  gpu: "AMD Radeon Graphics",
  ramGB: 32,
  storageGB: 512,
  storageType: "NVMe",
  ramExpandable: false,
  storageExpandable: false,
  specs: [
    { k: "CPU", v: "Ryzen 7 Pro 4750U" },
    { k: "GPU", v: "AMD Radeon Graphics" },
    { k: "RAM", v: "32GB" },
    { k: "Storage", v: "512GB NVMe" },
    { k: "Display", v: "Touchscreen" }
  ],
  options: { ram: [32], storage: [512] },
  customButtons: [
    { label: "WhatsApp — T14s Touch", kind: "whatsapp", href: "https://wa.me/96170269583?text=Interested%20in%20ThinkPad%20T14s%20Gen1%20Touch" },
    { label: "Call 03-824875", kind: "call", href: "tel:+9613824875" }
  ]
}

]
