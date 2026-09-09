const VISITOR_KEY = 'lealindie_visitor_id'
const VIEW_SESSION_KEY = 'lealindie_view_tracked'

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function getOrCreateVisitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_KEY)
  if (existing) return existing

  const id = crypto.randomUUID()
  window.localStorage.setItem(VISITOR_KEY, id)
  return id
}

export async function getVisitorHash(): Promise<string> {
  const id = getOrCreateVisitorId()
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`lealindie:${id}`),
  )
  return toHex(digest)
}

export function hasTrackedViewThisSession(): boolean {
  return window.sessionStorage.getItem(VIEW_SESSION_KEY) === '1'
}

export function markViewTrackedThisSession(): void {
  window.sessionStorage.setItem(VIEW_SESSION_KEY, '1')
}
