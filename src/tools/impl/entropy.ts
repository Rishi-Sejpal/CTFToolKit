export function shannonEntropy(s: string): number {
  const freq: Record<string, number> = {}
  for (const c of s) freq[c] = (freq[c] || 0) + 1
  const len = s.length
  let e = 0
  for (const k in freq) { const p = freq[k] / len; e -= p * Math.log2(p) }
  return e
}
export function byteEntropy(data: Uint8Array): number {
  const freq = new Array(256).fill(0)
  for (const b of data) freq[b]++
  const len = data.length
  let e = 0
  for (let i = 0; i < 256; i++) { if (freq[i]) { const p = freq[i]/len; e -= p*Math.log2(p) } }
  return e
}
