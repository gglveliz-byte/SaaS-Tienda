import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { EstadoPedido } from '@prisma/client'

// GET - Obtener pedido
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id, tiendaId: session.tiendaId },
      include: {
        items: {
          include: {
            producto: { select: { id: true, nombre: true } },
          },
        },
      },
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ pedido })
  } catch (error) {
    console.error('Error al obtener pedido:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT - Actualizar estado del pedido
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const { estado } = await request.json()

    // Validar estado
    const estadosValidos: EstadoPedido[] = ['pendiente', 'en_proceso', 'completado', 'cancelado']
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const pedido = await prisma.pedido.updateMany({
      where: { id, tiendaId: session.tiendaId },
      data: { estado },
    })

    return NextResponse.json({ success: true, pedido })
  } catch (error) {
    console.error('Error al actualizar pedido:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
