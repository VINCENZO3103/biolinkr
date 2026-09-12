"use client";

import { useMemo, useState } from "react";

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
  | "discord"
  | "spotify"
  | "patreon"
  | "onlyfans"
  | "fansly"
  | "kick";

type SocialLinkLike = {
  id?: string;
  profile_id?: string;
  platform: SocialPlatform;
  url: string;
  position?: number;
};

type SocialManagerProps = {
  socialLinks: SocialLinkLike[];
  socialPosition: "below_profile" | "footer";
  saving: boolean;
  onSocialLinksChange: (links: SocialLinkLike[]) => void;
  onSocialPositionChange: (position: "below_profile" | "footer") => void;
  onSave: () => void | Promise<void>;
};

const platforms: Array<{
  id: SocialPlatform;
  label: string;
  icon: string;
  placeholder: string;
}> = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "◎",
    placeholder: "https://instagram.com/tuo_username",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "♪",
    placeholder: "https://tiktok.com/@tuo_username",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "▶",
    placeholder: "https://youtube.com/@tuo_canale",
  },
  {
    id: "x",
    label: "X",
    icon: "𝕏",
    placeholder: "https://x.com/tuo_username",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "f",
    placeholder: "https://facebook.com/tuo_username",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "in",
    placeholder: "https://linkedin.com/in/tuo_username",
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈",
    placeholder: "https://t.me/tuo_username",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "◉",
    placeholder: "https://wa.me/numero",
  },
  {
    id: "twitch",
    label: "Twitch",
    icon: "▣",
    placeholder: "https://twitch.tv/tuo_canale",
  },
  {
    id: "discord",
    label: "Discord",
    icon: "◌",
    placeholder: "https://discord.gg/tuo_invito",
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: "◉",
    placeholder: "https://open.spotify.com/...",
  },
  {
    id: "patreon",
    label: "Patreon",
    icon: "P",
    placeholder: "https://patreon.com/tuo_nome",
  },
  {
    id: "onlyfans",
    label: "OnlyFans",
    icon: "OF",
    placeholder: "https://onlyfans.com/tuo_username",
  },
  {
    id: "fansly",
    label: "Fansly",
    icon: "F",
    placeholder: "https://fansly.com/tuo_username",
  },
  {
    id: "kick",
    label: "Kick",
    icon: "K",
    placeholder: "https://kick.com/tuo_canale",
  },
];

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function shortenUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname.replace("www.", "")}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return value;
  }
}

export default function SocialManager({
  socialLinks,
  socialPosition,
  saving,
  onSocialLinksChange,
  onSocialPositionChange,
  onSave,
}: SocialManagerProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("instagram");
  const [url, setUrl] = useState("");
  const [editingPlatform, setEditingPlatform] =
    useState<SocialPlatform | null>(null);
  const [editorMessage, setEditorMessage] = useState("");

  const selectedPlatformData = useMemo(
    () => platforms.find((platform) => platform.id === selectedPlatform),
    [selectedPlatform],
  );

  function openAddEditor() {
    const firstAvailable =
      platforms.find(
        (platform) =>
          !socialLinks.some((link) => link.platform === platform.id),
      )?.id ?? "instagram";

    setSelectedPlatform(firstAvailable);
    setUrl("");
    setEditingPlatform(null);
    setEditorMessage("");
    setIsEditorOpen(true);
  }

  function openEditEditor(link: SocialLinkLike) {
    setSelectedPlatform(link.platform);
    setUrl(link.url);
    setEditingPlatform(link.platform);
    setEditorMessage("");
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setUrl("");
    setEditingPlatform(null);
    setEditorMessage("");
  }

  function handlePlatformChange(platform: SocialPlatform) {
    setSelectedPlatform(platform);

    const existingLink = socialLinks.find(
      (link) => link.platform === platform,
    );

    if (existingLink) {
      setUrl(existingLink.url);
      setEditingPlatform(platform);
      return;
    }

    setUrl("");
    setEditingPlatform(null);
  }

  function handleSavePlatform() {
    const cleanUrl = url.trim();

    if (!selectedPlatformData) return;

    if (!isValidHttpUrl(cleanUrl)) {
      setEditorMessage(
        "Inserisci un URL valido che inizi con https:// oppure http://.",
      );
      return;
    }

    const alreadyExists = socialLinks.some(
      (link) => link.platform === selectedPlatform,
    );

    const updatedLinks = alreadyExists
      ? socialLinks.map((link) =>
          link.platform === selectedPlatform
            ? { ...link, url: cleanUrl }
            : link,
        )
      : [
          ...socialLinks,
          {
            platform: selectedPlatform,
            url: cleanUrl,
            position: socialLinks.length,
          },
        ];

    onSocialLinksChange(updatedLinks);
    closeEditor();
  }

  function handleRemovePlatform(platform: SocialPlatform) {
    onSocialLinksChange(
      socialLinks.filter((link) => link.platform !== platform),
    );

    if (editingPlatform === platform) {
      closeEditor();
    }
  }

  function getPlatform(platformId: SocialPlatform) {
    return platforms.find((platform) => platform.id === platformId);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#17181e] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d084]">
            Social
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            I tuoi profili
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
            Collega i tuoi profili social, riordinali e scegli dove mostrarli
            sulla tua pagina pubblica.
          </p>
        </div>

        <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/10 px-3 py-2 text-xs font-black text-[#00d084]">
          {socialLinks.length}{" "}
          {socialLinks.length === 1 ? "piattaforma" : "piattaforme"} collegate
        </span>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white">Piattaforme collegate</h3>
            <p className="mt-1 text-sm text-white/45">
              Modifica o rimuovi i profili senza aprire una lunga lista.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddEditor}
            className="rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
          >
            + Aggiungi piattaforma
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-[#0c0d12] px-5 py-8 text-center">
            <p className="font-bold text-white">Nessun social collegato</p>
            <p className="mt-2 text-sm text-white/45">
              Aggiungi il primo profilo per mostrarlo nella tua bio.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {socialLinks.map((link) => {
              const platform = getPlatform(link.platform);

              if (!platform) return null;

              return (
                <div
                  key={link.platform}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-3 sm:flex-nowrap"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-[#00d084]">
                    {platform.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">{platform.label}</p>
                    <p className="mt-1 truncate text-sm text-white/45">
                      {shortenUrl(link.url)}
                    </p>
                  </div>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => openEditEditor(link)}
                      className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084] sm:flex-none"
                    >
                      Modifica
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemovePlatform(link.platform)}
                      className="flex-1 rounded-lg border border-red-400/30 px-3 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400 hover:text-[#07100d] sm:flex-none"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isEditorOpen && (
        <div className="mt-6 rounded-2xl border border-[#00d084]/25 bg-[#0c0d12] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-white">
                {editingPlatform ? "Modifica piattaforma" : "Aggiungi piattaforma"}
              </h3>
              <p className="mt-1 text-sm text-white/45">
                Scegli il social e incolla il link del tuo profilo.
              </p>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/65 transition hover:border-white/30 hover:text-white"
            >
              Chiudi
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {platforms.map((platform) => {
              const linked = socialLinks.some(
                (link) => link.platform === platform.id,
              );
              const selected = selectedPlatform === platform.id;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => handlePlatformChange(platform.id)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    selected
                      ? "border-[#00d084] bg-[#00d084]/10 text-white"
                      : "border-white/10 bg-[#17181e] text-white/70 hover:border-white/30"
                  }`}
                >
                  <span className="block text-sm font-black">{platform.icon}</span>
                  <span className="mt-1 block truncate text-xs font-bold">
                    {platform.label}
                  </span>
                  {linked && (
                    <span className="mt-1 block text-[10px] font-bold text-[#00d084]">
                      Collegato
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <label className="mt-5 block text-sm font-bold text-white/80">
            URL di {selectedPlatformData?.label}
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={selectedPlatformData?.placeholder}
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
            />
          </label>

          {editorMessage && (
            <p className="mt-3 text-sm font-bold text-red-300">
              {editorMessage}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSavePlatform}
              className="rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
            >
              {editingPlatform ? "Aggiorna piattaforma" : "Aggiungi piattaforma"}
            </button>

            <button
              type="button"
              onClick={closeEditor}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-white/30"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="font-bold text-white">Posizione delle icone</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSocialPositionChange("below_profile")}
            className={`rounded-xl border p-4 text-left transition ${
              socialPosition === "below_profile"
                ? "border-[#00d084] bg-[#00d084]/10"
                : "border-white/10 bg-[#0c0d12] hover:border-white/30"
            }`}
          >
            <p className="font-bold text-white">Sotto nome, username e bio</p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Le icone appariranno subito sotto la descrizione del profilo.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSocialPositionChange("footer")}
            className={`rounded-xl border p-4 text-left transition ${
              socialPosition === "footer"
                ? "border-[#00d084] bg-[#00d084]/10"
                : "border-white/10 bg-[#0c0d12] hover:border-white/30"
            }`}
          >
            <p className="font-bold text-white">Nel footer</p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Le icone appariranno in fondo alla pagina, sopra “Creato con bioLinkr”.
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-[#00d084] px-5 py-4 text-base font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Salvataggio..." : "Salva modifiche social"}
        </button>
      </div>
    </section>
  );
}