import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Field, ErrorNotice } from "@/reference/components/Forms";

export const Route = createFileRoute("/admin/login")({ component: Login });

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    setError("Team sign-in is not configured on this preview.");
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
        <button data-testid="admin-login-submit" className="action-button">
          Enter the workspace <ArrowRight size={16} />
        </button>
      </form>
    </section>
  );
}
