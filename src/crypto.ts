import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";
import { managedNonce, randomBytes } from "@noble/ciphers/webcrypto";
import { scryptAsync } from "@noble/hashes/scrypt";
import { base64urlnopad } from "@scure/base";
import Pako from "pako";

const encryptFn = managedNonce(xchacha20poly1305);
const base64Encode = base64urlnopad.encode;
const base64Decode = base64urlnopad.decode;
const SALT_LENGTH = 32;
export const SALT_HEX_LENGTH = SALT_LENGTH * 2;

export const encryptText = async (contentStr: string, password64: string): Promise<string> => {
  try {
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return base64Encode(encrypted);
  } catch (e) {
    return "";
  }
};

export const decryptText = async (content64: string, password64: string): Promise<string> => {
  try {
    const content = base64Decode(content64);
    const password = base64Decode(password64);
    const cipher = encryptFn(password);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  }
};

export const hashPassword = async (passwordStr: string, saltHex: string): Promise<string> => {
  return base64Encode(await scryptAsync(passwordStr, hexToBytes(saltHex), { N: 2 ** 16, r: 8, p: 2, dkLen: 32 }));
};

export const generateSalt = () => {
  return bytesToHex(randomBytes(SALT_LENGTH));
};
