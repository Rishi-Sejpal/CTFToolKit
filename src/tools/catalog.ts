export interface CatalogEntry {
  name: string
  description: string
  category: string
  os: string[]
  packages: Record<string, string>
  link: string
  status?: 'installed' | 'installable' | 'unavailable' | 'unsupported'
}

export const TOOL_CATALOG: CatalogEntry[] = [
  { name: 'Nmap', description: 'Network discovery and security auditing', category: 'Reconnaissance', os: ['linux'], packages: { arch: 'nmap', debian: 'nmap', ubuntu: 'nmap', kali: 'nmap' }, link: 'https://nmap.org' },
  { name: 'Wireshark', description: 'Network protocol analyzer', category: 'Network Analysis', os: ['linux'], packages: { arch: 'wireshark-qt', debian: 'wireshark', ubuntu: 'wireshark', kali: 'wireshark' }, link: 'https://wireshark.org' },
  { name: 'John the Ripper', description: 'Password cracker', category: 'Password Auditing', os: ['linux'], packages: { arch: 'john', debian: 'john', ubuntu: 'john', kali: 'john' }, link: 'https://www.openwall.com/john/' },
  { name: 'Hashcat', description: 'Advanced password recovery', category: 'Password Auditing', os: ['linux'], packages: { arch: 'hashcat', debian: 'hashcat', ubuntu: 'hashcat', kali: 'hashcat' }, link: 'https://hashcat.net' },
  { name: 'ffuf', description: 'Fast web fuzzer', category: 'Web Application', os: ['linux'], packages: { arch: 'ffuf', debian: 'ffuf', ubuntu: 'ffuf', kali: 'ffuf' }, link: 'https://github.com/ffuf/ffuf' },
  { name: 'Gobuster', description: 'Directory/file brute forcer', category: 'Web Application', os: ['linux'], packages: { arch: 'gobuster', debian: 'gobuster', ubuntu: 'gobuster', kali: 'gobuster' }, link: 'https://github.com/OJ/gobuster' },
  { name: 'sqlmap', description: 'Automatic SQL injection tool', category: 'Web Application', os: ['linux'], packages: { arch: 'sqlmap', debian: 'sqlmap', ubuntu: 'sqlmap', kali: 'sqlmap' }, link: 'https://sqlmap.org' },
  { name: 'binwalk', description: 'Firmware analysis', category: 'Forensics', os: ['linux'], packages: { arch: 'binwalk', debian: 'binwalk', ubuntu: 'binwalk', kali: 'binwalk' }, link: 'https://github.com/ReFirmLabs/binwalk' },
  { name: 'Ghidra', description: 'Reverse engineering suite', category: 'Reverse Engineering', os: ['linux'], packages: { arch: 'ghidra', debian: 'ghidra', ubuntu: 'ghidra', kali: 'ghidra' }, link: 'https://ghidra-sre.org' },
  { name: 'Metasploit', description: 'Penetration testing framework', category: 'Exploitation', os: ['linux'], packages: { arch: 'metasploit', debian: 'metasploit-framework', ubuntu: 'metasploit-framework', kali: 'metasploit-framework' }, link: 'https://metasploit.com' },
  { name: 'Burp Suite', description: 'Web vulnerability scanner', category: 'Web Application', os: ['linux'], packages: { kali: 'burpsuite' }, link: 'https://portswigger.net' },
  { name: 'Aircrack-ng', description: 'Wireless security suite', category: 'Wireless', os: ['linux'], packages: { arch: 'aircrack-ng', debian: 'aircrack-ng', ubuntu: 'aircrack-ng', kali: 'aircrack-ng' }, link: 'https://aircrack-ng.org' },
  { name: 'Nikto', description: 'Web server scanner', category: 'Web Application', os: ['linux'], packages: { arch: 'nikto', debian: 'nikto', ubuntu: 'nikto', kali: 'nikto' }, link: 'https://cirt.net/nikto2' },
  { name: 'Hydra', description: 'Login brute forcer', category: 'Password Auditing', os: ['linux'], packages: { arch: 'hydra', debian: 'hydra', ubuntu: 'hydra', kali: 'hydra' }, link: 'https://github.com/vanhauser-thc/thc-hydra' },
  { name: 'tcpdump', description: 'Packet capture', category: 'Network Analysis', os: ['linux'], packages: { arch: 'tcpdump', debian: 'tcpdump', ubuntu: 'tcpdump', kali: 'tcpdump' }, link: 'https://tcpdump.org' },
  { name: 'strace', description: 'System call tracer', category: 'Forensics', os: ['linux'], packages: { arch: 'strace', debian: 'strace', ubuntu: 'strace', kali: 'strace' }, link: 'https://strace.io' },
  { name: 'ltrace', description: 'Library call tracer', category: 'Forensics', os: ['linux'], packages: { arch: 'ltrace', debian: 'ltrace', ubuntu: 'ltrace', kali: 'ltrace' }, link: 'https://ltrace.org' },
  { name: 'radare2', description: 'Reverse engineering framework', category: 'Reverse Engineering', os: ['linux'], packages: { arch: 'radare2', debian: 'radare2', ubuntu: 'radare2', kali: 'radare2' }, link: 'https://rada.re' },
  { name: 'gdb', description: 'Debugger', category: 'Reverse Engineering', os: ['linux'], packages: { arch: 'gdb', debian: 'gdb', ubuntu: 'gdb', kali: 'gdb' }, link: 'https://gnu.org/software/gdb' },
  { name: 'exiftool', description: 'Metadata reader', category: 'Forensics', os: ['linux'], packages: { arch: 'perl-image-exiftool', debian: 'exiftool', ubuntu: 'exiftool', kali: 'exiftool' }, link: 'https://exiftool.org' },
]
