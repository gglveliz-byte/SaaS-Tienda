import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Obtener mi tienda (para configuración)
export async function GET() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const tienda = await prisma.tienda.findUnique({
      where: { id: session.tiendaId },
      include: {
        plan: { select: { nombre: true, maxProductos: true } },
        archivos: {
          where: { OR: [{ esLogo: true }, { esBanner: true }] },
          select: { id: true, esLogo: true, esBanner: true },
        },
      },
    })

    if (!tienda) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    const logo = tienda.archivos.find((a) => a.esLogo)
    const banner = tienda.archivos.find((a) => a.esBanner)

    return NextResponse.json({
      tienda: {
        id: tienda.id,
        nombre: tienda.nombre,
        slug: tienda.slug,
        descripcion: tienda.descripcion,
        categoriaGeneral: tienda.categoriaGeneral,
        whatsapp: tienda.whatsapp,
        direccion: tienda.direccion,
        latitud: tienda.latitud ? Number(tienda.latitud) : null,
        longitud: tienda.longitud ? Number(tienda.longitud) : null,
        plan: tienda.plan,
        logoId: logo?.id,
        bannerId: banner?.id,
      },
    })
  } catch (error) {
    console.error('Error al obtener tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT - Actualizar mi tienda (vendedor solo edita lo permitido: nombre, descripcion, whatsapp, direccion, lat, lng)
export async function PUT(request: Request) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nombre, descripcion, whatsapp, direccion, latitud, longitud } = body

    await prisma.tienda.update({
      where: { id: session.tiendaId },
      data: {
        ...(nombre != null && { nombre }),
        ...(descripcion != null && { descripcion }),
        ...(whatsapp != null && { whatsapp }),
        ...(direccion != null && { direccion }),
        ...(latitud != null && { latitud }),
        ...(longitud != null && { longitud }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al actualizar tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
