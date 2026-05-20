import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { DM_Sans, DM_Mono } from "next/font/google"

import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "Batched - Drink Recipe Scaling",
  description: "Scale your drink recipes for batch preparation. Built for commercial kitchens.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.className} bg-background text-foreground antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
