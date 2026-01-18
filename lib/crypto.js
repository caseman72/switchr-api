import crypto from "crypto";

export function createSignature(token, secret, timestamp, nonce) {
  const data = token + timestamp + nonce;
  return crypto.createHmac("sha256", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");
}
