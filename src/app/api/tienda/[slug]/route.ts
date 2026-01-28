import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const tienda = await prisma.tienda.findUnique({
      where: { slug, activa: true },
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        categoriaGeneral: true,
        whatsapp: true,
        direccion: true,
        latitud: true,
        longitud: true,
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
