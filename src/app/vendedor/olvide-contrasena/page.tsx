'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input, Card } from '@/components/ui'

export default function VendedorOlvideContrasenaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/vendedor/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'Revisa tu correo.')
      } else {
        setError(data.error || 'Error al enviar')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <span className="text-5xl mb-4 block">🔐</span>
        <h1 className="text-2xl font-bold text-white">Recuperar contraseña</h1>
        <p className="text-gray-400 mt-2">Ingresa tu correo y te enviamos un enlace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vendedor@example.com"
          required
        />

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-900/50 border border-green-800 rounded-lg text-green-400 text-sm">
            {message}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Enviar enlace
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        <Link href="/vendedor/login" className="text-indigo-400 hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </Card>
  )
}
