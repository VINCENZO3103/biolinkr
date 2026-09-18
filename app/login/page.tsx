"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
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
            Tutto parte<br />
            <span className="text-[#78f5df]">da un click.</span>
          </h1>

          <p className="mt-6 text-lg text-white/60 opacity-0 animate-[fadeInUp_0.8s_0.25s_ease-out_forwards]">
            BioLinkr non raccoglie semplicemente i tuoi link. Ti aiuta a capire il tuo pubblico, ottimizzare ogni click e trasformare il traffico in risultati.
          </p>

          {/* Mini “features” orientate a CTR / analytics */}
          <ul className="mt-10 space-y-4 text-white/70">
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.35s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
              Scopri cosa funziona. Analizza click, sorgenti, paesi e dispositivi e scopri quali link attirano davvero il tuo pubblico.
            </li>
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.4s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
              Mostra il link giusto alla persona giusta. Usa A/B test e targeting per paese, dispositivo e sorgente per ottimizzare ogni visita.
            </li>
            <li className="flex items-start gap-3 opacity-0 animate-[fadeInUp_0.8s_0.45s_ease-out_forwards]">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d084]" />
              Ottimizza il CTR della tua bio su Instagram, TikTok, YouTube e altri canali.
            </li>
          </ul>
        </div>

        {/* Lato destro: card login */}
        <div className="w-full max-w-[460px]">
          <section className="rounded-[36px] border border-white/10 bg-[#17181e]/80 px-8 py-12 backdrop-blur shadow-2xl transition-all duration-500 ease-out hover:shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:px-12 sm:py-14 opacity-0 animate-[fadeInRight_0.8s_0.2s_ease-out_forwards]">
            <p className="text-sm font-bold tracking-[0.28em] text-[#00d084]">
              BENTORNATO
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Accedi al tuo account
            </h2>

            <p className="mt-3 text-base text-white/60">
              Gestisci la tua pagina BioLinkr, i tuoi link e le tue statistiche.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
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
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="La tua password"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-[#0c0d12] px-5 py-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/25 focus:border-[#00d084] focus:shadow-[0_0_0_3px_rgba(0,208,132,0.15)]"
                />
              </label>

              <div className="flex items-center justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm font-bold text-[#00d084] transition-colors duration-200 hover:text-[#78f5df] hover:underline"
                >
                  Password dimenticata?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-[#00d084] px-6 py-4 text-base font-black text-[#07100d] transition-all duration-300 hover:bg-[#19e49b] hover:shadow-[0_12px_40px_rgba(0,208,132,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Accesso in corso..." : "Accedi"}
                </span>
                {/* Effetto hover “shine” */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </button>

              {message && (
                <p className="text-center text-sm text-red-400 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
                  {message}
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
              Non hai ancora un account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#00d084] transition-colors duration-200 hover:text-[#78f5df] hover:underline"
              >
                Crea account
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
              Più click. Più risultati.
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