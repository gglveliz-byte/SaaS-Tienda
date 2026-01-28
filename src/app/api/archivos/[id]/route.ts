import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const archivo = await prisma.archivo.findUnique({
      where: { id },
      select: {
        data: true,
        mimeType: true,
        nombreOriginal: true,
      },
    })

    if (!archivo) {
      return new NextResponse('Archivo no encontrado', { status: 404 })
    }

    return new NextResponse(new Uint8Array(archivo.data), {
      headers: {
        'Content-Type': archivo.mimeType,
        'Cache-Control': 'public, max-age=86400', // 1 día de caché
        'Content-Disposition': `inline; filename="${archivo.nombreOriginal}"`,
      },
    })
  } catch (error) {
    console.error('Error al obtener archivo:', error)
    return new NextResponse('Error interno', { status: 500 })
  }
}
