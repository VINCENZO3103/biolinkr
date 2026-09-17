import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Ottieni il profile_id
  const profileRes = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .single();

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json(
      { error: "Profilo non trovato", detail: profileRes.error?.message },
      { status: 404 }
    );
  }

  const profileId = profileRes.data.id;

  // 2. Query diretta per ottenere tutte le visite
  const visitsRes = await supabase
    .from("profile_views")
    .select("country_code, device_type, referrer")
    .eq("profile_id", profileId);

  if (visitsRes.error) {
    return NextResponse.json(
      { error: "Errore nel recupero visite", detail: visitsRes.error.message },
      { status: 500 }
    );
  }

  const visits = visitsRes.data || [];

  // 3. Calcola le statistiche
  const totalVisits = visits.length;

  const countryMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();

  for (const v of visits) {
    const country = v.country_code ?? "Unknown";
    const device = v.device_type ?? "Unknown";
    const source = v.referrer ?? "other";

    countryMap.set(country, (countryMap.get(country) || 0) + 1);
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  }

  const countries = Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const devices = Array.from(deviceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const sources = Array.from(sourceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return NextResponse.json({
    totalVisits,
    countries,
    devices,
    sources,
  });
}