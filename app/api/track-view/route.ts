import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function cleanUtmValue(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim().toLowerCase();

  return cleaned.length > 0 ? cleaned.slice(0, 120) : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const profileId = body?.profileId;
    const source = cleanUtmValue(body?.source);
    const medium = cleanUtmValue(body?.medium);
    const campaign = cleanUtmValue(body?.campaign);
    const content = cleanUtmValue(body?.content);

    if (typeof profileId !== "string" || !profileId) {
      return NextResponse.json(
        { error: "profileId non valido" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        { error: "Configurazione Supabase mancante" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey);

    const { error } = await supabase.rpc("record_profile_view", {
      viewed_profile_id: profileId,
      source,
      medium,
      campaign,
      content,
    });

    if (error) {
      console.error("Errore RPC record_profile_view:", error);

      return NextResponse.json(
        {
          error: "Impossibile registrare la visita",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Errore endpoint visite:", error);

    return NextResponse.json(
      { error: "Richiesta visita non valida" },
      { status: 400 }
    );
  }
}