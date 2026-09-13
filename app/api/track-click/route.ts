import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const linkId =
      typeof body?.linkId === "string" ? body.linkId.trim() : "";

    if (!linkId) {
      return NextResponse.json(
        { error: "linkId mancante" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("track-click: env Supabase mancanti", {
        hasUrl: Boolean(supabaseUrl),
        hasAnonKey: Boolean(supabaseAnonKey),
      });

      return NextResponse.json(
        { error: "Configurazione Supabase mancante sul server" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabase.from("link_clicks").insert({
      link_id: linkId,
    });

    if (error) {
      console.error("Errore insert link_clicks:", error);

      return NextResponse.json(
        {
          error: "Impossibile registrare il click",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Errore API track-click:", error);

    return NextResponse.json(
      { error: "Impossibile registrare il click" },
      { status: 500 }
    );
  }
}