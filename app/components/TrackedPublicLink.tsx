"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

type TrackedPublicLinkProps = {
  linkId: string;
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel?: string;
  hoverEffect?: string;
};

export default function TrackedPublicLink({
  linkId,
  href,
  className,
  style,
  children,
  ariaLabel,
  hoverEffect,
}: TrackedPublicLinkProps) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkId }),
        keepalive: true,
      });
    } catch (error) {
      console.error("Errore nel tracciamento del click:", error);
    }

    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={ariaLabel}
      data-hover-effect={hoverEffect || "none"}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}