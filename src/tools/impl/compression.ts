export async function compressText(s: string, format: 'gzip' | 'deflate' = 'gzip'): Promise<string> {
  const stream = new Blob([s]).stream().pipeThrough(new CompressionStream(format))
  const buf = await new Response(stream).arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
export async function decompressText(b64: string, format: 'gzip' | 'deflate' = 'gzip'): Promise<string> {
  const bin = atob(b64.trim())
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format))
  return await new Response(stream).text()
}
