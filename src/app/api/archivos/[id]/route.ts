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
        tamano: true,
      },
    })

    if (!archivo) {
      return new NextResponse('Archivo no encontrado', { status: 404 })
    }

    const data = new Uint8Array(archivo.data)
    const size = archivo.tamano || data.length
    const isVideo = archivo.mimeType.startsWith('video/')

    // Soporte para Range requests (necesario para videos)
    const rangeHeader = request.headers.get('range')

    if (isVideo && rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1
      const chunkSize = end - start + 1

      return new NextResponse(data.slice(start, end + 1), {
        status: 206,
        headers: {
          'Content-Type': archivo.mimeType,
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    // Respuesta normal para imágenes o videos sin range request
    return new NextResponse(data, {
      headers: {
        'Content-Type': archivo.mimeType,
        'Content-Length': size.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': `inline; filename="${archivo.nombreOriginal}"`,
      },
    })
  } catch (error) {
    console.error('Error al obtener archivo:', error)
    return new NextResponse('Error interno', { status: 500 })
  }
}
