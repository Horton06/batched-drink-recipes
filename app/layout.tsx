import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { DM_Sans, DM_Mono, DM_Sans as V0_Font_DM_Sans, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _dmSans = V0_Font_DM_Sans({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900","1000"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "Batched - Drink Recipe Scaling",
  description: "Scale your drink recipes for batch preparation. Built for commercial kitchens.",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}<Analytics /></body>
    </html>
  )
}
