import './globals.css'
import Navigation from './components/navigation'

export const metadata = {
  title: 'Citazioni Casuali - Next.js App',
  description: 'App demo per il corso sul web deploy con Next.js',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Navigation />
        {children}
        <footer className="footer">
          <p>Creato per il corso sul web deploy</p>
        </footer>
      </body>
    </html>
  )
}