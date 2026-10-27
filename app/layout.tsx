import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LiveChat Customer Support Suite | Chatwoot Cloud',
  description: 'Open-source live customer engagement and agent inbox deployed on Vercel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
