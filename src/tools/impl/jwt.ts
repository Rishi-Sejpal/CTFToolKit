import { jwtVerify, SignJWT, importPKCS8, importSPKI } from 'jose'

export interface JwtParts { header: unknown; payload: unknown; signature: string }

export function decodeJwt(token: string): JwtParts {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT structure')
  const dec = (x: string) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(x.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))))
  return { header: dec(parts[0]), payload: dec(parts[1]), signature: parts[2] }
}

export async function signJwt(alg: string, payload: Record<string, unknown>, secretOrKey: string, expiresIn?: string): Promise<string> {
  // secretOrKey: for HMAC use raw secret string; for RSA/EC provide PEM private key
  let key: CryptoKey | Uint8Array
  if (alg.startsWith('HS')) {
    key = new TextEncoder().encode(secretOrKey)
  } else if (alg.startsWith('RS') || alg.startsWith('PS')) {
    key = await importPKCS8(secretOrKey, alg)
  } else if (alg.startsWith('ES')) {
    key = await importPKCS8(secretOrKey, alg)
  } else if (alg.startsWith('Ed')) {
    key = await importPKCS8(secretOrKey, alg)
  } else {
    throw new Error('Unsupported alg')
  }
  let builder = new SignJWT(payload).setProtectedHeader({ alg })
  if (expiresIn) builder = builder.setExpirationTime(expiresIn)
  builder = builder.setIssuedAt()
  return builder.sign(key as any)
}

export async function verifyJwt(token: string, alg: string, secretOrKey: string): Promise<{ valid: boolean; payload?: unknown; error?: string }> {
  try {
    let key: CryptoKey | Uint8Array
    if (alg.startsWith('HS')) {
      key = new TextEncoder().encode(secretOrKey)
    } else if (alg.startsWith('RS') || alg.startsWith('PS') || alg.startsWith('ES') || alg.startsWith('Ed')) {
      key = await importSPKI(secretOrKey, alg)
    } else {
      return { valid: false, error: 'Unsupported alg' }
    }
    const { payload } = await jwtVerify(token, key as any, { algorithms: [alg] })
    return { valid: true, payload }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}
