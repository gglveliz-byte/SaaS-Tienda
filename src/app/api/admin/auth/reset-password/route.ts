import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// POST - Restablecer contraseña con token
export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Token y contraseña nueva (mínimo 6 caracteres) son requeridos' },
        { status: 400 }
      )
    }

    const resetRow = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetRow || resetRow.tipo !== 'admin') {
      return NextResponse.json(
        { error: 'Enlace inválido o expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    if (resetRow.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Enlace inválido o expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(newPassword)

    await prisma.$transaction([
      prisma.admin.update({
        where: { email: resetRow.email },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetRow.id },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    })
  } catch (error) {
    console.error('Error reset-password admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
