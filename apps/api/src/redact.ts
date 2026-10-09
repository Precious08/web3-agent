// PII redaction BEFORE storage or prompt use. Wallet addresses (40-hex) are public
// Web3 content and stay; private keys (64-hex), emails and pasted secrets go.
export function redactPII(s: string): string {
  return s
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\b0x[a-fA-F0-9]{64}\b/g, "[redacted-key]")
    .replace(/(api[_-]?key|secret|bearer|token)\s*[:=]\s*\S+/gi, "$1=[redacted]");
}
