import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT - Actualizar plan
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const {
      nombre,
      precioMensual,
      permiteVideos,
      maxProductos,
      maxImagenesPorProducto,
      activo,
    } = body

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        nombre,
        precioMensual,
        permiteVideos,
        maxProductos,
        maxImagenesPorProducto,
        activo: activo ?? true,
      },
    })

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Error al actualizar plan:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Verificar si hay tiendas usando el plan
    const tiendasConPlan = await prisma.tienda.count({ where: { planId: id } })
    if (tiendasConPlan > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar, hay ${tiendasConPlan} tienda(s) usando este plan` },
        { status: 400 }
      )
    }

    await prisma.plan.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar plan:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
