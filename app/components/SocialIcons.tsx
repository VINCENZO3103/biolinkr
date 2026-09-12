"use client";

import {
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSpotify,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import {
  FaEnvelope,
  FaGlobe,
  FaTelegram,
} from "react-icons/fa";

import {
  SiKick,
  SiOnlyfans,
  SiPatreon,
} from "react-icons/si";

import { supabase } from "../supabase";

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "facebook"
  | "linkedin"
  | "telegram"
  | "whatsapp"
  | "twitch"
  | "kick"
  | "discord"
  | "spotify"
  | "patreon"
  | "onlyfans"
  | "fansly"
  | "github"
  | "website"
  | "email";

export type SocialLink = {
  id?: string;
  profile_id?: string;
  platform: SocialPlatform;
  url: string;
  position?: number;
};

type SocialIconsProps = {
  links: SocialLink[];
  className?: string;
};

const socialConfig: Record<
  SocialPlatform,
  {
    label: string;
    icon: typeof FaInstagram;
    hoverClass: string;
    imageSrc?: string;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    hoverClass: "hover:border-pink-400 hover:text-pink-300",
  },
  tiktok: {
    label: "TikTok",
    icon: FaTiktok,
    hoverClass: "hover:border-white hover:text-white",
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
    hoverClass: "hover:border-red-500 hover:text-red-400",
  },
  x: {
    label: "X / Twitter",
    icon: FaXTwitter,
    hoverClass: "hover:border-white hover:text-white",
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebookF,
    hoverClass: "hover:border-blue-500 hover:text-blue-300",
  },
  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    hoverClass: "hover:border-sky-500 hover:text-sky-300",
  },
  telegram: {
    label: "Telegram",
    icon: FaTelegram,
    hoverClass: "hover:border-sky-400 hover:text-sky-300",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: FaWhatsapp,
    hoverClass: "hover:border-emerald-400 hover:text-emerald-300",
  },
  twitch: {
    label: "Twitch",
    icon: FaTwitch,
    hoverClass: "hover:border-violet-400 hover:text-violet-300",
  },
  kick: {
    label: "Kick",
    icon: SiKick,
    hoverClass: "hover:border-lime-400 hover:text-lime-300",
  },
  discord: {
    label: "Discord",
    icon: FaDiscord,
    hoverClass: "hover:border-indigo-400 hover:text-indigo-300",
  },
  spotify: {
    label: "Spotify",
    icon: FaSpotify,
    hoverClass: "hover:border-green-400 hover:text-green-300",
  },
  patreon: {
    label: "Patreon",
    icon: SiPatreon,
    hoverClass: "hover:border-orange-400 hover:text-orange-300",
  },
  onlyfans: {
    label: "OnlyFans",
    icon: SiOnlyfans,
    hoverClass: "hover:border-sky-400 hover:text-sky-300",
  },
  fansly: {
  label: "Fansly",
  icon: FaGlobe,
  hoverClass: "hover:border-sky-400 hover:text-sky-300",
  imageSrc: "/icons/fansly.svg",
},
  github: {
    label: "GitHub",
    icon: FaGithub,
    hoverClass: "hover:border-white hover:text-white",
  },
  website: {
    label: "Sito web",
    icon: FaGlobe,
    hoverClass: "hover:border-[#00d084] hover:text-[#00d084]",
  },
  email: {
    label: "Email",
    icon: FaEnvelope,
    hoverClass: "hover:border-[#00d084] hover:text-[#00d084]",
  },
};

export default function SocialIcons({
  links,
  className = "",
}: SocialIconsProps) {
  const visibleLinks = [...links]
    .filter((link) => link.url?.trim())
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {visibleLinks.map((link) => {
        const config = socialConfig[link.platform];

        if (!config) {
          return null;
        }

        const Icon = config.icon;

        const href =
          link.platform === "email" && !link.url.startsWith("mailto:")
            ? `mailto:${link.url}`
            : link.platform === "whatsapp" &&
                !link.url.startsWith("https://")
              ? `https://wa.me/${link.url.replace(/\D/g, "")}`
              : link.url;

        return (
          <a
  key={link.id ?? `${link.platform}-${link.url}`}
  href={href}
  target={link.platform === "email" ? undefined : "_blank"}
  rel={
    link.platform === "email"
      ? undefined
      : "noopener noreferrer"
  }
  aria-label={config.label}
  title={config.label}
  onClick={() => {
  console.log("SOCIAL CLICK DEBUG", {
    id: link.id,
    profileId: link.profile_id,
    platform: link.platform,
    url: link.url,
  });

  if (!link.profile_id) {
    console.warn("SOCIAL CLICK BLOCCATO: profile_id mancante");
    return;
  }

  void supabase
    .from("social_clicks")
    .insert({
      profile_id: link.profile_id,
      social_link_id: link.id ?? null,
      platform: link.platform,
    })
    .then(({ data, error }) => {
      if (error) {
        console.error("SOCIAL CLICK ERRORE", error);
        return;
      }

      console.log("SOCIAL CLICK SALVATO", data);
    });
}}
  className={`grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition duration-200 hover:-translate-y-0.5 ${config.hoverClass}`}
>
  {config.imageSrc ? (
    <img
      src={config.imageSrc}
      alt=""
      aria-hidden="true"
      className="h-9 w-9 object-contain"
    />
  ) : (
    <Icon aria-hidden="true" />
  )}
</a>
        );
      })}
    </div>
  );
}