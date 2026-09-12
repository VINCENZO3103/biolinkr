import Link from "next/link";
import { ArrowRight, Check, Search, ShieldCheck, Zap } from "lucide-react";

const benefits = [
  "Pagine costruite per essere trovate",
  "Il 100% delle tue vendite resta a te",
  "Una pagina professionale in pochi minuti",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <section className="relative px-6 pb-24 pt-6 lg:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-[-0.06em]"
          >
            bio<span className="text-emerald-400">linkr</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white sm:block"
            >
              Accedi
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
            >
              Inizia gratis
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-14 pb-8 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300">
              <Zap className="h-4 w-4" />
              La tua presenza, senza trattenute
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Una pagina che fa crescere il tuo nome.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              BioLinkr trasforma il link in bio in una pagina veloce, elegante e
              progettata per farti trovare. Nessuna commissione sulle tue vendite.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 font-bold text-zinc-950 transition hover:bg-emerald-300"
              >
                Crea la tua pagina gratis
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#perche"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3.5 font-semibold text-white transition hover:border-zinc-500 hover:bg-white/5"
              >
                Scopri come funziona
              </a>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-10 -z-10 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="rounded-[2.4rem] border-[7px] border-zinc-700 bg-zinc-950 p-3 shadow-2xl shadow-emerald-950/40">
              <div className="overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-[#1c2541] via-[#12182b] to-[#0f1118] px-6 py-9">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-500 p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0e1424] text-2xl font-black">
                    A
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="font-bold">@alexcreates</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    Creator, designer & builder.
                  </p>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    "Il mio nuovo corso",
                    "Risorse gratuite",
                    "Prenota una call",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-left text-sm font-bold text-zinc-950"
                    >
                      {item}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                <p className="mt-7 text-center text-xs text-zinc-400">
                  Made with{" "}
                  <span className="font-semibold text-emerald-300">
                    biolinkr
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="perche"
        className="border-y border-white/10 bg-[#10131b] px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Per creator e professionisti
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Non un altro elenco di link.
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-300">
              BioLinkr è la tua casa digitale: una pagina che presenta ciò che
              fai, raccoglie il tuo pubblico e porta le persone nel posto giusto.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="SEO fin dall’inizio"
              text="Pagine veloci e indicizzabili, con metadati e struttura pensati per la ricerca."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="0% sulle vendite"
              text="Collega i tuoi strumenti di pagamento e conserva il 100% di ciò che guadagni."
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Pronto in pochi minuti"
              text="Scegli un layout, aggiungi i tuoi link e pubblica senza scrivere codice."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} BioLinkr. La tua presenza, a modo tuo.
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-zinc-400">{text}</p>
    </article>
  );
}