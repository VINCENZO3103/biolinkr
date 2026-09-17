'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

interface Profile {
  id: string;
  username: string;
  plan: 'free' | 'premium';
  subscription_status: string | null;
}

type BillingPeriod = 'monthly' | 'yearly';

const PRICE_IDS: Record<BillingPeriod, string> = {
  monthly: 'price_1UG37rV05Ak3S5GruigAUSMF',
  yearly: 'price_1UG38sV05Ak3S5GrsXIlpeYV',
};

const PRO_FEATURES = [
  'Layout esclusivi e badge verificato',
  'Targeting link per Paese, dispositivo e sorgente',
  'A/B test e analytics avanzate',
  'Dominio personalizzato e supporto prioritario',
];

function GemIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="upgradeGemBase"
          x1="5"
          y1="4"
          x2="19"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#effffc" />
          <stop offset="20%" stopColor="#aafbf0" />
          <stop offset="48%" stopColor="#3bddca" />
          <stop offset="76%" stopColor="#099e95" />
          <stop offset="100%" stopColor="#045d5b" />
        </linearGradient>

        <linearGradient
          id="upgradeGemTop"
          x1="7"
          y1="5"
          x2="16"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#b8fff6" />
          <stop offset="100%" stopColor="#39cfbf" />
        </linearGradient>
      </defs>

      <path
        d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
        fill="url(#upgradeGemBase)"
        stroke="#d9fffa"
        strokeWidth="0.95"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z"
        fill="url(#upgradeGemTop)"
      />
      <path
        d="M6.4 5.25 9.1 9.4H3.4l3-4.15Z"
        fill="#9effef"
        opacity="0.82"
      />
      <path
        d="m17.6 5.25-2.7 4.15h5.7l-3-4.15Z"
        fill="#2dbdaf"
        opacity="0.94"
      />
      <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
      <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
      <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />
      <path
        d="M7.1 6.4h4.75L9.7 8.45H5.65L7.1 6.4Z"
        fill="#ffffff"
        opacity="0.62"
      />
      <path
        d="M3.4 9.4h17.2M9.1 9.4 12 19.85l2.9-10.45M6.4 5.25l2.7 4.15m8.5-4.15-2.7 4.15"
        fill="none"
        stroke="#034c49"
        strokeWidth="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#40e0d0]/25 bg-[#40e0d0]/10 text-[11px] font-black text-[#aafbf0]">
      ✓
    </span>
  );
}

export default function UpgradePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>('yearly');
  const [error, setError] = useState<string | null>(null);

  const isYearly = billingPeriod === 'yearly';

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, plan, subscription_status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(data as Profile);
    } catch (loadError) {
      console.error('Error loading profile:', loadError);
      setError('Non è stato possibile caricare il tuo profilo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    if (!profile || processing) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICE_IDS[billingPeriod],
          userId: profile.id,
          profileId: profile.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Non è stato possibile avviare il checkout.',
        );
      }

      if (!data.url) {
        throw new Error('Stripe non ha restituito un link di checkout.');
      }

      window.location.href = data.url;
    } catch (upgradeError) {
      console.error('Upgrade error:', upgradeError);
      setError(
        upgradeError instanceof Error
          ? upgradeError.message
          : 'Si è verificato un errore. Riprova tra poco.',
      );
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b0d]">
        <div className="flex flex-col items-center gap-4">
          <GemIcon className="h-10 w-10 animate-pulse drop-shadow-[0_0_16px_rgba(64,224,208,0.42)]" />
          <p className="text-sm font-medium text-white/55">
            Caricamento BioLinkr PRO...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b0d] px-5 text-white">
        <section className="w-full max-w-md rounded-3xl border border-red-300/20 bg-[#141b1d] p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-lg font-black text-red-200">Profilo non trovato</p>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Riprova ad accedere oppure torna alla dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-6 rounded-xl bg-[#40e0d0] px-5 py-3 text-sm font-black text-[#061110] transition hover:bg-[#7af7e4]"
          >
            Torna alla dashboard
          </button>
        </section>
      </main>
    );
  }

  if (profile.plan === 'premium') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b0d] px-5 text-white">
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#141b1d] to-[#0e1315] shadow-[0_20px_70px_rgba(0,0,0,0.38)]">
          <div className="border-b border-[#40e0d0]/15 bg-gradient-to-r from-[#40e0d0]/13 via-[#40e0d0]/5 to-transparent p-7 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#40e0d0]/25 bg-[#40e0d0]/10">
              <GemIcon className="h-8 w-8 drop-shadow-[0_0_12px_rgba(64,224,208,0.48)]" />
            </span>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#aafbf0]">
              BioLinkr PRO
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
              Hai già accesso a PRO
            </h1>
          </div>

          <div className="p-7 text-center">
            <p className="text-sm leading-6 text-white/60">
              Tutte le funzionalità premium sono già attive sul tuo profilo.
            </p>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-6 rounded-xl bg-[#40e0d0] px-5 py-3 text-sm font-black text-[#061110] transition hover:bg-[#7af7e4]"
            >
              Torna alla dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#080b0d] px-4 py-7 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-15rem] h-[33rem] w-[33rem] -translate-x-1/2 rounded-full bg-[#40e0d0]/8 blur-[125px]" />
        <div className="absolute right-[-10rem] top-[26rem] h-72 w-72 rounded-full bg-[#099e95]/7 blur-[125px]" />
      </div>

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#40e0d0]/25 bg-[#40e0d0]/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#aafbf0]">
            <GemIcon className="h-3.5 w-3.5" />
            BioLinkr PRO
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Il tuo profilo, al massimo.
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/60">
            Prova tutte le funzioni PRO gratis per 7 giorni.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#141b1d] to-[#0e1315] shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_44px_rgba(64,224,208,0.055)] backdrop-blur">
          <div className="relative overflow-hidden border-b border-[#40e0d0]/15 bg-gradient-to-r from-[#40e0d0]/13 via-[#40e0d0]/5 to-transparent px-5 py-4 sm:px-6">
            <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-[#40e0d0]/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#40e0d0]/25 bg-[#080b0d]/55">
                <GemIcon className="h-6 w-6 drop-shadow-[0_0_10px_rgba(64,224,208,0.4)]" />
              </span>

              <div>
                <p className="text-sm font-black text-[#d9fffa]">
                  7 giorni di prova gratuita
                </p>

                <p className="mt-0.5 text-[11px] text-white/60">
                  Accesso completo a PRO. Nessun addebito oggi.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#78f5df]">
                  Scegli il tuo piano
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-white">
                  Un piccolo upgrade, grandi risultati.
                </h2>
              </div>

              <span className="shrink-0 rounded-full border border-[#40e0d0]/20 bg-[#40e0d0]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#aafbf0]">
                PRO
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                aria-pressed={isYearly}
                className={`relative overflow-hidden rounded-2xl border p-3.5 text-left transition duration-200 ${
                  isYearly
                    ? 'border-[#40e0d0]/60 bg-gradient-to-br from-[#153c39] via-[#102826] to-[#0d1718] text-white shadow-[0_0_0_1px_rgba(64,224,208,0.12),0_12px_28px_rgba(0,0,0,0.3),0_0_20px_rgba(64,224,208,0.09)]'
                    : 'border-white/10 bg-[#0c1013] text-white/60 hover:border-white/25 hover:bg-[#11181b]'
                }`}
              >
                <span className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-bl-2xl rounded-tr-xl border-b border-l border-[#40e0d0]/45 bg-gradient-to-br from-[#1f6d68] via-[#155b58] to-[#0b4140] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#d9fffa] shadow-[0_4px_12px_rgba(0,0,0,0.3),0_0_14px_rgba(64,224,208,0.16)]">
                  <span className="text-xs leading-none text-[#78f5df]">
                    ★
                  </span>
                  Consigliato
                </span>

                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border ${
                    isYearly
                      ? 'border-[#78f5df] bg-[#40e0d0]'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {isYearly && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#07100d]" />
                  )}
                </span>

                <div className="mt-3 flex items-end gap-1">
                  <span className="text-2xl font-black tracking-tight">
                    4,99 €
                  </span>

                  <span
                    className={`mb-1 text-[11px] font-bold ${
                      isYearly ? 'text-[#b9fff6]/75' : 'text-white/50'
                    }`}
                  >
                    / mese
                  </span>
                </div>

                <p
                  className={`mt-1 text-xs font-black ${
                    isYearly ? 'text-[#d9fffa]' : 'text-white/75'
                  }`}
                >
                  Abbonamento annuale
                </p>

                <p
                  className={`mt-1 text-[11px] ${
                    isYearly ? 'text-[#b9fff6]/75' : 'text-white/55'
                  }`}
                >
                  59,99 € / anno
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] ${
                    isYearly
                      ? 'border-[#40e0d0]/25 bg-[#40e0d0]/10 text-[#aafbf0]'
                      : 'border-white/10 bg-white/[0.03] text-white/50'
                  }`}
                >
                  Risparmi
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                aria-pressed={!isYearly}
                className={`relative overflow-hidden rounded-2xl border p-3.5 text-left transition duration-200 ${
                  !isYearly
                    ? 'border-[#40e0d0]/60 bg-gradient-to-br from-[#153c39] via-[#102826] to-[#0d1718] text-white shadow-[0_0_0_1px_rgba(64,224,208,0.12),0_12px_28px_rgba(0,0,0,0.3),0_0_20px_rgba(64,224,208,0.09)]'
                    : 'border-white/10 bg-[#0c1013] text-white/60 hover:border-white/25 hover:bg-[#11181b]'
                }`}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border ${
                    !isYearly
                      ? 'border-[#78f5df] bg-[#40e0d0]'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {!isYearly && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#07100d]" />
                  )}
                </span>

                <div className="mt-3 flex items-end gap-1">
                  <span className="text-2xl font-black tracking-tight">
                    5,99 €
                  </span>

                  <span
                    className={`mb-1 text-[11px] font-bold ${
                      !isYearly ? 'text-[#b9fff6]/75' : 'text-white/50'
                    }`}
                  >
                    / mese
                  </span>
                </div>

                <p
                  className={`mt-1 text-xs font-black ${
                    !isYearly ? 'text-[#d9fffa]' : 'text-white/75'
                  }`}
                >
                  Abbonamento mensile
                </p>

                <p
                  className={`mt-1 text-[11px] ${
                    !isYearly ? 'text-[#b9fff6]/75' : 'text-white/55'
                  }`}
                >
                  5,99 € / mese
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] ${
                    !isYearly
                      ? 'border-[#40e0d0]/25 bg-[#40e0d0]/10 text-[#aafbf0]'
                      : 'border-white/10 bg-white/[0.03] text-white/50'
                  }`}
                >
                  Flessibile
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={processing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#40e0d0] px-5 py-4 text-sm font-black text-[#061110] shadow-[0_8px_26px_rgba(64,224,208,0.26)] transition duration-200 hover:bg-[#7af7e4] hover:shadow-[0_11px_34px_rgba(64,224,208,0.38)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#061110]/60 border-t-transparent" />
                  Apertura checkout...
                </>
              ) : (
                <>
                  <GemIcon className="h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,44,50,0.55)]" />
                  Prova BioLinkr PRO · 0,00 €
                </>
              )}
            </button>

            <p className="mt-2 text-center text-[11px] font-medium text-white/55">
              7 giorni gratis · nessun addebito oggi
            </p>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                Incluso con BioLinkr PRO
              </p>

              <ul className="grid gap-2 sm:grid-cols-2">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0c1013]/75 px-3 py-2.5 text-[11px] leading-5 text-white/75"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-white/45">
              Dopo 7 giorni verrà addebitato il piano{' '}
              {isYearly ? 'annuale di 59,99 €' : 'mensile di 5,99 €'}, salvo
              annullamento prima della fine della prova. Pagamento sicuro con
              Stripe.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}