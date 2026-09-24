export async function verifyTurnstile(token: string | null, ip?: string | null) {
  if (!token) return false
  const body = new FormData()
  body.set('secret', process.env.TURNSTILE_SECRET_KEY ?? '')
  body.set('response', token)
  if (ip) body.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
