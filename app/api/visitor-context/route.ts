import { NextRequest, NextResponse } from "next/server";

function detectDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const agent = userAgent.toLowerCase();

  if (/ipad|tablet|kindle|silk/.test(agent)) {
    return "tablet";
  }

  if (/mobi|android|iphone|ipod/.test(agent)) {
    return "mobile";
  }

  return "desktop";
}

function detectSource(
  request: NextRequest,
): string {
  const utmSource = request.nextUrl.searchParams
    .get("utm_source")
    ?.trim()
    .toLowerCase();

  if (utmSource) {
    return utmSource.slice(0, 120);
  }

  const referer = request.headers.get("referer");

  if (!referer) {
    return "other";
  }

  try {
    const host = new URL(referer).hostname.toLowerCase();

    if (host.includes("instagram.com")) return "instagram";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("youtube.com")) return "youtube";
    if (host.includes("facebook.com")) return "facebook";
    if (host.includes("google.")) return "google";
    if (host.includes("twitter.com") || host.includes("x.com")) return "x";

    return "other";
  } catch {
    return "other";
  }
}

export async function GET(request: NextRequest) {
  const countryCode =
    request.headers.get("x-vercel-ip-country")?.toUpperCase() ??
    "Unknown";

  const userAgent = request.headers.get("user-agent") ?? "";

  return NextResponse.json(
    {
      countryCode,
      deviceType: detectDevice(userAgent),
      source: detectSource(request),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}