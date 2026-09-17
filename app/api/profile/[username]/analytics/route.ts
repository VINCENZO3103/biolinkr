import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  console.log("analytics: username=", username);

  if (!username) {
    return NextResponse.json(
      { error: "Username mancante" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("analytics: env Supabase mancanti");
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

  const profileRes = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .single();

  console.log("analytics: profileRes=", profileRes);

  if (profileRes.error || !profileRes.data) {
    console.error("analytics: profilo non trovato", profileRes.error);
    return NextResponse.json(
      { error: "Profilo non trovato" },
      { status: 404 }
    );
  }

  const profileId = profileRes.data.id;

  console.log("analytics: profileId=", profileId);

  // Totale visite
  const totalRes = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const totalVisits = totalRes.count ?? 0;

  console.log("analytics: totalVisits=", totalVisits);

  // Paesi
  const countriesRes = await supabase.rpc(
    "get_profile_views_by_country",
    { p_profile_id: profileId }
  );

  console.log("analytics: countries=", countriesRes);

  // Device
  const devicesRes = await supabase.rpc(
    "get_profile_views_by_device",
    { p_profile_id: profileId }
  );

  console.log("analytics: devices=", devicesRes);

  // Sorgenti
  const sourcesRes = await supabase.rpc(
    "get_profile_views_by_source",
    { p_profile_id: profileId }
  );

  console.log("analytics: sources=", sourcesRes);

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