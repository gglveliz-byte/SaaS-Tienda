import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar planes
export async function GET() {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const planes = await prisma.plan.findMany({
      orderBy: { precioMensual: 'asc' },
    })

    return NextResponse.json({ planes })
  } catch (error) {
    console.error('Error al obtener planes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Crear plan
export async function POST(request: Request) {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      nombre,
      precioMensual,
      permiteVideos,
      maxProductos,
      maxImagenesPorProducto,
    } = body

    if (!nombre || precioMensual === undefined) {
      return NextResponse.json(
        { error: 'Nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.create({
      data: {
        nombre,
        precioMensual,
        permiteVideos: permiteVideos || false,
        maxProductos: maxProductos || 50,
        maxImagenesPorProducto: maxImagenesPorProducto || 5,
      },
    })

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Error al crear plan:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
