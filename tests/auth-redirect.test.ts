import { test } from "node:test";
import assert from "node:assert/strict";
import { safeCallbackUrl } from "../libs/auth-redirect";

test("login callback accepts local content routes and rejects external URLs and loops", () => {
  assert.equal(safeCallbackUrl("/patterns/stack/valid-parentheses"), "/patterns/stack/valid-parentheses");
  assert.equal(safeCallbackUrl("/?from=signin"), "/?from=signin");
  for (const value of [undefined, ["/account"], "https://evil.example", "//evil.example", "/\\evil.example", "/signin", "/api/auth/signin", "/\n/evil.example"]) {
    assert.equal(safeCallbackUrl(value), "/account");
  }
});
