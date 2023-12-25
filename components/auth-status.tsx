import { getServerSession } from 'next-auth/next'
import SignOut from './SignOut'

export default async function AuthStatus() {
  const session = await getServerSession()
  return (
    <div className="absolute top-5 w-full flex justify-center items-center border-b border-white">
      {session && (
        <p className="text-stone-200 text-sm">
          Signed in as {session.user?.email}
          <SignOut />
        </p>
      )}
    </div>
  )
}
