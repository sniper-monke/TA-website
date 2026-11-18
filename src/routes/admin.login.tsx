import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { adminLogin } from "@/lib/admin";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Field, ErrorNotice } from "@/reference/components/Forms";

export const Route = createFileRoute("/admin/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await adminLogin({ data: { email, password } });
      await navigate({ to: "/admin" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="login-page shell">
      <div className="login-photo">
        <img src="/images/timber-detail.webp" alt="Timber slat detail" />
        <p>
          Behind the
          <br />
          <em>good sound.</em>
        </p>
      </div>
      <form onSubmit={submit} className="login-form" data-testid="admin-login-form">
        <LockKeyhole size={24} strokeWidth={1} />
        <p className="label-eyebrow">Timber Acoustics / Team</p>
        <h1>Welcome back.</h1>
        <Field
          multiline={false}
          id="admin-login-email"
          label="Email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        />
        <Field
          multiline={false}
          id="admin-login-password"
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
        />
        <ErrorNotice id="admin-login-error">{error}</ErrorNotice>
        <button disabled={busy} data-testid="admin-login-submit" className="action-button">
          {busy ? "Signing in…" : "Enter the workspace"} <ArrowRight size={16} />
        </button>
      </form>
    </section>
  );
}
