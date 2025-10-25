import type { LaptopProduct } from "@/types"

export const products: LaptopProduct[] = [
  {
    id: "fujitsu-celsius-h780",
    slug: "fujitsu-celsius-h780",
    brand: "Fujitsu",
    title: "FUJITSU Workstation CELSIUS H780",
    description: "Mobile workstation with Quadro graphics.",
    basePriceUSD: 500,
    thumbnail: "/assets/fujitsu-h780.png",
    cpu: "Intel Core i7-8820H 2.6GHz",
    gpu: "NVIDIA Quadro P600 4GB + Intel HD 630",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Core i7-8820H 2.6GHz" },
      { k: "GPU", v: "Quadro P600 4GB + Intel HD 630" }
    ],
    ramOptions: [
      { sizeGB: 32, priceDeltaUSD: 0, available: true },
      { sizeGB: 64, priceDeltaUSD: 70, available: true }
    ],
    storageOptions: [
      { sizeGB: 256, priceDeltaUSD: 0, available: true },
      { sizeGB: 512, priceDeltaUSD: 30, available: true },
      { sizeGB: 1024, priceDeltaUSD: 90, available: true }
    ],
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
    description: "Compact business ultrabook (11th-gen + Iris Xe).",
    basePriceUSD: 350,
    thumbnail: "/assets/dell-7320.png",
    cpu: "Intel Core i5-1145G7 2.6GHz",
    gpu: "Intel Iris Xe",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Core i5-1145G7 2.6GHz" },
      { k: "GPU", v: "Intel Iris Xe" }
    ],
    ramOptions: [
      { sizeGB: 16, priceDeltaUSD: 0, available: true }
    ],
    storageOptions: [
      { sizeGB: 512, priceDeltaUSD: 0, available: true }
    ],
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
    description: "Sturdy 13-inch business laptop.",
    basePriceUSD: 285,
    thumbnail: "/assets/hp-830-g5.png",
    cpu: "Intel Core i5-8350U",
    gpu: "Intel HD 620",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Core i5-8350U" },
      { k: "GPU", v: "Intel HD 620" }
    ],
    ramOptions: [
      { sizeGB: 16, priceDeltaUSD: 0, available: true }
    ],
    storageOptions: [
      { sizeGB: 256, priceDeltaUSD: 0, available: true }
    ],
    customButtons: [
      { label: "WhatsApp 1", kind: "whatsapp", href: "https://wa.me/96170269583" },
      { label: "WhatsApp 2", kind: "call", href: "https://wa.me/9613824875" }
    ]
  },

  // ——— Trois modèles supplémentaires optionnels (si tu les veux dans ton seed) ———
  {
    id: "lenovo-thinkpad-x1-carbon-g6",
    slug: "lenovo-thinkpad-x1-carbon-g6",
    brand: "Lenovo",
    title: "Lenovo ThinkPad X1 Carbon Gen 6",
    description: "Ultra-light business flagship. Solid keyboard, premium build.",
    basePriceUSD: 320,
    thumbnail: "/assets/lenovo-x1-carbon-g6.png",
    cpu: "Intel Core i5-8250U",
    gpu: "Intel UHD 620",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Core i5-8250U" },
      { k: "GPU", v: "Intel UHD 620" }
    ],
    ramOptions: [
      { sizeGB: 8, priceDeltaUSD: 0, available: true }
    ],
    storageOptions: [
      { sizeGB: 256, priceDeltaUSD: 0, available: true }
    ],
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
    description: "Reliable 14\" ProBook. Dual-drive config (NVMe + HDD).",
    basePriceUSD: 220,
    thumbnail: "/assets/hp-probook-440-g5.png",
    cpu: "Intel Core i5-7200U",
    gpu: "Intel HD 620",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Core i5-7200U" },
      { k: "GPU", v: "Intel HD 620" }
    ],
    ramOptions: [
      { sizeGB: 8, priceDeltaUSD: 0, available: true }
    ],
    storageOptions: [
      { sizeGB: 128, priceDeltaUSD: 0, available: true }
    ],
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
    description: "Slim T-series with touchscreen and Ryzen 7 Pro performance.",
    basePriceUSD: 450,
    thumbnail: "/assets/lenovo-t14s-gen1.png",
    cpu: "AMD Ryzen 7 Pro 4750U",
    gpu: "AMD Radeon Graphics",
    storageType: "NVMe",
    specs: [
      { k: "CPU", v: "Ryzen 7 Pro 4750U" },
      { k: "GPU", v: "AMD Radeon Graphics" },
      { k: "Display", v: "Touchscreen" }
    ],
    ramOptions: [
      { sizeGB: 32, priceDeltaUSD: 0, available: true }
    ],
    storageOptions: [
      { sizeGB: 512, priceDeltaUSD: 0, available: true }
    ],
    customButtons: [
      { label: "WhatsApp — T14s Touch", kind: "whatsapp", href: "https://wa.me/96170269583?text=Interested%20in%20ThinkPad%20T14s%20Gen1%20Touch" },
      { label: "Call 03-824875", kind: "call", href: "tel:+9613824875" }
    ]
  }
]
