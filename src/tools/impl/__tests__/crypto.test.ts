/** @vitest-environment node */
import { describe, it, expect } from 'vitest'
import * as C from '../crypto'

describe('crypto', () => {
  it('sha256 known', async () => {
    expect(await C.hashText('SHA-256', 'abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
  it('hmac', async () => {
    const h = await C.hmacText('SHA-256', 'key', 'msg')
    expect(h.length).toBe(64)
  })
  it('hashid', () => {
    expect(C.hashIdentifier('5d41402abc4b2a76b9719d911017c592')[0].name).toBe('MD5')
  })
})
