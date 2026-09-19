"use client";

import { useEffect, useMemo, useState } from "react";
import TrackedPublicLink from "./TrackedPublicLink";

type BioLink = {
  id: string;
  title: string;
  url: string;
  target_countries: string[];
  target_devices: string[];
  target_sources: string[];
  icon_url: string | null;
  icon_size: number;
  icon_object_x: number | null;
  icon_object_y: number | null;
  background_color: string | null;
  badge_text: string | null;
  text_color: string | null;
  hover_effect: string | null;
  display_type: "button" | "image";
  image_url: string | null;
  image_height: number | null;
};

type VisitorContext = {
  countryCode: string;
  deviceType: string;
  source: string;
};

type TargetedLinksProps = {
  links: BioLink[];
  buttonStyle: string;
  globalButtonBgColor?: string;
  globalButtonTextColor?: string;
};

function getButtonClasses(
  buttonStyle: string,
  globalButtonBgColor?: string,
  globalButtonTextColor?: string
) {
  const bg = globalButtonBgColor || undefined;
  const color = globalButtonTextColor || undefined;

  const base: Record<string, string> = {
    outline:
      "rounded-xl border border-white/20 bg-transparent font-black text-white transition hover:border-[#00d084] hover:bg-white/5",
    glass:
      "rounded-xl border border-white/10 bg-white/5 font-black text-white backdrop-blur transition hover:bg-white/10",
    solid:
      "rounded-xl font-black transition",
  };

  const solidDefaultBg = "#00d084";
  const solidDefaultText = "#07100d";

  const solidStyle = `background: ${bg || solidDefaultBg}; color: ${color || solidDefaultText};`;

  return {
    outline: base.outline,
    glass: base.glass,
    solid: `${base.solid} ${solidStyle}`,
  }[buttonStyle] || base.solid;
}

function normalize(values: string[] | null | undefined) {
  return (values ?? [])
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function linkMatchesVisitor(link: BioLink, visitor: VisitorContext) {
  const countries = normalize(link.target_countries);
  const devices = normalize(link.target_devices);
  const sources = normalize(link.target_sources);

  const countryMatches =
    countries.length === 0 ||
    countries.includes(visitor.countryCode.toLowerCase());

  const deviceMatches =
    devices.length === 0 ||
    devices.includes(visitor.deviceType.toLowerCase());

  const sourceMatches =
    sources.length === 0 ||
    sources.includes(visitor.source.toLowerCase());

  return countryMatches && deviceMatches && sourceMatches;
}

export default function TargetedLinks({
  links,
  buttonStyle,
  globalButtonBgColor = "",
  globalButtonTextColor = "",
}: TargetedLinksProps) {
  const [visitor, setVisitor] = useState<VisitorContext | null>(null);

  useEffect(() => {
    const params = window.location.search;

    void fetch(`/api/visitor-context${params}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Impossibile rilevare il contesto del visitatore");
        }

        return response.json();
      })
      .then((data: VisitorContext) => {
        setVisitor(data);
      })
      .catch(() => {
        setVisitor({
          countryCode: "Unknown",
          deviceType: /mobi|android|iphone|ipod/i.test(
            navigator.userAgent,
          )
            ? "mobile"
            : "desktop",
          source: "other",
        });
      });
  }, []);

  const visibleLinks = useMemo(() => {
    if (!visitor) {
      return links;
    }

    return links.filter((link) => linkMatchesVisitor(link, visitor));
  }, [links, visitor]);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.25em] text-white/50">
        Link
      </h2>

      <div className="space-y-3">
        {visibleLinks.map((link) => {
          const baseClasses = getButtonClasses(
            buttonStyle,
            globalButtonBgColor || undefined,
            globalButtonTextColor || undefined
          );

          return link.display_type === "image" && link.image_url ? (
            <TrackedPublicLink
              key={link.id}
              linkId={link.id}
              href={link.url}
              hoverEffect={link.hover_effect || "none"}
              ariaLabel={link.title || "Apri link"}
              className="relative block w-full overflow-hidden rounded-2xl border border-white/10 transition hover:scale-[1.01] hover:border-[#00d084]"
              style={{
                background: link.background_color || "#0c0d12",
              }}
            >
              <img
                src={link.image_url}
                alt={link.title || ""}
                className="block w-full object-cover object-center"
                style={{
                  height: `${link.image_height ?? 220}px`,
                }}
              />
            </TrackedPublicLink>
          ) : (
            <TrackedPublicLink
              key={link.id}
              linkId={link.id}
              href={link.url}
              hoverEffect={link.hover_effect || "none"}
              className={`group relative flex w-full items-center justify-center rounded-xl px-4 py-4 font-black transition ${baseClasses}`}
              style={{
                background:
                  link.background_color ||
                  globalButtonBgColor ||
                  undefined,
                color:
                  link.text_color ||
                  globalButtonTextColor ||
                  undefined,
              }}
            >
              {link.icon_url && (
                <span
                  className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor:
                      link.background_color ||
                      globalButtonBgColor ||
                      "rgba(255,255,255,0.15)",
                  }}
                >
                  <img
                    src={link.icon_url}
                    alt=""
                    className="h-full w-full"
                    style={{
                      width: `${link.icon_size ?? 24}px`,
                      height: `${link.icon_size ?? 24}px`,
                      objectFit: "cover",
                      objectPosition: `${link.icon_object_x ?? 50}% ${link.icon_object_y ?? 50}%`,
                    }}
                  />
                </span>
              )}

              <span
                className="relative z-10 px-12 text-center"
                style={{
                  color:
                    link.text_color ||
                    globalButtonTextColor ||
                    undefined,
                }}
              >
                {link.title}
              </span>
            </TrackedPublicLink>
          );
        })}
      </div>
    </div>
  );
}