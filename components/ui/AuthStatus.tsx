import { getServerSession } from 'next-auth/next'
import SignOut from './SignOut'
import { ConnectStatus } from './ConnectStatus'

export default async function AuthStatus() {
  const session = await getServerSession()
  return (
    <div className="absolute py-2 w-full flex justify-center items-center border-b border-white">
      {session && (
        <div className="text-stone-200 text-sm flex gap-2 items-center">
          <ConnectStatus />
          <span className="border-r pr-2">{session.user?.email}</span>
          <SignOut />
        </div>
      )}
    </div>
  )
}
