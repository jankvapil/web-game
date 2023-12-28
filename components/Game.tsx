'use client'

import { config } from 'game/game'
import { useEffect, useState } from 'react'
import { Game as GameType } from 'phaser'
import { useSocket } from './providers/SocketProvider'
import { useSession } from 'next-auth/react'
import { ScoreUpPayload, SocketInitResponse } from '@/lib/types'

/**
 * Client-side game component
 */
export const Game = () => {
  const containerId = 'game-content'
  const session = useSession()
  const { socket, isConnected } = useSocket()
  const [game, setGame] = useState<GameType | null>(null)
  const [playerTopScore, setPlayerTopScore] = useState(0)
  const [allPlayersTopScore, setAllPlayersTopScore] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)

  const loadPhaser = async () => {
    const Phaser = await import('phaser')
    const game = new Phaser.Game({
      ...config,
      parent: containerId,
    })

    game.events.on('scoreUp', (score: number) => {
      console.log('[GameEvent] scoreUp:', score)
      setCurrentScore(score)
    })

    game.events.on('endgame', () => {
      console.log('[GameEvent] end game')
      game.events.emit('restart')
    })

    setGame(game)
  }

  useEffect(() => {
    const userId = session.data?.user?.id
    if (isConnected && userId && currentScore > playerTopScore) {
      const payload: ScoreUpPayload = {
        id: userId,
        score: currentScore,
      }
      console.log('[SocketIO] scoreUp payload:', payload)
      socket.emit('scoreUp', payload)
    }
  }, [currentScore])

  let loading = false
  useEffect(() => {
    !loading && loadPhaser()
    loading = true
  }, [])

  useEffect(() => {
    const userId = session.data?.user?.id
    if (isConnected && userId) {
      console.log('[SocketIO] Init user', userId)
      socket.emit('init', userId)
      socket.on('init', (data: SocketInitResponse) => {
        console.log('[SocketIO] Init response', data)
        setPlayerTopScore(data.yourScore)
        setAllPlayersTopScore(data.topScore)
      })
    }
  }, [isConnected])

  return (
    <div>
      <ul>
        <li>All players top score: {allPlayersTopScore}</li>
        <li>Your top score: {playerTopScore}</li>
        <li>Your current score: {currentScore}</li>
      </ul>
      <div id={containerId} />
    </div>
  )
}
