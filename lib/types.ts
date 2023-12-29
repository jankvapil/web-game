/** socket.io init response payload type */
export type SocketInitResponse = {
  yourScore: number
  topScore: number
}

/** socket.io scoreUp payload type */
export type ScoreUpPayload = {
  id: number
  score: number
}

/** common event for game & socket.io */
export enum Event {
  Init = 'init',
  ScoreUp = 'scoreUp',
  Restart = 'restart',
  Endgame = 'endgame',
}

/** socket.io event */
export enum SocketIOEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
  Error = 'error',
}
