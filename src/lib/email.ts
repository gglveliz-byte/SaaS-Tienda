// nodemailer se carga de forma dinámica para evitar error si no está instalado

export async function sendPasswordResetEmail(
  to: string,
  tipo: 'admin' | 'vendedor',
  token: string
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return { ok: false, error: 'Email no configurado (EMAIL_USER / EMAIL_APP_PASSWORD)' }
  }

  let nodemailer: typeof import('nodemailer')
  try {
    nodemailer = (await import('nodemailer')).default
  } catch {
    return {
      ok: false,
      error:
        'Módulo de email no instalado. En la carpeta del proyecto ejecuta: npm install nodemailer',
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const baseUrl = process.env.SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001'
  const path = tipo === 'admin' ? '/admin/restablecer' : '/vendedor/restablecer'
  const url = `${baseUrl}${path}?token=${token}`

  const subject = 'Recuperar contraseña - Tienda SaaS'
  const html = `
    <p>Hola,</p>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p><a href="${url}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">Restablecer contraseña</a></p>
    <p>Si no solicitaste esto, ignora este correo. El enlace expira en 1 hora.</p>
    <p>— Tienda SaaS</p>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    })
    return { ok: true }
  } catch (err) {
    console.error('Error enviando email:', err)
    return { ok: false, error: 'No se pudo enviar el correo' }
  }
}
