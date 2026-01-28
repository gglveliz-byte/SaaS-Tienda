'use client'

interface TiendaFooterProps {
  tienda: {
    nombre: string
    whatsapp: string
    direccion?: string | null
    latitud?: number
    longitud?: number
  }
}

export function TiendaFooter({ tienda }: TiendaFooterProps) {
  const whatsappLink = `https://wa.me/${tienda.whatsapp.replace(/\D/g, '')}`

  const embedUrl =
    tienda.latitud != null && tienda.longitud != null
      ? `https://maps.google.com/maps?q=${tienda.latitud},${tienda.longitud}&z=16&output=embed`
      : null

  return (
    <footer className="bg-[var(--secondary)] border-t border-[var(--muted)]/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">{tienda.nombre}</h3>
            <p className="text-[var(--muted)] text-sm">
              Gracias por visitarnos. Contáctanos por WhatsApp para cualquier consulta.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Contacto</h3>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tienda.whatsapp}
            </a>
          </div>
          {(tienda.direccion || embedUrl) && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Ubicación</h3>
              {tienda.direccion && <p className="text-[var(--muted)] text-sm mb-2">{tienda.direccion}</p>}
              {tienda.latitud != null && tienda.longitud != null && (
                <a
                  href={`https://www.google.com/maps?q=${tienda.latitud},${tienda.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ver en Google Maps
                </a>
              )}
            </div>
          )}
        </div>

        {embedUrl && (
          <div className="mt-8 rounded-xl overflow-hidden h-56 sm:h-64 border border-[var(--muted)]/20">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            />
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-[var(--muted)]/20 text-center text-[var(--muted)] text-sm">
          <p>© {new Date().getFullYear()} {tienda.nombre}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
