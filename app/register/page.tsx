import Image from 'next/image'
import Form from '@/components/ui/form/Form'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-black">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <Link href="/">
            <Image
              src="/snake.jpg"
              priority
              alt="Logo"
              className="h-20 w-20 rounded-full"
              width={150}
              height={150}
            />
          </Link>
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <Form type="register" />
      </div>
    </div>
  )
}
