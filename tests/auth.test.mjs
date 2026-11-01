import { encode } from "next-auth/jwt";
import { test } from "node:test";
import assert from "node:assert/strict";

const origin = process.env.AUTH_TEST_URL ?? "http://localhost:3100";

test("home stays public", async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
});

for (const path of ["/patterns/two-pointers/three-sum", "/patterns/sliding-window/minimum-window-substring", "/patterns/stack/valid-parentheses", "/future-page"]) {
  test(`anonymous visitors must sign in for ${path}`, async () => {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert.equal(response.status, 307);
    const location = new URL(response.headers.get("location"), origin);
    assert.equal(location.pathname, "/signin");
    assert.equal(location.searchParams.get("callbackUrl"), path);
  });
}


test("anonymous users cannot access account", async () => {
  const response = await fetch(`${origin}/account`, { redirect: "manual" });
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, "/signin");
});

test("forged session cookie cannot access account", async () => {
  const response = await fetch(`${origin}/account`, {
    redirect: "manual", headers: { Cookie: "next-auth.session-token=forged-session" },
  });
  assert.equal(response.status, 307);
});

test("anonymous session exposes no user or provider token", async () => {
  const response = await fetch(`${origin}/api/auth/session`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {});
});

test("sign-in page uses a generic provider error", async () => {
  const response = await fetch(`${origin}/signin?error=private-provider-detail`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Sign-in could not be completed/);
  assert.match(html, /Continue with GitHub|Sign-in is not available yet/);
});

test("CSRF endpoint issues a token and HTTP-only cookie", async () => {
  const response = await fetch(`${origin}/api/auth/csrf`);
  assert.equal(response.status, 200);
  assert.ok((await response.json()).csrfToken);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i);
});

test("sign-in without CSRF does not redirect to GitHub", async () => {
  const response = await fetch(`${origin}/api/auth/signin/github`, {
    method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "callbackUrl=https%3A%2F%2Fexample.com",
  });
  assert.equal(response.status, 302);
  assert.equal(new URL(response.headers.get("location"), origin).origin, origin);
});

test("configured OAuth starts with state and rejects external callback URLs", async () => {
  const providers = await (await fetch(`${origin}/api/auth/providers`)).json();
  assert.ok(providers.github, "the test server must enable the GitHub provider");
  const csrfResponse = await fetch(`${origin}/api/auth/csrf`);
  const { csrfToken } = await csrfResponse.json();
  const cookie = csrfResponse.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
  const response = await fetch(`${origin}/api/auth/signin/github`, {
    method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
    body: new URLSearchParams({ csrfToken, callbackUrl: "https://example.com" }),
  });
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.origin, "https://github.com");
  assert.equal(location.pathname, "/login/oauth/authorize");
  assert.ok(location.searchParams.get("state"));
  assert.equal(location.searchParams.get("redirect_uri"), `${origin}/api/auth/callback/github`);
  assert.ok(!response.headers.getSetCookie().some(value => /callback-url=https%3A%2F%2Fexample.com/i.test(value)));
});

async function sessionCookie(maxAge = 3600) {
  assert.ok(process.env.AUTH_TEST_SECRET, "Run through tests/run-auth.mjs to use isolated test credentials");
  const token = await encode({ secret: process.env.AUTH_TEST_SECRET,
    token: { sub: "test-user", name: "Regression User", email: "regression@example.invalid" }, maxAge });
  return `next-auth.session-token=${token}`;
}

test("valid encrypted session opens content and account, never exposes provider secrets", async () => {
  const cookie = await sessionCookie();
  for (const path of ["/account", "/patterns/stack/valid-parentheses", "/patterns/sliding-window/minimum-window-substring"]) {
    const response = await fetch(`${origin}${path}`, { headers: { Cookie: cookie }, redirect: "manual" });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(!html.includes(process.env.AUTH_TEST_SECRET));
    if (path !== "/account") {
      assert.ok(!html.includes("Optimized two-pointer scan"));
      assert.ok(!html.includes("Brute force triplet scan"));
      assert.ok(!html.includes("Sorted anchors"));
    }
  }
  const session = await (await fetch(`${origin}/api/auth/session`, { headers: { Cookie: cookie } })).json();
  assert.equal(session.user.name, "Regression User");
  assert.ok(!("accessToken" in session));
});

test("expired session and middleware bypass headers cannot open lessons", async () => {
  for (const headers of [
    { Cookie: await sessionCookie(-3600) },
    { "x-middleware-subrequest": "middleware:middleware:middleware:middleware:middleware" },
  ]) {
    const response = await fetch(`${origin}/patterns/two-pointers/three-sum`, { headers, redirect: "manual" });
    assert.equal(response.status, 307);
  }
});

test("authenticated sign-in honors only local return paths", async () => {
  const cookie = await sessionCookie();
  for (const [callbackUrl, expected] of [["/patterns/stack/valid-parentheses", "/patterns/stack/valid-parentheses"], ["https://example.com", "/account"]]) {
    const response = await fetch(`${origin}/signin?${new URLSearchParams({ callbackUrl })}`, { headers: { Cookie: cookie }, redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location"), origin).pathname, expected);
  }
});

test("sign-out clears the session cookie with a CSRF-protected POST", async () => {
  const cookie = await sessionCookie();
  const csrfResponse = await fetch(`${origin}/api/auth/csrf`, { headers: { Cookie: cookie } });
  const { csrfToken } = await csrfResponse.json();
  const csrfCookies = csrfResponse.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
  const response = await fetch(`${origin}/api/auth/signout`, {
    method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: `${cookie}; ${csrfCookies}` },
    body: new URLSearchParams({ csrfToken, callbackUrl: origin }),
  });
  assert.equal(response.status, 302);
  assert.ok(response.headers.getSetCookie().some(value => value.startsWith("next-auth.session-token=;") && /Max-Age=0/i.test(value)));
});

test("unknown private APIs return 401 rather than HTML redirects", async () => {
  const response = await fetch(`${origin}/api/private-data`, { redirect: "manual" });
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Unauthorized" });
});
