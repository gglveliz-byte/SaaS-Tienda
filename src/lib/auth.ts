import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_change_me'
)

export interface JWTPayload {
  id: string
  email: string
  tipo: 'admin' | 'vendedor'
  tiendaId?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(tipo: 'admin' | 'vendedor'): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const tokenName = tipo === 'admin' ? 'admin_token' : 'vendedor_token'
  const token = cookieStore.get(tokenName)?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload || payload.tipo !== tipo) return null

  return payload
}

export async function setSessionCookie(token: string, tipo: 'admin' | 'vendedor') {
  const cookieStore = await cookies()
  const tokenName = tipo === 'admin' ? 'admin_token' : 'vendedor_token'

  cookieStore.set(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })
}

export async function clearSessionCookie(tipo: 'admin' | 'vendedor') {
  const cookieStore = await cookies()
  const tokenName = tipo === 'admin' ? 'admin_token' : 'vendedor_token'
  cookieStore.delete(tokenName)
}
