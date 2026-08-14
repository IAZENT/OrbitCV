// Client-side encryption for AI API keys using Web Crypto API.
// Keys are encrypted before storage in Supabase and decrypted only in-browser.
// The server never sees the passphrase or the decrypted key.

const PASSPHRASE = "orbitcv-ai-key-encryption-v1";
const SALT = "orbitcv-salt-v1";

async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(PASSPHRASE),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALT),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptApiKey(key: string): Promise<{ encrypted: string; iv: string }> {
  const cryptoKey = await deriveKey();
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(key),
  );

  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptApiKey(encrypted: string, iv: string): Promise<string> {
  const cryptoKey = await deriveKey();
  const decoder = new TextDecoder();

  const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    cryptoKey,
    encryptedBytes,
  );

  return decoder.decode(decrypted);
}
