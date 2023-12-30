'use client'

import { config } from '@/lib/game/game'
import { useEffect, useState } from 'react'
import { Game as GameType } from 'phaser'
import { useSocket } from '../providers/SocketProvider'
import { useSession } from 'next-auth/react'
import { Event, ScoreUpPayload, SocketInitResponse } from '@/lib/types'

/**
 * Client-side game component
 */
export const Game = () => {
  const containerId = 'game-content'
  const session = useSession()
  const { socket, isConnected } = useSocket()
  const [_, setGame] = useState<GameType | null>(null)
  const [playerTopScore, setPlayerTopScore] = useState(0)
  const [allPlayersTopScore, setAllPlayersTopScore] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)

  const loadPhaser = async () => {
    const Phaser = await import('phaser')
    const game = new Phaser.Game({
      ...config,
      parent: containerId,
    })

    game.events.on(Event.ScoreUp, (score: number) => {
      console.log('[GameEvent] scoreUp:', score)
      setCurrentScore(score)
    })

    game.events.on(Event.Endgame, () => {
      console.log('[GameEvent] end game')
      setCurrentScore(0)
      game.events.emit(Event.Restart)
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
      socket.emit(Event.ScoreUp, payload)
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
      socket.emit(Event.Init, userId)
      socket.on(Event.Init, (data: SocketInitResponse) => {
        console.log('[SocketIO] Init response', data)
        setPlayerTopScore(data.yourScore)
        setAllPlayersTopScore(data.topScore)
      })
    }
  }, [isConnected])

  return (
    <>
      <ul className="pb-4">
        <li>All players top score: {allPlayersTopScore}</li>
        <li>Your top score: {playerTopScore}</li>
        <li>Your current score: {currentScore}</li>
      </ul>
      <div id={containerId} />
    </>
  )
}
