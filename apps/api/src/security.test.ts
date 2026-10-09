import { describe, expect, it } from "vitest";
import { checkLimit } from "./rateLimit";
import { redactPII } from "./redact";

describe("checkLimit", () => {
  it("allows max then blocks within window", () => {
    const k = `t:${Math.random()}`;
    expect(checkLimit(k, 2, 60_000)).toBe(true);
    expect(checkLimit(k, 2, 60_000)).toBe(true);
    expect(checkLimit(k, 2, 60_000)).toBe(false);
  });
  it("separate keys don't share budget", () => {
    expect(checkLimit(`a:${Math.random()}`, 1, 60_000)).toBe(true);
    expect(checkLimit(`b:${Math.random()}`, 1, 60_000)).toBe(true);
  });
});

describe("redactPII", () => {
  it("redacts emails, keys and pasted secrets", () => {
    expect(redactPII("mail me at jane@doe.io please")).toContain("[redacted-email]");
    expect(redactPII("key 0x" + "ab".repeat(32))).toContain("[redacted-key]");
    expect(redactPII("api_key: sk-live-123")).toContain("api_key=[redacted]");
  });
  it("keeps public wallet addresses", () => {
    const addr = "0x" + "ab".repeat(20);
    expect(redactPII(`holder ${addr}`)).toContain(addr);
  });
});
