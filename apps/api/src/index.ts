/**
 * mermaidly short-link API (Cloudflare Worker).
 *
 * Stores `shortId -> { code, viewOnly }` in KV so shared diagrams can be
 * referenced by a tiny id instead of embedding the whole diagram in the URL.
 *
 * Routes:
 *   POST /shorten   body { code, viewOnly? } -> { id }
 *   GET  /s/:id     -> { code, viewOnly }   (resets TTL on each read)
 */

interface Env {
  LINKS: KVNamespace
  ALLOWED_ORIGINS: string
}

interface StoredLink {
  code: string
  viewOnly: boolean
}

// Sliding expiry: a link dies 90 days after it was last opened.
const TTL_SECONDS = 90 * 24 * 60 * 60
// Reject anything larger than this to keep KV values (and abuse) bounded.
const MAX_CODE_LENGTH = 100_000
const ID_LENGTH = 7
const ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  const allowAny = allowed.includes('*')
  const allowOrigin = allowAny
    ? '*'
    : origin && allowed.includes(origin)
      ? origin
      : allowed[0] || '*'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function generateId(): string {
  const bytes = new Uint8Array(ID_LENGTH)
  crypto.getRandomValues(bytes)
  let id = ''
  for (let i = 0; i < ID_LENGTH; i++) id += ID_ALPHABET[bytes[i] % ID_ALPHABET.length]
  return id
}

async function handleShorten(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response> {
  let body: { code?: unknown; viewOnly?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, cors)
  }

  const code = body.code
  if (typeof code !== 'string' || code.length === 0) {
    return json({ error: 'Missing "code"' }, 400, cors)
  }
  if (code.length > MAX_CODE_LENGTH) {
    return json({ error: 'Diagram too large to shorten' }, 413, cors)
  }

  const value: StoredLink = { code, viewOnly: body.viewOnly === true }
  const serialized = JSON.stringify(value)

  // Generate a unique id, retrying on the rare collision.
  let id = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    id = generateId()
    if ((await env.LINKS.get(id)) === null) break
    id = ''
  }
  if (!id) return json({ error: 'Could not allocate id, try again' }, 503, cors)

  await env.LINKS.put(id, serialized, { expirationTtl: TTL_SECONDS })
  return json({ id }, 200, cors)
}

async function handleResolve(
  id: string,
  env: Env,
  cors: Record<string, string>,
): Promise<Response> {
  const raw = await env.LINKS.get(id)
  if (raw === null) {
    return json({ error: 'Link not found or expired' }, 404, cors)
  }

  let value: StoredLink
  try {
    value = JSON.parse(raw)
  } catch {
    return json({ error: 'Corrupt link' }, 500, cors)
  }

  // Sliding expiry: rewrite with a fresh TTL so active links never die.
  // KV has no "touch", so re-put the same value. Best-effort — ignore failures.
  await env.LINKS.put(id, raw, { expirationTtl: TTL_SECONDS }).catch(() => {})

  return json(value, 200, cors)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(env, origin)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method === 'POST' && url.pathname === '/shorten') {
      return handleShorten(request, env, cors)
    }

    const resolveMatch = url.pathname.match(/^\/s\/([A-Za-z0-9]+)$/)
    if (request.method === 'GET' && resolveMatch) {
      return handleResolve(resolveMatch[1], env, cors)
    }

    return json({ error: 'Not found' }, 404, cors)
  },
} satisfies ExportedHandler<Env>
