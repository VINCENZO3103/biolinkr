"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

type ProfileViewTrackerProps = {
  profileId: string;
  username: string;
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
  username,
}: ProfileViewTrackerProps) {
  const searchParams = useSearchParams();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    console.log("ProfileViewTracker: profileId=", profileId, "username=", username);

    if (!profileId || !username || hasTrackedView.current) {
      console.log("ProfileViewTracker: salto la chiamata", {
        profileId,
        username,
        hasTrackedView: hasTrackedView.current,
      });
      return;
    }

    hasTrackedView.current = true;

    const payload = JSON.stringify({
      profileId,
      username,
      source: readUtmValue(searchParams.get("utm_source")),
      medium: readUtmValue(searchParams.get("utm_medium")),
      campaign: readUtmValue(searchParams.get("utm_campaign")),
      content: readUtmValue(searchParams.get("utm_content")),
    });

    console.log("ProfileViewTracker: invio payload", payload);

    void fetch("/api/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    });
  }, [profileId, username, searchParams]);

  return null;
}