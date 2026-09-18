import Link from "next/link";

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

function TargetIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

function LinkIcon() {
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
      <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
    </svg>
  );
}

function LayoutIcon() {
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ProBadge() {
  return (
    <span className="rounded-full border border-[#00d084]/20 bg-[#00d084]/10 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
      PRO
    </span>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0c0d12] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-390px] h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[#00d084]/[0.1] blur-[165px]" />
        <div className="absolute right-[-300px] top-[500px] h-[560px] w-[560px] rounded-full bg-[#8b5cf6]/[0.06] blur-[150px]" />
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
            className="biolinkr-cta inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d084] px-4 py-2.5 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] sm:px-5"
          >
            <span className="hidden sm:inline">Inizia gratis</span>
            <span className="sm:hidden">Registrati</span>
            <ArrowUpRight />
          </Link>
        </div>
      </header>

      {/* HERO — invariato */}
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10 max-w-2xl">
          <p className="biolinkr-reveal text-sm font-black tracking-[0.2em] text-[#00d084]">
            IL LINK IN BIO CHE OTTIMIZZA I CLICK
          </p>

          <h1 className="biolinkr-reveal biolinkr-reveal-delay-1 mt-4 text-5xl font-black leading-[0.93] tracking-[-0.078em] text-white sm:text-6xl lg:text-7xl">
            Smetti di
            <span className="block text-[#00d084]">indovinare.</span>
            <span className="block">Inizia a ottimizzare.</span>
          </h1>

          <p className="biolinkr-reveal biolinkr-reveal-delay-2 mt-7 max-w-xl text-lg leading-8 text-white/60 sm:text-xl">
            BioLinkr trasforma la tua pagina in uno strumento per capire il
            traffico, aumentare il CTR e mostrare il contenuto più rilevante a
            ogni visitatore.
          </p>

          <div className="biolinkr-reveal biolinkr-reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="biolinkr-cta inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00d084] px-6 py-4 text-base font-black text-[#07100d] transition hover:bg-[#19e49b]"
            >
              Crea la tua pagina gratis
              <ArrowUpRight />
            </Link>

            <a
              href="#come-funziona"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] px-6 py-4 text-base font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-[#00d084]/55 hover:bg-[#00d084]/10 hover:text-[#5cf0bd]"
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
              Pagina pronta in pochi minuti
            </span>
          </div>
        </div>

        {/* DEMO HERO — invariata */}
        <div className="relative min-w-0">
          <div className="biolinkr-glow absolute inset-x-[8%] top-[12%] h-[62%] rounded-full bg-[#00d084]/[0.14] blur-[100px]" />

          <div className="biolinkr-float-soft relative overflow-hidden rounded-[36px] border border-[#8b5cf6]/30 bg-[#121319]/95 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.52)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="biolinkr-live-dot h-2 w-2 rounded-full bg-[#00d084] shadow-[0_0_14px_rgba(0,208,132,0.85)]" />
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#c4b5fd]">
                    A/B TEST IN CORSO
                  </p>
                </div>

                <p className="mt-2 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
                  Quale CTA porta più click?
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Stesso traffico, due varianti. I dati ti aiutano a decidere.
                </p>
              </div>

              <div className="rounded-2xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-4 py-3 text-right">
                <p className="text-[9px] font-black tracking-[0.12em] text-[#d7c5ff]/60">
                  DISTRIBUZIONE
                </p>

                <p className="mt-1 text-sm font-black text-[#d7c5ff]">
                  50% A · 50% B
                </p>

                <p className="mt-1 text-[10px] font-bold text-white/35">
                  Risultato aggiornato in tempo reale
                </p>
              </div>
            </div>

            <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-2">
              <article className="grid min-h-[290px] grid-rows-[auto_1fr_auto] rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-black text-white/70">
                    VARIANTE A
                  </span>

                  <span className="text-xs font-bold text-white/40">
                    146 click
                  </span>
                </div>

                <div className="pt-7">
                  <p className="min-h-[48px] text-lg font-black leading-6 text-white/80">
                    Guarda il video
                  </p>

                  <p className="mt-2 min-h-[40px] text-sm leading-5 text-white/45">
                    CTA generica mostrata al pubblico.
                  </p>
                </div>

                <div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[45%] rounded-full bg-white/40" />
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-3xl font-black tracking-[-0.06em] text-white/70">
                      5,8%
                    </p>

                    <span className="text-xs font-bold text-white/40">
                      CTR
                    </span>
                  </div>
                </div>
              </article>

              <article className="grid min-h-[290px] grid-rows-[auto_1fr_auto] rounded-3xl border border-[#a78bfa]/60 bg-gradient-to-br from-[#8b5cf6]/25 to-[#8b5cf6]/[0.08] p-5 shadow-[0_18px_45px_rgba(139,92,246,0.16)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-[#8b5cf6]/30 px-3 py-1.5 text-xs font-black text-[#f1ebff]">
                    VARIANTE B
                  </span>

                  <span className="text-xs font-bold text-[#e0d1ff]">
                    219 click
                  </span>
                </div>

                <div className="pt-7">
                  <p className="min-h-[48px] text-lg font-black leading-6 text-white">
                    Guarda l&apos;ultimo video
                  </p>

                  <p className="mt-2 min-h-[40px] text-sm leading-5 text-[#e0d1ff]/65">
                    CTA specifica e orientata al contenuto.
                  </p>
                </div>

                <div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[70%] rounded-full bg-[#a78bfa]" />
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-3xl font-black tracking-[-0.06em] text-[#f1ebff]">
                      8,7%
                    </p>

                    <span className="text-xs font-bold text-[#e0d1ff]">
                      CTR
                    </span>
                  </div>
                </div>
              </article>
            </div>

            <div className="biolinkr-pulse-ring mt-4 flex flex-col gap-4 rounded-2xl border border-[#00d084]/25 bg-[#00d084]/12 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#5cf0bd]">
                  La variante B è in vantaggio.
                </p>

                <p className="mt-1 text-xs text-white/50">
                  Più click con lo stesso numero di visitatori.
                </p>
              </div>

              <span className="biolinkr-energy-badge w-fit rounded-xl bg-[#00d084] px-4 py-2.5 text-sm font-black text-[#07100d]">
                +50% CTR
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="relative overflow-hidden rounded-3xl border border-[#00d084]/25 bg-[#0c0d12]/60 p-5">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#00d084]/10 blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-3 text-[#5cf0bd]">
                    <TargetIcon />
                  </span>
                  <ProBadge />
                </div>

                <h3 className="relative mt-5 text-lg font-black tracking-[-0.04em]">
                  Targeting avanzato
                </h3>

                <p className="relative mt-2 text-sm leading-6 text-white/55">
                  Mostra il link più rilevante in base a paese, dispositivo e
                  sorgente del traffico.
                </p>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-white/60">
                    Italia
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-white/60">
                    Mobile
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-white/60">
                    Instagram
                  </span>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-3xl border border-[#8b5cf6]/25 bg-[#0c0d12]/60 p-5">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#8b5cf6]/10 blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex rounded-2xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-3 text-[#d7c5ff]">
                    <CalendarIcon />
                  </span>

                  <span className="rounded-full border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-3 py-1 text-[10px] font-black tracking-[0.12em] text-[#d7c5ff]">
                    PRO
                  </span>
                </div>

                <h3 className="relative mt-5 text-lg font-black tracking-[-0.04em]">
                  Link intelligenti
                </h3>

                <p className="relative mt-2 text-sm leading-6 text-white/55">
                  Programma i tuoi link, gestisci le priorità e fai comparire la
                  CTA giusta nel momento più utile.
                </p>

                <div className="relative mt-4 rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black text-[#d7c5ff]">
                      NUOVO VIDEO
                    </span>

                    <span className="text-xs font-bold text-[#d7c5ff]/70">
                      Live oggi
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[72%] rounded-full bg-[#a78bfa]" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMA / DOPO — più compatta */}
      <section className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-14 lg:py-16">
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

          <div className="mx-auto mt-7 grid max-w-5xl gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
            <article className="rounded-[28px] border border-white/10 bg-[#121319] p-5 sm:p-6 lg:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-white/35">
                    PRIMA
                  </p>
                  <h3 className="mt-1 text-xl font-black tracking-[-0.05em] text-white/70 sm:text-2xl">
                    Senza BioLinkr
                  </h3>
                </div>

                <span className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-black text-white/45">
                  A INTUITO
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-white/35">
                    CTR MEDIO
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-[-0.06em] text-white/70">
                      5,8%
                    </p>

                    <p className="text-right text-xs font-bold text-white/40">
                      Link principale
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-white/35">
                    DECISIONE
                  </p>

                  <p className="mt-2 text-base font-black text-white/65">
                    Modifichi i link a intuito.
                  </p>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[28px] border border-[#00d084]/35 bg-gradient-to-br from-[#00d084]/15 via-[#121319] to-[#121319] p-5 shadow-[0_25px_60px_rgba(0,208,132,0.08)] sm:p-6 lg:p-7">
              <div className="relative flex items-center justify-between border-b border-[#00d084]/20 pb-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#5cf0bd]">
                    DOPO
                  </p>

                  <h3 className="mt-1 text-xl font-black tracking-[-0.05em] text-white sm:text-2xl">
                    Con BioLinkr
                  </h3>
                </div>

                <span className="rounded-xl bg-[#00d084] px-3 py-2 text-xs font-black text-[#07100d]">
                  TEST COMPLETATO
                </span>
              </div>

              <div className="relative mt-5 space-y-3">
                <div className="rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
                    CTR MEDIO
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-[-0.06em] text-[#5cf0bd]">
                      8,7%
                    </p>

                    <p className="text-right text-xs font-bold text-[#5cf0bd]/70">
                      Dopo il test
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 p-4">
                  <p className="text-[10px] font-black tracking-[0.12em] text-[#5cf0bd]">
                    DECISIONE
                  </p>

                  <p className="mt-2 text-base font-black text-white">
                    Applichi ciò che funziona.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section
        id="come-funziona"
        className="border-y border-white/10 bg-[#101116] py-12 sm:py-14 lg:py-16"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
              COME FUNZIONA
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
              Pubblica, testa, migliora.
              <span className="block text-white/45">In tre passaggi.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Trasforma una semplice pagina link in un sistema che ti aiuta a
              capire il traffico e ottimizzare ogni visita.
            </p>
          </div>

          <div className="relative isolate mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
            <article className="biolinkr-card relative rounded-[28px] border border-white/10 bg-[#17181e] p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  01
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 text-sm font-black text-[#5cf0bd]">
                  1
                </span>
              </div>

              <p className="mt-8 text-[10px] font-black tracking-[0.15em] text-[#00d084] sm:mt-10">
                PUBBLICA
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.05em]">
                Crea la tua pagina.
              </h3>

              <p className="mt-3 leading-7 text-white/55">
                Aggiungi i link importanti, organizza la tua bio e condividi un
                unico URL su tutti i tuoi canali.
              </p>
            </article>

            <article className="biolinkr-card relative rounded-[28px] border border-[#8b5cf6]/25 bg-[#17181e] p-6 sm:p-7">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8b5cf6]/12 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  02
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/15 text-sm font-black text-[#d7c5ff]">
                  2
                </span>
              </div>

              <p className="relative mt-8 text-[10px] font-black tracking-[0.15em] text-[#c4b5fd] sm:mt-10">
                CONFRONTA
              </p>

              <h3 className="relative mt-3 text-2xl font-black tracking-[-0.05em]">
                Testa due versioni.
              </h3>

              <p className="relative mt-3 leading-7 text-white/55">
                Confronta titoli, CTA o destinazioni del link. BioLinkr divide
                il traffico e misura quale variante riceve più click.
              </p>
            </article>

            <article className="biolinkr-card relative overflow-hidden rounded-[28px] border border-[#00d084]/30 bg-gradient-to-br from-[#00d084]/12 via-[#17181e] to-[#17181e] p-6 sm:p-7">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00d084]/15 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <span className="text-5xl font-black tracking-[-0.09em] text-white/[0.08]">
                  03
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00d084]/25 bg-[#00d084]/10 text-sm font-black text-[#5cf0bd]">
                  ✓
                </span>
              </div>

              <p className="relative mt-8 text-[10px] font-black tracking-[0.15em] text-[#5cf0bd] sm:mt-10">
                OTTIMIZZA
              </p>

              <h3 className="relative mt-3 text-2xl font-black tracking-[-0.05em]">
                Mostra il link giusto.
              </h3>

              <p className="relative mt-3 leading-7 text-white/55">
                Usa CTR, fonti di traffico e targeting per mostrare contenuti più
                rilevanti a ogni visitatore.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* TUTTO IL NECESSARIO */}
      <section
        id="funzioni"
        className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-14 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
            TUTTO IL NECESSARIO
          </p>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
            La tua pagina. I tuoi dati. Decisioni migliori.
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="biolinkr-card rounded-[28px] border border-white/10 bg-[#17181e] p-6 sm:p-7">
            <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
              <LinkIcon />
            </span>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              Pagina bio personalizzata
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Costruisci una pagina coerente con il tuo stile e organizza i link
              che vuoi far trovare al tuo pubblico.
            </p>
          </article>

          <article className="biolinkr-card rounded-[28px] border border-white/10 bg-[#17181e] p-6 sm:p-7">
            <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
              <ChartIcon />
            </span>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              Analytics e CTR
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Osserva visite, click, CTR e fonti di traffico per capire cosa
              funziona davvero.
            </p>
          </article>

          <article className="biolinkr-card rounded-[28px] border border-[#8b5cf6]/25 bg-[#17181e] p-6 sm:p-7">
            <span className="inline-flex rounded-2xl bg-[#8b5cf6]/10 p-3 text-[#d7c5ff]">
              <TrendIcon />
            </span>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              A/B test sui link
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Confronta due versioni dello stesso link e usa i dati per
              scegliere la CTA migliore.
            </p>
          </article>

          <article className="biolinkr-card relative overflow-hidden rounded-[28px] border border-[#00d084]/25 bg-[#17181e] p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
                <TargetIcon />
              </span>
              <ProBadge />
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              Targeting avanzato
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Mostra link diversi in base a paese, dispositivo e sorgente del
              visitatore. Più rilevanza, più click.
            </p>
          </article>

          <article className="biolinkr-card rounded-[28px] border border-[#8b5cf6]/25 bg-[#17181e] p-6 sm:p-7">
            <span className="inline-flex rounded-2xl bg-[#8b5cf6]/10 p-3 text-[#d7c5ff]">
              <CalendarIcon />
            </span>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              Link intelligenti
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Programma i tuoi link, gestisci le priorità e mostra ogni CTA nel
              momento più utile.
            </p>
          </article>

          <article className="biolinkr-card relative overflow-hidden rounded-[28px] border border-[#00d084]/25 bg-[#17181e] p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex rounded-2xl bg-[#00d084]/10 p-3 text-[#5cf0bd]">
                <LayoutIcon />
              </span>
              <ProBadge />
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.045em] sm:mt-7">
              Layout avanzati
            </h3>

            <p className="mt-3 leading-7 text-white/55">
              Scegli tra layout esclusivi, video background e personalizzazioni
              avanzate per creare una pagina davvero tua.
            </p>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 bg-[#101116] py-12 sm:py-14 lg:py-16"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="text-sm font-black tracking-[0.2em] text-[#00d084]">
              DOMANDE FREQUENTI
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-5xl">
              Tutto chiaro.
              <span className="block text-white/45">Quasi.</span>
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
                Pochi minuti. Scegli il nome della pagina, aggiungi i link e
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
                varianti in vantaggio, così sai subito dove vale la pena
                intervenire.
              </p>
            </details>

            <details className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Posso mostrare link diversi a persone diverse?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                Sì. Con il targeting avanzato puoi personalizzare i link in base
                a paese, dispositivo e sorgente del traffico, così ogni persona
                vede il contenuto più rilevante.
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
                Crei due versioni dello stesso link, per esempio due titoli
                diversi. BioLinkr distribuisce il traffico, confronta i click e
                ti mostra quale variante sta ottenendo il risultato migliore.
              </p>
            </details>

            <details className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white marker:content-none sm:text-lg">
                Cosa include BioLinkr Pro?
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-medium text-[#5cf0bd] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="max-w-xl pt-4 text-sm leading-7 text-white/55 sm:text-base">
                BioLinkr Pro include strumenti avanzati come targeting per paese,
                dispositivo e sorgente, oltre a layout esclusivi, video background
                e personalizzazioni avanzate della pagina.
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
                No. Puoi creare la tua pagina BioLinkr e iniziare a configurarla
                senza inserire una carta di credito.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA FINALE — visual invariato, copy aggiornato */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-12 pt-12 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="relative overflow-hidden rounded-[36px] border border-[#00d084]/25 bg-gradient-to-br from-[#00d084]/20 via-[#0f3f31] to-[#17181e] px-7 py-14 sm:px-12 sm:py-20">
          <div className="biolinkr-glow absolute right-[-100px] top-[-180px] h-[400px] w-[400px] rounded-full bg-[#00d084]/20 blur-[100px]" />

          <div className="relative max-w-3xl">
            <p className="text-sm font-black tracking-[0.2em] text-[#5cf0bd]">
              IL TUO TRAFFICO VALE DI PIÙ
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.065em] sm:text-6xl">
              Fai lavorare meglio ogni click.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Crea la tua pagina, scopri cosa funziona e mostra a ogni
              visitatore il contenuto più rilevante.
            </p>

            <Link
              href="/signup"
              className="biolinkr-cta mt-9 inline-flex items-center gap-2 rounded-2xl bg-[#00d084] px-6 py-4 font-black text-[#07100d] transition hover:bg-[#19e49b]"
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