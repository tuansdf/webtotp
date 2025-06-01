import { decryptText, encryptText, generateSalt, hashPassword, SALT_HEX_LENGTH } from "@/crypto.js";
import { createSignal } from "solid-js";

const STORAGE_KEY = "store";

export type StoreSecret = {
  id?: string;
  name?: string;
  secret?: string;
};

const getRawFromStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

const [password, setPassword] = createSignal<string>("");
const [salt, setSalt] = createSignal<string>("");
export const [ok, setOk] = createSignal<boolean>(false);
export const [secrets, setSecrets] = createSignal<StoreSecret[]>([]);

const setSecretsAndStore = async (input: StoreSecret[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, (await encryptText(JSON.stringify(input), password())) + salt());
  } catch {}
  setSecrets(input);
};

export const addSecret = async (input: StoreSecret) => {
  const result = [...secrets(), input];
  await setSecretsAndStore(result);
};

export const deleteSecret = async (id: string) => {
  const result = secrets().filter((item) => item.id !== id);
  await setSecretsAndStore(result);
};

export const decryptSecrets = async (rawPassword: string): Promise<boolean> => {
  try {
    const raw = getRawFromStorage();
    if (!raw) {
      const salt = generateSalt();
      setPassword(await hashPassword(rawPassword, salt));
      setSalt(salt);
      setOk(true);
      return true;
    }
    const salt = raw.slice(SALT_HEX_LENGTH * -1);
    const hashed = await hashPassword(rawPassword, salt);
    const result = await decryptText(raw.slice(0, SALT_HEX_LENGTH * -1), hashed);
    if (!result) return false;
    setPassword(hashed);
    setSalt(salt);
    setOk(true);
    setSecrets(JSON.parse(result));
    return true;
  } catch (e) {
    return false;
  }
};
