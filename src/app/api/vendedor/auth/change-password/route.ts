import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { verifyPassword, hashPassword } from '@/lib/auth'

// POST - Cambiar contraseña (vendedor logueado)
export async function POST(request: Request) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva (mínimo 6 caracteres) son requeridas' },
        { status: 400 }
      )
    }

    const vendedor = await prisma.vendedor.findUnique({
      where: { id: session.id },
    })

    if (!vendedor) {
      return NextResponse.json({ error: 'Vendedor no encontrado' }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, vendedor.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(newPassword)

    await prisma.vendedor.update({
      where: { id: session.id },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente.',
    })
  } catch (error) {
    console.error('Error change-password vendedor:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
