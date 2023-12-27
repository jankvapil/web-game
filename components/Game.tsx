'use client'

import { config } from 'game/game'
import { useEffect, useState } from 'react'
import { Game as GameType } from 'phaser'

/**
 * Client-side game component
 */
export const Game = () => {
  const containerId = 'game-content'
  const [game, setGame] = useState<GameType | null>(null)

  let loading = false
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
    !loading && loadPhaser()
    loading = true
  }, [])

  return <div id={containerId} />
}
