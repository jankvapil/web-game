// These styles apply to every route in the application
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import AuthStatus from '@/components/ui/AuthStatus'
import { Suspense } from 'react'
import { ContentWrapper } from '@/components/ui/ContentWrapper'
import { SocketProvider } from '@/components/providers/SocketProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'

const title = 'Snake game'
const description =
  'This is a snake game with user score sync to database via web-sockets'

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://web-game-production.up.railway.app/'),
  themeColor: '#FFF',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SocketProvider>
            <Toaster />
            <Suspense fallback="Loading...">
              <AuthStatus />
            </Suspense>
            <ContentWrapper>{children}</ContentWrapper>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
