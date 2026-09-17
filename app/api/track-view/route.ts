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

    const profileId = body?.profileId as string | undefined;
    const username = body?.username as string | undefined;

    const source = cleanUtmValue(body?.source);
    const medium = cleanUtmValue(body?.medium);
    const campaign = cleanUtmValue(body?.campaign);
    const content = cleanUtmValue(body?.content);

    if (
      (typeof profileId !== "string" || !profileId.trim()) &&
      (typeof username !== "string" || !username.trim())
    ) {
      return NextResponse.json(
        { error: "profileId o username mancanti" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("track-view: env Supabase mancanti", {
        hasUrl: Boolean(supabaseUrl),
        hasAnonKey: Boolean(supabaseAnonKey),
      });

      return NextResponse.json(
        { error: "Configurazione Supabase mancante" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Risolvi profileId da username se necessario
    let resolvedProfileId = profileId?.trim() ?? null;

    if (!resolvedProfileId && username) {
      const profileRes = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim().toLowerCase())
        .single();

      if (profileRes.error || !profileRes.data) {
        console.error(
          "Impossibile risolvere il profilo per username:",
          username,
          profileRes.error
        );
        return NextResponse.json(
          { error: "Profilo non trovato" },
          { status: 404 }
        );
      }

      resolvedProfileId = profileRes.data.id;
    }

    // Paese da Vercel
    const countryCode =
      request.headers.get("x-vercel-ip-country") ?? null;

    // Device da User-Agent
    const ua = request.headers.get("user-agent") ?? "";
    let deviceType = "desktop";
    if (/mobile/i.test(ua)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(ua)) deviceType = "tablet";

    // Sorgente: UTM + referrer
    const url = new URL(request.url);
    const utmSource =
      source ?? url.searchParams.get("utm_source");
    const referrerRaw = request.headers.get("referer");

    let referrer = "direct";
    if (utmSource) {
      referrer = utmSource.toLowerCase();
    } else if (referrerRaw) {
      const host = new URL(referrerRaw).hostname;
      if (host.includes("instagram.com")) referrer = "instagram";
      else if (host.includes("tiktok.com")) referrer = "tiktok";
      else if (host.includes("youtube.com")) referrer = "youtube";
      else if (host.includes("facebook.com")) referrer = "facebook";
      else if (
        host.includes("twitter.com") ||
        host.includes("x.com")
      )
        referrer = "x";
      else referrer = "other";
    }

    // Usa la nuova RPC con geolocalizzazione
    const { error } = await supabase.rpc(
      "record_profile_view_with_geo",
      {
        viewed_profile_id: resolvedProfileId,
        source,
        medium,
        campaign,
        content,
        p_country_code: countryCode,
        p_device_type: deviceType,
        p_referrer: referrer,
      }
    );

    if (error) {
      console.error(
        "Errore RPC record_profile_view_with_geo:",
        error
      );

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
    console.error("Errore endpoint track-view:", error);

    return NextResponse.json(
      { error: "Richiesta visita non valida" },
      { status: 400 }
    );
  }
}