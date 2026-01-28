import type {
  Admin,
  Plan,
  Tienda,
  Vendedor,
  CategoriaProducto,
  Producto,
  Archivo,
  Pedido,
  ItemPedido,
  CategoriaGeneral,
  EstadoPedido,
  TipoArchivo
} from '@prisma/client'

export type {
  Admin,
  Plan,
  Tienda,
  Vendedor,
  CategoriaProducto,
  Producto,
  Archivo,
  Pedido,
  ItemPedido,
  CategoriaGeneral,
  EstadoPedido,
  TipoArchivo
}

// Tienda con relaciones
export type TiendaConPlan = Tienda & {
  plan: Plan
}

export type TiendaConVendedor = Tienda & {
  vendedor: Vendedor | null
  plan: Plan
}

export type TiendaCompleta = Tienda & {
  plan: Plan
  vendedor: Vendedor | null
  categorias: CategoriaProducto[]
  _count: {
    productos: number
    pedidos: number
  }
}

// Producto con relaciones
export type ProductoConArchivos = Producto & {
  archivos: Archivo[]
  categoria: CategoriaProducto | null
}

export type ProductoCompleto = Producto & {
  archivos: Archivo[]
  categoria: CategoriaProducto | null
  tienda: Pick<Tienda, 'id' | 'slug' | 'nombre'>
}

// Pedido con relaciones
export type PedidoConItems = Pedido & {
  items: (ItemPedido & {
    producto: Pick<Producto, 'id' | 'nombre'>
  })[]
}

export type PedidoCompleto = Pedido & {
  items: ItemPedido[]
  tienda: Pick<Tienda, 'id' | 'slug' | 'nombre' | 'whatsapp'>
}

// Carrito (localStorage)
export interface CarritoItem {
  productoId: string
  nombre: string
  precio: number
  precioOferta?: number
  cantidad: number
  imagenId?: string
  stock: number
}

export interface Carrito {
  tiendaSlug: string
  items: CarritoItem[]
}

// API Responses
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Estadísticas Admin
export interface EstadisticasAdmin {
  totalTiendas: number
  tiendasActivas: number
  tiendasInactivas: number
  totalPedidosMes: number
  ingresosMes: number
  pedidosPorEstado: {
    pendiente: number
    en_proceso: number
    completado: number
    cancelado: number
  }
}

// Estadísticas Vendedor
export interface EstadisticasVendedor {
  totalProductos: number
  productosActivos: number
  productosStockBajo: number
  pedidosHoy: number
  pedidosPendientes: number
  ventasMes: number
}

// Form Types
export interface CrearTiendaInput {
  nombre: string
  slug: string
  descripcion?: string
  categoriaGeneral: CategoriaGeneral
  whatsapp: string
  direccion?: string
  latitud?: number
  longitud?: number
  planId: string
  vendedorEmail: string
  vendedorNombre: string
  vendedorPassword: string
}

export interface CrearProductoInput {
  nombre: string
  descripcion?: string
  precio: number
  precioOferta?: number
  stock: number
  categoriaId?: string
  activo?: boolean
  destacado?: boolean
}

export interface CrearPedidoInput {
  tiendaId: string
  clienteNombre: string
  clienteTelefono: string
  clienteDireccion?: string
  notas?: string
  items: {
    productoId: string
    cantidad: number
  }[]
}

// Temas
export interface TemaColores {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  muted: string
}

// Temas claros por categoría (fondos claros, texto oscuro, responsivos)
export const TEMAS_CATEGORIA: Record<CategoriaGeneral, TemaColores> = {
  tecnologia: {
    primary: '#0066FF',
    secondary: '#e0f2fe',
    accent: '#00D4FF',
    background: '#f8fafc',
    text: '#0f172a',
    muted: '#64748b',
  },
  moda: {
    primary: '#b45309',
    secondary: '#fef3c7',
    accent: '#f59e0b',
    background: '#fffbeb',
    text: '#1c1917',
    muted: '#78716c',
  },
  comida: {
    primary: '#ea580c',
    secondary: '#ffedd5',
    accent: '#fb923c',
    background: '#fff7ed',
    text: '#1c1917',
    muted: '#78716c',
  },
  general: {
    primary: '#4f46e5',
    secondary: '#e0e7ff',
    accent: '#818cf8',
    background: '#f8fafc',
    text: '#1e293b',
    muted: '#64748b',
  },
}
