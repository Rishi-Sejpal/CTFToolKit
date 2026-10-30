/** @vitest-environment node */
import { describe, it, expect } from 'vitest'
import * as J from '../jwt'

describe('jwt', () => {
  it('decode', () => {
    const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const p = J.decodeJwt(t)
    expect((p.payload as any).sub).toBe('1234567890')
  })
  it('sign+verify', async () => {
    const t = await J.signJwt('HS256', { foo: 'bar' }, 'secret', '1h')
    const r = await J.verifyJwt(t, 'HS256', 'secret')
    expect(r.valid).toBe(true)
    expect((r.payload as any).foo).toBe('bar')
  })
  it('verify wrong secret fails', async () => {
    const t = await J.signJwt('HS256', { foo: 'bar' }, 'secret', '1h')
    const r = await J.verifyJwt(t, 'HS256', 'other')
    expect(r.valid).toBe(false)
  })
  it('verify alg mismatch fails', async () => {
    const t = await J.signJwt('HS256', { foo: 'bar' }, 'secret', '1h')
    const r = await J.verifyJwt(t, 'HS384', 'secret')
    expect(r.valid).toBe(false)
  })
})
