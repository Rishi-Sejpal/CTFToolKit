// 
import type { ToolDefinition, ToolCategory } from '../lib/types'
import { SharedEncoding } from './components/SharedEncoding'
import { HashTool, HmacTool, HashIdTool, FileHashTool, JwtTool } from './components/CryptoTools'
import ReverseShellTool from './components/ReverseShellTool'
import RecipeWorkbench from './components/RecipeWorkbench'
import CatalogTool from './components/CatalogTool'
import StringsTool from './components/StringsTool'
import FileSigTool from './components/FileSigTool'
import ExifTool from './components/ExifTool'
import ZeroWidthTool from './components/ZeroWidthTool'
import LsbTool from './components/LsbTool'
import WorkspaceTool from './components/WorkspaceTool'
import TextUtilsTool from './components/TextUtilsTool'
import { Base58Tool, Base85Tool, MorseTool, VigenereTool, AesTool, EntropyTool, SubnetTool } from './components/ExtraTools'
import UrlParserTool from './components/UrlParserTool'
import CheatSheetsTool from './components/CheatSheetsTool'
import HexEditorTool from './components/HexEditorTool'

function W(props: { mode: any; title: string; desc: string }) {
  return <SharedEncoding mode={props.mode} title={props.title} desc={props.desc} />
}

import type { ComponentType } from 'react'
const mk = (id: string, name: string, category: ToolCategory, description: string, keywords: string[], comp: ComponentType): ToolDefinition => ({
  id, name, category, description, keywords, component: comp,
})

export const TOOLS: ToolDefinition[] = [
  mk('cheatsheets', 'Cheat Sheets', 'Cheat Sheets', 'Quick references', ['cheat', 'reference', 'curl', 'nmap'], CheatSheetsTool),
  mk('hexeditor', 'Hex Editor', 'Utilities', 'Hex editor', ['hex', 'editor', 'file'], HexEditorTool),
  mk('b64-enc', 'Base64 Encode', 'Encoding', 'Encode text to Base64', ['base64', 'encode'], () => <W mode="b64e" title="Base64 Encode" desc="Encode text to Base64" />),
  mk('b64-dec', 'Base64 Decode', 'Encoding', 'Decode Base64 to text', ['base64', 'decode'], () => <W mode="b64d" title="Base64 Decode" desc="Decode Base64" />),
  mk('b32-enc', 'Base32 Encode', 'Encoding', 'Encode text to Base32', ['base32'], () => <W mode="b32e" title="Base32 Encode" desc="Encode" />),
  mk('b32-dec', 'Base32 Decode', 'Encoding', 'Decode Base32', ['base32'], () => <W mode="b32d" title="Base32 Decode" desc="Decode" />),
  mk('hex-enc', 'Hex Encode', 'Encoding', 'Text to hex', ['hex'], () => <W mode="hexe" title="Hex Encode" desc="Text to hex bytes" />),
  mk('hex-dec', 'Hex Decode', 'Encoding', 'Hex to text', ['hex'], () => <W mode="hexd" title="Hex Decode" desc="Hex to text" />),
  mk('bin-enc', 'Binary Encode', 'Encoding', 'Text to binary', ['binary'], () => <W mode="bine" title="Binary Encode" desc="Text to binary" />),
  mk('bin-dec', 'Binary Decode', 'Encoding', 'Binary to text', ['binary'], () => <W mode="bind" title="Binary Decode" desc="Binary to text" />),
  mk('url-enc', 'URL Encode', 'Encoding', 'URL encode', ['url', 'percent'], () => <W mode="urle" title="URL Encode" desc="Percent-encode" />),
  mk('url-dec', 'URL Decode', 'Encoding', 'URL decode', ['url'], () => <W mode="urld" title="URL Decode" desc="Percent-decode" />),
  mk('html-enc', 'HTML Entity Encode', 'Encoding', 'HTML entities encode', ['html'], () => <W mode="htmle" title="HTML Encode" desc="Encode HTML entities" />),
  mk('html-dec', 'HTML Entity Decode', 'Encoding', 'HTML entities decode', ['html'], () => <W mode="htmld" title="HTML Decode" desc="Decode HTML entities" />),
  mk('rot13', 'ROT13', 'Encoding', 'ROT13 cipher', ['rot13', 'caesar'], () => <W mode="rot" title="ROT13" desc="ROT13" />),
  mk('rot11', 'ROT11', 'Encoding', 'ROT11 cipher', ['rot11'], () => <W mode="rot11" title="ROT11" desc="ROT11" />),
  mk('rot47', 'ROT47', 'Encoding', 'ROT47 cipher', ['rot47'], () => <W mode="rot47" title="ROT47" desc="ROT47" />),
  mk('caesar', 'Caesar Cipher', 'Encoding', 'Caesar shift', ['caesar', 'shift'], () => <W mode="caesar" title="Caesar Cipher" desc="Shift letters" />),
  mk('xor-enc', 'XOR Encode', 'Encoding', 'XOR to hex', ['xor'], () => <W mode="xor" title="XOR Encode" desc="XOR text with key, output hex" />),
  mk('xor-dec', 'XOR Decode', 'Encoding', 'XOR from hex', ['xor'], () => <W mode="xord" title="XOR Decode" desc="XOR hex with key" />),
  mk('json-fmt', 'JSON Format', 'Encoding', 'Pretty print JSON', ['json', 'format'], () => <W mode="json" title="JSON Format" desc="Pretty print" />),
  mk('json-min', 'JSON Minify', 'Encoding', 'Minify JSON', ['json', 'minify'], () => <W mode="jsonmin" title="JSON Minify" desc="Minify" />),
  mk('uni-esc', 'Unicode Escape', 'Encoding', 'Unicode to \\uXXXX', ['unicode'], () => <W mode="uni" title="Unicode Escape" desc="Escape unicode" />),
  mk('uni-unes', 'Unicode Unescape', 'Encoding', 'Unescape \\uXXXX', ['unicode'], () => <W mode="ascii" title="Unicode Unescape" desc="Unescape" />),
  mk('ts2date', 'Timestamp to Date', 'Encoding', 'Unix timestamp to ISO', ['timestamp', 'date'], () => <W mode="ts2date" title="Timestamp to Date" desc="Unix to ISO" />),
  mk('date2ts', 'Date to Timestamp', 'Encoding', 'Date to unix timestamp', ['timestamp', 'date'], () => <W mode="date2ts" title="Date to Timestamp" desc="Date to unix" />),
  mk('regex', 'Regex Tester', 'Text', 'Test regular expressions', ['regex'], () => <W mode="regex" title="Regex Tester" desc="Test regex" />),
  mk('text-diff', 'Text Diff', 'Text', 'Compare two texts', ['diff', 'compare'], () => <W mode="diff" title="Text Diff" desc="Line diff" />),
  mk('gzip', 'Gzip Compress', 'Encoding', 'Compress text to base64 gzip', ['gzip', 'compress'], () => <W mode="comp" title="Gzip Compress" desc="Compress" />),
  mk('gunzip', 'Gzip Decompress', 'Encoding', 'Decompress base64 gzip', ['gzip', 'decompress'], () => <W mode="decomp" title="Gzip Decompress" desc="Decompress" />),
  mk('hash', 'Hash', 'Cryptography', 'SHA hashes', ['hash', 'sha'], HashTool),
  mk('hmac', 'HMAC', 'Cryptography', 'HMAC generation', ['hmac'], HmacTool),
  mk('hashid', 'Hash Identifier', 'Cryptography', 'Identify hash type', ['hashid'], HashIdTool),
  mk('filehash', 'File Hash', 'Cryptography', 'Hash files', ['file', 'hash'], FileHashTool),
  mk('jwt', 'JWT', 'Cryptography', 'JWT inspect/sign/verify', ['jwt', 'token'], JwtTool),
  mk('rsg', 'Reverse Shell Generator', 'Reverse Shell', 'Generate reverse shells', ['reverse', 'shell', 'rsg'], ReverseShellTool),
  mk('recipe', 'Recipe Workbench', 'Recipe', 'Chain transformations', ['recipe', 'workbench', 'chain'], RecipeWorkbench),
  mk('catalog', 'Native Tool Catalog', 'Utilities', 'Browse native tools', ['catalog', 'tools', 'kali'], CatalogTool),
  mk('strings', 'Strings Extractor', 'Forensics', 'Extract printable strings', ['strings', 'binary'], StringsTool),
  mk('filesig', 'File Signature', 'Forensics', 'Identify file by magic bytes', ['file', 'magic', 'signature'], FileSigTool),
  mk('exif', 'EXIF Viewer', 'Forensics', 'Inspect image metadata', ['exif', 'metadata', 'image'], ExifTool),
  mk('zerowidth', 'Zero-Width Detector', 'Steganography', 'Detect hidden unicode', ['stego', 'unicode', 'hidden'], ZeroWidthTool),
  mk('lsb', 'LSB Inspector', 'Steganography', 'Visualise LSB plane', ['stego', 'lsb', 'image'], LsbTool),
  mk('workspace', 'Challenge Workspace', 'Utilities', 'Save notes and findings', ['workspace', 'challenge', 'notes'], WorkspaceTool),
  mk('textutils', 'Text Utils', 'Text', 'Text stats and transforms', ['text', 'utils', 'count'], TextUtilsTool),
  mk('base58', 'Base58', 'Encoding', 'Base58 encode/decode', ['base58'], Base58Tool),
  mk('base85', 'Base85', 'Encoding', 'Base85 encode/decode', ['base85','ascii85'], Base85Tool),
  mk('morse', 'Morse Code', 'Encoding', 'Morse encode/decode', ['morse'], MorseTool),
  mk('vigenere', 'Vigenère Cipher', 'Cryptography', 'Vigenère cipher', ['vigenere'], VigenereTool),
  mk('aes', 'AES Encrypt/Decrypt', 'Cryptography', 'AES-GCM', ['aes','crypto'], AesTool),
  mk('entropy', 'Entropy Analysis', 'Forensics', 'Shannon/byte entropy', ['entropy'], EntropyTool),
  mk('subnet', 'IP Subnet Calculator', 'Web', 'IPv4 CIDR info', ['ip','subnet','cidr'], SubnetTool),
  mk('urlparser', 'URL Parser', 'Web', 'Parse URL components', ['url','parse'], UrlParserTool),
]
