
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/ui/error-boundary"

export const metadata: Metadata = {
  title: 'Marketing Scorecard',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
