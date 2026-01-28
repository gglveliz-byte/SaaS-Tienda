import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST - Subir logo o banner de la tienda
export async function POST(request: Request) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('archivo') as File | null
    const tipo = formData.get('tipo') as string // 'logo' | 'banner'

    if (!file?.size || !['logo', 'banner'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Envía un archivo y tipo: logo o banner' },
        { status: 400 }
      )
    }

    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      return NextResponse.json(
        { error: 'Solo se permiten imágenes (JPG, PNG, etc.)' },
        { status: 400 }
      )
    }

    const esLogo = tipo === 'logo'
    const esBanner = tipo === 'banner'

    const buffer = Buffer.from(await file.arrayBuffer())

    await prisma.$transaction(async (tx) => {
      // Quitar logo/banner anterior
      await tx.archivo.updateMany({
        where: {
          tiendaId: session.tiendaId!,
          ...(esLogo ? { esLogo: true } : { esBanner: true }),
        },
        data: esLogo ? { esLogo: false } : { esBanner: false },
      })

      // Crear nuevo archivo
      await tx.archivo.create({
        data: {
          tipo: 'imagen',
          nombreOriginal: file.name,
          mimeType: file.type,
          tamano: file.size,
          data: buffer,
          orden: 0,
          tiendaId: session.tiendaId!,
          productoId: null,
          esLogo,
          esBanner,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al subir archivo tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
