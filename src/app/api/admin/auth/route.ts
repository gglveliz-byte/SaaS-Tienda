import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken, setSessionCookie, clearSessionCookie, hashPassword } from '@/lib/auth'

// POST - Login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar admin
    let admin = await prisma.admin.findUnique({
      where: { email },
    })

    // Si no existe admin y es el email configurado, crear uno
    if (!admin && email === process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL) {
      const hash = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123')
      admin = await prisma.admin.create({
        data: {
          email: process.env.ADMIN_EMAIL as string,
          passwordHash: hash,
          nombre: 'Administrador',
        },
      })
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValid = await verifyPassword(password, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear token y cookie
    const token = await createToken({
      id: admin.id,
      email: admin.email,
      tipo: 'admin',
    })

    await setSessionCookie(token, 'admin')

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre,
      },
    })
  } catch (error) {
    console.error('Error en login admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Logout
export async function DELETE() {
  await clearSessionCookie('admin')
  return NextResponse.json({ success: true })
}
