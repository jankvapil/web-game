// These styles apply to every route in the application
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import AuthStatus from '@/components/ui/AuthStatus'
import { Suspense } from 'react'
import { ContentWrapper } from '@/components/ui/ContentWrapper'
import { SocketProvider } from '@/components/providers/SocketProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'

const title = 'Next.js Prisma Postgres Auth Starter'
const description =
  'This is a Next.js starter kit that uses Next-Auth for simple email + password login and a Postgres database to persist the data.'

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
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
