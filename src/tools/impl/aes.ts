export async function aesEncrypt(text: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
  const out = new Uint8Array(salt.length + iv.length + ct.byteLength)
  out.set(salt, 0); out.set(iv, salt.length); out.set(new Uint8Array(ct), salt.length + iv.length)
  return btoa(String.fromCharCode(...out))
}
export async function aesDecrypt(b64: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const data = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const salt = data.slice(0, 16)
  const iv = data.slice(16, 28)
  const ct = data.slice(28)
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return new TextDecoder().decode(pt)
}
