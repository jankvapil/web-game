'use client'

import { useSocket } from '@/components/providers/SocketProvider'

export const ConnectStatus = () => {
  const { isConnected } = useSocket()

  return (
    <div
      className="border-4 w-4 h-4 rounded-full"
      style={{ borderColor: isConnected ? 'green' : 'red' }}
    />
  )
}
