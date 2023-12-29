import prisma from '@/lib/prisma'

import { SocketInitResponse, Event } from '@/lib/types'
import { Socket } from 'socket.io'

/**
 * Handles client initialization, returns his best score and top score of all players
 */
export const initHandler = async (socket: Socket, userId: number) => {
  console.log('[SocketIO] Initialized user with ID', userId)
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  const userWitTopScore = await prisma.user.findFirst({
    orderBy: {
      score: 'desc',
    },
  })

  if (user && userWitTopScore) {
    const response: SocketInitResponse = {
      yourScore: user.score,
      topScore: userWitTopScore?.score,
    }
    socket.emit(Event.Init, response)
  }
}
