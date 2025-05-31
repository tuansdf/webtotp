import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";
import { managedNonce } from "@noble/ciphers/webcrypto";
import Pako from "pako";

const encryptFn = managedNonce(xchacha20poly1305);

export const encryptText = async (contentStr: string, passwordHex: string): Promise<string> => {
  const start = performance.now();
  try {
    const password = hexToBytes(passwordHex);
    const cipher = encryptFn(password);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return bytesToHex(encrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("EPERF: " + (performance.now() - start) + " ms");
  }
};

export const decryptText = async (contentHex: string, passwordHex: string): Promise<string> => {
  const start = performance.now();
  try {
    const content = hexToBytes(contentHex);
    const password = hexToBytes(passwordHex);
    const cipher = encryptFn(password);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  } finally {
    console.info("DPERF: " + (performance.now() - start) + " ms");
  }
};
