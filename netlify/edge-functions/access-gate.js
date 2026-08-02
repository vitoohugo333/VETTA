const COOKIE_NAME = 'vetta_access';
const LOGIN_PATH = '/__vetta-access';
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function runtimeEnv(name) {
  return globalThis.Netlify?.env?.get?.(name) ?? globalThis.process?.env?.[name] ?? '';
}

function bytesToBase64Url(bytes) {
  let value = '';
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  try {
    return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function constantTimeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const limit = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < limit; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

export function parseCredentials(value) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => (
      item
      && typeof item.id === 'string'
      && /^[A-Za-z0-9_-]{1,80}$/.test(item.id)
      && typeof item.hash === 'string'
      && /^[a-f0-9]{64}$/i.test(item.hash)
      && (item.expiresAt === null || (typeof item.expiresAt === 'string' && Number.isFinite(Date.parse(item.expiresAt))))
    )).map(item => ({ id: item.id, hash: item.hash.toLowerCase(), expiresAt: item.expiresAt }));
  } catch {
    return [];
  }
}

export function isCredentialActive(credential, now = Date.now()) {
  if (!credential || credential.expiresAt === undefined) return false;
  return credential.expiresAt === null || Date.parse(credential.expiresAt) > now;
}

export async function createSession(credential, secret, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const credentialExpiry = credential.expiresAt === null
    ? issuedAt + SESSION_SECONDS
    : Math.floor(Date.parse(credential.expiresAt) / 1000);
  const expiresAt = Math.min(issuedAt + SESSION_SECONDS, credentialExpiry);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({ id: credential.id, exp: expiresAt })));
  const signature = bytesToBase64Url(await hmac(payload, secret));
  return { token: `${payload}.${signature}`, expiresAt };
}

export async function verifySession(token, credentials, secret, now = Date.now()) {
  if (typeof token !== 'string' || typeof secret !== 'string' || !secret) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra || !constantTimeEqual(signature, bytesToBase64Url(await hmac(payload, secret)))) return null;
  const bytes = base64UrlToBytes(payload);
  if (!bytes) return null;
  try {
    const parsed = JSON.parse(decoder.decode(bytes));
    if (!parsed || typeof parsed.id !== 'string' || !Number.isInteger(parsed.exp) || parsed.exp * 1000 <= now) return null;
    const credential = credentials.find(item => item.id === parsed.id && isCredentialActive(item, now));
    return credential ?? null;
  } catch {
    return null;
  }
}

function sessionToken(request) {
  const match = request.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : '';
}

function safeRedirect(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

function accessPage(redirectTo, message = '') {
  const notice = message ? '<p role="alert">Senha inválida ou acesso expirado.</p>' : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>VETTA | Acesso protegido</title></head><body><main data-vetta-access-gate="true"><h1>VETTA</h1><p>Informe a senha de acesso.</p>${notice}<form method="post" action="${LOGIN_PATH}"><input type="hidden" name="redirect" value="${redirectTo}"><label>Senha <input name="password" type="password" autocomplete="current-password" required autofocus></label><button type="submit">Entrar</button></form></main></body></html>`;
}

function unauthorized(request, message = '') {
  const url = new URL(request.url);
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(accessPage(`${url.pathname}${url.search}`, message), {
      status: 401,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  return new Response('Acesso protegido.', { status: 401, headers: { 'cache-control': 'no-store' } });
}

export default async (request, context) => {
  const credentials = parseCredentials(runtimeEnv('VETTA_ACCESS_CREDENTIALS_JSON'));
  const secret = runtimeEnv('VETTA_ACCESS_SESSION_SECRET');
  if (!credentials.length || secret.length < 32) {
    return new Response('Proteção de acesso indisponível.', { status: 503, headers: { 'cache-control': 'no-store' } });
  }

  const url = new URL(request.url);
  if (url.pathname === LOGIN_PATH && request.method === 'POST') {
    const form = await request.formData();
    const password = form.get('password');
    const passwordHash = typeof password === 'string' ? await sha256Hex(password) : '';
    const credential = typeof password === 'string'
      ? credentials.find(item => isCredentialActive(item) && constantTimeEqual(item.hash, passwordHash))
      : null;
    if (!credential) return unauthorized(request, 'invalid');
    const session = await createSession(credential, secret);
    return new Response(null, {
      status: 303,
      headers: {
        location: safeRedirect(form.get('redirect')),
        'set-cookie': `${COOKIE_NAME}=${session.token}; Path=/; Max-Age=${Math.max(0, session.expiresAt - Math.floor(Date.now() / 1000))}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  if (await verifySession(sessionToken(request), credentials, secret)) return context.next();
  return unauthorized(request);
};
