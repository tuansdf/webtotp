import { addSecret } from "@/store.ts";
import { A, useNavigate } from "@solidjs/router";
import { nanoid } from "nanoid";
import { createSignal } from "solid-js";

export default function AddPage() {
  const navigate = useNavigate();
  const [name, setName] = createSignal("");
  const [secret, setSecret] = createSignal("");

  const handleSubmit = () => {
    if (!name || !secret) return;
    addSecret({
      id: nanoid(8),
      name: name(),
      secret: secret(),
    });
    navigate("/");
  };

  return (
    <>
      <div class="main">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <header class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="fs-4 m-0">Add TOTP</h1>
            <div>
              <A href="/" class="me-3">
                Home
              </A>
              <span>Add</span>
            </div>
          </header>
          <label class="form-label w-100">
            Name
            <input required class="form-control" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
          </label>
          <label class="form-label w-100 mb-3">
            Secret
            <input required class="form-control" value={secret()} onInput={(e) => setSecret(e.currentTarget.value)} />
          </label>
          <button class="btn btn-primary">Add</button>
        </form>
      </div>
    </>
  );
}
