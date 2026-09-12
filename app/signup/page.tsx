"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user && !data.session) {
      setMessage(
        "Account creato. Controlla la tua email e conferma l’indirizzo prima di accedere."
      );
      return;
    }

    setMessage("Account creato con successo. Ora puoi accedere.");
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-[620px]">
        <Link
          href="/"
          className="inline-block text-3xl font-black tracking-tight"
        >
          bio<span className="text-[#00d084]">linkr</span>
        </Link>

        <section className="mt-24 rounded-[36px] border border-white/10 bg-[#17181e] px-8 py-14 shadow-2xl sm:px-14">
          <p className="text-sm font-bold tracking-[0.28em] text-[#00d084]">
            INIZIA GRATIS
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Crea il tuo account.
          </h1>

          <p className="mt-4 text-lg text-white/60">
            Crea e pubblica la tua prima pagina BioLinkr.
          </p>

          <form className="mt-12 space-y-7" onSubmit={handleSubmit}>
            <label className="block text-lg font-bold">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                required
                className="mt-3 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-6 py-5 text-lg text-white outline-none transition placeholder:text-white/25 focus:border-[#00d084]"
              />
            </label>

            <label className="block text-lg font-bold">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Almeno 6 caratteri"
                minLength={6}
                required
                className="mt-3 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-6 py-5 text-lg text-white outline-none transition placeholder:text-white/25 focus:border-[#00d084]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#00d084] px-6 py-5 text-xl font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creazione in corso..." : "Crea account"}
            </button>

            {message && (
              <p className="text-center text-sm text-white/70">{message}</p>
            )}
          </form>

          <p className="mt-10 text-center text-white/60">
            Hai già un account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#00d084] hover:underline"
            >
              Accedi
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}