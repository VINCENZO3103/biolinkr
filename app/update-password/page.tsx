"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkRecoverySession() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setErrorMessage(
          "Questo link di recupero non è valido oppure è scaduto. Richiedine uno nuovo."
        );
      }

      setCheckingSession(false);
    }

    void checkRecoverySession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setErrorMessage("La nuova password deve contenere almeno 8 caratteri.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Le due password non coincidono.");
      setMessage("");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(
        error.message ||
          "Non è stato possibile aggiornare la password. Richiedi un nuovo link."
      );
      return;
    }

    setMessage("Password aggiornata con successo. Verrai reindirizzato al login.");

    window.setTimeout(() => {
      router.replace("/login");
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col justify-center">
        <Link
          href="/"
          className="mb-10 text-center text-3xl font-black tracking-tight text-white/65 transition hover:text-white"
        >
          bio<span className="text-[#00d084]">linkr</span>
        </Link>

        <section className="rounded-3xl border border-white/10 bg-[#17181e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00d084]">
            Sicurezza account
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
            Scegli una nuova password
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            Inserisci una password nuova e sicura per il tuo account BioLinkr.
          </p>

          {checkingSession ? (
            <div className="mt-7 rounded-xl border border-white/10 bg-[#0c0d12] px-4 py-4 text-center text-sm text-white/55">
              Verifica del link di recupero...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block text-sm font-bold text-white/85">
                Nuova password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Almeno 8 caratteri"
                  disabled={loading || Boolean(errorMessage && !password)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 transition focus:border-[#00d084] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block text-sm font-bold text-white/85">
                Conferma nuova password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ripeti la nuova password"
                  disabled={loading || Boolean(errorMessage && !password)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 transition focus:border-[#00d084] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              {errorMessage && (
                <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </p>
              )}

              {message && (
                <p className="rounded-xl border border-[#00d084]/25 bg-[#00d084]/10 px-4 py-3 text-sm text-[#9bf5ce]">
                  {message}
                </p>
              )}

              {!errorMessage && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#00d084] px-5 py-3.5 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Aggiornamento..." : "Aggiorna password"}
                </button>
              )}
            </form>
          )}

          <p className="mt-6 text-center text-sm text-white/50">
            <Link
              href="/reset-password"
              className="font-bold text-[#00d084] transition hover:text-[#5cf0bd]"
            >
              Richiedi un nuovo link
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}