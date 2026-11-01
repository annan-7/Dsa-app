import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:net";

// Isolated credentials and a free loopback port keep this test independent of real OAuth accounts.
const portFinder = createServer();
await new Promise(resolve => portFinder.listen(0, "127.0.0.1", resolve));
const port = portFinder.address().port;
await new Promise(resolve => portFinder.close(resolve));
const origin = `http://localhost:${port}`;
const secret = randomBytes(32).toString("base64");
const env = { ...process.env, NEXTAUTH_URL: origin, NEXTAUTH_SECRET: secret,
  GITHUB_ID: "test-client-id", GITHUB_SECRET: "test-client-secret", AUTH_TEST_SECRET: secret, AUTH_TEST_URL: origin };
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { env, stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
server.stdout.on("data", chunk => { logs += chunk; });
server.stderr.on("data", chunk => { logs += chunk; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 200; attempt++) {
    if (server.exitCode !== null) throw new Error(`Test server exited: ${logs}`);
    try { ready = (await fetch(`${origin}/api/auth/providers`)).ok; } catch { /* Wait for startup. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error(`Test server startup timed out: ${logs}`);
  const tests = spawn(process.execPath, ["--test", "tests/auth.test.mjs"], { env, stdio: "inherit" });
  const [exitCode] = await once(tests, "exit");
  process.exitCode = exitCode ?? 1;
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
