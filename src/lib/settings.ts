export interface AppSettings { live: boolean; delimiter: string }
const KEY = 'ctftoolkit:v1:settings'
const DEFAULT: AppSettings = { live: true, delimiter: 'auto' }

export function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT }
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT }
  }
}

export function writeSettings(s: AppSettings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {}
  window.dispatchEvent(new CustomEvent('ctftoolkit:settings', { detail: s }))
}
