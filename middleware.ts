import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const publicRoutes = ['/register', '/login']
  const privateRoutes = ['/']

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!session && privateRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url))
  } else if (session && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // returns 404 if page does not exist
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
