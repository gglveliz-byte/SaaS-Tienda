import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar pedidos
export async function GET() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const pedidos = await prisma.pedido.findMany({
      where: { tiendaId: session.tiendaId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
