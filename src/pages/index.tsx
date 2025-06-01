import { deleteSecret, secrets, StoreSecret } from "@/store.ts";
import { A } from "@solidjs/router";
import { TOTP, URI } from "otpauth";
import { createSignal, For, onCleanup } from "solid-js";

export default function IndexPage() {
  return (
    <div>
      <header class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="fs-4 m-0">TOTP</h1>
        <div>
          <span class="me-3">Home</span>
          <A href="/add">Add</A>
        </div>
      </header>
      <For each={secrets()}>
        {(secret) => {
          return <Item secret={secret} />;
        }}
      </For>
    </div>
  );
}

const Item = (props: { secret: StoreSecret }) => {
  const [copied, setCopied] = createSignal<boolean>(false);
  const [deleted, setDeleted] = createSignal<boolean>(false);
  const [value, setValue] = createSignal("");
  const [time, setTime] = createSignal("");

  let copiedDeb: ReturnType<typeof setTimeout> | null = null;
  let deletedDeb: ReturnType<typeof setTimeout> | null = null;

  const otpFn = createOtp(props.secret.secret || "");

  const handleLoad = () => {
    setValue(otpFn.generateToken());
    setTime(String(otpFn.getRemainingTime()));
  };
  handleLoad();
  const intervalRef = setInterval(() => {
    handleLoad();
  }, 1000);

  onCleanup(() => {
    clearInterval(intervalRef);
  });

  return (
    <div class="alert alert-dark d-flex align-items-center">
      <div
        class="d-flex justify-content-center align-items-center me-3 fs-4 fw-semibold flex-shrink-0"
        style={{ width: "3rem", "line-height": 1, "margin-top": "-6px" }}
      >
        {time()}
      </div>
      <div class="w-100">
        <div class="w-100 text-break">{props.secret.name}</div>
        <div class="d-flex justify-content-between align-items-end w-100">
          <div class="fs-1 fw-bold" style={{ "line-height": 1.2 }}>
            {value()}
          </div>
          <div class="d-flex align-items-center gap-3">
            <button
              class="btn btn-primary btn-sm fw-semibold"
              disabled={copied()}
              onClick={() => {
                navigator.clipboard.writeText(value());
                setCopied(true);
                if (copiedDeb) {
                  clearTimeout(copiedDeb);
                }
                copiedDeb = setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            >
              {copied() ? "Copied" : "Copy"}
            </button>
            <button
              class="btn btn-danger btn-sm fw-semibold"
              onClick={async () => {
                if (deleted()) {
                  await deleteSecret(props.secret.id || "");
                }
                setDeleted(true);
                if (deletedDeb) {
                  clearTimeout(deletedDeb);
                }
                deletedDeb = setTimeout(() => {
                  setDeleted(false);
                }, 1000);
              }}
            >
              {deleted() ? "Confirm?" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const createOtp = (secret: string) => {
  let totp: TOTP;
  try {
    if (secret.startsWith(`otpauth://totp`)) {
      totp = URI.parse(secret) as TOTP;
    } else {
      totp = new TOTP({
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret,
        issuer: "",
        issuerInLabel: false,
        label: "",
      });
    }
  } catch {
    totp = new TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret,
      issuer: "",
      issuerInLabel: false,
      label: "",
    });
  }
  return {
    generateToken: () => totp.generate(),
    getRemainingTime: () => {
      return totp.period - (Math.floor(Date.now() / 1000) % totp.period);
    },
    period: totp.period,
    issuer: totp.issuer,
    label: totp.label,
  };
};
