import { decryptText, encryptText, hashPassword } from "@/crypto.js";
import { createStore } from "solid-js/store";

const STORAGE_KEY = "store";

export type StoreSecret = {
  id?: string;
  name?: string;
  secret?: string;
};

type Store = {
  secrets: StoreSecret[];
  password: string;
};

const getRawFromStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

export const [store, setStore] = createStore<Store>({
  secrets: [],
  password: "",
});

export const setSecrets = async (input: StoreSecret[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, await encryptText(JSON.stringify(input), store.password));
  } catch {}
  setStore("secrets", input);
};

export const addSecret = async (input: StoreSecret) => {
  const result = [...store.secrets, input];
  await setSecrets(result);
};

export const deleteSecret = async (id: string) => {
  const result = store.secrets.filter((item) => item.id !== id);
  await setSecrets(result);
};

export const decryptSecrets = async (password: string): Promise<boolean> => {
  try {
    const hashed = await hashPassword(password);
    if (!getRawFromStorage()) {
      setStore("password", hashed);
      return true;
    }
    const result = await decryptText(getRawFromStorage() || "", hashed);
    if (!result) return false;
    setStore("password", hashed);
    setStore("secrets", JSON.parse(result));
    return true;
  } catch (e) {
    return false;
  }
};
