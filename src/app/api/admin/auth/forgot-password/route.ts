import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

// POST - Solicitar recuperación de contraseña
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña.' },
        { status: 200 }
      )
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: {
        email: admin.email,
        token,
        tipo: 'admin',
        expiresAt,
      },
    })

    const result = await sendPasswordResetEmail(admin.email, 'admin', token)

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'No se pudo enviar el correo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.',
    })
  } catch (error) {
    console.error('Error forgot-password admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
