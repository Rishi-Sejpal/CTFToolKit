export function b64Encode(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}
export function b64Decode(s: string): string {
  const bin = atob(s.trim())
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}
export function b32Encode(s: string): string {
  // RFC4648
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = new TextEncoder().encode(s)
  let bits = ''
  for (const b of bytes) bits += b.toString(2).padStart(8, '0')
  let out = ''
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0')
    out += alphabet[parseInt(chunk, 2)]
  }
  const pad = (8 - (out.length % 8)) % 8
  return out + '='.repeat(pad === 8 ? 0 : pad)
}
export function b32Decode(s: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = s.replace(/=+$/, '').toUpperCase().replace(/\s/g, '')
  let bits = ''
  for (const c of clean) {
    const idx = alphabet.indexOf(c)
    if (idx < 0) throw new Error('Invalid base32 character')
    bits += idx.toString(2).padStart(5, '0')
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2)
  return new TextDecoder().decode(bytes)
}
export function toHex(s: string): string {
  return [...new TextEncoder().encode(s)].map((b) => b.toString(16).padStart(2, '0')).join(' ')
}
export function fromHex(s: string): string {
  const hex = s.replace(/\s/g, '')
  if (hex.length % 2) throw new Error('Odd hex length')
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return new TextDecoder().decode(bytes)
}
export function toBinary(s: string): string {
  return [...new TextEncoder().encode(s)].map((b) => b.toString(2).padStart(8, '0')).join(' ')
}
export function fromBinary(s: string): string {
  const parts = s.trim().split(/\s+/)
  const bytes = new Uint8Array(parts.map((p) => parseInt(p, 2)))
  return new TextDecoder().decode(bytes)
}
export function urlEncode(s: string): string { return encodeURIComponent(s) }
export function urlDecode(s: string): string { return decodeURIComponent(s) }
export function htmlEncode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
export function htmlDecode(s: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = s
  return txt.value
}
export function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}
export function caesar(s: string, shift: number): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base)
  })
}
export function xorText(s: string, key: string): string {
  const kb = new TextEncoder().encode(key)
  const sb = new TextEncoder().encode(s)
  const out = new Uint8Array(sb.length)
  for (let i = 0; i < sb.length; i++) out[i] = sb[i] ^ kb[i % kb.length]
  return [...out].map((b) => b.toString(16).padStart(2, '0')).join('')
}
export function xorFromHex(hex: string, key: string): string {
  const clean = hex.replace(/\s/g, '')
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  const kb = new TextEncoder().encode(key)
  const out = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ kb[i % kb.length]
  return new TextDecoder().decode(out)
}
export function jsonFormat(s: string, minify = false): string {
  const obj = JSON.parse(s)
  return minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2)
}
export function unicodeToAscii(s: string): string {
  let out = ''
  for (const ch of s) out += ch.charCodeAt(0) <= 127 ? ch : '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  return out
}
export function asciiToUnicode(s: string): string {
  return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
}
export function timestampToDate(s: string): string {
  const n = Number(s.trim())
  if (!Number.isFinite(n)) throw new Error('Invalid number')
  const ms = n > 1e12 ? n : n * 1000
  return new Date(ms).toISOString()
}
export function dateToTimestamp(s: string): string {
  const d = new Date(s.trim())
  if (isNaN(d.getTime())) throw new Error('Invalid date')
  return Math.floor(d.getTime() / 1000).toString()
}
