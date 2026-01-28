import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT - Actualizar categoría
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
    const { nombre, activa, orden } = await request.json()

    const categoria = await prisma.categoriaProducto.updateMany({
      where: { id, tiendaId: session.tiendaId },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(activa !== undefined && { activa }),
        ...(orden !== undefined && { orden }),
      },
    })

    return NextResponse.json({ success: true, categoria })
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar categoría
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Quitar categoría de los productos que la usan
    await prisma.producto.updateMany({
      where: { categoriaId: id, tiendaId: session.tiendaId },
      data: { categoriaId: null },
    })

    await prisma.categoriaProducto.deleteMany({
      where: { id, tiendaId: session.tiendaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
