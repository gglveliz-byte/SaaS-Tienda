import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TiendaHeader } from '@/components/tienda/TiendaHeader'
import { TiendaFooter } from '@/components/tienda/TiendaFooter'
import { TEMAS_CATEGORIA } from '@/types'

async function getTienda(slug: string) {
  return prisma.tienda.findUnique({
    where: { slug, activa: true },
    include: {
      plan: true,
      archivos: {
        where: { OR: [{ esLogo: true }, { esBanner: true }] },
      },
    },
  })
}

export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tienda = await getTienda(slug)

  if (!tienda) {
    notFound()
  }

  const tema = TEMAS_CATEGORIA[tienda.categoriaGeneral]
  const logo = tienda.archivos.find((a) => a.esLogo)
  const banner = tienda.archivos.find((a) => a.esBanner)

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: tema.background,
        color: tema.text,
        ['--primary' as string]: tema.primary,
        ['--secondary' as string]: tema.secondary,
        ['--accent' as string]: tema.accent,
        ['--muted' as string]: tema.muted,
      }}
    >
      <TiendaHeader
        tienda={{
          nombre: tienda.nombre,
          slug: tienda.slug,
          categoriaGeneral: tienda.categoriaGeneral,
          logoId: logo?.id,
        }}
      />

      {/* Banner */}
      {banner && (
        <div
          className="h-40 sm:h-48 md:h-64 bg-cover bg-center rounded-b-2xl overflow-hidden"
          style={{
            backgroundImage: `url(/api/archivos/${banner.id})`,
          }}
        >
          <div className="h-full w-full bg-black/30 flex items-center justify-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
              {tienda.nombre}
            </h1>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

      <TiendaFooter
        tienda={{
          nombre: tienda.nombre,
          whatsapp: tienda.whatsapp,
          direccion: tienda.direccion,
          latitud: tienda.latitud ? Number(tienda.latitud) : undefined,
          longitud: tienda.longitud ? Number(tienda.longitud) : undefined,
        }}
      />
    </div>
  )
}
