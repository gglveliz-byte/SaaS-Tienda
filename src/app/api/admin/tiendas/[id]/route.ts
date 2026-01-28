import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { CategoriaGeneral } from '@prisma/client'

// GET - Obtener tienda
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const tienda = await prisma.tienda.findUnique({
      where: { id },
      include: {
        plan: true,
        vendedor: true,
        _count: {
          select: { productos: true, pedidos: true },
        },
      },
    })

    if (!tienda) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ tienda })
  } catch (error) {
    console.error('Error al obtener tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT - Actualizar tienda
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
      descripcion,
      categoriaGeneral,
      whatsapp,
      direccion,
      latitud,
      longitud,
      planId,
      activa,
    } = body

    const tienda = await prisma.tienda.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        categoriaGeneral: categoriaGeneral as CategoriaGeneral,
        whatsapp,
        direccion,
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null,
        planId,
        activa,
      },
    })

    return NextResponse.json({ success: true, tienda })
  } catch (error) {
    console.error('Error al actualizar tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar tienda
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
    await prisma.tienda.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
