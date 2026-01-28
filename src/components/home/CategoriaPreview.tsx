'use client'

interface CategoriaPreviewProps {
  categoria: 'tecnologia' | 'moda' | 'comida' | 'general'
  nombre: string
}

export function CategoriaPreview({ categoria, nombre }: CategoriaPreviewProps) {
  const estilos = {
    tecnologia: {
      bg: 'from-blue-600 via-blue-500 to-cyan-500',
      headerBg: 'bg-blue-700/30',
      icon: '💻',
      nombreTienda: 'TechStore',
      descripcion: 'Lo último en tecnología',
      productos: [
        { nombre: 'iPhone 15 Pro', precio: '$999', precioOriginal: '$1,199', imagen: '📱', destacado: true },
        { nombre: 'MacBook Air', precio: '$1,199', precioOriginal: null, imagen: '💻', destacado: false },
        { nombre: 'AirPods Pro', precio: '$249', precioOriginal: '$299', imagen: '🎧', destacado: false },
        { nombre: 'Apple Watch', precio: '$399', precioOriginal: null, imagen: '⌚', destacado: false },
      ],
    },
    moda: {
      bg: 'from-yellow-600 via-amber-500 to-orange-400',
      headerBg: 'bg-yellow-700/30',
      icon: '👗',
      nombreTienda: 'Fashion Boutique',
      descripcion: 'Moda y estilo único',
      productos: [
        { nombre: 'Vestido Elegante', precio: '$89', precioOriginal: '$120', imagen: '👗', destacado: true },
        { nombre: 'Zapatos Premium', precio: '$120', precioOriginal: null, imagen: '👠', destacado: false },
        { nombre: 'Bolso de Diseño', precio: '$150', precioOriginal: '$180', imagen: '👜', destacado: false },
        { nombre: 'Accesorios', precio: '$45', precioOriginal: null, imagen: '💍', destacado: false },
      ],
    },
    comida: {
      bg: 'from-orange-600 via-red-500 to-pink-500',
      headerBg: 'bg-orange-700/30',
      icon: '🍕',
      nombreTienda: 'Delicias Express',
      descripcion: 'Comida deliciosa y fresca',
      productos: [
        { nombre: 'Pizza Margarita', precio: '$12', precioOriginal: null, imagen: '🍕', destacado: true },
        { nombre: 'Hamburguesa', precio: '$8', precioOriginal: '$10', imagen: '🍔', destacado: false },
        { nombre: 'Sushi Roll', precio: '$15', precioOriginal: null, imagen: '🍣', destacado: false },
        { nombre: 'Pasta Italiana', precio: '$11', precioOriginal: null, imagen: '🍝', destacado: false },
      ],
    },
    general: {
      bg: 'from-indigo-600 via-purple-500 to-pink-500',
      headerBg: 'bg-indigo-700/30',
      icon: '🛍️',
      nombreTienda: 'Tienda Premium',
      descripcion: 'Productos de calidad',
      productos: [
        { nombre: 'Producto Premium', precio: '$49', precioOriginal: '$69', imagen: '⭐', destacado: true },
        { nombre: 'Oferta Especial', precio: '$29', precioOriginal: '$39', imagen: '🎁', destacado: false },
        { nombre: 'Nuevo Lanzamiento', precio: '$79', precioOriginal: null, imagen: '✨', destacado: false },
        { nombre: 'Best Seller', precio: '$59', precioOriginal: null, imagen: '🔥', destacado: false },
      ],
    },
  }

  const estilo = estilos[categoria]

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${estilo.bg} cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/20 shadow-lg`}
    >
      {/* Header de tienda completo */}
      <div className={`${estilo.headerBg} backdrop-blur-sm p-4 border-b border-white/20`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{estilo.icon}</div>
            <div>
              <div className="text-white font-bold text-base leading-tight">
                {estilo.nombreTienda}
              </div>
              <div className="text-white/80 text-xs">{estilo.descripcion}</div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-medium">Ejemplo</span>
          </div>
        </div>
      </div>

      {/* Contenido de productos */}
      <div className="p-4">
        {/* Producto destacado grande */}
        <div className="mb-3">
          {estilo.productos
            .filter((p) => p.destacado)
            .map((producto) => (
              <div
                key={producto.nombre}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl flex-shrink-0">{producto.imagen}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-bold truncate mb-1">
                      {producto.nombre}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-base font-bold">
                        {producto.precio}
                      </span>
                      {producto.precioOriginal && (
                        <span className="text-white/60 text-xs line-through">
                          {producto.precioOriginal}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Grid de productos pequeños */}
        <div className="grid grid-cols-3 gap-2">
          {estilo.productos
            .filter((p) => !p.destacado)
            .slice(0, 3)
            .map((producto, idx) => (
              <div
                key={idx}
                className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20 hover:bg-white/25 transition-colors"
              >
                <div className="text-2xl mb-1">{producto.imagen}</div>
                <div className="text-white text-xs font-semibold truncate mb-0.5">
                  {producto.nombre}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-white text-xs font-bold">
                    {producto.precio}
                  </span>
                  {producto.precioOriginal && (
                    <span className="text-white/50 text-[10px] line-through">
                      {producto.precioOriginal}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Footer simulado */}
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
          <div className="text-white/70 text-xs">📱 WhatsApp</div>
          <div className="text-white/70 text-xs">🛒 Ver tienda</div>
        </div>
      </div>

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-2xl pointer-events-none" />
    </div>
  )
}
