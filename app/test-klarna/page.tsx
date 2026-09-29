"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestKlarnaPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [debug, setDebug] = useState<string>("");

  useEffect(() => {
    async function startCheckout() {
      try {
        setStatus("loading");
        setDebug("Recupero sessione Supabase...");

        // 1. Recupera l'utente loggato
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setDebug("Utente non loggato o errore auth.");
          setStatus("error");
          return;
        }

        const userId = user.id;
        setDebug(`Utente: ${userId}. Recupero profilo...`);

        // 2. Recupera il profilo
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, username")
          .eq("id", userId)
          .single();

        if (profileError || !profile) {
          setDebug(`Profilo non trovato: ${profileError?.message || "nessun dato"}`);
          setStatus("error");
          return;
        }

        const profileId = profile.id;
        setDebug(`Profilo: ${profileId}. Creo checkout...`);

        // 3. METTI QUI IL PRICE ID DEL PRODOTTO DA 999,99 €
        const priceId = "price_XXXXXX";

        // 4. Chiama la tua API di checkout
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            userId,
            profileId,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          setDebug(`Errore API: ${res.status} – ${errText}`);
          setStatus("error");
          return;
        }

        const { url } = await res.json();
        setDebug("Reindirizzamento a Stripe Checkout...");

        // 5. Redirect a Stripe
        window.location.href = url;
      } catch (e: any) {
        setDebug(`Errore generico: ${e?.message || String(e)}`);
        setStatus("error");
      }
    }

    startCheckout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0d12] text-white">
      <div className="text-center max-w-md mx-auto px-4">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Apertura checkout Klarna…
            </h1>
            <p className="text-sm text-gray-400 mb-4">{debug}</p>
            <p className="text-xs text-gray-500">
              Se non vieni reindirizzato entro 10 secondi, ricarica la pagina.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-red-400">
              Errore nell’avvio del checkout
            </h1>
            <p className="text-sm text-gray-400 mb-2">{debug}</p>
            <ul className="text-xs text-gray-500 text-left bg-[#17181e] border border-[#2a2d35] rounded-lg p-3 mb-4">
              <li>• Assicurati di essere loggato su BioLinkr.</li>
              <li>• Controlla di aver inserito il priceId corretto.</li>
              <li>• Verifica che esista il profilo per il tuo user ID.</li>
            </ul>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-[#17181e] border border-[#2a2d35] rounded-lg text-sm"
            >
              Torna alla dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}