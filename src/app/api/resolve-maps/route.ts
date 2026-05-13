import { NextResponse } from 'next/server'
import { parseGoogleMapsUrl } from '@/lib/utils'

/**
 * GET /api/resolve-maps?url=...
 * Resuelve URLs cortas de Google Maps (maps.app.goo.gl) para obtener coordenadas
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Se requiere el parámetro url' }, { status: 400 })
  }

  try {
    // Primero intenta parsear directamente (URLs largas)
    const directCoords = parseGoogleMapsUrl(url)
    if (directCoords) {
      return NextResponse.json({ coords: directCoords, resolvedUrl: url })
    }

    // Si es URL corta, resuelve el redirect (server-side)
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    })

    const finalUrl = response.url
    const coords = parseGoogleMapsUrl(finalUrl)

    return NextResponse.json({
      coords,
      resolvedUrl: finalUrl,
    })
  } catch (error) {
    console.error('Error resolviendo URL de Maps:', error)
    return NextResponse.json({ error: 'No se pudo resolver la URL', coords: null }, { status: 200 })
  }
}
