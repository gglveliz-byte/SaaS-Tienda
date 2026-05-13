'use client'

interface TiendaFooterProps {
  nombre: string
  slug: string
  whatsapp?: string | null
  direccion?: string | null
  latitud?: number | null
  longitud?: number | null
}

export function TiendaFooter({ nombre, slug, whatsapp, direccion, latitud, longitud }: TiendaFooterProps) {
  const hasMap = latitud != null && longitud != null
  const mapSrc = hasMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitud - 0.008},${latitud - 0.006},${longitud + 0.008},${latitud + 0.006}&layer=mapnik&marker=${latitud},${longitud}`
    : null

  const mapExternalUrl = hasMap
    ? `https://www.google.com/maps?q=${latitud},${longitud}`
    : null

  const metodosPago = [
    { icon: 'whatsapp', label: 'WhatsApp', color: '#25D366', desc: 'Pedido directo' },
    { icon: 'account_balance', label: 'Transferencia', color: '#1C6EF2', desc: 'Pago seguro' },
    { icon: 'payments', label: 'Efectivo', color: '#059669', desc: 'Contra entrega' },
    { icon: 'credit_card', label: 'Tarjeta', color: '#7C3AED', desc: 'Próximamente' },
  ]

  return (
    <footer className="mt-16">
      {/* Métodos de pago */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              Compra 100% segura
            </div>
            <div className="h-px flex-1 bg-gray-200"></div>
            <p className="text-xs text-gray-400 hidden sm:block">Métodos de pago disponibles</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metodosPago.map(({ icon, label, color, desc }) => (
              <div
                key={label}
                className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {icon === 'whatsapp' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1", color }}>
                      {icon}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa + Info */}
      {(hasMap || direccion) && (
        <div className="bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* Mapa */}
              {mapSrc && (
                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                  <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                      <span className="material-symbols-outlined text-[#FFC107]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      Nuestra ubicación
                    </div>
                    {mapExternalUrl && (
                      <a
                        href={mapExternalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#FFC107] hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        Abrir en Maps
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
                      </a>
                    )}
                  </div>
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="240"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Ubicación de ${nombre}`}
                  />
                </div>
              )}

              {/* Datos de contacto */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-gray-900" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                  </div>
                  <span className="text-xl font-bold text-white">{nombre}</span>
                </div>

                {direccion && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#FFC107] mt-0.5" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Dirección</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{direccion}</p>
                    </div>
                  </div>
                )}

                {whatsapp && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">WhatsApp</p>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-300 hover:text-[#25D366] transition-colors"
                      >
                        {whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#FFC107]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Pedidos</p>
                    <p className="text-sm text-gray-300">Realizamos envíos a todo el país</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer base */}
      <div className="bg-gray-950 border-t border-gray-800 py-5 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} <span className="text-gray-500 font-medium">{nombre}</span>. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Potenciado por
            <span className="text-[#FFC107] font-semibold ml-1">Tienda Digital</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
