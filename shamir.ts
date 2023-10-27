import { combine } from './sss';
import { split } from './sss';
import * as crypto from "crypto";

type CryptoParams = {
  ciphertext: string;
  cipherparams: {
    iv: string;
    name: string;
    length: number;
  };
  kdf: string;
  kdfparams: {
    salt: string;
    iterations: number;
    hash: string;
  };
};

export type Share = {
  version: number;
  id: string;
  share: {
    total: number;
    threshold: number;
    encrypted: boolean;
    share_sha512: string;
    secret_sha512: string;
  };
  crypto: CryptoParams;
  algorithm: string;
};

async function decryptShareWithPassword(
  share: Share,
  password: string,
): Promise<Uint8Array> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: share.crypto.kdf },
    false,
    ["deriveKey"],
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: share.crypto.kdf,
      salt: new TextEncoder().encode(share.crypto.kdfparams.salt),
      iterations: share.crypto.kdfparams.iterations,
      hash: share.crypto.kdfparams.hash,
    },
    passwordKey,
    {
      name: share.crypto.cipherparams.name,
      length: share.crypto.cipherparams.length,
    },
    true,
    ["decrypt"],
  );

  const decryptedContent = await crypto.subtle.decrypt(
    {
      name: share.crypto.cipherparams.name,
      iv: new Uint8Array(
        share.crypto.cipherparams.iv.split(",").map((byte) => +byte),
      ),
    },
    derivedKey,
    hexToBuffer(share.crypto.ciphertext),
  );

  return new Uint8Array(decryptedContent);
}

async function encryptShare(
  originalShare: Uint8Array,
  password: string,
  total: number,
  threshold: number,
  secretHash: string,
): Promise<Share> {
  const share_sha512 = await computeSHA512(originalShare);

  const cryptoConfig = {
    kdf: "PBKDF2",
    cipherparams: {
      name: "AES-GCM",
      length: 256,
    },
    kdfparams: {
      salt: crypto.getRandomValues(new Uint8Array(16)).toString(),
      iterations: 100000,
      hash: "SHA-256",
    },
  };

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: cryptoConfig.kdf },
    false,
    ["deriveKey"],
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: cryptoConfig.kdf,
      salt: new TextEncoder().encode(cryptoConfig.kdfparams.salt),
      iterations: cryptoConfig.kdfparams.iterations,
      hash: cryptoConfig.kdfparams.hash,
    },
    passwordKey,
    {
      name: cryptoConfig.cipherparams.name,
      length: cryptoConfig.cipherparams.length,
    },
    true,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: cryptoConfig.cipherparams.name,
      iv: iv,
    },
    derivedKey,
    originalShare,
  );

  const encryptedShare: Share = {
    version: 1,
    id: crypto.randomUUID(),
    share: {
      total,
      threshold,
      encrypted: true,
      share_sha512: share_sha512,
      secret_sha512: secretHash,
    },
    crypto: {
      ciphertext: bufferToHex(new Uint8Array(encryptedContent)),
      cipherparams: {
        iv: Array.from(iv).toString(),
        ...cryptoConfig.cipherparams,
      },
      kdf: cryptoConfig.kdf,
      kdfparams: cryptoConfig.kdfparams,
    },
    algorithm: "shamir-secret-sharing",
  };

  return encryptedShare;
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  const result = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    const byte = parseInt(hexString.substr(i, 2), 16);
    if (isNaN(byte)) {
      throw new Error("Invalid hex string");
    }
    result[i / 2] = byte;
  }

  return result;
}

async function computeSHA512(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function splitWithPasswordAsStore(
  secret: string,
  password: string,
  total: number,
  threshold: number,
): Promise<Share[]> {
  const secretAsUint8Array = new TextEncoder().encode(secret);
  const shares = await split(secretAsUint8Array, total, threshold);

  const secret_sha512 = await computeSHA512(secretAsUint8Array);

  const encryptedShares: Share[] = [];
  for (let share of shares) {
    const encryptedShare = await encryptShare(
      share,
      password,
      total,
      threshold,
      secret_sha512,
    );
    encryptedShares.push(encryptedShare);
  }

  return encryptedShares;
}

export async function decryptAndCombineWithPassword(
  password: string,
  shares: Share[],
): Promise<string> {
  const decryptedShares = [];
  for (const share of shares) {
    decryptedShares.push(await decryptShareWithPassword(share, password));
  }

  const combinedSecretBuffer = await combine(decryptedShares);

  return new TextDecoder().decode(combinedSecretBuffer);
}