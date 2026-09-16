import Link from "next/link";

import IPhonePreview from "./components/IPhonePreview";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="m3 17 6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5" />
      <path d="M12 16V8" />
      <path d="M16 16V4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0c0d12] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-390px] h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[#00d084]/[0.1] blur-[165px]" />
        <div className="absolute right-[-300px] top-[600px] h-[560px] w-[560px] rounded-full bg-[#8b5cf6]/[0.055] blur-[150px]" />
        <div className="absolute left-[-260px] top-[1280px] h-[540px] w-[540px] rounded-full bg-[#00d084]/[0.05] blur-[150px]" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-black tracking-[-0.06em] sm:text-3xl"
        >
          bio<span className="text-[#00d084]">linkr</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-white/60 md:flex">
          <a href="#come-funziona" className="transition hover:text-white">
            Come funziona
          </a>
          <a href="#funzioni" className="transition hover:text-white">
            Funzioni
          </a>
          <a href="#faq" className="transition hover:text-white">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white sm:px-4"
          >
            Accedi
          </Link>

          <Link
            href="/signup"
            className="biolinkr-cta inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d084] px-4 py-2.5 text-sm font-black text-[#07100d] sm:px-5"
          >
            <span className="hidden sm:inline">Inizia gratis</span>
            <span className="sm:hidden">Registrati</span>
            <ArrowUpRight />
          </Link>
        </div>
      </header>

                        {/* HERO */}
      <section className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 overflow-hidden px-4 pb-6 pt-4 sm:px-6 lg:grid-cols-[0.83fr_1.17fr] lg:items-start lg:gap-10 lg:px-8 lg:pb-8 lg:pt-10">
        <div className="relative z-10 max-w-2xl">
          <p className="biolinkr-reveal text-sm font-black tracking-[0.2em] text-[#00d084]">
            IL LINK IN BIO CHE OTTIMIZZA I CLICK
          </p>

          <h1 className="biolinkr-reveal biolinkr-reveal-delay-1 mt-4 text-5xl font-black leading-[0.93] tracking-[-0.078em] text-white sm:text-6xl lg:text-7xl">
            Scopri quale link
            <span className="block text-[#00d084]">
              porta più risultati.
            </span>
          </h1>

          <p className="biolinkr-reveal biolinkr-reveal-delay-2 mt-7 max-w-xl text-lg leading-8 text-white/60 sm:text-xl">
            BioLinkr ti aiuta a capire come le persone usano la tua pagina,
            testare due varianti e mantenere ciò che genera più click.
          </p>

          <div className="biolinkr-reveal biolinkr-reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="biolinkr-cta inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00d084] px-6 py-4 text-base font-black text-[#07100d] hover:bg-[#19e49b]"
            >
              Crea la tua pagina gratis
              <ArrowUpRight />
            </Link>

            <a
              href="#come-funziona"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] px-6 py-4 text-base font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-[#00d084]/55 hover:bg-[#00d084]/10 hover:text-[#5cf0bd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d084] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0d12]"
            >
              Scopri come funziona
              <ArrowRight />
            </a>
          </div>

          <div className="biolinkr-reveal biolinkr-reveal-delay-4 mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-white/45">
            <span className="inline-flex items-center gap-2">
              <span className="text-[#00d084]">
                <CheckIcon />
              </span>
              Nessuna carta richiesta
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-[#00d084]">
                <CheckIcon />
              </span>
              Pronta in pochi minuti
            </span>
          </div>
        </div>

        <div className="relative mx-auto min-w-0 w-full max-w-[820px] lg:mx-0 lg:max-w-none">
          <div className="biolinkr-glow absolute inset-x-[12%] top-[20%] h-[55%] rounded-full bg-[#00d084]/[0.16] blur-[105px]" />

          <div className="biolinkr-experiment-stage relative">
            <div className="biolinkr-float-soft biolinkr-experiment biolinkr-experiment-tilt relative min-w-0 w-full !h-auto !min-h-0 overflow-hidden rounded-[36px] border border-[#8b5cf6]/30 bg-[#121319]/95 px-4 pb-0 pt-4 shadow-[0_35px_100px_rgba(0,0,0,0.52)] backdrop-blur-xl sm:px-6 sm:pb-0 sm:pt-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="biolinkr-live-dot h-2 w-2 rounded-full bg-[#00d084] shadow-[0_0_14px_rgba(0,208,132,0.85)]" />
                    <p className="text-[10px] font-black tracking-[0.16em] text-[#c4b5fd]">
                      A/B TEST IN CORSO
                    </p>
                  </div>
                  <p className="mt-1 text-base font-black tracking-[-0.025em] text-white">
                    Quale CTA porta più click?
                  </p>
                </div>

                <div className="rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-3 py-2 text-right">
                  <p className="text-[9px] font-black tracking-[0.12em] text-[#d7c5ff]/60">
                    TRAFFICO
                  </p>
                  <p className="mt-1 text-xs font-black text-[#d7c5ff]">
                    50% A · 50% B
                  </p>
                  <p className="mt-0.5 text-[9px] font-bold text-white/35">
                    Stesso traffico, risultato diverso
                  </p>
                </div>
              </div>

              <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#00d084]/20 bg-gradient-to-r from-[#00d084]/10 via-[#0c0d12]/80 to-[#8b5cf6]/10 px-4 py-3">
                <div className="absolute right-[-20px] top-[-30px] h-20 w-20 rounded-full bg-[#00d084]/15 blur-2xl" />

                <div className="relative grid items-center gap-4 sm:grid-cols-[1fr_165px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-black tracking-[0.12em] text-[#5cf0bd]">
                        OTTIMIZZAZIONE IN CORSO
                      </span>

                      <span className="rounded-lg border border-[#8b5cf6]/25 bg-[#8b5cf6]/15 px-2 py-1 text-[10px] font-black text-[#e1d5ff]">
                        B IN VANTAGGIO
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-black leading-5 text-white">
                      La variante B genera più click con lo stesso traffico.
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[11px] font-bold">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <span className="h-2 w-2 rounded-full bg-white/45" />
                        Variante A
                      </span>

                      <span className="flex items-center gap-1.5 text-[#e1d5ff]">
                        <span className="h-2 w-2 rounded-full bg-[#c4b5fd]" />
                        Variante B
                      </span>
                    </div>
                  </div>

                  <div className="relative min-w-0">
                    <div className="mb-1 flex justify-end">
                      <span className="biolinkr-energy-badge rounded-lg bg-[#00d084] px-2.5 py-1 text-[10px] font-black text-[#07100d]">
                        +50% CTR
                      </span>
                    </div>

                    <svg
                      viewBox="0 0 165 48"
                      className="h-12 w-full overflow-visible"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="biolinkr-uplift-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.34" />
                          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M2 36 C18 33 28 38 42 34 C56 30 66 36 80 32 C95 29 107 34 121 30 C135 27 149 31 163 27"
                        fill="none"
                        stroke="rgba(255,255,255,0.42)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeDasharray="3 4"
                      />

                      <path
                        d="M2 41 C18 38 28 36 42 32 C57 28 67 24 80 21 C95 18 107 18 121 12 C136 6 149 10 163 4 L163 48 L2 48 Z"
                        fill="url(#biolinkr-uplift-fill)"
                      />

                      <path
                        d="M2 41 C18 38 28 36 42 32 C57 28 67 24 80 21 C95 18 107 18 121 12 C136 6 149 10 163 4"
                        fill="none"
                        stroke="#c4b5fd"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="biolinkr-chart-line"
                      />

                      <circle cx="163" cy="4" r="3.25" fill="#c4b5fd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/95 p-4 sm:p-5">
                    <p className="text-[10px] font-black tracking-[0.15em] text-white/40">
                      COSA STAI TESTANDO
                    </p>
                    <p className="mt-2 text-base font-black tracking-[-0.035em]">
                      Il testo del link principale
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/45">
                      Stesso link, due modi diversi di presentarlo. Vediamo quale porta
                      più persone a cliccare.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-black text-white/65">
                          A
                        </span>
                        <span className="text-[10px] font-black text-white/45">
                          146 click
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-white/75">
                        Guarda il video
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="biolinkr-bar-a h-full w-[45%] rounded-full bg-white/40" />
                      </div>
                      <span className="text-sm font-black text-white/60">5,8%</span>
                    </div>

                    <div className="biolinkr-winner biolinkr-winner-strong relative overflow-hidden rounded-2xl border border-[#a78bfa]/60 bg-gradient-to-br from-[#8b5cf6]/25 to-[#8b5cf6]/[0.08] p-4">
                      <div className="relative flex items-center justify-between">
                        <span className="rounded-lg bg-[#8b5cf6]/30 px-2 py-1 text-[10px] font-black text-[#e9ddff]">
                          B
                        </span>
                        <span className="text-[10px] font-black text-[#e0d1ff]">
                          219 click
                        </span>
                      </div>
                      <p className="relative mt-2 text-sm font-bold text-white">
                        Guarda l'ultimo video
                      </p>
                      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="biolinkr-bar-b-hero h-full w-[70%] rounded-full bg-[#a78bfa]" />
                      </div>
                      <span className="biolinkr-winner-number text-sm font-black text-[#f1ebff]">8,7%</span>
                    </div>
                  </div>

                  <div className="biolinkr-pulse-ring rounded-2xl border border-[#00d084]/25 bg-[#00d084]/12 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#5cf0bd]">
                          La variante B è in vantaggio.
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Più click, stesso traffico.
                        </p>
                      </div>
                      <span className="biolinkr-energy-badge rounded-xl bg-[#00d084] px-3 py-2 text-xs font-black text-[#07100d]">
                        +50% CTR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-start justify-center overflow-hidden lg:block">
  <div className="relative origin-top scale-[0.55] sm:scale-[0.65] lg:scale-[0.72]">
                    <IPhonePreview>
                      <div className="h-full bg-gradient-to-b from-[#123d31] via-[#0c1f1a] to-[#090a0e] px-5 pb-10 pt-20 text-white">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#00d084] to-[#087f59] text-3xl font-black text-[#07100d] shadow-[0_14px_30px_rgba(0,208,132,0.22)]">
                          M
                        </div>

                        <p className="mt-5 text-center text-2xl font-black tracking-[-0.045em]">
                          Marco Live
                        </p>

                        <p className="mt-2 text-center text-sm leading-6 text-white/70">
                          Streaming, contenuti e community.
                        </p>

                        <div className="mt-9 space-y-3">
                          <div className="rounded-2xl bg-[#00d084] px-4 py-4 text-center text-[17px] font-black text-[#07100d] shadow-[0_10px_24px_rgba(0,208,132,0.2)]">
                            Guarda l'ultimo video
                          </div>

                          <div className="rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-4 text-center text-[17px] font-bold text-white">
                            Seguimi su Twitch
                          </div>
                        </div>

                        <div className="mt-7 rounded-2xl border border-[#00d084]/30 bg-[#00d084]/10 p-3 shadow-[0_12px_28px_rgba(0,208,132,0.12)]">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00d084] text-xs font-black text-[#07100d]">
                                ✓
                              </span>
                              <p className="text-xs font-black tracking-[0.08em] text-[#5cf0bd]">
                                OTTIMIZZAZIONE APPLICATA
                              </p>
                            </div>
                            <span className="rounded-lg bg-[#00d084] px-2.5 py-1 text-xs font-black text-[#07100d]">
                              +50% CTR
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                              <p className="text-[9px] font-black tracking-[0.12em] text-white/45">
                                PRIMA
                              </p>
                              <p className="mt-1.5 text-xs font-bold leading-4 text-white/65">
                                Guarda il video
                              </p>
                              <p className="mt-1.5 text-sm font-black text-white/60">
                                5,8%
                                <span className="ml-1 text-[10px] font-bold text-white/40">
                                  CTR
                                </span>
                              </p>
                            </div>

                            <div className="rounded-xl border border-[#00d084]/25 bg-[#00d084]/10 p-2">
                              <p className="text-[9px] font-black tracking-[0.12em] text-[#5cf0bd]">
                                DOPO
                              </p>
                              <p className="mt-1.5 text-xs font-bold leading-4 text-white">
                                Guarda l'ultimo video
                              </p>
                              <p className="mt-1.5 text-sm font-black text-[#5cf0bd]">
                                8,7%
                                <span className="ml-1 text-[10px] font-bold text-[#5cf0bd]/70">
                                  CTR
                                </span>
                              </p>
                            </div>
                          </div>

                          <p className="mt-2.5 text-center text-[10px] font-bold text-white/65">
                            La variante B ora è mostrata al 100% dei visitatori.
                          </p>
                        </div>
                      </div>
                    </IPhonePreview>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMA/DOPO */}
      <section className="border-y border-white/10 bg-white/[0.02] py-14 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
              UN ESEMPIO CONCRETO
            </p>

            <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.055em] sm:text-4xl">
              Prima guardavi i numeri.
              <span className="block text-white/45">
                Ora sai quale decisione prendere.
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
            <article className="rounded-[28px] border border-white/10 bg-[#121319] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-white/35">
                    PRIMA DI
                  </p>
                  <h3 className="mt-1 text-2xl font-black tracking-[-0.05em] text-white/70">
                    BioLinkr
                  </h3>
                </div>
                <span className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-black text-white/45">
                  SENZA TEST
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-white/35">
                    CTR MEDIO
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-[-0.06em] text-white/70">
                      5,8%
                    </p>
                    <p className="text-right text-xs font-bold text-white/40">
                      CTR del link principale
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-white/35">
                    DECISIONE
                  </p>
                  <p className="mt-2 text-base font-black text-white/65">
                    Modifichi i link a intuito
                  </p>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[28px] border border-[#00d084]/35 bg-gradient-to-br from-[#00d084]/15 via-[#121319] to-[#121319] p-6 shadow-[0_25px_60px_rgba(0,208,132,0.08)] sm:p-8">
              <div className="relative flex items-center justify-between border-b border-[#00d084]/20 pb-5">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#5cf0bd]">
                    DOPO
                  </p>
                  <h3 className="mt-1 text-2xl font-black tracking-[-0.05em] text-white">
                    BioLinkr
                  </h3>
                </div>
                <span className="rounded-xl bg-[#00d084] px-3 py-2 text-xs font-black text-[#07100d]">
                  +50% CTR
                </span>
              </div>

              <div className="relative mt-6 space-y-3">
                <div className="rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
                    CTR MEDIO
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-[-0.06em] text-[#5cf0bd]">
                      8,7%
                    </p>
                    <p className="text-right text-xs font-bold text-[#5cf0bd]/70">
                      Dopo aver applicato il test
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
                    DECISIONE
                  </p>
                  <p className="mt-2 text-base font-black text-white">
                    Applichi ciò che funziona
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="border-y border-white/10 bg-[#101116] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
              COME FUNZIONA
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
              Pubblica, testa, migliora.
              <span className="block text-white/45">
                In tre passaggi.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Crea la tua pagina, confronta due versioni dei link importanti e usa i dati
              per scegliere cosa mostrare al tuo pubblico.
            </p>
          </div>

          <div className="relative isolate mt-10 grid gap-4 md:grid-cols-3">
            <article className="biolinkr-card relative rounded-[28px] border border-white/10 bg-[#17181e] p-7">
              <div className="flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  01
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 text-sm font-black text-[#5cf0bd]">
                  1
                </span>
              </div>

              <p className="mt-10 text-[10px] font-black tracking-[0.15em] text-[#00d084]">
                PUBBLICA
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.05em]">
                Crea la tua pagina.
              </h3>

              <p className="mt-3 leading-7 text-white/55">
                Aggiungi i link che vuoi far trovare al tuo pubblico e condividi un
                unico URL nella tua bio.
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00d084] text-sm font-black text-[#07100d]">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-black">marco.live</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      3 link pubblicati
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="biolinkr-card relative rounded-[28px] border border-[#8b5cf6]/25 bg-[#17181e] p-7">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8b5cf6]/12 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  02
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/15 text-sm font-black text-[#d7c5ff]">
                  2
                </span>
              </div>

              <p className="relative mt-10 text-[10px] font-black tracking-[0.15em] text-[#c4b5fd]">
                CONFRONTA
              </p>

              <h3 className="relative mt-3 text-2xl font-black tracking-[-0.05em]">
                Metti una variante alla prova.
              </h3>

              <p className="relative mt-3 leading-7 text-white/55">
                Cambia il titolo o la destinazione di un link. BioLinkr divide il
                traffico tra A e B in modo equilibrato.
              </p>

              <div className="relative mt-7 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-3">
                  <p className="text-[10px] font-black text-white/40">A</p>
                  <p className="mt-2 text-xs font-bold text-white/70">
                    Guarda il video
                  </p>
                </div>

                <div className="rounded-xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/10 p-3">
                  <p className="text-[10px] font-black text-[#d7c5ff]">B</p>
                  <p className="mt-2 text-xs font-bold text-white">
                    Guarda l'ultimo video
                  </p>
                </div>
              </div>
            </article>

            <article className="biolinkr-card relative overflow-hidden rounded-[28px] border border-[#00d084]/30 bg-gradient-to-br from-[#00d084]/12 via-[#17181e] to-[#17181e] p-7">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00d084]/15 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  03
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00d084]/25 bg-[#00d084]/10 text-sm font-black text-[#5cf0bd]">
                  ✓
                </span>
              </div>

              <p className="relative mt-10 text-[10px] font-black tracking-[0.15em] text-[#5cf0bd]">
                MIGLIORA
              </p>

              <h3 className="relative mt-3 text-2xl font-black tracking-[-0.05em]">
                Applica ciò che funziona.
              </h3>

              <p className="relative mt-3 leading-7 text-white/55">
                Guarda CTR e click, individua la variante migliore e rendila il link
                mostrato a tutte le persone.
              </p>

              <div className="relative mt-7 flex items-center justify-between rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
                    VARIANTE B
                  </p>
                  <p className="mt-1 text-sm font-black text-white">
                    Applicata a tutti
                  </p>
                </div>
                <span className="rounded-xl bg-[#00d084] px-3 py-2 text-xs font-black text-[#07100d]">
                  +50% CTR
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FUNZIONI */}
      <section id="funzioni" className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
            TUTTO IL NECESSARIO
          </p>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
            La tua pagina. I tuoi dati. Decisioni migliori.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="biolinkr-card rounded-[28px] border border-white/10 bg-[#17181e] p-7">
            <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
              <TrendIcon />
            </span>

            <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">
              Pagina bio personalizzata
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Costruisci una pagina coerente con il tuo stile e organizza i
              link che vuoi far trovare al tuo pubblico.
            </p>
          </article>

          <article className="biolinkr-card rounded-[28px] border border-white/10 bg-[#17181e] p-7">
            <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
              <CalendarIcon />
            </span>

            <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">
              Link programmati
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Decidi quando un link deve comparire o scomparire dalla tua
              pagina, senza ricordarti di aggiornarla manualmente.
            </p>
          </article>

          <article className="biolinkr-card rounded-[28px] border border-white/10 bg-[#17181e] p-7">
            <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
              <ChartIcon />
            </span>

            <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">
              Analytics e performance
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Osserva click, CTR e fonti di traffico per capire cosa funziona
              e prendere decisioni basate sui dati.
            </p>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10 bg-[#101116] py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
              DOMANDE FREQUENTI
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
              Tutto chiaro.
              <span className="block text-white/45">
                Quasi.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
              Le risposte alle domande più comuni prima di creare la tua pagina
              BioLinkr.
            </p>
          </div>

          <div className="divide-y divide-white/10 rounded-[28px] border border-white/10 bg-[#17181e]">
            <details className="group px-5 py-5 sm:px-7 sm:py-6" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Quanto tempo serve per creare una pagina?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                Pochi minuti. Scegli il nome della pagina, aggiungi i tuoi link e
                condividi un unico URL nella bio dei tuoi social.
              </p>
            </details>

            <details className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Devo saper leggere i dati per usarlo?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                No. BioLinkr mette in evidenza click, CTR, fonti di traffico e
                varianti in vantaggio, così sai subito dove vale la pena intervenire.
              </p>
            </details>

            <details className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Come funziona un A/B test?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                Crei due versioni dello stesso link, per esempio due titoli diversi.
                BioLinkr distribuisce il traffico, confronta i click e ti indica quale
                variante sta ottenendo il risultato migliore.
              </p>
            </details>

            <details className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Serve una carta di credito per iniziare?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                No. Puoi creare la tua pagina BioLinkr e iniziare a configurarla senza
                inserire una carta di credito.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8 lg:pb-16">
        <div className="relative overflow-hidden rounded-[36px] border border-[#00d084]/25 bg-gradient-to-br from-[#00d084]/20 via-[#0f3f31] to-[#17181e] px-7 py-14 sm:px-12 sm:py-20">
          <div className="biolinkr-glow absolute right-[-100px] top-[-180px] h-[400px] w-[400px] rounded-full bg-[#00d084]/20 blur-[100px]" />

          <div className="relative max-w-3xl">
            <p className="text-sm font-black tracking-[0.2em] text-[#5cf0bd]">
              SMETTI DI INDOVINARE
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-6xl">
              Ogni click può insegnarti qualcosa.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Crea la tua pagina BioLinkr, osserva come le persone la usano e
              migliora ciò che conta davvero: il prossimo click.
            </p>

            <Link
              href="/signup"
              className="biolinkr-cta mt-9 inline-flex items-center gap-2 rounded-2xl bg-[#00d084] px-6 py-4 font-black text-[#07100d] hover:bg-[#19e49b]"
            >
              Crea la tua pagina gratis
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-9 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link
          href="/"
          className="text-xl font-black tracking-[-0.06em] text-white"
        >
          bio<span className="text-[#00d084]">linkr</span>
        </Link>

        <p>
          © {new Date().getFullYear()} BioLinkr. Trasforma dati in click
          migliori.
        </p>
      </footer>
    </main>
  );
}