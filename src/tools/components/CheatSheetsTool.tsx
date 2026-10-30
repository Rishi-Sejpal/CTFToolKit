import { useState } from "react"
import { ToolCard } from '../../components/ui/ToolCard'

const SHEETS: { name: string; content: string }[] = [
  { name: 'curl', content: `curl -i URL\n curl -s URL\n curl -X POST -d 'a=b' URL\n curl -H 'Auth: token' URL\n curl -k https://...\n curl -L URL (follow redirects)\n curl -o file URL\n curl -I URL (headers only)` },
  { name: 'nmap', content: `nmap -sC -sV target\n nmap -p- target\n nmap -sn 10.0.0.0/24 (ping sweep)\n nmap -A target\n nmap --script vuln target\n nmap -sU -p 53,161 target\n nmap -oN out.txt target` },
  { name: 'netcat', content: `nc -lvnp 4444\n nc target 80\n nc -zv target 1-1000\n nc -u target 53` },
  { name: 'openssl', content: `openssl s_client -connect host:443\n openssl x509 -in cert.pem -text\n openssl enc -aes-256-cbc -in f -out f.enc\n openssl rand -hex 16` },
  { name: 'gobuster', content: `gobuster dir -u URL -w wordlist\n gobuster dns -d domain -w wordlist\n gobuster vhost -u URL -w wordlist` },
  { name: 'ffuf', content: `ffuf -u URL/FUZZ -w wordlist\n ffuf -u URL -H 'Host: FUZZ' -w wordlist\n ffuf -u URL -X POST -d 'a=FUZZ' -w wordlist` },
  { name: 'sqlmap', content: `sqlmap -u "URL?id=1" --batch\n sqlmap -r request.txt --dbs\n sqlmap -u URL --dump -T users` },
  { name: 'hydra', content: `hydra -l user -P pass.txt ssh://host\n hydra -L users.txt -P pass.txt http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"` },
  { name: 'john', content: `john --wordlist=rockyou.txt hashes.txt\n john --show hashes.txt\n unshadow passwd shadow > hashes.txt` },
  { name: 'hashcat', content: `hashcat -m 0 hashes.txt wordlist\n hashcat -m 1000 ntlm.txt rockyou.txt\n hashcat -m 1400 sha256.txt wordlist` },
  { name: 'smbclient', content: `smbclient -L //host -N\n smbclient //host/share -U user\n smbget smb://host/share/file` },
  { name: 'tcpdump', content: `tcpdump -i eth0\n tcpdump -r file.pcap\n tcpdump host 1.2.3.4\n tcpdump port 80 -w out.pcap` },
]

export default function CheatSheetsTool() {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(SHEETS[0].name)
  const filtered = SHEETS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
  const cur = SHEETS.find((s) => s.name === sel) || SHEETS[0]
  return (
    <ToolCard title="Cheat Sheets" description="Quick reference for common tools">
      <div className="row">
        <input className="input" placeholder="Search sheets…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ width: 160 }} value={sel} onChange={(e) => setSel(e.target.value)}>
          {filtered.map((s) => <option key={s.name}>{s.name}</option>)}
        </select>
      </div>
      <textarea value={cur.content} readOnly style={{ minHeight: 240 }} />
      <button className="btn" onClick={() => navigator.clipboard.writeText(cur.content)}>Copy</button>
    </ToolCard>
  )
}
