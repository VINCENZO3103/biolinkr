"use client";

import { MouseEvent } from "react";
import CountdownBadge from "./CountdownBadge";

type TrackedLinkProps = {
  linkId: string;
  title: string;
  url: string;
  endsAt?: string | null;
};

export default function TrackedLink({
  linkId,
  title,
  url,
  endsAt,
}: TrackedLinkProps) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    const payload = JSON.stringify({ linkId });

    void fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    });
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full rounded-2xl bg-[#00d084] px-6 py-5 text-center text-lg font-black text-[#07100d] transition hover:bg-[#19e49b]"
    >
      <span className="block">{title}</span>

      {endsAt && <CountdownBadge endsAt={endsAt} />}
    </a>
  );
}