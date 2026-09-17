import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { error: "Username mancante" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const profileRes = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .single();

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json(
      { error: "Profilo non trovato" },
      { status: 404 }
    );
  }

  const profileId = profileRes.data.id;

  console.log("analytics: profileId=", profileId);

  // Test diretto: esegui una query semplice per verificare
  const testRes = await supabase
    .from("profile_views")
    .select("profile_id, country_code, device_type, referrer")
    .eq("profile_id", profileId)
    .limit(5);

  console.log("analytics: testRes=", testRes);

  // Totale visite
  const totalRes = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const totalVisits = totalRes.count ?? 0;

  // Paesi
  const countriesRes = await supabase.rpc(
    "get_profile_views_by_country",
    { p_profile_id: profileId }
  );

  const countries = Array.isArray(countriesRes.data)
    ? countriesRes.data.map((c: any) => ({
        country_code: String(c.country_code ?? "unknown"),
        visits: Number(c.visits ?? 0),
      }))
    : [];

  // Device
  const devicesRes = await supabase.rpc(
    "get_profile_views_by_device",
    { p_profile_id: profileId }
  );

  const devices = Array.isArray(devicesRes.data)
    ? devicesRes.data.map((d: any) => ({
        device_type: String(d.device_type ?? "unknown"),
        visits: Number(d.visits ?? 0),
      }))
    : [];

  // Sorgenti
  const sourcesRes = await supabase.rpc(
    "get_profile_views_by_source",
    { p_profile_id: profileId }
  );

  const sources = Array.isArray(sourcesRes.data)
    ? sourcesRes.data.map((s: any) => ({
        referrer: String(s.referrer ?? "unknown"),
        visits: Number(s.visits ?? 0),
      }))
    : [];

  return NextResponse.json({
    totalVisits,
    countries,
    devices,
    sources,
  });
}