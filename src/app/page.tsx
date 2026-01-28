import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-bold text-white">Tienda SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/vendedor/login"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Vendedor
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Tu tienda en línea
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            en minutos
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Crea tu catálogo, recibe pedidos por WhatsApp y gestiona tu negocio
          desde cualquier lugar. Sin complicaciones.
        </p>
        <a
          href="https://wa.me/521234567890?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contáctanos por WhatsApp
        </a>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Todo lo que necesitas para vender
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🛍️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Catálogo visual
            </h3>
            <p className="text-gray-400">
              Sube fotos y videos de tus productos. Organiza por categorías y
              destaca tus mejores ofertas.
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Pedidos por WhatsApp
            </h3>
            <p className="text-gray-400">
              Tus clientes hacen pedidos que llegan directo a tu WhatsApp con
              todos los detalles listos.
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Panel de gestión
            </h3>
            <p className="text-gray-400">
              Administra productos, stock y pedidos desde un panel simple y fácil
              de usar.
            </p>
          </div>
        </div>
      </section>

      {/* Temas */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Diseños para cada tipo de negocio
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Tu tienda se adapta automáticamente al estilo de tu negocio
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 flex items-end">
            <span className="text-white font-semibold">Tecnología</span>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-yellow-600 to-amber-400 p-6 flex items-end">
            <span className="text-white font-semibold">Moda</span>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-600 to-red-500 p-6 flex items-end">
            <span className="text-white font-semibold">Comida</span>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 p-6 flex items-end">
            <span className="text-white font-semibold">General</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="p-12 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl border border-indigo-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-gray-400 mb-8">
            Contáctanos y te ayudamos a crear tu tienda
          </p>
          <a
            href="https://wa.me/521234567890?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Comenzar ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Tienda SaaS. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
