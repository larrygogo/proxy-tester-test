import { JetBrains_Mono as Font_Mono, Inter } from "next/font/google"

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const fontMono = Font_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})
