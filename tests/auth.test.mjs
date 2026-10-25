import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

const { encode } = createRequire(import.meta.url)('next-auth/jwt');

test('authentication protects application routes', { timeout: 180_000 }, async (t) => {
  const base = 'http://127.0.0.1:3100';
  const secret = randomBytes(48).toString('base64url');
  const server = spawn(process.execPath, [
    'node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3100',
  ], {
    env: {
      ...process.env,
      NEXTAUTH_URL: base,
      NEXTAUTH_SECRET: secret,
      // No real Google credentials or external OAuth requests are used in these tests.
      GOOGLE_CLIENT_ID: 'ci-placeholder',
      GOOGLE_CLIENT_SECRET: 'ci-placeholder',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const capture = (chunk) => { output = (output + chunk.toString()).slice(-20_000); };
  server.stdout.on('data', capture);
  server.stderr.on('data', capture);
  t.after(async () => {
    if (server.exitCode !== null) return;
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    const force = setTimeout(() => server.kill('SIGKILL'), 5_000);
    await exited;
    clearTimeout(force);
  });

  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${output}`);
    try {
      const response = await fetch(`${base}/api/auth/csrf`, { signal: AbortSignal.timeout(5_000) });
      if (response.ok) { ready = true; break; }
    } catch { /* Wait for the server to start. */ }
    await delay(500);
  }
  assert.ok(ready, `Server did not become ready: ${output}`);
  const request = (path, options = {}) => fetch(base + path, {
    ...options, redirect: 'manual', signal: AbortSignal.timeout(30_000),
  });
  const protectedPath = '/patterns/two-pointers/three-sum';

  await t.test('Home is public', async () => {
    const response = await request('/');
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Show the Aha moment/);
  });

  await t.test('existing, future, and API routes require a session', async () => {
    for (const path of [protectedPath, '/future-page', '/api/private', `${protectedPath}?mode=optimized`]) {
      const response = await request(path);
      assert.equal(response.status, 307, path);
      const location = new URL(response.headers.get('location'), base);
      assert.equal(location.pathname, '/api/auth/signin');
      const callback = new URL(location.searchParams.get('callbackUrl'), base);
      assert.equal(callback.pathname + callback.search, path);
    }
  });

  await t.test('invalid and expired sessions are rejected', async () => {
    const expired = await encode({ secret, token: { sub: 'ci-user' }, maxAge: -3600 });
    for (const token of ['invalid', expired]) {
      const response = await request(protectedPath, {
        headers: { cookie: `next-auth.session-token=${token}` },
      });
      assert.equal(response.status, 307);
    }
  });

  await t.test('middleware bypass header does not bypass authentication', async () => {
    const response = await request(protectedPath, {
      headers: { 'x-middleware-subrequest': Array(5).fill('middleware').join(':') },
    });
    assert.equal(response.status, 307);
  });

  await t.test('a valid signed session can access the visualizer', async () => {
    const token = await encode({ secret, token: { sub: 'ci-user', name: 'CI user' } });
    const response = await request(protectedPath, {
      headers: { cookie: `next-auth.session-token=${token}` },
    });
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /3Sum/);
    assert.match(body, /Sign out/);
  });

  await t.test('Google sign-in and CSRF endpoints remain public', async () => {
    const signin = await request('/api/auth/signin');
    assert.equal(signin.status, 200);
    assert.match(await signin.text(), /Google/);
    const csrf = await request('/api/auth/csrf');
    assert.equal(csrf.status, 200);
    assert.ok((await csrf.json()).csrfToken);
  });
});
