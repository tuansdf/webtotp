import { createStore } from "solid-js/store";

const STORAGE_KEY = "secrets";

export type StoreSecret = {
  id?: string;
  name?: string;
  secret?: string;
};

type Store = {
  secrets: StoreSecret[];
};

const getSecretsFromStorage = () => {
  try {
    const secrets = localStorage.getItem(STORAGE_KEY);
    if (!secrets) return [];
    return JSON.parse(secrets) as StoreSecret[];
  } catch (e) {
    return [];
  }
};

export const [store, setStore] = createStore<Store>({
  secrets: getSecretsFromStorage(),
});

export const setSecrets = (input: StoreSecret[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch {}
  setStore("secrets", input);
};

export const addSecret = (input: StoreSecret) => {
  const result = [...store.secrets, input];
  setSecrets(result);
};

export const deleteSecret = (id: string) => {
  const result = store.secrets.filter((item) => item.id !== id);
  setSecrets(result);
};
