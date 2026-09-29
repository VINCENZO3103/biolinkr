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
        setDebug("1. Recupero sessione Supabase...");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setDebug(`2. Errore auth: ${userError?.message || "utente non loggato"}`);
          setStatus("error");
          return;
        }

        const userId = user.id;
        setDebug(`2. Utente: ${userId}. Recupero profilo...`);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, username")
          .eq("id", userId)
          .single();

        if (profileError || !profile) {
          setDebug(`3. Profilo non trovato: ${profileError?.message || "nessun dato"}`);
          setStatus("error");
          return;
        }

        const profileId = profile.id;
        setDebug(`3. Profilo: ${profileId}. Preparo chiamata API...`);

        // METTI QUI IL PRICE ID DEL PRODOTTO DA 999,99 €
        const priceId = "price_1UKy6uV05Ak3S5GrMyDoyMz8";

        setDebug(`4. Chiamo API con: priceId=${priceId}, userId=${userId}, profileId=${profileId}`);

        const res = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            userId,
            profileId,
          }),
        });

        const text = await res.text();

        if (!res.ok) {
          setDebug(`5. Errore API: ${res.status} – ${text}`);
          setStatus("error");
          return;
        }

        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          setDebug(`5. Risposta non JSON: ${text}`);
          setStatus("error");
          return;
        }

        setDebug(`5. Risposta OK: ${JSON.stringify(json)}. Reindirizzo...`);

        window.location.href = json.url;
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