import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function generateOrderMessage(
  numeroPedido: number,
  clienteNombre: string,
  clienteTelefono: string,
  items: { nombre: string; cantidad: number; precio: number }[],
  total: number,
  notas?: string
): string {
  const itemsText = items
    .map(item => `• ${item.cantidad}x ${item.nombre} - ${formatPrice(item.precio * item.cantidad)}`)
    .join('\n')

  let message = `🛒 *Nuevo Pedido #${numeroPedido.toString().padStart(3, '0')}*
━━━━━━━━━━━━━━━━━━━━

*Cliente:* ${clienteNombre}
*Teléfono:* ${clienteTelefono}

*Productos:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
*Total: ${formatPrice(total)}*`

  if (notas) {
    message += `\n\n📝 Notas: ${notas}`
  }

  return message
}

export const ESTADO_PEDIDO_LABELS = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  en_proceso: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
} as const

export const CATEGORIA_GENERAL_LABELS = {
  tecnologia: 'Tecnología',
  moda: 'Moda',
  comida: 'Comida',
  general: 'General',
} as const

/**
 * Extrae latitud y longitud de un enlace de Google Maps.
 * Soporta: @lat,lng, zoom | ?q=lat,lng | place_id
 */
export function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  // Formato @lat,lng,zoom (ej: https://www.google.com/maps/@19.4326,-99.1332,17z)
  const atMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  // Formato q=lat,lng o q=lat+lng
  const qMatch = trimmed.match(/[?&]q=(-?\d+\.?\d*)[,+ ](-?\d+\.?\d*)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  // Formato ll=lat,lng (antiguo)
  const llMatch = trimmed.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) }
  return null
}
