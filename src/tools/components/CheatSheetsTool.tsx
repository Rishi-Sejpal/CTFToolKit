import { useState } from 'react'
import { ToolCard } from '../../components/ui/ToolCard'

const SHEETS: { name: string; content: string }[] = [
  { name: 'curl', content: `curl -i URL\ncurl -s URL\ncurl -X POST -d 'a=b' URL\ncurl -H 'Auth: token' URL\ncurl -k https://...\ncurl -L URL (follow redirects)\ncurl -o file URL\ncurl -I URL (headers only)` },
  { name: 'nmap', content: `nmap -sC -sV target\nnmap -p- target\nnmap -sn 10.0.0.0/24 (ping sweep)\nnmap -A target\nnmap --script vuln target\nnmap -sU -p 53,161 target\nnmap -oN out.txt target` },
  { name: 'netcat', content: `nc -lvnp 4444\nnc target 80\nnc -zv target 1-1000\nnc -u target 53` },
  { name: 'openssl', content: `openssl s_client -connect host:443\nopenssl x509 -in cert.pem -text\nopenssl enc -aes-256-cbc -in f -out f.enc\nopenssl rand -hex 16` },
  { name: 'gobuster', content: `gobuster dir -u URL -w wordlist\ngobuster dns -d domain -w wordlist\ngobuster vhost -u URL -w wordlist` },
  { name: 'ffuf', content: `ffuf -u URL/FUZZ -w wordlist\nffuf -u URL -H 'Host: FUZZ' -w wordlist\nffuf -u URL -X POST -d 'a=FUZZ' -w wordlist` },
  { name: 'sqlmap', content: `sqlmap -u "URL?id=1" --batch\nsqlmap -r request.txt --dbs\nsqlmap -u URL --dump -T users` },
  { name: 'hydra', content: `hydra -l user -P pass.txt ssh://host\nhydra -L users.txt -P pass.txt http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"` },
  { name: 'john', content: `john --wordlist=rockyou.txt hashes.txt\njohn --show hashes.txt\nunshadow passwd shadow > hashes.txt` },
  { name: 'hashcat', content: `hashcat -m 0 hashes.txt wordlist\nhashcat -m 1000 ntlm.txt rockyou.txt\nhashcat -m 1400 sha256.txt wordlist` },
  { name: 'smbclient', content: `smbclient -L //host -N\nsmbclient //host/share -U user\nsmbget smb://host/share/file` },
  { name: 'tcpdump', content: `tcpdump -i eth0\ntcpdump -r file.pcap\ntcpdump host 1.2.3.4\ntcpdump port 80 -w out.pcap` },
]

export default function CheatSheetsTool() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const filtered = SHEETS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <ToolCard title="Cheat Sheets" description="Quick reference for common tools">
      <input className="input" placeholder="Search sheets…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.map((s) => (
        <div key={s.name} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 8 }}>
          <div style={{ cursor: 'pointer', fontWeight: 600 }} onClick={() => setOpen((o) => ({ ...o, [s.name]: !(o[s.name] ?? false) }))}>
            {(open[s.name] ?? false) ? '▾' : '▸'} {s.name}
          </div>
          {(open[s.name] ?? false) && (
            <>
              <textarea value={s.content} readOnly style={{ minHeight: 120, marginTop: 6 }} />
              <button className="btn" onClick={() => navigator.clipboard.writeText(s.content)}>Copy</button>
            </>
          )}
        </div>
      ))}
    </ToolCard>
  )
}
