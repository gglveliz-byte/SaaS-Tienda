import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar categorías
export async function GET() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const categorias = await prisma.categoriaProducto.findMany({
      where: { tiendaId: session.tiendaId },
      orderBy: { orden: 'asc' },
      include: {
        _count: { select: { productos: true } },
      },
    })

    return NextResponse.json({ categorias })
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Crear categoría
export async function POST(request: Request) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { nombre } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    }

    // Obtener el orden más alto
    const ultimaCategoria = await prisma.categoriaProducto.findFirst({
      where: { tiendaId: session.tiendaId },
      orderBy: { orden: 'desc' },
    })

    const categoria = await prisma.categoriaProducto.create({
      data: {
        nombre,
        orden: (ultimaCategoria?.orden || 0) + 1,
        tiendaId: session.tiendaId,
      },
    })

    return NextResponse.json({ success: true, categoria })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
