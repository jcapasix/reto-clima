import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clima en Tiempo Real',
  description: 'Consulta el clima actual de cualquier ciudad del mundo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

