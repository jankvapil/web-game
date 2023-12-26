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
    setGame(game)
  }

  useEffect(() => {
    !loading && loadPhaser()
    loading = true
  }, [])

  return <div id={containerId} />
}
