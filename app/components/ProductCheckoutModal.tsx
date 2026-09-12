"use client";

import { useState } from "react";
import { supabase } from "../supabase";

type Product = {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  file_url: string | null;
  external_url: string | null;
  cover_image_url: string | null;
};

type ProductCheckoutModalProps = {
  product: Product;
  profileId: string;
};

function formatPrice(cents: number, currency: string) {
  const locale =
    currency === "USD"
      ? "en-US"
      : currency === "GBP"
        ? "en-GB"
        : "it-IT";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default function ProductCheckoutModal({
  product,
  profileId,
}: ProductCheckoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleBuy() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessage("Inserisci un'email valida.");
      return;
    }

    setBuying(true);
    setMessage("");

    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      profile_id: profileId,
      buyer_email: cleanEmail,
      buyer_name: cleanName || null,
      amount_cents: product.price_cents,
      currency: product.currency,
    });

    setBuying(false);

    if (error) {
      setMessage(`Errore nell'ordine: ${error.message}`);
      return;
    }

    setSuccess(true);
    setMessage("");
  }

  function closeModal() {
    setIsOpen(false);
    setEmail("");
    setName("");
    setBuying(false);
    setMessage("");
    setSuccess(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-xl bg-[#00d084] px-4 py-4 text-center font-black text-[#07100d] transition hover:bg-[#19e49b]"
      >
        {product.title} · {formatPrice(product.price_cents, product.currency)}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
            {!success ? (
              <>
                <h3 className="text-2xl font-black text-white">
                  Acquista: {product.title}
                </h3>

                <p className="mt-2 text-white/55">
                  Inserisci la tua email per completare l'ordine.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-bold text-white/90">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
                    />
                  </label>

                  <label className="block text-sm font-bold text-white/90">
                    Nome (opzionale)
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Il tuo nome"
                      className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
                    />
                  </label>

                  <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-4">
                    <p className="text-sm font-bold text-white/70">
                      Riepilogo ordine
                    </p>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <p className="text-white/55">Prodotto</p>
                      <p className="font-bold text-white">{product.title}</p>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm">
                      <p className="text-white/55">Importo</p>
                      <p className="font-bold text-white">
                        {formatPrice(product.price_cents, product.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {message && (
                  <p className="mt-4 text-center text-sm text-white/70">
                    {message}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={buying}
                    className="rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buying ? "Elaborazione..." : "Conferma ordine"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={buying}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 disabled:opacity-50"
                  >
                    Annulla
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-white">
                  Ordine completato
                </h3>

                <p className="mt-2 text-white/55">
                  Grazie! Questo è un ordine di test. In futuro, qui arriverà il
                  link per scaricare il prodotto o il link di pagamento reale.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
                  >
                    Chiudi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}