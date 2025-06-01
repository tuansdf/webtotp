import { Router } from "@/router.tsx";
import { decryptSecrets, ok } from "@/store.js";
import { createSignal, Match, Show, Switch } from "solid-js";

export default function App() {
  const [passwordInput, setPasswordInput] = createSignal<string>("");
  const [passwordError, setPasswordError] = createSignal<boolean>(false);
  const [loading, setLoading] = createSignal<boolean>(false);

  return (
    <>
      <main class="main">
        <Switch>
          <Match when={!ok()}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 100));
                  setPasswordError(false);
                  const ok = await decryptSecrets(passwordInput());
                  if (!ok) {
                    setPasswordError(true);
                  }
                  setPasswordInput("");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <label class="d-block">
                Please enter your password to access your vault
                <input
                  required
                  minLength={8}
                  placeholder="Password"
                  type="password"
                  class="form-control w-100 mt-2"
                  onInput={(e) => setPasswordInput(e.currentTarget.value)}
                />
              </label>
              <div class="d-flex justify-content-end">
                <button class="btn btn-primary mt-3" type="submit">
                  Submit
                </button>
              </div>
              <Show when={passwordError()}>
                <div class="alert alert-danger mt-3">Incorrect password</div>
              </Show>
            </form>
          </Match>
          <Match when>
            <Router />
          </Match>
        </Switch>
      </main>
      <Show when={loading()}>
        <ScreenLoading />
      </Show>
    </>
  );
}

const ScreenLoading = () => {
  return (
    <div class="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center bg-black opacity-50">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
