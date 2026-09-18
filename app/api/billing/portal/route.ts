import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, subscription_status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const customerId = profile.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "Nessun cliente Stripe associato. Effettua prima un upgrade a premium.",
        },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin")}/dashboard`,
      configuration: "bpc_1UGvwGV05Ak3S5Gr15ADYP4T", // <-- sostituisci con il tuo ID
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Errore creazione portal session:", err);
    return NextResponse.json(
      { error: err?.message ?? "Errore nella creazione della portal" },
      { status: 500 }
    );
  }
}