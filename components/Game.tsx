'use client'

import { config } from 'game/game'
import { useEffect, useState } from 'react'
import { Game as GameType } from 'phaser'
import { useSocket } from './providers/SocketProvider'
import { useSession } from 'next-auth/react'

/**
 * Client-side game component
 */
export const Game = () => {
  const containerId = 'game-content'
  const session = useSession()
  const { socket, isConnected } = useSocket()
  const [game, setGame] = useState<GameType | null>(null)

  const loadPhaser = async () => {
    const Phaser = await import('phaser')
    const game = new Phaser.Game({
      ...config,
      parent: containerId,
    })

    game.events.on('endgame', () => {
      console.log('[Event] end game')
      game.events.emit('restart')
    })

    setGame(game)
  }

  useEffect(() => {
    console.log(session)
  }, [session])

  let loading = false
  useEffect(() => {
    !loading && loadPhaser()
    loading = true
  }, [])

  useEffect(() => {
    if (isConnected) {
      console.log('[SocketIO] User is connected to the socket:')
      console.log(socket)

      socket.emit('init', 'Hello from client!')

      socket.on('init', (data: any) => {
        console.log('[SocketIO] Message arrived!')
        console.log(data)
      })
    }
  }, [socket, isConnected])

  return <div id={containerId} />
}
