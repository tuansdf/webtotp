import { createStore } from "solid-js/store";

const StorageKey = "secrets";

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
    const secrets = localStorage.getItem(StorageKey);
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
    localStorage.setItem(StorageKey, JSON.stringify(input));
  } catch {}
  setStore("secrets", input);
};

export const addSecret = (input: StoreSecret) => {
  const result = [...store.secrets, input];
  setSecrets(result);
};

export const deleteSecret = (id: string) => {
  const result = store.secrets.filter((item) => item.id !== id);
  console.log(result)
  setSecrets(result);
};
