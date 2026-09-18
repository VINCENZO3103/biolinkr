"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanDisplayName = displayName.trim() || cleanUsername;

    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      setMessage(
        "Username: 3-30 caratteri, solo lettere minuscole, numeri e _"
      );
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          displayname: cleanDisplayName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessage("Non è stato possibile creare l'account. Riprova.");
      return;
    }

    if (!data.session) {
      setMessage(
        "Account creato. Controlla la tua email, conferma l'indirizzo e poi accedi."
      );
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0d12] text-white">
      {/* Sfondo decorativo animato */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradiente di base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0d12] via-[#0f1118] to-[#0b2a26]" />

        {/* Luci / glow animati */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#00d084]/10 blur-3xl transition-transform duration-[3000ms] ease-in-out hover:scale-110" />
        <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#40e0d0]/10 blur-3xl transition-transform duration-[3000ms] ease-in-out hover:scale-110" />

        {/* Pattern astratto “link / nodi” */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0,208,132,0.6) 1px, transparent 1px),
              radial-gradient(circle at 70% 40%, rgba(64,224,208,0.6) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(0,208,132,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px, 52px 52px, 56px 56px',
            backgroundPosition: '0 0, 10px 20px, 20px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10 lg:justify-between lg:px-10">
        {/* Lato sinistro: branding + copy orientato a CTR / traffico */}
        <div className="hidden max-w-xl lg:block">
          <Link
            href="/"
            className="inline-block text-3xl font-black tracking-tight text-white opacity-0 transition-all duration-700 ease-out hover:text-[#78f5df] animate-[fadeIn_0.7s_ease-out_forwards]"
          >
            bio<span className="text-[#00d084]">linkr</span>
          </Link>

          <h1 className="mt-14 text-5xl font-black leading-tight text-white opacity-0 sm:text-6xl animate-[fadeInUp_0.8s_0.15s_ease-out_forwards]">
            Inizia a crescere.<br />
            <span className="text-[#78f5df]">Un click alla volta.</span>
          </h1>

          <p className="mt-6 text-lg text-white/60 opacity-0 animate-[fadeInUp_0.8s_0.25s_ease-out_forwards]">
            Crea il tuo BioLinkr e trasforma il tuo link in bio in uno strumento di crescita. Scopri cosa funziona, raggiungi meglio il tuo pubblico e ottieni di più da ogni visita.
          </p>

          {/* Mini “features” orientate a CTR / analytics */}
          <ul className="mt-10 space-y-4 text-white/70">
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.35s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
Conosci il tuo pubblico. Analizza click, sorgenti, paesi e dispositivi e scopri quali contenuti funzionano meglio.
            </li>
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.4s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
Testa e targetizza. Confronta diverse varianti e mostra i link più rilevanti in base a paese, dispositivo e sorgente.
            </li>
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.45s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
Trasforma il traffico in risultati. Ottimizza la tua bio per ottenere più click, follower, clienti e opportunità.Trasforma il traffico in risultati. Ottimizza la tua bio per ottenere più click, follower, clienti e opportunità.
            </li>
          </ul>
        </div>

        {/* Lato destro: card signup */}
        <div className="w-full max-w-[480px]">
          <section className="rounded-[36px] border border-white/10 bg-[#17181e]/80 px-8 py-10 backdrop-blur shadow-2xl transition-all duration-500 ease-out hover:shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:px-12 sm:py-12 opacity-0 animate-[fadeInRight_0.8s_0.2s_ease-out_forwards]">
            <p className="text-sm font-bold tracking-[0.28em] text-[#00d084]">
              INIZIA GRATIS
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Crea il tuo account
            </h2>

            <p className="mt-3 text-base text-white/60">
              Crea la tua prima pagina BioLinkr e inizia a ottimizzare i click.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-base font-bold">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-5 py-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[#00d084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.15)]"
                />
              </label>

              <label className="block text-base font-bold">
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="tuo_username"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-5 py-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[#00d084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.15)]"
                />
                <span className="mt-2 block text-sm text-white/50">
                  3-30 caratteri, solo lettere minuscole, numeri e underscore.
                </span>
              </label>

              <label className="block text-base font-bold">
                Nome visualizzato (opzionale)
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Il tuo nome o brand"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-5 py-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[#00d084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.15)]"
                />
              </label>

              <label className="block text-base font-bold">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Almeno 6 caratteri"
                  minLength={6}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-5 py-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[#00d084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.15)]"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-[#00d084] px-6 py-4 text-base font-black text-[#07100d] transition-all duration-300 hover:bg-[#19e49b] hover:shadow-[0_12px_40px_rgba(0,208,132,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Creazione in corso..." : "Crea account"}
                </span>
                {/* Effetto hover “shine” */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </button>

              {message && (
                <p
                  className={`text-center text-sm opacity-0 animate-[fadeIn_0.4s_ease-out_forwards] ${
                    message.toLowerCase().includes("account creato")
                      ? "text-[#00d084]"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
              Hai già un account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#00d084] transition-colors duration-200 hover:text-[#78f5df] hover:underline"
              >
                Accedi
              </Link>
            </p>
          </section>

          {/* Mobile: logo + mini copy */}
          <div className="mt-8 text-center lg:hidden">
            <Link
              href="/"
              className="inline-block text-2xl font-black tracking-tight text-white opacity-0 animate-[fadeIn_0.7s_0.2s_ease-out_forwards]"
            >
              bio<span className="text-[#00d084]">linkr</span>
            </Link>
            <p className="mt-3 text-sm text-white/60 opacity-0 animate-[fadeIn_0.7s_0.3s_ease-out_forwards]">
              Inizia a crescere. Un click alla volta.
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes per animazioni custom */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(14px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}