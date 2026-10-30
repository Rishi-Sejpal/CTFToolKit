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

export function b58Encode(s: string): string {
  const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let num = BigInt(0)
  for (const b of new TextEncoder().encode(s)) num = num * 256n + BigInt(b)
  let out = ''
  while (num > 0n) { out = alpha[Number(num % 58n)] + out; num /= 58n }
  for (const b of new TextEncoder().encode(s)) { if (b === 0) out = '1' + out; else break }
  return out || '1'
}
export function b58Decode(s: string): string {
  const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let num = BigInt(0)
  for (const c of s) { const idx = alpha.indexOf(c); if (idx < 0) throw new Error('Invalid base58'); num = num * 58n + BigInt(idx) }
  const bytes: number[] = []
  while (num > 0n) { bytes.unshift(Number(num % 256n)); num /= 256n }
  let leading = 0
  for (const c of s) { if (c === '1') leading++; else break }
  const res = new Uint8Array(leading + bytes.length)
  for (let i = 0; i < bytes.length; i++) res[leading + i] = bytes[i]
  return new TextDecoder().decode(res)
}
export function b85Encode(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let out = ''
  for (let i = 0; i < bytes.length; i += 4) {
    const chunk = bytes.slice(i, i + 4)
    let n = 0
    for (let j = 0; j < 4; j++) n = n * 256 + (chunk[j] || 0)
    const chars = []
    for (let j = 0; j < 5; j++) { chars.unshift(String.fromCharCode((n % 85) + 33)); n = Math.floor(n / 85) }
    out += chars.join('')
  }
  return out
}
export function b85Decode(s: string): string {
  const clean = s.trim()
  const out: number[] = []
  for (let i = 0; i < clean.length; i += 5) {
    const chunk = clean.slice(i, i + 5)
    let n = 0
    for (const c of chunk) n = n * 85 + (c.charCodeAt(0) - 33)
    for (let j = 3; j >= 0; j--) { out.push((n >> (j * 8)) & 0xff) }
  }
  return new TextDecoder().decode(new Uint8Array(out))
}
export function morseEncode(s: string): string {
  const map: Record<string, string> = { a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..', '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':'/' }
  return s.toLowerCase().split('').map((c) => map[c] ?? c).join(' ')
}
export function morseDecode(s: string): string {
  const rev: Record<string,string> = { '.-':'a','-...':'b','-.-.':'c','-..':'d','.':'e','..-.':'f','--.':'g','....':'h','..':'i','.---':'j','-.-':'k','.-..':'l','--':'m','-.':'n','---':'o','.--.':'p','--.-':'q','.-.':'r','...':'s','-':'t','..-':'u','...-':'v','.--':'w','-..-':'x','-.--':'y','--..':'z' }
  return s.split(' / ').map((w) => w.split(' ').map((c) => rev[c] ?? c).join('')).join(' ')
}
export function vigenere(s: string, key: string, dec=false): string {
  key = key.toLowerCase()
  let ki = 0
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    const k = key[ki % key.length].charCodeAt(0) - 97
    ki++
    const shift = dec ? -k : k
    return String.fromCharCode(((c.charCodeAt(0)-base+shift+26)%26)+base)
  })
}
