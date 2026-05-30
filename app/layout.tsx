import type { Metadata } from 'next'

import './globals.css'
import Navbar from '@/components/Navbar'



import { Toaster } from 'react-hot-toast'

import SmoothScroll from '@/components/SmoothScroll'
import ReactQueryProvider from '@/lib/react-query'

export const metadata: Metadata = {
  title: 'GPE - Gestão de Projetos Escolares',
  description: 'Gestão de trabalhos em grupo e avaliações',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 min-h-screen font-sans">
        <ReactQueryProvider>
          <Toaster position="top-right" />
          <Navbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
