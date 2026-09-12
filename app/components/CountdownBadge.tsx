"use client";

import { useEffect, useState } from "react";

type CountdownBadgeProps = {
  endsAt: string;
};

function getTimeRemaining(endsAt: string) {
  const difference = new Date(endsAt).getTime() - Date.now();

  if (difference <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${days}g`);
  }

  if (hours > 0 || days > 0) {
    parts.push(`${hours.toString().padStart(2, "0")}h`);
  }

  parts.push(`${minutes.toString().padStart(2, "0")}m`);
  parts.push(`${seconds.toString().padStart(2, "0")}s`);

  return parts.join(" ");
}

export default function CountdownBadge({ endsAt }: CountdownBadgeProps) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(endsAt));

  useEffect(() => {
    function updateCountdown() {
      setRemaining(getTimeRemaining(endsAt));
    }

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endsAt]);

  if (!remaining) {
    return null;
  }

  return (
    <span className="mt-2 block text-xs font-bold tracking-wide text-[#07100d]/65">
      Scade tra {remaining}
    </span>
  );
}