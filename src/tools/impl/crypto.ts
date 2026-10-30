export async function hashText(alg: string, s: string): Promise<string> {
  const data = new TextEncoder().encode(s)
  const buf = await crypto.subtle.digest(alg, data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
export async function hmacText(alg: string, secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: alg }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
export async function fileHash(alg: string, file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const h = await crypto.subtle.digest(alg, buf)
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
export function hashIdentifier(input: string): { name: string; score: number; reason: string }[] {
  const s = input.trim().toLowerCase()
  const res: { name: string; score: number; reason: string }[] = []
  const hex = /^[0-9a-f]+$/.test(s)
  const len = s.length
  if (hex) {
    if (len === 32) res.push({ name: 'MD5', score: 0.7, reason: '32 hex chars' })
    if (len === 40) res.push({ name: 'SHA-1', score: 0.7, reason: '40 hex chars' })
    if (len === 64) res.push({ name: 'SHA-256', score: 0.75, reason: '64 hex chars' })
    if (len === 96) res.push({ name: 'SHA-384', score: 0.75, reason: '96 hex chars' })
    if (len === 128) res.push({ name: 'SHA-512', score: 0.75, reason: '128 hex chars' })
  }
  if (s.startsWith('$2')) res.push({ name: 'bcrypt', score: 0.8, reason: 'bcrypt prefix' })
  if (s.startsWith('$argon2')) res.push({ name: 'Argon2', score: 0.85, reason: 'argon2 prefix' })
  if (res.length === 0) res.push({ name: 'Unknown', score: 0.1, reason: 'No strong pattern' })
  return res.sort((a, b) => b.score - a.score)
}
