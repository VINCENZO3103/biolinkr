"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

type ProfileViewTrackerProps = {
  profileId: string;
};

function readUtmValue(value: string | null) {
  if (!value) {
    return null;
  }

  const cleaned = value.trim().toLowerCase();

  return cleaned.length > 0 ? cleaned.slice(0, 120) : null;
}

export default function ProfileViewTracker({
  profileId,
}: ProfileViewTrackerProps) {
  const searchParams = useSearchParams();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!profileId || hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;

    const payload = JSON.stringify({
      profileId,
      source: readUtmValue(searchParams.get("utm_source")),
      medium: readUtmValue(searchParams.get("utm_medium")),
      campaign: readUtmValue(searchParams.get("utm_campaign")),
      content: readUtmValue(searchParams.get("utm_content")),
    });

    void fetch("/api/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    });
  }, [profileId, searchParams]);

  return null;
}