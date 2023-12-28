'use client'

import { SessionProvider as NextAuthProvider } from 'next-auth/react'

type Props = {
  children?: React.ReactNode
}

export const SessionProvider = ({ children }: Props) => {
  return <NextAuthProvider>{children}</NextAuthProvider>
}
