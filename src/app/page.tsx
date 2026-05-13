import Link from 'next/link'

export default function HomePage() {
  const features = [
    { icon: 'inventory_2', title: 'Catálogo visual', desc: 'Sube fotos de tus productos. Organiza por categorías y destaca tus mejores ofertas con imágenes de alta calidad.' },
    { icon: 'chat', title: 'Pedidos por WhatsApp', desc: 'Tus clientes hacen pedidos directamente por WhatsApp con todos los detalles del carrito listos.' },
    { icon: 'dashboard', title: 'Panel de gestión', desc: 'Administra productos, stock y pedidos desde un panel moderno, simple y fácil de usar.' },
    { icon: 'storefront', title: 'Tu tienda pública', desc: 'Cada vendedor tiene su propia URL pública con su catálogo, diseño premium y carrito de compras.' },
    { icon: 'category', title: 'Categorías y secciones', desc: 'Organiza tus productos en categorías: ropa, electrónica, celulares, accesorios y más.' },
    { icon: 'local_shipping', title: 'Gestión de inventario', desc: 'Controla el stock de cada producto con alertas cuando el nivel sea bajo.' },
  ]

  const planes = [
    { nombre: 'Básico', precio: 'Gratis', features: ['1 tienda', 'Hasta 20 productos', 'Pedidos por WhatsApp', 'Soporte básico'], destacado: false },
    { nombre: 'Pro', precio: '$9.99/mes', features: ['1 tienda', 'Productos ilimitados', 'Categorías ilimitadas', 'Soporte prioritario', 'Estadísticas'], destacado: true },
    { nombre: 'Business', precio: '$24.99/mes', features: ['Múltiples tiendas', 'Todo lo del Pro', 'API de integración', 'Dominio personalizado', 'Soporte 24/7'], destacado: false },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col font-rubik">

      {/* Header */}
      <header className="bg-surface border-b border-border-light sticky top-0 z-50 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-accent-vibrant flex items-center justify-center">
              <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            </div>
            <span className="text-xl font-bold text-on-surface">Tienda Digital</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/vendedor/login" className="text-sm text-secondary hover:text-on-surface font-medium transition-colors px-3 py-2">
              Vendedor
            </Link>
            <Link href="/admin/login" className="text-sm bg-surface-deep text-white font-bold px-4 py-2 rounded-lg hover:bg-accent-vibrant hover:text-surface-deep transition-all">
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-surface-deep via-[#1a1a2e] to-surface-deep py-20 md:py-32 px-4 md:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-accent-vibrant/10 text-accent-vibrant text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-accent-vibrant/20 mb-6">
            Plataforma de E-Commerce
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tu tienda en línea<br />
            <span className="text-accent-vibrant">en minutos</span>
          </h1>
          <p className="text-base md:text-xl text-secondary-fixed-dim max-w-2xl mx-auto mb-10 leading-relaxed">
            Crea tu catálogo, recibe pedidos por WhatsApp y gestiona tu inventario
            desde cualquier lugar. Sin complicaciones, sin costos ocultos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/593987865420?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 min-h-[50px] px-8 py-3.5 bg-[#25D366] text-white text-base font-bold rounded-xl hover:bg-[#20b858] transition-all shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Crear mi tienda gratis
            </a>
            <Link
              href="/vendedor/login"
              className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 py-3.5 bg-white/10 text-white text-base font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios bar */}
      <section className="border-y border-border-light bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border-light">
          {[
            { icon: 'bolt', t: 'Configuración rápida', s: 'Lista en minutos' },
            { icon: 'chat', t: 'WhatsApp integrado', s: 'Pedidos directos' },
            { icon: 'devices', t: 'Responsive', s: 'Funciona en móvil' },
            { icon: 'support_agent', t: 'Soporte', s: 'Te ayudamos' },
          ].map((b) => (
            <div key={b.icon} className="flex items-center gap-3 px-4 py-5">
              <span className="material-symbols-outlined text-accent-vibrant" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
              <div>
                <p className="text-sm font-bold text-on-surface">{b.t}</p>
                <p className="text-xs text-secondary">{b.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Todo lo que necesitas para vender</h2>
          <p className="text-secondary max-w-2xl mx-auto">Una plataforma completa para gestionar tu negocio en línea de forma profesional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={icon} className="bg-surface rounded-xl border border-border-light p-6 hover:shadow-md hover:border-outline-variant transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent-vibrant/10 flex items-center justify-center mb-4 group-hover:bg-accent-vibrant/20 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section className="bg-surface-container-low py-20 px-4 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Planes y precios</h2>
            <p className="text-secondary">Elige el plan que mejor se adapta a tu negocio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planes.map(({ nombre, precio, features: fs, destacado }) => (
              <div
                key={nombre}
                className={`rounded-2xl border p-8 flex flex-col gap-6 ${
                  destacado
                    ? 'bg-surface-deep border-surface-muted shadow-xl scale-[1.03]'
                    : 'bg-surface border-border-light'
                }`}
              >
                {destacado && (
                  <span className="self-start bg-accent-vibrant text-surface-deep text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Más popular
                  </span>
                )}
                <div>
                  <h3 className={`text-xl font-bold ${destacado ? 'text-white' : 'text-on-surface'}`}>{nombre}</h3>
                  <p className={`text-3xl font-bold mt-2 ${destacado ? 'text-accent-vibrant' : 'text-on-surface'}`}>{precio}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {fs.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-green-500" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className={destacado ? 'text-secondary-fixed-dim' : 'text-secondary'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/593987865420?text=Hola,%20quiero%20contratar%20el%20plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${
                    destacado
                      ? 'bg-accent-vibrant text-surface-deep hover:bg-accent-hover'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  Comenzar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-20 text-center">
        <div className="bg-gradient-to-r from-surface-deep to-[#1a1a2e] rounded-2xl px-8 py-14 border border-surface-muted">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-secondary-fixed-dim mb-8 max-w-xl mx-auto">Contáctanos por WhatsApp y te ayudamos a crear tu tienda en menos de 24 horas.</p>
          <a
            href="https://wa.me/593987865420?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent-vibrant text-surface-deep font-bold px-8 py-4 rounded-xl hover:bg-accent-hover transition-colors text-base shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Crear mi tienda ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-deep border-t border-surface-muted py-8 px-4 safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-vibrant flex items-center justify-center">
              <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            </div>
            <span className="text-white font-bold text-sm">Tienda Digital</span>
          </div>
          <p className="text-secondary-fixed-dim text-xs text-center">
            © {new Date().getFullYear()} Tienda Digital. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/vendedor/login" className="text-xs text-secondary-fixed-dim hover:text-accent-vibrant transition-colors">Vendedor</Link>
            <Link href="/admin/login" className="text-xs text-secondary-fixed-dim hover:text-accent-vibrant transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
