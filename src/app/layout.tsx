import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tea Wizard by Moon Artistry',
  description: 'Ritual teas handcrafted with intention. Herbal blends designed for the sacred in the everyday.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
