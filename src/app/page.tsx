import Link from 'next/link'
import { CategoriaPreview } from '@/components/home/CategoriaPreview'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      {/* Header - móvil primero: tap targets 44px min */}
      <header className="border-b border-white/10 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0">🏪</span>
            <span className="text-base sm:text-xl font-bold text-white truncate">Tienda SaaS</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/vendedor/login"
              className="min-h-[44px] min-w-[44px] sm:min-w-0 flex items-center justify-center px-3 py-2.5 text-gray-400 hover:text-white active:bg-white/10 rounded-lg transition-colors touch-manipulation"
            >
              Vendedor
            </Link>
            <Link
              href="/admin/login"
              className="min-h-[44px] flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all touch-manipulation text-sm font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - tipografía móvil primero */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Tu tienda en línea
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            en minutos
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-1">
          Crea tu catálogo, recibe pedidos por WhatsApp y gestiona tu negocio
          desde cualquier lugar. Sin complicaciones.
        </p>
        <a
          href="https://wa.me/593987865420?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all touch-manipulation w-full max-w-sm mx-auto sm:w-auto"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contáctanos por WhatsApp
        </a>
      </section>

      {/* Características - cards táctiles en móvil */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16">
          Todo lo que necesitas para vender
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-2xl">🛍️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
              Catálogo visual
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Sube fotos y videos de tus productos. Organiza por categorías y
              destaca tus mejores ofertas.
            </p>
          </div>

          <div className="p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
              Pedidos por WhatsApp
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Tus clientes hacen pedidos que llegan directo a tu WhatsApp con
              todos los detalles listos.
            </p>
          </div>

          <div className="p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
              Panel de gestión
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Administra productos, stock y pedidos desde un panel simple y fácil
              de usar.
            </p>
          </div>
        </div>
      </section>

      {/* Temas - grid 1 col móvil */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 sm:mb-6">
          Diseños para cada tipo de negocio
        </h2>
        <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-1">
          Tu tienda se adapta automáticamente al estilo de tu negocio
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <CategoriaPreview categoria="tecnologia" nombre="Tecnología" />
          <CategoriaPreview categoria="moda" nombre="Moda" />
          <CategoriaPreview categoria="comida" nombre="Comida" />
          <CategoriaPreview categoria="general" nombre="General" />
        </div>
      </section>

      {/* CTA - botón táctil */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24 text-center">
        <div className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
            Contáctanos y te ayudamos a crear tu tienda
          </p>
          <a
            href="https://wa.me/593987865420?text=Hola,%20quiero%20crear%20mi%20tienda%20en%20línea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-gray-900 text-base sm:text-lg font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all touch-manipulation w-full max-w-xs mx-auto sm:w-auto"
          >
            Comenzar ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8 safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center text-gray-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} Tienda SaaS. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
