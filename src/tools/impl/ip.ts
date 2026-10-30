export function subnetInfo(cidr: string): string {
  const [ip, bitsStr] = cidr.split('/')
  const bits = Number(bitsStr)
  const parts = ip.split('.').map(Number)
  let ipNum = 0
  for (const p of parts) ipNum = (ipNum << 8) + p
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
  const network = (ipNum & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const hosts = bits >= 31 ? 0 : (1 << (32 - bits)) - 2
  const toIp = (n: number) => [24,16,8,0].map((s) => (n >>> s) & 255).join('.')
  return `Network: ${toIp(network)}\nBroadcast: ${toIp(broadcast)}\nMask: ${toIp(mask)}\nUsable hosts: ${hosts}`
}
