"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function TestKlarnaPayPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [debug, setDebug] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setStatus("success");
      setDebug("Checkout completato! Controlla su Stripe Dashboard → Payments.");
      return;
    }
    if (params.get("canceled") === "1") {
      setStatus("error");
      setDebug("Checkout annullato.");
      return;
    }

    async function startCheckout() {
      try {
        setStatus("loading");
        setDebug("1. Recupero utente...");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setDebug(`Errore auth: ${userError?.message || "utente non loggato"}`);
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
          setDebug(`Profilo non trovato: ${profileError?.message || "nessun dato"}`);
          setStatus("error");
          return;
        }

        const profileId = profile.id;
        setDebug(`3. Profilo: ${profileId}. Avvio checkout...`);

        // METTI QUI IL PRICE ID DA 999,99 €
        const priceId = "price_1UKzdEV05Ak3S5Gr6jBeYZkC";

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
          setDebug(`Errore API: ${res.status} – ${text}`);
          setStatus("error");
          return;
        }

        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          setDebug(`Risposta non JSON: ${text}`);
          setStatus("error");
          return;
        }

        if (!json.url) {
          setDebug(`Nessun URL nella risposta: ${JSON.stringify(json)}`);
          setStatus("error");
          return;
        }

        setDebug(`Reindirizzo a Stripe...`);
        window.location.href = json.url + (json.url.includes("?") ? "&" : "?") + "test_klarna=1";
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
              Apertura checkout Klarna (999,99 €)…
            </h1>
            <p className="text-sm text-gray-400 mb-4">{debug}</p>
            <p className="text-xs text-gray-500">
              Se non vieni reindirizzato entro 10 secondi, ricarica la pagina.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-[#00d084]">
              Checkout completato!
            </h1>
            <p className="text-sm text-gray-400 mb-4">{debug}</p>
            <p className="text-xs text-gray-500">
              Verifica su Stripe Dashboard → Payments che il metodo sia “klarna”.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-red-400">
              Errore / annullamento
            </h1>
            <p className="text-sm text-gray-400 mb-2">{debug}</p>
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