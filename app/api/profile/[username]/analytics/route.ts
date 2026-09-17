import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username mancante" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

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

  // Device
  const devicesRes = await supabase.rpc(
    "get_profile_views_by_device",
    { p_profile_id: profileId }
  );

  // Sorgenti
  const sourcesRes = await supabase.rpc(
    "get_profile_views_by_source",
    { p_profile_id: profileId }
  );

  return NextResponse.json({
    totalVisits,
    countries: (countriesRes.data ?? []) as Array<{
      country_code: string;
      visits: number;
    }>,
    devices: (devicesRes.data ?? []) as Array<{
      device_type: string;
      visits: number;
    }>,
    sources: (sourcesRes.data ?? []) as Array<{
      referrer: string;
      visits: number;
    }>,
  });
}