import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { managedNonce } from "@noble/ciphers/webcrypto";
import { scryptAsync } from "@noble/hashes/scrypt";
import { base64urlnopad } from "@scure/base";
import Pako from "pako";

const encryptFn = managedNonce(xchacha20poly1305);
const base64Encode = base64urlnopad.encode;
const base64Decode = base64urlnopad.decode;

export const encryptText = async (contentStr: string, password64: string): Promise<string> => {
  const start = performance.now();
  try {
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return base64Encode(encrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("EPERF: " + (performance.now() - start) + " ms");
  }
};

export const decryptText = async (content64: string, password64: string): Promise<string> => {
  const start = performance.now();
  try {
    const content = base64Decode(content64);
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  } finally {
    console.info("DPERF: " + (performance.now() - start) + " ms");
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return base64Encode(await scryptAsync(password, "hahahahehehehihihi", { N: 2 ** 16, r: 8, p: 1, dkLen: 32 }));
};
