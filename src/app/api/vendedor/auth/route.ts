import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken, setSessionCookie, clearSessionCookie } from '@/lib/auth'

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

    const vendedor = await prisma.vendedor.findUnique({
      where: { email },
      include: { tienda: true },
    })

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, vendedor.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const token = await createToken({
      id: vendedor.id,
      email: vendedor.email,
      tipo: 'vendedor',
      tiendaId: vendedor.tiendaId,
    })

    await setSessionCookie(token, 'vendedor')

    return NextResponse.json({
      success: true,
      vendedor: {
        id: vendedor.id,
        email: vendedor.email,
        nombre: vendedor.nombre,
        tienda: {
          id: vendedor.tienda.id,
          nombre: vendedor.tienda.nombre,
          slug: vendedor.tienda.slug,
        },
      },
    })
  } catch (error) {
    console.error('Error en login vendedor:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Logout
export async function DELETE() {
  await clearSessionCookie('vendedor')
  return NextResponse.json({ success: true })
}
