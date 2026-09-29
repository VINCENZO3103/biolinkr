"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestKlarnaPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    async function startCheckout() {
      try {
        setStatus("loading");

        // METTI QUI IL PRICE ID DEL PRODOTTO DA 750 €
        const priceId = "price_1UKy6uV05Ak3S5GrMyDoyMz8";

        // Recupera userId e profileId da qualche parte:
        // - localStorage
        // - contesto auth
        // - oppure hardcoded per test
        // Esempio (adatta):
        const userId = localStorage.getItem("userId");
        const profileId = localStorage.getItem("profileId");

        if (!userId || !profileId) {
          setStatus("error");
          return;
        }

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
          setStatus("error");
          return;
        }

        const { url } = await res.json();

        // Redirect a Stripe Checkout
        window.location.href = url;
      } catch {
        setStatus("error");
      }
    }

    startCheckout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0d12] text-white">
      <div className="text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Apertura checkout Klarna…
            </h1>
            <p className="text-sm text-gray-400">
              Se non vieni reindirizzato entro pochi secondi, ricarica la pagina.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-red-400">
              Errore nell’avvio del checkout
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              Controlla di aver impostato priceId, userId e profileId correttamente.
            </p>
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