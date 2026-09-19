"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Inserisci il tuo indirizzo email.");
      setMessage("");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const redirectTo = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(
        error.message ||
          "Non è stato possibile inviare il link per reimpostare la password."
      );
      return;
    }

    setMessage(
      "Se esiste un account associato a questa email, riceverai a breve un link per reimpostare la password."
    );
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
            Recupero account
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
            Password dimenticata?
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            Inserisci l’email associata al tuo account. Ti invieremo un link
            sicuro per scegliere una nuova password.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-sm font-bold text-white/85">
              Indirizzo email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@email.com"
                disabled={loading}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#00d084] px-5 py-3.5 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Invio del link..." : "Invia link di recupero"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Ricordi la password?{" "}
            <Link
              href="/login"
              className="font-bold text-[#00d084] transition hover:text-[#5cf0bd]"
            >
              Accedi
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}