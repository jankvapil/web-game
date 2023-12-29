import prisma from '@/lib/prisma'

import { ScoreUpPayload, SocketInitResponse, Event } from '@/lib/types'
import { Socket } from 'socket.io'

/**
 * Handles score update
 */
export const scoreUpHandler = async (
  socket: Socket,
  payload: ScoreUpPayload
) => {
  console.log('[SocketIO] Update score', payload)
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  })

  if (user && user.score < payload.score) {
    console.log('[SocketIO] Updating score...')
    try {
      const updatedUser = await prisma.user.update({
        where: { id: payload.id },
        data: { score: payload.score },
      })
      const userWitTopScore = await prisma.user.findFirst({
        orderBy: {
          score: 'desc',
        },
      })
      if (updatedUser && userWitTopScore) {
        console.log('[SocketIO] Refresh top player...')
        const response: SocketInitResponse = {
          yourScore: updatedUser.score,
          topScore: userWitTopScore?.score,
        }
        socket.emit(Event.Init, response)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
