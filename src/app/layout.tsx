"use client"
import '@/styles/globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
    <body className="overflow-hidden">
      {children}
    </body>
    </html>
  )
}