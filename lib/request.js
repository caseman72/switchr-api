import { createSignature } from "./crypto.js";

// Rate limit tracking
let rateLimitRemaining = null;
let rateLimitReset = null;

export class RateLimitError extends Error {
  constructor(resetBy, remaining) {
    const resetIn = Math.ceil((resetBy - Date.now()) / 1000);
    super(`Rate limited. Resets in ${resetIn} seconds`);
    this.name = "RateLimitError";
    this.resetBy = resetBy;
    this.resetIn = resetIn;
  }
}

export function getRateLimitStatus() {
  return {
    remaining: rateLimitRemaining,
    resetBy: rateLimitReset ? new Date(rateLimitReset) : null,
    resetIn: rateLimitReset ? Math.max(0, Math.ceil((rateLimitReset - Date.now()) / 1000)) : null
  };
}

function parseRateLimitHeaders(headers) {
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");

  if (remaining !== null) {
    rateLimitRemaining = parseInt(remaining, 10);
  }
  if (reset) {
    rateLimitReset = parseInt(reset, 10) * 1000;
  }
}

export async function request(token, secret, path, method = "GET", body = null) {
  const t = Date.now();
  const nonce = String(t);
  const sign = createSignature(token, secret, t, nonce);

  const url = `https://api.switch-bot.com${path}`;

  const options = {
    method,
    headers: {
      "Authorization": token,
      "sign": sign,
      "nonce": nonce,
      "t": t,
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  parseRateLimitHeaders(response.headers);

  const json = await response.json();

  if (json.statusCode === 190) {
    const resetBy = rateLimitReset || Date.now() + 60000;
    throw new RateLimitError(resetBy, rateLimitRemaining);
  }

  if (json.statusCode !== 100) {
    throw new Error(`API error ${json.statusCode}: ${json.message}`);
  }

  return json.body;
}
