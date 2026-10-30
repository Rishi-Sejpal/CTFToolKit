import { describe, it, expect } from 'vitest'
import * as E from '../encoding'

describe('encoding', () => {
  it('base64 roundtrip', () => {
    const s = 'hello world café'
    expect(E.b64Decode(E.b64Encode(s))).toBe(s)
  })
  it('hex roundtrip', () => {
    const s = 'abc'
    expect(E.fromHex(E.toHex(s))).toBe(s)
  })
  it('url roundtrip', () => {
    const s = 'a b+c'
    expect(E.urlDecode(E.urlEncode(s))).toBe(s)
  })
  it('json format', () => {
    expect(E.jsonFormat('{"a":1}')).toContain('\n')
  })
  it('timestamp', () => {
    expect(E.timestampToDate('0')).toBe('1970-01-01T00:00:00.000Z')
  })
})
