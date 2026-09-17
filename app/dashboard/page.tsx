"use client";

import ImageCropEditor from "../components/ImageCropEditor";

import {
  ChangeEvent,
  FormEvent,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "../supabase";
import ProfilePreview from "../components/ProfilePreview";
import IPhonePreview from "../components/IPhonePreview";
import SocialIcons, {
  SocialLink,
  SocialPlatform,
} from "../components/SocialIcons";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  avatar_width: number | null;
avatar_height: number | null;
avatar_position_x: number | null;
avatar_position_y: number | null;
  bg_color: string | null;
  bg_image_url: string | null;
  banner_image_url: string | null;
  bg_video_url: string | null; 
  button_style: string;
  social_position: "below_profile" | "footer" | null;
  display_name_color: string | null;
  username_color: string | null;
  bio_color: string | null;
  display_name_size: string | null;
  bio_size: string | null;
  plan: "free" | "premium";
};

type BioLink = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  position: number;
  starts_at: string | null;
  ends_at: string | null;
  ab_group: string | null;
  is_variant: boolean;
  variant_of: string | null;
  icon_url: string | null;
  icon_object_x: number | null;
icon_object_y: number | null;
  icon_size: number;
  icon_position_x: "left" | "center" | "right";
  icon_position_y: "top" | "center" | "bottom";
  display_type: "button" | "image";
image_url: string | null;
image_height: number | null;
background_color: string | null;
badge_text: string | null;
text_color: string | null;
hover_effect: string | null;
};

type SocialLinkRow = SocialLink & {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  url: string;
  position: number;
};

type Product = {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  file_url: string | null;
  external_url: string | null;
  cover_image_url: string | null;
};

type Order = {
  id: string;
  product_id: string;
  profile_id: string;
  buyer_email: string;
  buyer_name: string | null;
  amount_cents: number;
  currency: string;
};

type LinkClick = {
  link_id: string;
  clicked_at: string;
};

type SocialClick = {
  platform: string;
  clicked_at: string;
};

type ProfileView = {
  profile_id: string;
  viewed_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

type TrafficRow = {
  label: string;
  visits: number;
  percentage: number;
};

type LinkStatus = {
  label: string;
  detail: string;
  className: string;
};

type SortableLinkItemProps = {
  link: BioLink;
  variants: BioLink[];
  isEditing: boolean;
  editingTitle: string;
  editingUrl: string;
  editingIconUrl: string;

  editingIconObjectX: number;
  editingIconObjectY: number;

  editingIconSize: number;
  editingIconPositionX: "left" | "center" | "right";
  editingIconPositionY: "top" | "center" | "bottom";
  editingImageHeight: number;
  editingBackgroundColor: string;
  editingBadgeText: string;
  editingTextColor: string;
  editingHoverEffect: string;
  editingScheduleEnabled: boolean;
  editingStartsAt: string;
  editingEndsAt: string;
  savingEdit: boolean;
  deleting: boolean;
  uploadingIcon: boolean;

  onIconFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEdit: (link: BioLink) => void;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onIconUrlChange: (value: string) => void;

  onIconObjectPositionChange: (x: number, y: number) => void;
  onResetIconObjectPosition: () => void;

  onIconSizeChange: (value: number) => void;
  onIconPositionXChange: (value: "left" | "center" | "right") => void;
  onIconPositionYChange: (
    value: "top" | "center" | "bottom"
  ) => void;
  onImageHeightChange: (value: number) => void;
  onBackgroundColorChange: (value: string) => void;
  onBadgeTextChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
  onHoverEffectChange: (value: string) => void;
  onScheduleEnabledChange: (enabled: boolean) => void;
  onStartsAtChange: (value: string) => void;
  onEndsAtChange: (value: string) => void;
  onQuickSchedule: (
    preset: "hour" | "tonight" | "tomorrow" | "week",
    target: "new" | "edit"
  ) => void;
  onSave: (linkId: string) => void;
  onCancel: () => void;
  onDelete: (linkId: string) => void;
  onAddVariant: (link: BioLink) => void;
};

type AddVariantModalProps = {
  originalLink: BioLink;
  isOpen: boolean;
  saving: boolean;
  variantTitle: string;
  variantUrl: string;
  message: string;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
};

type AbGroupStats = {
  ab_group: string;
  links: BioLink[];
  stats: { link: BioLink; clicks: number }[];
  totalClicksInGroup: number;
  winner: { link: BioLink; clicks: number } | null;
};

type ProductForm = {
  title: string;
  description: string;
  priceCents: string;
  currency: string;
  fileUrl: string;
  externalUrl: string;
  coverImageUrl: string;
};

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function fromIsoToDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return toDateTimeLocalValue(date);
}

function getTimeUntil(targetDate: Date) {
  const difference = targetDate.getTime() - Date.now();
  const absoluteDifference = Math.abs(difference);

  const minutes = Math.round(absoluteDifference / (1000 * 60));
  const hours = Math.round(absoluteDifference / (1000 * 60 * 60));
  const days = Math.round(absoluteDifference / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${Math.max(1, minutes)} min`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "ora" : "ore"}`;
  }

  return `${days} ${days === 1 ? "giorno" : "giorni"}`;
}

function getLinkStatus(link: BioLink): LinkStatus {
  const now = new Date();

  if (link.starts_at) {
    const startsAt = new Date(link.starts_at);

    if (startsAt > now) {
      return {
        label: "Programmato",
        detail: `Tra ${getTimeUntil(startsAt)}`,
        className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
      };
    }
  }

  if (link.ends_at) {
    const endsAt = new Date(link.ends_at);

    if (endsAt <= now) {
      return {
        label: "Scaduto",
        detail: "Non visibile",
        className: "border-red-400/25 bg-red-400/10 text-red-300",
      };
    }

    return {
      label: "Live ora",
      detail: `Scade tra ${getTimeUntil(endsAt)}`,
      className: "border-[#00d084]/25 bg-[#00d084]/10 text-[#00d084]",
    };
  }

  return {
    label: "Live ora",
    detail: "Sempre visibile",
    className: "border-[#00d084]/25 bg-[#00d084]/10 text-[#00d084]",
  };
}

function isLinkActive(link: BioLink) {
  const status = getLinkStatus(link);

  return status.label === "Live ora";
}

function SortableLinkItem({
  link,
  variants,
  isEditing,
  editingTitle,
  editingUrl,
  editingIconUrl,

  editingIconObjectX,
  editingIconObjectY,

  editingIconSize,
  editingIconPositionX,
  editingIconPositionY,
  editingImageHeight,
  editingBackgroundColor,
  editingBadgeText,
  editingTextColor,
  editingHoverEffect,
  editingScheduleEnabled,
  editingStartsAt,
  editingEndsAt,
  savingEdit,
  deleting,
  uploadingIcon,
  onIconFileChange,
  onEdit,
  onTitleChange,
  onUrlChange,
  onIconUrlChange,

  onIconObjectPositionChange,
  onResetIconObjectPosition,

  onIconSizeChange,
  onIconPositionXChange,
  onIconPositionYChange,
  onImageHeightChange,
  onBackgroundColorChange,
  onBadgeTextChange,
  onTextColorChange,
  onHoverEffectChange,
  onScheduleEnabledChange,
  onStartsAtChange,
  onEndsAtChange,
  onQuickSchedule,
  onSave,
  onCancel,
  onDelete,
  onAddVariant,
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const status = getLinkStatus(link);
  const hasVariants = variants.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-white/10 bg-[#0c0d12] p-4 ${
        isDragging ? "z-10 opacity-50 shadow-2xl" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editingTitle}
            onChange={(event) => onTitleChange(event.target.value)}
            maxLength={80}
            placeholder="Titolo del link"
            className="w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
          />

          <input
            type="url"
            value={editingUrl}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
          />

          <div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
  <div className="flex items-start gap-4">
    <div
  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
  style={{
    backgroundColor: editingBackgroundColor || "rgba(255,255,255,0.15)",
  }}
>
  {editingIconUrl ? (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
  {editingIconUrl ? (
    <img
      src={editingIconUrl}
      alt="Anteprima icona link"
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-xl text-white/35">🖼️</span>
  )}
</div>
  ) : null}
</div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-white">Icona del link</p>

      <p className="mt-1 text-xs text-white/45">
        JPG, PNG o WEBP · massimo 1 MB
      </p>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onIconFileChange}
        disabled={uploadingIcon}
        className="mt-3 block w-full cursor-pointer text-sm text-white/65 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-bold file:text-white file:transition hover:file:bg-[#00d084] hover:file:text-[#07100d] disabled:cursor-not-allowed"
      />
    </div>
  </div>

</div>

{editingIconUrl && (
  <>
    {/* Dimensione icona */}
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-bold text-white/80">
          Dimensione icona
          <span className="ml-2 rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-[#00d084]">
            {editingIconSize}px
          </span>
        </label>
      </div>

      <input
        type="range"
        min="16"
        max="250"
        step="1"
        value={editingIconSize}
        onChange={(event) => onIconSizeChange(Number(event.target.value))}
        className="mt-3 w-full cursor-pointer accent-[#00d084]"
      />

      <div className="mt-2 flex justify-between text-[11px] text-white/40">
        <span>Piccola</span>
        <span>Grande</span>
      </div>
    </div>

    {/* Inquadratura thumbnail (drag&drop) */}
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-white/80">
            Inquadratura thumbnail
          </p>
          <p className="mt-1 text-xs text-white/45">
            Trascina l’immagine per scegliere quale parte mostrare nel cerchio.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetIconObjectPosition}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/65 transition hover:border-[#00d084] hover:text-[#00d084]"
        >
          Ripristina
        </button>
      </div>

      <ImageCropEditor
  src={editingIconUrl}
  x={editingIconObjectX}
  y={editingIconObjectY}
  onChange={onIconObjectPositionChange}
  iconSize={editingIconSize}
  label="Inquadratura thumbnail"
  size={220}
/>
    </div>
  </>
)}

<div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-sm font-bold text-white">Sfondo del link</p>
      <p className="mt-1 text-xs text-white/45">
        Lascia vuoto per usare lo stile globale della pagina.
      </p>
    </div>

    {editingBackgroundColor && (
      <button
        type="button"
        onClick={() => onBackgroundColorChange("")}
        className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/65 transition hover:border-red-400 hover:text-red-300"
      >
        Ripristina
      </button>
    )}
  </div>

  <input
    type="text"
    value={editingBackgroundColor}
    onChange={(event) => onBackgroundColorChange(event.target.value)}
    placeholder="#00d084 oppure linear-gradient(135deg, #7c3aed, #ec4899)"
    className="mt-4 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
  />

  <div className="mt-3 flex flex-wrap items-center gap-3">
    <input
      type="color"
      value={
        editingBackgroundColor?.startsWith("#") &&
        !editingBackgroundColor.includes("(")
          ? editingBackgroundColor
          : "#00d084"
      }
      onChange={(event) => onBackgroundColorChange(event.target.value)}
      className="h-10 w-14 cursor-pointer rounded-lg border border-white/15 bg-[#0c0d12] p-0"
    />

    <span className="text-xs text-white/45">
      Scegli un colore oppure scrivi un gradiente CSS.
    </span>
  </div>

  <div
    className="mt-4 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-black text-[#07100d]"
    style={{
      background: editingBackgroundColor || "#00d084",
    }}
  >
    Anteprima del link
  </div>
</div>

<div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-white">Colore del testo</p>
      <p className="mt-1 text-xs text-white/45">
        Scegli un colore che rimanga leggibile sullo sfondo del link.
      </p>
    </div>

    {editingTextColor && (
      <button
        type="button"
        onClick={() => onTextColorChange("")}
        className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/65 transition hover:border-red-400 hover:text-red-300"
      >
        Ripristina
      </button>
    )}
  </div>

  <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
    {[
      { label: "Bianco", value: "#ffffff" },
      { label: "Nero", value: "#07100d" },
      { label: "Smeraldo", value: "#00d084" },
      { label: "Oro", value: "#facc15" },
      { label: "Rosa", value: "#f9a8d4" },
      { label: "Viola", value: "#c4b5fd" },
    ].map((preset) => (
      <button
        key={preset.value}
        type="button"
        onClick={() => onTextColorChange(preset.value)}
        title={preset.label}
        className={`flex h-10 items-center justify-center rounded-xl border transition ${
          editingTextColor.toLowerCase() === preset.value
            ? "border-[#00d084] ring-2 ring-[#00d084]/25"
            : "border-white/10 hover:border-white/35"
        }`}
        style={{ backgroundColor: preset.value }}
      >
        <span
          className="text-[10px] font-black"
          style={{
            color: preset.value === "#07100d" ? "#ffffff" : "#07100d",
          }}
        >
          A
        </span>
      </button>
    ))}
  </div>

  <div className="mt-4 flex items-center gap-3">
    <input
      type="color"
      value={
        editingTextColor?.startsWith("#") && editingTextColor.length === 7
          ? editingTextColor
          : "#ffffff"
      }
      onChange={(event) => onTextColorChange(event.target.value)}
      className="h-11 w-14 cursor-pointer rounded-xl border border-white/15 bg-[#0c0d12] p-0"
    />

    <input
      type="text"
      value={editingTextColor}
      onChange={(event) => onTextColorChange(event.target.value)}
      placeholder="#ffffff"
      className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0c0d12] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#00d084]"
    />
  </div>

  <div
    className="mt-4 rounded-xl border border-white/10 bg-[#0c0d12] px-4 py-3 text-center text-sm font-black"
    style={{
      color: editingTextColor || "#ffffff",
    }}
  >
    Il tuo testo qui
  </div>
</div>

<div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-white">Effetto hover</p>
      <p className="mt-1 text-xs text-white/45">
        Scegli come deve reagire il link quando il cursore ci passa sopra.
      </p>
    </div>

    {editingHoverEffect && editingHoverEffect !== "none" && (
      <button
        type="button"
        onClick={() => onHoverEffectChange("none")}
        className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/65 transition hover:border-red-400 hover:text-red-300"
      >
        Ripristina
      </button>
    )}
  </div>

  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
    {[
      { value: "none", label: "Nessuno", desc: "Statico" },
      { value: "lift", label: "Lift", desc: "Si solleva" },
      { value: "glow", label: "Glow", desc: "Bagliore" },
      { value: "shine", label: "Shine", desc: "Riflesso" },
      { value: "pulse", label: "Pulse", desc: "Pulsante" },
    ].map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onHoverEffectChange(opt.value)}
        className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition ${
          editingHoverEffect === opt.value
            ? "border-[#00d084] bg-[#00d084]/10"
            : "border-white/10 hover:border-white/35"
        }`}
      >
        <span className="text-sm font-bold text-white">{opt.label}</span>
        <span className="text-[10px] text-white/50">{opt.desc}</span>
      </button>
    ))}
  </div>

</div>

{link.display_type === "image" && (
  <div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-white">Altezza immagine</p>
        <p className="mt-1 text-xs text-white/45">
          Regola l’altezza del banner immagine.
        </p>
      </div>

      <span className="rounded-lg bg-[#00d084]/10 px-3 py-2 text-sm font-black text-[#00d084]">
        {editingImageHeight}px
      </span>
    </div>

    <input
      type="range"
      min="120"
      max="520"
      step="10"
      value={editingImageHeight}
      onChange={(event) => onImageHeightChange(Number(event.target.value))}
      className="mt-5 w-full cursor-pointer accent-[#00d084]"
    />

    <div className="mt-2 flex justify-between text-[11px] text-white/40">
      <span>Compatta</span>
      <span>Grande</span>
    </div>
  </div>
)}

          <div className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-white">Programmazione</p>
                <p className="mt-1 text-sm text-white/45">
                  Attiva o nascondi automaticamente il link.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onScheduleEnabledChange(!editingScheduleEnabled)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  editingScheduleEnabled
                    ? "bg-[#00d084] text-[#07100d]"
                    : "bg-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                {editingScheduleEnabled ? "Programmato" : "Sempre attivo"}
              </button>
            </div>

            {editingScheduleEnabled && (
              <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onQuickSchedule("hour", "edit")}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                  >
                    +1 ora
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickSchedule("tonight", "edit")}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                  >
                    Stasera
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickSchedule("tomorrow", "edit")}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                  >
                    Domani
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickSchedule("week", "edit")}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                  >
                    7 giorni
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-bold text-white/75">
                    Pubblica da
                    <input
                      type="datetime-local"
                      value={editingStartsAt}
                      onChange={(event) => onStartsAtChange(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-3 py-3 text-white outline-none focus:border-[#00d084]"
                    />
                  </label>

                  <label className="text-sm font-bold text-white/75">
                    Nascondi dopo
                    <input
                      type="datetime-local"
                      value={editingEndsAt}
                      onChange={(event) => onEndsAtChange(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-3 py-3 text-white outline-none focus:border-[#00d084]"
                    />
                  </label>
                </div>

                <p className="text-xs text-white/45">
                  Lascia â€œPubblica daâ€ vuoto per renderlo visibile subito.
                  Lascia â€œNascondi dopoâ€ vuoto per non impostare una scadenza.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSave(link.id)}
              disabled={savingEdit || uploadingIcon}
              className="rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:opacity-60"
            >
              {savingEdit ? "Salvataggio..." : "Salva modifiche"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={savingEdit}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-white/30"
            >
              Annulla
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-wrap items-start gap-3 sm:flex-nowrap sm:items-center">
          <button
  type="button"
  {...attributes}
  {...listeners}
  aria-label={`Trascina ${link.title} per cambiare ordine`}
  className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-lg border border-white/15 text-white/55 transition hover:border-[#00d084] hover:text-[#00d084] active:cursor-grabbing"
>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </svg>
</button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-bold text-white">{link.title}</p>

              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}
              >
                {status.label}
              </span>

              {hasVariants && (
                <span className="rounded-full border border-[#9d7bff]/30 bg-[#9d7bff]/15 px-2.5 py-1 text-xs font-bold text-[#d3b8ff]">
                  A/B test
                </span>
              )}
            </div>

            <p className="mt-1 truncate text-sm text-white/45">{link.url}</p>

            <p className="mt-2 text-xs text-white/45">{status.detail}</p>

            {hasVariants && (
              <p className="mt-2 text-xs text-[#9d7bff]/80">
                {variants.length} variante{variants.length > 1 ? "i" : ""} attiva
                {variants.length > 1 ? "i" : ""}
              </p>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
  <button
    type="button"
    onClick={() => onEdit(link)}
    className="min-w-0 flex-1 rounded-lg border border-white/15 px-2 py-2 text-xs font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084] sm:flex-none sm:px-3 sm:text-sm"
  >
    Modifica
  </button>

  {!hasVariants ? (
    <button
      type="button"
      onClick={() => onAddVariant(link)}
      className="min-w-0 flex-1 rounded-lg border border-[#9d7bff]/40 px-2 py-2 text-xs font-bold text-[#d3b8ff] transition hover:bg-[#9d7bff] hover:text-[#0c0d12] sm:flex-none sm:px-3 sm:text-sm"
    >
      <span className="sm:hidden">A/B</span>
      <span className="hidden sm:inline">+ Variante</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onAddVariant(link)}
      className="min-w-0 flex-1 rounded-lg border border-[#9d7bff]/40 px-2 py-2 text-xs font-bold text-[#d3b8ff] transition hover:bg-[#9d7bff] hover:text-[#0c0d12] sm:flex-none sm:px-3 sm:text-sm"
    >
      <span className="sm:hidden">Gestisci</span>
      <span className="hidden sm:inline">Gestisci</span>
    </button>
  )}

  <button
    type="button"
    onClick={() => onDelete(link.id)}
    disabled={deleting}
    className="min-w-0 flex-1 rounded-lg border border-red-400/30 px-2 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400 hover:text-[#0c0d12] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-3 sm:text-sm"
  >
    {deleting ? "..." : "Elimina"}
  </button>
</div>
        </div>
      )}
    </div>
  );
}

function AddVariantModal({
  originalLink,
  isOpen,
  saving,
  variantTitle,
  variantUrl,
  message,
  onTitleChange,
  onUrlChange,
  onSave,
  onClose,
}: AddVariantModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
        <h3 className="text-2xl font-black text-white">
          Aggiungi variante A/B
        </h3>

        <p className="mt-2 text-white/55">
          Crea una seconda versione di questo link per testare quale titolo o
          URL performa meglio.
        </p>

        <div className="mt-2 rounded-xl border border-white/10 bg-[#0c0d12] p-4">
          <p className="text-sm font-bold text-white/70">Link originale</p>
          <p className="mt-1 truncate text-sm text-white/45">
            {originalLink.title}
          </p>
          <p className="truncate text-xs text-white/40">{originalLink.url}</p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-white/90">
            Titolo della variante
            <input
              type="text"
              value={variantTitle}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Es. Iscriviti alla newsletter"
              maxLength={80}
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#9d7bff]"
            />
          </label>

          <label className="block text-sm font-bold text-white/90">
            URL della variante
            <input
              type="url"
              value={variantUrl}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#9d7bff]"
            />
          </label>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-white/70">{message}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !variantTitle.trim() || !variantUrl.trim()}
            className="rounded-xl bg-[#9d7bff] px-5 py-3 text-sm font-black text-[#0c0d12] transition hover:bg-[#b696ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Creazione..." : "Crea variante"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

type ConfirmMakeWinnerModalProps = {
  isOpen: boolean;
  winnerLink: BioLink;
  otherVariants: BioLink[];
  saving: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmMakeWinnerModal({
  isOpen,
  winnerLink,
  otherVariants,
  saving,
  message,
  onConfirm,
  onClose,
}: ConfirmMakeWinnerModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
        <h3 className="text-2xl font-black text-white">
          Rendi definitiva questa variante
        </h3>

        <p className="mt-2 text-white/55">
          Confermi di voler tenere solo questa variante ed eliminare le altre?
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0c0d12] p-4">
          <p className="text-sm font-bold text-white/70">Variante vincente</p>
          <p className="mt-1 truncate text-sm text-white/45">
            {winnerLink.title}
          </p>
          <p className="truncate text-xs text-white/40">{winnerLink.url}</p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-bold text-white/50">
              Verranno eliminate {otherVariants.length} variante
              {otherVariants.length > 1 ? "i" : ""}:
            </p>

            <ul className="mt-2 space-y-1">
              {otherVariants.map((v) => (
                <li key={v.id} className="truncate text-xs text-white/40">
                  â€¢ {v.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-white/70">{message}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="rounded-xl bg-[#9d7bff] px-5 py-3 text-sm font-black text-[#0c0d12] transition hover:bg-[#b696ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Elaborazione..." : "Conferma e rendi definitiva"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

type ProductModalProps = {
  isOpen: boolean;
  product: Product | null;
  saving: boolean;
  form: ProductForm;
  message: string;
  onFormChange: (form: ProductForm) => void;
  onSave: () => void;
  onClose: () => void;
};

function ProductModal({
  isOpen,
  product,
  saving,
  form,
  message,
  onFormChange,
  onSave,
  onClose,
}: ProductModalProps) {
  if (!isOpen) {
    return null;
  }

  function updateField<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) {
    onFormChange({ ...form, [key]: value });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
        <h3 className="text-2xl font-black text-white">
          {product ? "Modifica prodotto" : "Nuovo prodotto"}
        </h3>

        <p className="mt-2 text-white/55">
          {product
            ? "Modifica le informazioni del tuo prodotto digitale."
            : "Crea un nuovo prodotto digitale da vendere sulla tua pagina."}
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-white/90">
            Titolo
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Es. Preset Lightroom"
              maxLength={80}
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
            />
          </label>

          <label className="block text-sm font-bold text-white/90">
            Descrizione
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descrivi il tuo prodotto..."
              maxLength={500}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
            />

            <span className="mt-2 block text-right text-xs text-white/45">
              {form.description.length}/500
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-white/90">
              Prezzo (â‚¬)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceCents}
                onChange={(e) => updateField("priceCents", e.target.value)}
                placeholder="19.90"
                className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
              />
            </label>

            <label className="block text-sm font-bold text-white/90">
              Valuta
              <select
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none focus:border-[#00d084]"
              >
                <option value="EUR">EUR (â‚¬)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (Â£)</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-bold text-white/90">
            Cover immagine URL
            <input
              type="url"
              value={form.coverImageUrl}
              onChange={(e) => updateField("coverImageUrl", e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
            <p className="font-bold text-white">File o link esterno</p>
            <p className="mt-1 text-sm text-white/45">
              Carica il file del prodotto oppure inserisci un link esterno
              (Gumroad, Stripe Payment Link, ecc.).
            </p>

            <div className="mt-4 space-y-4">
              <label className="block text-sm font-bold text-white/75">
                URL file (opzionale)
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => updateField("fileUrl", e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
                />
              </label>

              <label className="block text-sm font-bold text-white/75">
                Link esterno (opzionale)
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={(e) => updateField("externalUrl", e.target.value)}
                  placeholder="https://gumroad.com/..."
                  className="mt-2 w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#00d084]"
                />
              </label>
            </div>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-white/70">{message}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={
              saving ||
              !form.title.trim() ||
              !form.priceCents ||
              Number(form.priceCents) < 0
            }
            className="rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Salvataggio..." : "Salva prodotto"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

type SortableSocialItemProps = {
  socialLink: SocialLinkRow;
};

function SortableSocialItem({
  socialLink,
}: SortableSocialItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: socialLink.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const platformLabel =
    socialLink.platform.charAt(0).toUpperCase() +
    socialLink.platform.slice(1);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-white/10 bg-[#0c0d12] p-3 transition ${
        isDragging ? "z-20 opacity-50 shadow-2xl" : ""
      }`}
    >
      <button
  type="button"
  {...attributes}
  {...listeners}
  aria-label="Trascina link.title per cambiare ordine"
  className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-lg border border-white/15 text-white/55 transition hover:border-[#00d084] hover:text-[#00d084] active:cursor-grabbing"
>
  <svg
  viewBox="0 0 24 24"
  fill="none"
  className="h-5 w-5"
  aria-hidden="true"
>
  <path
    d="M9 5h6M9 12h6M9 19h6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
</svg>
</button>

      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{platformLabel}</p>

        <p className="mt-1 truncate text-sm text-white/45">
          {socialLink.url}
        </p>
      </div>

      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-white/45">
        #{socialLink.position + 1}
      </span>
    </div>
  );
}

type SortableSocialPreviewIconProps = {
  socialLink: SocialLinkRow;
};

function SortableSocialPreviewIcon({
  socialLink,
}: SortableSocialPreviewIconProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: socialLink.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClickCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      className={`cursor-grab touch-none select-none transition active:cursor-grabbing ${
        isDragging ? "scale-110 opacity-70" : ""
      }`}
      title="Trascina per cambiare ordine"
    >
      <SocialIcons
        links={[socialLink]}
        className="justify-center"
      />
    </div>
  );
}

function flagFromCode(code: string | undefined): string {
  if (!code || code === "Unknown") return "🌍";

  const map: Record<string, string> = {
    IT: "🇮🇹",
    US: "🇺🇸",
    GB: "🇬🇧",
    FR: "🇫🇷",
    DE: "🇩🇪",
    ES: "🇪🇸",
    BR: "🇧🇷",
    MT: "🇲🇹",
    // aggiungi quelli che ti servono
  };

  return map[code.toUpperCase()] ?? "🌍";
}


export default function DashboardPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
const [showProModal, setShowProModal] = useState(false);

const [redeemCode, setRedeemCode] = useState("");
const [redeemingCode, setRedeemingCode] = useState(false);
const [redeemMessage, setRedeemMessage] = useState("");

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayNameColor, setDisplayNameColor] = useState("#ffffff");
const [usernameColor, setUsernameColor] = useState("#a3a3a3");
const [bioColor, setBioColor] = useState("#d4d4d4");
const [displayNameSize, setDisplayNameSize] = useState("text-4xl");
const [bioSize, setBioSize] = useState("text-base");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [videoOpacity, setVideoOpacity] = useState(0.6);
  // DEBUG
console.log("videoOpacity stato:", videoOpacity);
// Oggetto profilo derivato (per ora con piano fisso)
const profile: { plan: "free" | "premium"; bgvideourl: string | null } = {
  plan: "free",
  bgvideourl: null,
};
  const saveSocialLinks = async (profileId: string, links: SocialLink[]) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("DEBUG social:", {
    profileId,
    authUserId: user?.id,
    userError,
    links,
  });

  if (!user) {
    throw new Error("Nessun utente autenticato: effettua di nuovo il login.");
  }

  if (profileId !== user.id) {
    throw new Error(
      `ID profilo non corrisponde all'utente autenticato. Profilo: ${profileId}; utente: ${user.id}`
    );
  }

  const { error: deleteError } = await supabase
    .from("social_links")
    .delete()
    .eq("profile_id", user.id);

  if (deleteError) {
    console.error("Errore eliminazione social:", {
      message: deleteError.message,
      details: deleteError.details,
      hint: deleteError.hint,
      code: deleteError.code,
    });

    throw new Error(
      `Errore cancellazione social: ${deleteError.message} ${
        deleteError.details ?? ""
      }`
    );
  }

  const linksToSave = links
    .filter((link) => link.url.trim() !== "")
    .map((link, index) => ({
      profile_id: user.id,
      platform: link.platform,
      url: link.url.trim(),
      position: index,
    }));

  console.log("DEBUG link pronti per Supabase:", linksToSave);

  if (linksToSave.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("social_links")
    .insert(linksToSave);

  if (insertError) {
    console.error("Errore inserimento social:", {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
    });

    throw new Error(
      `Errore inserimento social: ${insertError.message} ${
        insertError.details ?? ""
      }`
    );
  }
};

  const [bgColor, setBgColor] = useState("");
  const [backgroundMode, setBackgroundMode] = useState<
  "color" | "gradient" | "image" | "video"
>("color");

const [gradientStart, setGradientStart] = useState("#2c135f");
const [gradientEnd, setGradientEnd] = useState("#0b766a");
const [gradientAngle, setGradientAngle] = useState("145deg");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bgVideoUrl, setBgVideoUrl] = useState<string | null>(null);
  const [buttonStyle, setButtonStyle] = useState("solid");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
const [socialPosition, setSocialPosition] = useState<
  "below_profile" | "footer"
>("footer");
const [savingSocials, setSavingSocials] = useState(false);
const [socialEditorOpen, setSocialEditorOpen] = useState(false);
const [activeSection, setActiveSection] = useState<
  "links" | "appearance" | "social" | "analytics" | "abtest" | "preview" | "pro"
>("links");

const [appearancePanel, setAppearancePanel] = useState<
  "layout" | "theme" | "background" | "buttons" | "profile" | null
>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkIconUrl, setLinkIconUrl] = useState("");
  const [newLinkIconFile, setNewLinkIconFile] = useState<File | null>(null);
  const [newLinkDisplayType, setNewLinkDisplayType] = useState<"button" | "image">("button");
const [newLinkImageFile, setNewLinkImageFile] = useState<File | null>(null);
const [newLinkImagePreview, setNewLinkImagePreview] = useState("");
  const [linkScheduleEnabled, setLinkScheduleEnabled] = useState(false);
  const [linkStartsAt, setLinkStartsAt] = useState("");
  const [linkEndsAt, setLinkEndsAt] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    title: "",
    description: "",
    priceCents: "",
    currency: "EUR",
    fileUrl: "",
    externalUrl: "",
    coverImageUrl: "",
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  const [ordersByProduct, setOrdersByProduct] = useState<
    Record<string, Order[]>
  >({});

  const [totalClicks, setTotalClicks] = useState(0);
  const [todayClicks, setTodayClicks] = useState(0);
  const [weekClicks, setWeekClicks] = useState(0);

  const [totalSocialClicks, setTotalSocialClicks] = useState(0);
  const [todaySocialClicks, setTodaySocialClicks] = useState(0);
  const [weekSocialClicks, setWeekSocialClicks] = useState(0);
  const [socialClicksByPlatform, setSocialClicksByPlatform] = useState<
  
  Record<string, number>
  >({});

  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [weekViews, setWeekViews] = useState(0);

  const [countriesByVisits, setCountriesByVisits] = useState<
  Array<{ name: string; value: number }>
>([]);

const [devicesByVisits, setDevicesByVisits] = useState<
  Array<{ name: string; value: number }>
>([]);

const [sourcesByVisits, setSourcesByVisits] = useState<
  Array<{ name: string; value: number }>
>([]);

const [geoAnalyticsLoading, setGeoAnalyticsLoading] = useState(false);

  const [clicksByLink, setClicksByLink] = useState<Record<string, number>>(
    {}
  );
  const [trafficSources, setTrafficSources] = useState<TrafficRow[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [editingLinkId, setEditingLinkId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const [editingIconUrl, setEditingIconUrl] = useState("");
  const [uploadingLinkIcon, setUploadingLinkIcon] = useState(false);
  const [editingIconObjectX, seteditingIconObjectX] = useState(50);
const [editingIconObjectY, seteditingIconObjectY] = useState(50);
  const [editingIconSize, setEditingIconSize] = useState(24);
const [editingIconPositionX, setEditingIconPositionX] = useState<
  "left" | "center" | "right"
>("left");
const [editingIconPositionY, setEditingIconPositionY] = useState<
  "top" | "center" | "bottom"
>("center");
  const [editingBackgroundColor, setEditingBackgroundColor] = useState("");
  const [editingImageHeight, setEditingImageHeight] = useState(220);
  const [editingBadgeText, setEditingBadgeText] = useState("");
  const [editingTextColor, setEditingTextColor] = useState("");
  const [editingHoverEffect, setEditingHoverEffect] = useState("none");
const [profileImageWidth, setProfileImageWidth] = useState<number>(120);

const avatarPreviewSize = profileImageWidth ?? 120;
const [profileImagePositionX, setProfileImagePositionX] = useState(50);
const avatarDragRef = useRef<HTMLDivElement | null>(null);
const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [editingScheduleEnabled, setEditingScheduleEnabled] = useState(false);
  const [editingStartsAt, setEditingStartsAt] = useState("");
  const [editingEndsAt, setEditingEndsAt] = useState("");

  const [addingVariantLinkId, setAddingVariantLinkId] = useState("");
  const [variantTitle, setVariantTitle] = useState("");
  const [variantUrl, setVariantUrl] = useState("");
  const [savingVariant, setSavingVariant] = useState(false);
  const [variantMessage, setVariantMessage] = useState("");

  const [confirmWinnerGroupId, setConfirmWinnerGroupId] = useState("");
  const [confirmWinnerLink, setConfirmWinnerLink] = useState<BioLink | null>(
    null
  );
  const [confirmOtherVariants, setConfirmOtherVariants] = useState<BioLink[]>(
    []
  );
  const [savingWinner, setSavingWinner] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState("");

  const [message, setMessage] = useState("");
  const [proModalOpen, setProModalOpen] = useState(false);
const [lockedFeature, setLockedFeature] = useState("Sfondi video");
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("free");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [profileLayout, setProfileLayout] = useState<
  "classic" | "hero" | "banner" | "shape"
>("classic");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [savingLink, setSavingLink] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    setUserId(user.id);
    setEmail(user.email ?? "");

    const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select(
    "id, username, display_name, bio, avatar_url, avatar_width, avatar_height, avatar_position_x, avatar_position_y, bg_color, bg_image_url, banner_image_url, bg_video_url, button_style, social_position, display_name_color, username_color, bio_color, display_name_size, display_name_align, bio_size, plan, video_opacity, subscription_status, subscription_end_date, profile_layout"
  )
  .eq("id", user.id)
  .maybeSingle();

  console.log("PROFILO CARICATO:", profile);

setPlan(profile?.plan === "premium" ? "premium" : "free");
setSubscriptionStatus(profile?.subscription_status ?? "free");
setSubscriptionEndDate(profile?.subscription_end_date ?? null);
setProfileLayout(
  profile?.profile_layout === "hero" ||
    profile?.profile_layout === "banner" ||
    profile?.profile_layout === "shape"
    ? profile.profile_layout
    : "classic"
);

    if (profileError) {
      setMessage(
        `Errore nel caricamento del profilo: ${profileError.message}`
      );
    }

    if (profile) {
  const savedProfile = profile as unknown as Profile;

  if (profile?.video_opacity != null) {
  setVideoOpacity(profile.video_opacity);
}

  // Imposta il piano
  setPlan((savedProfile as Profile & { plan?: "free" | "premium" }).plan === "premium" ? "premium" : "free");

  setSocialPosition(
    (savedProfile as Profile & {
      social_position?: "below_profile" | "footer";
    }).social_position === "below_profile"
      ? "below_profile"
      : "footer"
  );

  setUsername(savedProfile.username ?? "");
  setDisplayName(savedProfile.display_name ?? "");
  setBio(savedProfile.bio ?? "");
  setAvatarUrl(savedProfile.avatar_url ?? "");
  setProfileImageWidth(
    typeof savedProfile.avatar_width === "number"
      ? savedProfile.avatar_width
      : 120
  );
  setProfileImagePositionX(savedProfile.avatar_position_x ?? 50);
  setBgColor(savedProfile.bg_color ?? "");
  setBgImageUrl(savedProfile.bg_image_url ?? "");
  setBannerImageUrl(savedProfile.banner_image_url ?? "");
  setBgVideoUrl(savedProfile.bg_video_url ?? null);
  setButtonStyle(savedProfile.button_style ?? "solid");
  setBioSize(savedProfile.bio_size ?? "text-base");

  // Nuovi campi profilo
  setDisplayNameColor(
    (savedProfile as Profile & {
      display_name_color?: string;
    }).display_name_color ?? "#ffffff"
  );

  setUsernameColor(
    (savedProfile as Profile & {
      username_color?: string;
    }).username_color ?? "#00d084"
  );

  setBioColor(
    (savedProfile as Profile & {
      bio_color?: string;
    }).bio_color ?? "rgba(255,255,255,0.7)"
  );

  setDisplayNameSize(
    (savedProfile as Profile & {
      display_name_size?: string;
    }).display_name_size ?? "text-4xl"
  );

  const [savedLinks, savedProducts, savedSocials] = await Promise.all([
  loadLinks(user.id),
  loadProducts(user.id),
  loadSocialLinks(user.id),
]);

setSocialLinks(savedSocials);

await loadAnalytics(user.id, savedLinks);
await loadOrders(user.id, savedProducts);

if (username) {
  await loadGeoAnalytics(username);
}
}

    setLoading(false);
  }

  loadDashboard();
}, [router]);

  async function loadLinks(profileId: string) {
    const { data, error } = await supabase
      .from("links")
      .select(
  "id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_object_x, icon_object_y, icon_size, icon_position_x, icon_position_y, display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect"


)
      .eq("profile_id", profileId)
      .order("position", { ascending: true });

    if (error) {
      setMessage(`Errore nel caricamento dei link: ${error.message}`);
      return [] as BioLink[];
    }

    const loadedLinks = (data ?? []) as BioLink[];
    setLinks(loadedLinks);

    return loadedLinks;
  }

  async function loadSocialLinks(profileId: string) {
  const { data, error } = await supabase
    .from("social_links")
    .select("id, profile_id, platform, url, position")
    .eq("profile_id", profileId)
    .order("position", { ascending: true });

  if (error) {
    setMessage(`Errore nel caricamento dei social: ${error.message}`);
    return [] as SocialLinkRow[];
  }

  return (data ?? []) as SocialLinkRow[];
}

  async function loadProducts(profileId: string) {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, profile_id, title, description, price_cents, currency, file_url, external_url, cover_image_url"
      )
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(`Errore nel caricamento dei prodotti: ${error.message}`);
      return [] as Product[];
    }

    const loadedProducts = (data ?? []) as Product[];
    setProducts(loadedProducts);

    return loadedProducts;
  }

  async function loadOrders(profileId: string, profileProducts: Product[]) {
    if (profileProducts.length === 0) {
      setOrdersByProduct({});
      return;
    }

    const productIds = profileProducts.map((p) => p.id);

    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, product_id, profile_id, buyer_email, buyer_name, amount_cents, currency"
      )
      .eq("profile_id", profileId)
      .in("product_id", productIds)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(`Errore nel caricamento degli ordini: ${error.message}`);
      return;
    }

    const orders = (data ?? []) as Order[];

    const byProduct: Record<string, Order[]> = {};

    for (const order of orders) {
      const existing = byProduct[order.product_id] ?? [];
      existing.push(order);
      byProduct[order.product_id] = existing;
    }

    setOrdersByProduct(byProduct);
  }

  function makeTrafficRows(
    counts: Record<string, number>,
    total: number
  ): TrafficRow[] {
    return Object.entries(counts)
      .map(([label, visits]) => ({
        label,
        visits,
        percentage: total > 0 ? Math.round((visits / total) * 100) : 0,
      }))
      .sort((a, b) => b.visits - a.visits || a.label.localeCompare(b.label));
  }

async function loadAnalytics(
  profileId: string,
  profileLinks: BioLink[],
) {
  setAnalyticsLoading(true);

  try {
    const linkIds = profileLinks
      .map((link) => link.id)
      .filter((id): id is string => Boolean(id));

    const [viewsResult, clicksResult, socialClicksResult] =
      await Promise.all([
        supabase
          .from("profile_views")
          .select("viewed_at, utm_source")
          .eq("profile_id", profileId),

        linkIds.length > 0
          ? supabase
              .from("link_clicks")
              .select("link_id, clicked_at")
              .in("link_id", linkIds)
          : Promise.resolve({ data: [], error: null }),

        supabase
          .from("social_clicks")
          .select("platform, clicked_at, profile_id")
          .eq("profile_id", profileId),
      ]);

    if (viewsResult.error) {
      throw new Error(
        `Errore nel caricamento delle visite: ${viewsResult.error.message}`,
      );
    }

    if (clicksResult.error) {
      throw new Error(
        `Errore nel caricamento dei click: ${clicksResult.error.message}`,
      );
    }

    if (socialClicksResult.error) {
      throw new Error(
        `Errore nel caricamento dei click social: ${socialClicksResult.error.message}`,
      );
    }

    const views = viewsResult.data ?? [];
    const clicks = clicksResult.data ?? [];
    const socialClicks = socialClicksResult.data ?? [];

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let viewsLast24Hours = 0;
    let viewsLast7Days = 0;

    const sourceCounts: Record<string, number> = {};

    for (const view of views) {
      const viewedAt = new Date(view.viewed_at);

      if (viewedAt >= oneDayAgo) {
        viewsLast24Hours += 1;
      }

      if (viewedAt >= sevenDaysAgo) {
        viewsLast7Days += 1;
      }

      const source = view.utm_source ?? "Diretto/non tracciato";
      sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;
    }

    const linkClickTotals: Record<string, number> = {};
    let clicksLast24Hours = 0;
    let clicksLast7Days = 0;

    for (const click of clicks) {
      linkClickTotals[click.link_id] =
        (linkClickTotals[click.link_id] ?? 0) + 1;

      const clickedAt = new Date(click.clicked_at);

      if (clickedAt >= oneDayAgo) {
        clicksLast24Hours += 1;
      }

      if (clickedAt >= sevenDaysAgo) {
        clicksLast7Days += 1;
      }
    }

    const socialClickTotals: Record<string, number> = {};
    let socialClicksLast24Hours = 0;
    let socialClicksLast7Days = 0;

    for (const socialClick of socialClicks) {
      const platform = socialClick.platform ?? "other";

      socialClickTotals[platform] =
        (socialClickTotals[platform] ?? 0) + 1;

      const clickedAt = new Date(socialClick.clicked_at);

      if (clickedAt >= oneDayAgo) {
        socialClicksLast24Hours += 1;
      }

      if (clickedAt >= sevenDaysAgo) {
        socialClicksLast7Days += 1;
      }
    }

    setTotalViews(views.length);
    setTodayViews(viewsLast24Hours);
    setWeekViews(viewsLast7Days);

    setTotalClicks(clicks.length);
    setTodayClicks(clicksLast24Hours);
    setWeekClicks(clicksLast7Days);
    setClicksByLink(linkClickTotals);

    setTotalSocialClicks(socialClicks.length);
    setTodaySocialClicks(socialClicksLast24Hours);
    setWeekSocialClicks(socialClicksLast7Days);
    setSocialClicksByPlatform(socialClickTotals);

    setTrafficSources(
      makeTrafficRows(sourceCounts, views.length),
    );
  } catch (error) {
    console.error("Errore analytics dashboard:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Errore nel caricamento delle analytics",
    );
  } finally {
    setAnalyticsLoading(false);
  }
}

async function loadGeoAnalytics(username: string) {
  setGeoAnalyticsLoading(true);
  try {
    const url = `/api/profile/${encodeURIComponent(username)}/analytics`;
    console.log("Chiamata analytics geo:", url);

    const res = await fetch(url);

    console.log("Status response:", res.status);

    if (!res.ok) {
      console.error("Errore nel caricamento analytics geo", res.status);
      return;
    }

    const data = await res.json();
    console.log("Dati analytics geo ricevuti:", data);

    setCountriesByVisits(data.countries ?? []);
    setDevicesByVisits(data.devices ?? []);
    setSourcesByVisits(data.sources ?? []);
  } catch (err) {
    console.error("Errore nel caricamento analytics geo", err);
  } finally {
    setGeoAnalyticsLoading(false);
  }
}

  function isValidHttpUrl(value: string) {
    try {
      const parsedUrl = new URL(value);

      return (
        parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:"
      );
    } catch {
      return false;
    }
  }

  function toIsoOrNull(value: string) {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function isValidSchedule(startsAt: string, endsAt: string) {
    if (!startsAt || !endsAt) {
      return true;
    }

    return new Date(startsAt) < new Date(endsAt);
  }

  function applyQuickSchedule(
    preset: "hour" | "tonight" | "tomorrow" | "week",
    target: "new" | "edit"
  ) {
    const now = new Date();
    const startsAt = new Date(now);
    let endsAt = new Date(now);

    if (preset === "hour") {
      endsAt.setHours(endsAt.getHours() + 1);
    }

    if (preset === "tonight") {
      endsAt.setHours(23, 59, 0, 0);

      if (endsAt <= now) {
        endsAt.setDate(endsAt.getDate() + 1);
      }
    }

    if (preset === "tomorrow") {
      endsAt.setDate(endsAt.getDate() + 1);
    }

    if (preset === "week") {
      endsAt.setDate(endsAt.getDate() + 7);
    }

    if (target === "new") {
      setLinkScheduleEnabled(true);
      setLinkStartsAt(toDateTimeLocalValue(startsAt));
      setLinkEndsAt(toDateTimeLocalValue(endsAt));
      return;
    }

    setEditingScheduleEnabled(true);
    setEditingStartsAt(toDateTimeLocalValue(startsAt));
    setEditingEndsAt(toDateTimeLocalValue(endsAt));
  }

  function updateGradient(
  start = gradientStart,
  end = gradientEnd,
  angle = gradientAngle
) {
  setGradientStart(start);
  setGradientEnd(end);
  setGradientAngle(angle);
  setBgColor(`linear-gradient(${angle}, ${start} 0%, ${end} 100%)`);
}

function updateAvatarHorizontalPosition(clientX: number) {
  const element = avatarDragRef.current;

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const position = ((clientX - rect.left) / rect.width) * 100;

  setProfileImagePositionX(
    Math.min(100, Math.max(0, Math.round(position)))
  );
}

function handleAvatarPointerDown(event: PointerEvent<HTMLDivElement>) {
  if (!avatarUrl) {
    return;
  }

  event.currentTarget.setPointerCapture(event.pointerId);
  setIsDraggingAvatar(true);
  updateAvatarHorizontalPosition(event.clientX);
}

function handleAvatarPointerMove(event: PointerEvent<HTMLDivElement>) {
  if (!isDraggingAvatar) {
    return;
  }

  updateAvatarHorizontalPosition(event.clientX);
}

function handleAvatarPointerUp(event: PointerEvent<HTMLDivElement>) {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  setIsDraggingAvatar(false);
}

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !userId) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setMessage("Scegli un'immagine JPG, PNG o WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSizeInBytes) {
      setMessage("L'immagine deve pesare al massimo 10 MB.");
      event.target.value = "";
      return;
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    const filePath = `${userId}/avatar.${extension}`;

    setUploadingAvatar(true);
    setMessage("");

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      setUploadingAvatar(false);
      setMessage(
        `Non Ã¨ stato possibile caricare l'immagine: ${uploadError.message}`
      );
      event.target.value = "";
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const urlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        avatar_url: urlWithCacheBuster,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setUploadingAvatar(false);
    event.target.value = "";

    if (profileError) {
      setMessage(
        `Immagine caricata, ma non Ã¨ stato possibile salvarla nel profilo: ${profileError.message}`
      );
      return;
    }

    setAvatarUrl(urlWithCacheBuster);
    setMessage("Foto profilo aggiornata.");
  }

  async function handleBannerImageChange(
  event: ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file || !userId) {
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeInBytes = 3 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setMessage("Scegli un'immagine JPG, PNG o WEBP.");
    event.target.value = "";
    return;
  }

  if (file.size > maxSizeInBytes) {
    setMessage("Il banner deve pesare al massimo 3 MB.");
    event.target.value = "";
    return;
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  const filePath = `${userId}/banner.${extension}`;

  setUploadingBanner(true);
  setMessage("");

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    setUploadingBanner(false);
    setMessage(
      `Non è stato possibile caricare il banner: ${uploadError.message}`
    );
    event.target.value = "";
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  setBannerImageUrl(`${publicUrl}?v=${Date.now()}`);
  setUploadingBanner(false);
  event.target.value = "";
  setMessage(
    "Banner caricato. Premi “Salva modifiche” per pubblicarlo."
  );
}

  async function handleBgChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file || !userId) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    setMessage("Scegli un'immagine JPG, PNG o WEBP.");
    event.target.value = "";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    setMessage("L'immagine deve pesare al massimo 10 MB.");
    event.target.value = "";
    return;
  }
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filePath = `${userId}/bg.${extension}`;
  setUploadingBg(true);
  setMessage("Caricamento video...");
  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
  if (uploadError) {
    setUploadingBg(false);
    setMessage(`Non è stato possibile caricare lo sfondo: ${uploadError.message}`);
    event.target.value = "";
    return;
  }
  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const urlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;
  const { error: profileError } = await supabase.from("profiles").update({
    bg_image_url: urlWithCacheBuster,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
  setUploadingBg(false);
  event.target.value = "";
  if (profileError) {
    setMessage(`Sfondo caricato, ma non è stato possibile salvarlo: ${profileError.message}`);
    return;
  }
  setBgImageUrl(urlWithCacheBuster);
  setMessage("Sfondo aggiornato.");
}

async function handleBgVideoChange(event: ChangeEvent<HTMLInputElement>) {
  console.log("handleBgVideoChange START");
  console.log("event.target.files:", event.target.files);
  console.log("userId:", userId);

  const file = event.target.files?.[0];
  console.log("file estratto:", file);

  if (!file) {
    console.log("handleBgVideoChange EXIT: no file");
    return;
  }

  if (!userId) {
    console.log("handleBgVideoChange EXIT: no userId");
    return;
  }

  console.log("Prima dei controlli su nome e dimensione");

  const fileName = file.name.toLowerCase();
  const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB

  const isVideo =
    fileName.endsWith(".mp4") ||
    fileName.endsWith(".mov") ||
    fileName.endsWith(".webm");

  const isGif = fileName.endsWith(".gif");

  console.log(
    "isVideo:",
    isVideo,
    "isGif:",
    isGif,
    "file.size:",
    file.size,
    "maxSizeInBytes:",
    maxSizeInBytes
  );

  if (!isVideo && !isGif) {
    console.log("handleBgVideoChange EXIT: estensione non supportata");
    setMessage(
      "Scegli un video MP4/MOV/WEBM o una GIF già ottimizzata (max 20 MB)."
    );
    event.target.value = "";
    return;
  }

  if (file.size > maxSizeInBytes) {
    console.log("handleBgVideoChange EXIT: file troppo grande");
    setMessage("Il file deve pesare al massimo 20 MB.");
    event.target.value = "";
    return;
  }

  // Percorso nel bucket
  const extension = isGif ? "gif" : "mp4";
  const filePath = isGif
    ? `${userId}/bg-animation.gif`
    : `${userId}/bg-video.mp4`;

  setUploadingBg(true);
  setMessage("Caricamento file...");

  console.log("Dopo setUploadingBg(true), inizio upload, filePath:", filePath);

  const contentType = isGif ? "image/gif" : "video/mp4";

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType,
    });

  console.log("Upload finito, uploadError:", uploadError);

  if (uploadError) {
    setUploadingBg(false);
    setMessage(`Non è stato possibile caricare il file: ${uploadError.message}`);
    event.target.value = "";
    return;
  }

  // Genera URL firmato (valido 1 anno)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("videos")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365);

  let fileUrl: string;

  if (!signedUrlError && signedUrlData?.signedUrl) {
    // Aggiungo un parametro t= per forzare il refresh quando cambi video
    const separator = signedUrlData.signedUrl.includes("?") ? "&" : "?";
    fileUrl = `${signedUrlData.signedUrl}${separator}t=${Date.now()}`;
    console.log("URL firmato file:", fileUrl);
  } else {
    // Fallback su URL pubblico
    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(filePath);

    fileUrl = `${urlData.publicUrl}?v=${Date.now()}`;
    console.log("URL pubblico file (fallback):", fileUrl);
  }

  // Se è GIF, la salviamo come bg_image_url, altrimenti come bg_video_url
  let updatePayload: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (isGif) {
    updatePayload.bg_image_url = fileUrl;
    updatePayload.bg_video_url = ""; // o null, se preferisci
    console.log("Salvataggio come GIF (bg_image_url)");
  } else {
    updatePayload.bg_video_url = fileUrl;
    console.log("Salvataggio come video (bg_video_url)");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);

  console.log("profileError:", profileError);

  setUploadingBg(false);
  event.target.value = "";

  if (profileError) {
    setMessage("File caricato, ma non è stato possibile salvarlo nel profilo.");
    return;
  }

  if (isGif) {
    setBgImageUrl(fileUrl);
    setBgVideoUrl(null);
    setMessage("Animazione di sfondo aggiornata.");
  } else {
    setBgVideoUrl(fileUrl);
    setMessage("Video di sfondo aggiornato.");
  }

  console.log("handleBgVideoChange END");
}

  async function saveLinkOrder(reorderedLinks: BioLink[]) {
    const results = await Promise.all(
      reorderedLinks.map((link, position) =>
        supabase.from("links").update({ position }).eq("id", link.id)
      )
    );

    return results.find((result) => result.error)?.error;
  }
  
  async function saveSocialLinksOrder(reorderedSocialLinks: SocialLinkRow[]) {
  const results = await Promise.all(
    reorderedSocialLinks.map((socialLink, position) =>
      supabase
        .from("social_links")
        .update({ position })
        .eq("id", socialLink.id)
    )
  );

  return results.find((result) => result.error)?.error;
}

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || reordering) {
      return;
    }

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedLinks = arrayMove(links, oldIndex, newIndex).map(
      (link, position) => ({
        ...link,
        position,
      })
    );

    const previousLinks = links;

    setLinks(reorderedLinks);
    setReordering(true);
    setMessage("");

    const error = await saveLinkOrder(reorderedLinks);

    setReordering(false);

    if (error) {
      setLinks(previousLinks);
      setMessage(`Non Ã¨ stato possibile salvare l'ordine: ${error.message}`);
      return;
    }

    setMessage("Ordine dei link salvato.");
  }

  async function handleSocialDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id || savingSocials) {
    return;
  }

  const oldIndex = socialLinks.findIndex(
    (socialLink) => socialLink.id === active.id
  );

  const newIndex = socialLinks.findIndex(
    (socialLink) => socialLink.id === over.id
  );

  if (oldIndex === -1 || newIndex === -1) {
    return;
  }

  const previousSocialLinks = socialLinks;

  const reorderedSocialLinks = arrayMove(
    socialLinks,
    oldIndex,
    newIndex
  ).map((socialLink, position) => ({
    ...socialLink,
    position,
  }));

  setSocialLinks(reorderedSocialLinks);
  setSavingSocials(true);
  setMessage("");

  const error = await saveSocialLinksOrder(reorderedSocialLinks);

  setSavingSocials(false);

  if (error) {
    setSocialLinks(previousSocialLinks);
    setMessage(
      `Non è stato possibile salvare l'ordine dei social: ${error.message}`
    );
    return;
  }

  setMessage("Ordine delle icone social salvato.");
}

async function handleSaveSocialSettings() {
  if (!userId) {
    setMessage("Devi prima creare e salvare il profilo.");
    return;
  }

  setSavingSocials(true);
  setMessage("");

  const cleanSocialPosition =
    socialPosition === "below_profile" ? "below_profile" : "footer";

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      social_position: cleanSocialPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (profileError) {
    setSavingSocials(false);
    setMessage(
      `Non è stato possibile salvare la posizione dei social: ${profileError.message}`
    );
    return;
  }

  try {
    await saveSocialLinks(userId, socialLinks);

    const refreshedSocialLinks = await loadSocialLinks(userId);
    setSocialLinks(refreshedSocialLinks);

    setMessage("Modifiche social salvate.");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Errore sconosciuto";

    setMessage(
      `Posizione social salvata, ma non è stato possibile salvare i link: ${errorMessage}`
    );
  } finally {
    setSavingSocials(false);
  }
}

async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const cleanUsername = username.trim().toLowerCase();
  const cleanDisplayName = displayName.trim();
  const cleanBio = bio.trim();
  const cleanBgColor = bgColor.trim() || null;
  const cleanBgImageUrl = bgImageUrl.trim() || null;
  const cleanBannerImageUrl = bannerImageUrl.trim() || null;
  const cleanBgVideoUrl = bgVideoUrl ?? null; // ← aggiungi questa riga
  const cleanButtonStyle = buttonStyle.trim() || "solid";
  const cleanBioSize = bioSize || "text-base";
  const cleanProfileLayout =
  profileLayout === "hero" ||
  profileLayout === "banner" ||
  profileLayout === "shape"
    ? profileLayout
    : "classic";
  const cleanSocialPosition =
    socialPosition === "below_profile" ? "below_profile" : "footer";

  // Nuovi campi profilo
  const cleanDisplayNameColor = displayNameColor.trim() || "#ffffff";
  const cleanUsernameColor = usernameColor.trim() || "#00d084";
  const cleanBioColor = bioColor.trim() || "rgba(255,255,255,0.7)";
  const cleanDisplayNameSize = displayNameSize || "text-4xl";

  if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
    setMessage(
      "Lo username deve avere da 3 a 30 caratteri e usare solo lettere minuscole, numeri o underscore (_)."
    );
    return;
  }

  if (!cleanDisplayName) {
    setMessage("Inserisci un nome da mostrare.");
    return;
  }

  setSavingProfile(true);
  setMessage("");

  const { data: savedProfileData, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username: cleanUsername,
        display_name: cleanDisplayName,
        bio: cleanBio,
        avatar_url: avatarUrl || null,
        avatar_width: profileImageWidth,
        avatar_height: profileImageWidth,
        avatar_position_x: profileImagePositionX,
        avatar_position_y: 50,
        bg_color: cleanBgColor,
        bg_image_url: cleanBgImageUrl,
        banner_image_url: cleanBannerImageUrl,
        bg_video_url: cleanBgVideoUrl, // ← aggiungi questa riga
        button_style: cleanButtonStyle,
        profile_layout: cleanProfileLayout,
        video_opacity: videoOpacity,
        bio_size: cleanBioSize,
        social_position: cleanSocialPosition,
        display_name_color: cleanDisplayNameColor,
        username_color: cleanUsernameColor,
        bio_color: cleanBioColor,
        display_name_size: cleanDisplayNameSize,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    )
    .select(
      "username, display_name, bio, avatar_url, avatar_width, avatar_position_x, bg_color, bg_image_url, banner_image_url, bg_video_url, button_style, profile_layout, bio_size, social_position, display_name_color, username_color, bio_color, display_name_size, video_opacity"
    )
    .single();

  if (error) {
    setSavingProfile(false);

    if (error.code === "23505") {
      setMessage("Questo username è già occupato. Scegline un altro.");
      return;
    }

    setMessage(`Non è stato possibile salvare il profilo: ${error.message}`);
    return;
  }

  setSavingProfile(false);
  setMessage("Profilo salvato con successo.");

  if (savedProfileData) {
    setUsername(savedProfileData.username ?? "");
    setDisplayName(savedProfileData.display_name ?? "");
    setBio(savedProfileData.bio ?? "");
    setAvatarUrl(savedProfileData.avatar_url ?? "");
    setProfileImageWidth(savedProfileData.avatar_width ?? 120);
    setProfileImagePositionX(savedProfileData.avatar_position_x ?? 50);
    setBgColor(savedProfileData.bg_color ?? "");
    setBgImageUrl(savedProfileData.bg_image_url ?? "");
    setBannerImageUrl(savedProfileData.banner_image_url ?? "");
    setBgVideoUrl(savedProfileData.bg_video_url ?? null); // ← aggiungi questa riga
    if (savedProfileData.video_opacity != null) {
  setVideoOpacity(savedProfileData.video_opacity);
}
    setButtonStyle(savedProfileData.button_style ?? "solid");
    setProfileLayout(
  savedProfileData.profile_layout === "hero" ||
    savedProfileData.profile_layout === "banner" ||
    savedProfileData.profile_layout === "shape"
    ? savedProfileData.profile_layout
    : "classic"
);
    setBioSize(savedProfileData.bio_size ?? "text-base");
    setSocialPosition(
      savedProfileData.social_position === "below_profile"
        ? "below_profile"
        : "footer"
    );
    setDisplayNameColor(savedProfileData.display_name_color ?? "#ffffff");
    setUsernameColor(savedProfileData.username_color ?? "#00d084");
    setBioColor(
      savedProfileData.bio_color ?? "rgba(255,255,255,0.7)"
    );
    setDisplayNameSize(
      savedProfileData.display_name_size ?? "text-4xl"
    );
  }
}

async function handleRedeemCode() {
  if (!redeemCode.trim()) {
    setRedeemMessage("Inserisci un codice.");
    return;
  }

  setRedeemingCode(true);
  setRedeemMessage("");

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      setRedeemMessage("Utente non loggato.");
      setRedeemingCode(false);
      return;
    }

    const { data, error } = await supabase.rpc('redeem_promo_code', {
      p_code: redeemCode.trim().toUpperCase(),
      p_user_id: user.id,
    });

    if (error || !data) {
      setRedeemMessage("Errore durante il riscatto. Riprova.");
      setRedeemingCode(false);
      return;
    }

    const result = data as { success?: boolean; error?: string };

    if (!result.success) {
      const map: Record<string, string> = {
        INVALID_CODE: "Codice non valido.",
        CODE_EXPIRED: "Codice scaduto.",
        MAX_REDEMPTIONS_REACHED: "Codice esaurito.",
        ALREADY_USED: "Hai già usato questo codice.",
      };
      setRedeemMessage(map[result.error!] || "Codice non valido.");
      setRedeemingCode(false);
      return;
    }

    setRedeemMessage("✅ Codice riscattato! Il tuo piano è ora PRO.");
    setRedeemCode("");
    setRedeemingCode(false);

    // Aggiorna plan localmente
    setPlan("premium");
  } catch {
    setRedeemMessage("Errore durante il riscatto. Riprova.");
    setRedeemingCode(false);
  }
}

  async function handleAddLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setMessage("Devi prima creare e salvare il profilo.");
      return;
    }

    const cleanTitle = linkTitle.trim();
    const cleanUrl = linkUrl.trim();
    const cleanIconUrl = null;

    if (newLinkDisplayType === "button" && !cleanTitle) {
  setMessage("Inserisci il titolo del link.");
  return;
}

if (newLinkDisplayType === "image" && !newLinkImageFile) {
  setMessage("Carica un'immagine per il link immagine.");
  return;
}

    if (!isValidHttpUrl(cleanUrl)) {
      setMessage(
        "Inserisci un URL valido che inizi con https:// oppure http://"
      );
      return;
    }

    if (
      linkScheduleEnabled &&
      !isValidSchedule(linkStartsAt, linkEndsAt)
    ) {
      setMessage(
        "La data di fine deve essere successiva alla data di inizio."
      );
      return;
    }

    setSavingLink(true);
    setMessage("");

    const abGroupValue = crypto.randomUUID();

    const { data: newLink, error } = await supabase
      .from("links")
      .insert({
        profile_id: userId,
        title:
  newLinkDisplayType === "image"
    ? cleanTitle || "Link immagine"
    : cleanTitle,
        url: cleanUrl,
        display_type: newLinkDisplayType,
        image_url: null,
        position: links.length,
        starts_at: linkScheduleEnabled ? toIsoOrNull(linkStartsAt) : null,
        ends_at: linkScheduleEnabled ? toIsoOrNull(linkEndsAt) : null,
        ab_group: abGroupValue,
        is_variant: false,
        variant_of: null,
        icon_url: cleanIconUrl,
      })
      .select(
        "id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_object_x, icon_object_y, icon_size, icon_position_x, icon_position_y, display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect "


      )
      .single();

    setSavingLink(false);

    if (error) {
      setMessage(`Non Ã¨ stato possibile aggiungere il link: ${error.message}`);
      return;
    }

    let linkWithIcon = newLink as BioLink;

if (newLinkIconFile) {
  const extension =
    newLinkIconFile.type === "image/png"
      ? "png"
      : newLinkIconFile.type === "image/webp"
        ? "webp"
        : "jpg";

  const filePath = `${userId}/links/${linkWithIcon.id}/icon.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, newLinkIconFile, {
      cacheControl: "3600",
      upsert: true,
      contentType: newLinkIconFile.type,
    });

  if (uploadError) {
    setMessage(
      `Link creato, ma non è stato possibile caricare l'icona: ${uploadError.message}`
    );
  } else {
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const iconUrlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;

    const { data: updatedLink, error: updateError } = await supabase
      .from("links")
      .update({ icon_url: iconUrlWithCacheBuster })
      .eq("id", linkWithIcon.id)
      .select(
        "id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_object_x, icon_size, icon_position_x, icon_position_y, display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect "


      )
      .single();

    if (updateError) {
      setMessage(
        `Link creato, ma non è stato possibile associare l'icona: ${updateError.message}`
      );
    } else if (updatedLink) {
      linkWithIcon = updatedLink as BioLink;
    }
  }
}

if (newLinkDisplayType === "image" && newLinkImageFile) {
  const extension =
    newLinkImageFile.type === "image/png"
      ? "png"
      : newLinkImageFile.type === "image/webp"
        ? "webp"
        : "jpg";

  const filePath = `${userId}/links/${linkWithIcon.id}/banner.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, newLinkImageFile, {
      cacheControl: "3600",
      upsert: true,
      contentType: newLinkImageFile.type,
    });

  if (uploadError) {
    setMessage(
      `Link creato, ma non è stato possibile caricare l'immagine: ${uploadError.message}`
    );
  } else {
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const imageUrlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;

    const { data: updatedLink, error: updateError } = await supabase
      .from("links")
      .update({ image_url: imageUrlWithCacheBuster })
      .eq("id", linkWithIcon.id)
      .select(
        "id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_object_x, icon_size, icon_position_x, icon_position_y, display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect "

      )
      .single();

    if (updateError) {
      setMessage(
        `Link creato, ma non è stato possibile associare l'immagine: ${updateError.message}`
      );
    } else if (updatedLink) {
      linkWithIcon = updatedLink as BioLink;
    }
  }
}

    const updatedLinks = [...links, linkWithIcon];

    setLinks(updatedLinks);
    setLinkTitle("");
    setLinkUrl("");
    setLinkIconUrl("");
    setNewLinkIconFile(null);
    setNewLinkDisplayType("button");
setNewLinkImageFile(null);
setNewLinkImagePreview("");
    setLinkScheduleEnabled(false);
    setLinkStartsAt("");
    setLinkEndsAt("");

    await loadAnalytics(userId, updatedLinks);
    setMessage("Link aggiunto con successo.");
  }

async function handleLinkIconChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file || !userId || !editingLinkId) {
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeInBytes = 1 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setMessage("Scegli un'icona JPG, PNG o WEBP.");
    event.target.value = "";
    return;
  }

  if (file.size > maxSizeInBytes) {
    setMessage("L'icona deve pesare al massimo 1 MB.");
    event.target.value = "";
    return;
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  const filePath = `${userId}/links/${editingLinkId}/icon.${extension}`;

  setUploadingLinkIcon(true);
  setMessage("");

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    setUploadingLinkIcon(false);
    setMessage(
      `Non è stato possibile caricare l'icona: ${uploadError.message}`
    );
    event.target.value = "";
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const iconUrlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;

  setEditingIconUrl(iconUrlWithCacheBuster);
  setUploadingLinkIcon(false);
  event.target.value = "";
  setMessage("Icona caricata. Premi “Salva modifiche” per confermarla.");
}

function startEditingLink(link: BioLink) {
  setEditingLinkId(link.id);

  setEditingTitle(link.title ?? "");
  setEditingUrl(link.url ?? "");
  setEditingIconUrl(link.icon_url ?? "");

  seteditingIconObjectX(link.icon_object_x ?? 50);
  seteditingIconObjectY(link.icon_object_y ?? 50);

  setEditingIconSize(link.icon_size ?? 24);
  setEditingIconPositionX(link.icon_position_x ?? "left");
  setEditingIconPositionY(link.icon_position_y ?? "center");

  setEditingImageHeight(link.image_height ?? 220);
  setEditingBackgroundColor(link.background_color ?? "");
  setEditingBadgeText(link.badge_text ?? "");
  setEditingTextColor(link.text_color ?? "");
  setEditingHoverEffect(link.hover_effect ?? "none");

  setEditingScheduleEnabled(Boolean(link.starts_at || link.ends_at));
  setEditingStartsAt(fromIsoToDateTimeLocal(link.starts_at));
  setEditingEndsAt(fromIsoToDateTimeLocal(link.ends_at));

  setMessage("");
}

  function cancelEditingLink() {
    setEditingLinkId("");
    setEditingTitle("");
    setEditingUrl("");
    setEditingIconSize(24);
setEditingIconPositionX("left");
setEditingIconPositionY("center");
setEditingImageHeight(220);
setEditingBackgroundColor("");
setEditingBadgeText("");
setEditingTextColor("");
    setEditingIconUrl("");
    seteditingIconObjectX(50);
seteditingIconObjectY(50);
    setEditingScheduleEnabled(false);
    setEditingStartsAt("");
    setEditingEndsAt("");
  }

function handleNewLinkIconChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeInBytes = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setMessage("Scegli un'icona JPG, PNG o WEBP.");
    event.target.value = "";
    return;
  }

  if (file.size > maxSizeInBytes) {
    setMessage("L'icona deve pesare al massimo 5 MB.");
    event.target.value = "";
    return;
  }

  setNewLinkIconFile(file);
  setMessage("Icona pronta: verrà caricata quando aggiungi il link.");
}

function handleNewLinkImageChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeInBytes = 3 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setMessage("Scegli un'immagine JPG, PNG o WEBP.");
    event.target.value = "";
    return;
  }

  if (file.size > maxSizeInBytes) {
    setMessage("L'immagine deve pesare al massimo 3 MB.");
    event.target.value = "";
    return;
  }

  setNewLinkImageFile(file);
  setNewLinkImagePreview(URL.createObjectURL(file));
  setMessage("Immagine pronta: verrà caricata quando aggiungi il link.");
}

  function handleNewScheduleToggle(enabled: boolean) {
    setLinkScheduleEnabled(enabled);

    if (!enabled) {
      setLinkStartsAt("");
      setLinkEndsAt("");
    }
  }

  function handleEditingScheduleToggle(enabled: boolean) {
    setEditingScheduleEnabled(enabled);

    if (!enabled) {
      setEditingStartsAt("");
      setEditingEndsAt("");
    }
  }

  async function handleSaveLinkEdit(linkId: string) {
    const cleanTitle = editingTitle.trim();
    const cleanUrl = editingUrl.trim();
    const cleanIconUrl = editingIconUrl.trim() || null;

    if (!cleanTitle) {
      setMessage("Inserisci il titolo del link.");
      return;
    }

    if (!isValidHttpUrl(cleanUrl)) {
      setMessage(
        "Inserisci un URL valido che inizi con https:// oppure http://"
      );
      return;
    }

    if (
      editingScheduleEnabled &&
      !isValidSchedule(editingStartsAt, editingEndsAt)
    ) {
      setMessage(
        "La data di fine deve essere successiva alla data di inizio."
      );
      return;
    }

    setSavingEdit(true);
    setMessage("");

    const { data: updatedLink, error } = await supabase
      .from("links")
      .update({
  title: cleanTitle,
  url: cleanUrl,
  icon_url: cleanIconUrl,
  icon_object_x: editingIconObjectX,
icon_object_y: editingIconObjectY,
  icon_size: editingIconSize,
  icon_position_x: editingIconPositionX,
  icon_position_y: editingIconPositionY,
  background_color: editingBackgroundColor.trim() || null,
  image_height:
  editingImageHeight >= 120 && editingImageHeight <= 520
    ? editingImageHeight
    : 220,
  badge_text: editingBadgeText.trim().slice(0, 24) || null,
  text_color: editingTextColor.trim() || null,
  hover_effect: editingHoverEffect,
  starts_at: editingScheduleEnabled
    ? toIsoOrNull(editingStartsAt)
    : null,
  ends_at: editingScheduleEnabled ? toIsoOrNull(editingEndsAt) : null,
})
      .eq("id", linkId)
      .select(
        "id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_object_x, icon_size, icon_position_x, icon_position_y, display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect "


      )
      .single();

    setSavingEdit(false);

    if (error) {
      setMessage(`Non Ã¨ stato possibile modificare il link: ${error.message}`);
      return;
    }

    setLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === linkId ? (updatedLink as BioLink) : link
      )
    );

    cancelEditingLink();
    setMessage("Link aggiornato con successo.");
  }

  function openAddVariantModal(link: BioLink) {
    setAddingVariantLinkId(link.id);
    setVariantTitle("");
    setVariantUrl("");
    setSavingVariant(false);
    setVariantMessage("");
  }

  function closeAddVariantModal() {
    setAddingVariantLinkId("");
    setVariantTitle("");
    setVariantUrl("");
    setSavingVariant(false);
    setVariantMessage("");
  }

  async function createVariant() {
  const originalLink = links.find((l) => l.id === addingVariantLinkId);

  if (!originalLink) {
    setVariantMessage("Link originale non trovato.");
    return;
  }

  const cleanTitle = variantTitle.trim();
  const cleanUrl = variantUrl.trim();

  if (!cleanTitle) {
    setVariantMessage("Inserisci il titolo della variante.");
    return;
  }

  if (!isValidHttpUrl(cleanUrl)) {
    setVariantMessage(
      "Inserisci un URL valido che inizi con https:// oppure http://"
    );
    return;
  }

  setSavingVariant(true);
  setVariantMessage("");

  // Genera un ab_group se il link originale non ne ha uno
  const abGroupValue = originalLink.ab_group ?? crypto.randomUUID();

  const { data: newVariant, error } = await supabase
    .from("links")
    .insert({
      profile_id: userId,
      title: cleanTitle,
      url: cleanUrl,
      position: originalLink.position + 1,
      starts_at: originalLink.starts_at,
      ends_at: originalLink.ends_at,
      ab_group: abGroupValue,
      is_variant: true,
      variant_of: originalLink.id,
      // Icona e dimensioni ereditate dal link originale
      icon_url: originalLink.icon_url ?? null,
      icon_size: originalLink.icon_size ?? 24,
      icon_object_x: originalLink.icon_object_x ?? 50,
      icon_object_y: originalLink.icon_object_y ?? 50,
      icon_position_x: originalLink.icon_position_x ?? "left",
      icon_position_y: originalLink.icon_position_y ?? "center",
    })
    .select(
      `id, profile_id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of,
       icon_url, icon_size, icon_object_x, icon_object_y, icon_position_x, icon_position_y,
       display_type, image_url, image_height, background_color, badge_text, text_color, hover_effect`
    )
    .single();

  setSavingVariant(false);

  if (error) {
    setVariantMessage(
      `Non è stato possibile creare la variante: ${error.message}`
    );
    return;
  }

  // Aggiorna anche il link originale con lo stesso ab_group
  const updatedOriginal = {
    ...originalLink,
    ab_group: abGroupValue,
  };

  const updatedLinks = [
    ...links.filter((l) => l.id !== originalLink.id),
    updatedOriginal,
    newVariant as BioLink,
  ].sort((a, b) => a.position - b.position);

  setLinks(updatedLinks);

  // Salva su Supabase l'ab_group aggiornato per il link originale
  await supabase
    .from("links")
    .update({ ab_group: abGroupValue })
    .eq("id", originalLink.id);

  closeAddVariantModal();

  await loadAnalytics(userId, updatedLinks);
  setMessage("Variante A/B creata con successo.");
}

  async function handleDeleteLink(linkId: string) {
    const previousLinks = links;

    setDeletingLinkId(linkId);
    setMessage("");

    const { error } = await supabase.from("links").delete().eq("id", linkId);

    setDeletingLinkId("");

    if (error) {
      setMessage(`Non Ã¨ stato possibile eliminare il link: ${error.message}`);
      return;
    }

    const remainingLinks = links
      .filter((link) => link.id !== linkId)
      .map((link, position) => ({ ...link, position }));

    setLinks(remainingLinks);

    const reorderError = await saveLinkOrder(remainingLinks);

    if (reorderError) {
      setLinks(previousLinks);
      setMessage(
        `Link eliminato, ma non Ã¨ stato possibile riordinare: ${reorderError.message}`
      );
      return;
    }

    await loadAnalytics(userId, remainingLinks);
    setMessage("Link eliminato.");
  }

  function openConfirmWinnerModal(
    group: AbGroupStats,
    winner: { link: BioLink; clicks: number }
  ) {
    const otherVariants = group.links.filter(
      (l) => l.id !== winner.link.id
    );

    setConfirmWinnerGroupId(group.ab_group);
    setConfirmWinnerLink(winner.link);
    setConfirmOtherVariants(otherVariants);
    setSavingWinner(false);
    setWinnerMessage("");
  }

  function closeConfirmWinnerModal() {
    setConfirmWinnerGroupId("");
    setConfirmWinnerLink(null);
    setConfirmOtherVariants([]);
    setSavingWinner(false);
    setWinnerMessage("");
  }

  async function makeWinnerDefinitive() {
    if (!confirmWinnerLink || confirmOtherVariants.length === 0) {
      return;
    }

    setSavingWinner(true);
    setWinnerMessage("");

    const idsToDelete = confirmOtherVariants.map((v) => v.id);

    const deletePromises = idsToDelete.map((id) =>
      supabase.from("links").delete().eq("id", id)
    );

    const deleteResults = await Promise.all(deletePromises);

    const deleteError = deleteResults.find((r) => r.error)?.error;

    if (deleteError) {
      setSavingWinner(false);
      setWinnerMessage(
        `Non Ã¨ stato possibile eliminare le altre varianti: ${deleteError.message}`
      );
      return;
    }

    const { error: updateError } = await supabase
      .from("links")
      .update({
        ab_group: null,
        is_variant: false,
        variant_of: null,
      })
      .eq("id", confirmWinnerLink.id);

    setSavingWinner(false);

    if (updateError) {
      setWinnerMessage(
        `Variante resa definitiva, ma errore nel pulire i campi: ${updateError.message}`
      );
      return;
    }

    const remainingLinks = links.filter(
      (l) =>
        l.ab_group !== confirmWinnerGroupId ||
        l.id === confirmWinnerLink.id
    );

    const reorderedLinks = remainingLinks.map((link, position) => ({
      ...link,
      position,
    }));

    setLinks(reorderedLinks);

    const reorderError = await saveLinkOrder(reorderedLinks);

    if (reorderError) {
      setWinnerMessage(
        `Operazione completata, ma errore nel riordinare: ${reorderError.message}`
      );
      return;
    }

    closeConfirmWinnerModal();
    setMessage("Variante resa definitiva. Le altre varianti sono state eliminate.");
    await loadAnalytics(userId, reorderedLinks);
  }

  function openNewProductModal() {
    setEditingProduct(null);
    setProductForm({
      title: "",
      description: "",
      priceCents: "",
      currency: "EUR",
      fileUrl: "",
      externalUrl: "",
      coverImageUrl: "",
    });
    setProductMessage("");
    setProductModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      priceCents: (product.price_cents / 100).toFixed(2),
      currency: product.currency,
      fileUrl: product.file_url ?? "",
      externalUrl: product.external_url ?? "",
      coverImageUrl: product.cover_image_url ?? "",
    });
    setProductMessage("");
    setProductModalOpen(true);
  }

  function closeProductModal() {
    setProductModalOpen(false);
    setEditingProduct(null);
    setProductMessage("");
  }

  async function saveProduct() {
    if (!userId) {
      setProductMessage("Devi prima creare e salvare il profilo.");
      return;
    }

    const cleanTitle = productForm.title.trim();
    const cleanDescription = productForm.description.trim();
    const priceCents = Math.round(Number(productForm.priceCents) * 100);
    const cleanCurrency = productForm.currency;
    const cleanFileUrl = productForm.fileUrl.trim() || null;
    const cleanExternalUrl = productForm.externalUrl.trim() || null;
    const cleanCoverImageUrl = productForm.coverImageUrl.trim() || null;

    if (!cleanTitle) {
      setProductMessage("Inserisci un titolo per il prodotto.");
      return;
    }

    if (priceCents < 0) {
      setProductMessage("Il prezzo non puÃ² essere negativo.");
      return;
    }

    if (!cleanFileUrl && !cleanExternalUrl) {
      setProductMessage(
        "Inserisci almeno un file URL o un link esterno per il prodotto."
      );
      return;
    }

    setSavingProduct(true);
    setProductMessage("");

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          title: cleanTitle,
          description: cleanDescription,
          price_cents: priceCents,
          currency: cleanCurrency,
          file_url: cleanFileUrl,
          external_url: cleanExternalUrl,
          cover_image_url: cleanCoverImageUrl,
        })
        .eq("id", editingProduct.id);

      setSavingProduct(false);

      if (error) {
        setProductMessage(
          `Non Ã¨ stato possibile modificare il prodotto: ${error.message}`
        );
        return;
      }

      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              title: cleanTitle,
              description: cleanDescription,
              price_cents: priceCents,
              currency: cleanCurrency,
              file_url: cleanFileUrl,
              external_url: cleanExternalUrl,
              cover_image_url: cleanCoverImageUrl,
            }
          : p
      );

      setProducts(updatedProducts);
      closeProductModal();
      setMessage("Prodotto aggiornato con successo.");
      await loadOrders(userId, updatedProducts);
      return;
    }

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert({
        profile_id: userId,
        title: cleanTitle,
        description: cleanDescription,
        price_cents: priceCents,
        currency: cleanCurrency,
        file_url: cleanFileUrl,
        external_url: cleanExternalUrl,
        cover_image_url: cleanCoverImageUrl,
      })
      .select(
        "id, profile_id, title, description, price_cents, currency, file_url, external_url, cover_image_url"
      )
      .single();

    setSavingProduct(false);

    if (error) {
      setProductMessage(
        `Non Ã¨ stato possibile creare il prodotto: ${error.message}`
      );
      return;
    }

    const updatedProducts = [newProduct as Product, ...products];

    setProducts(updatedProducts);
    closeProductModal();
    setMessage("Prodotto creato con successo.");
    await loadOrders(userId, updatedProducts);
  }

  async function deleteProduct(productId: string) {
    const previousProducts = products;

    setMessage("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      setMessage(`Non Ã¨ stato possibile eliminare il prodotto: ${error.message}`);
      return;
    }

    const remainingProducts = products.filter((p) => p.id !== productId);

    setProducts(remainingProducts);
    setMessage("Prodotto eliminato.");
    await loadOrders(userId, remainingProducts);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0d12] px-6 py-10 text-white">
        <p className="text-center text-white/60">Caricamento dashboard...</p>
      </main>
    );
  }

  const cleanUsername = username.trim().toLowerCase();
  const publicProfileUrl = cleanUsername ? `/${cleanUsername}` : "";

  const totalCtr =
    totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  const topLink = links.reduce<BioLink | null>((currentTopLink, link) => {
    if (!currentTopLink) {
      return link;
    }

    return (clicksByLink[link.id] ?? 0) >
      (clicksByLink[currentTopLink.id] ?? 0)
      ? link
      : currentTopLink;
  }, null);

  const topLinkClicks = topLink ? clicksByLink[topLink.id] ?? 0 : 0;

  function getVariantsForLink(link: BioLink) {
    if (!link.ab_group) {
      return [];
    }

    return links.filter(
      (l) =>
        l.ab_group === link.ab_group &&
        l.id !== link.id &&
        l.is_variant
    );
  }

  function getAbGroups(): AbGroupStats[] {
    const groupsMap = new Map<string, BioLink[]>();

    for (const link of links) {
      if (!link.ab_group) {
        continue;
      }

      const existing = groupsMap.get(link.ab_group) ?? [];
      existing.push(link);
      groupsMap.set(link.ab_group, existing);
    }

    const result: AbGroupStats[] = [];

    for (const [ab_group, groupLinks] of groupsMap.entries()) {
      if (groupLinks.length <= 1) {
        continue;
      }

      const stats = groupLinks.map((l) => ({
        link: l,
        clicks: clicksByLink[l.id] ?? 0,
      }));

      const totalClicksInGroup = stats.reduce(
        (sum, s) => sum + s.clicks,
        0
      );

      const winner = stats.reduce<{ link: BioLink; clicks: number } | null>(
        (currentWinner, s) => {
          if (!currentWinner) {
            return s;
          }

          return s.clicks > currentWinner.clicks ? s : currentWinner;
        },
        null
      );

      result.push({
        ab_group,
        links: groupLinks,
        stats,
        totalClicksInGroup,
        winner: winner ?? null,
      });
    }

    return result;
  }

  const abGroups = getAbGroups();

  function formatPrice(cents: number, currency: string) {
    const locale =
      currency === "USD"
        ? "en-US"
        : currency === "GBP"
          ? "en-GB"
          : "it-IT";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(cents / 100);
  }
  
 const previewLinks = links.map((l) => {
  const isCurrentlyEditing = l.id === editingLinkId;

  return {
    id: l.id,
    title: isCurrentlyEditing ? editingTitle || l.title : l.title,
    url: isCurrentlyEditing ? editingUrl || l.url : l.url,
    icon_url: isCurrentlyEditing
      ? editingIconUrl || null
      : l.icon_url,
    icon_size: isCurrentlyEditing ? editingIconSize : l.icon_size,
    icon_position_x: isCurrentlyEditing
      ? editingIconPositionX
      : l.icon_position_x,
    icon_position_y: isCurrentlyEditing
      ? editingIconPositionY
      : l.icon_position_y,
    icon_object_x: isCurrentlyEditing
      ? editingIconObjectX
      : l.icon_object_x,
    icon_object_y: isCurrentlyEditing
      ? editingIconObjectY
      : l.icon_object_y,
    display_type: l.display_type ?? "button",
    image_url: l.image_url,
    image_height: isCurrentlyEditing
      ? editingImageHeight
      : l.image_height,
    background_color: isCurrentlyEditing
      ? editingBackgroundColor || null
      : l.background_color,
    badge_text: isCurrentlyEditing
      ? editingBadgeText.trim() || null
      : l.badge_text,
    text_color: isCurrentlyEditing
      ? editingTextColor.trim() || null
      : l.text_color,
    hover_effect: isCurrentlyEditing
      ? editingHoverEffect || null
      : l.hover_effect,
  };
});

const previewProducts = products.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  price_cents: p.price_cents,
  currency: p.currency,
  cover_image_url: p.cover_image_url,
}));

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#0c0d12] px-3 py-5 pb-28 text-white sm:px-6 sm:py-10 lg:overflow-visible lg:px-6 lg:pb-10">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-black tracking-tight">
            bio<span className="text-[#00d084]">linkr</span>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition hover:border-[#00d084] hover:text-[#00d084]"
          >
            Esci
          </button>
        </header>

        <div className="mt-6 flex gap-3 lg:hidden">
  <button
    type="button"
    onClick={() => setMobilePreviewOpen(true)}
    className="flex-1 rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition active:scale-[0.98]"
  >
    Anteprima pagina
  </button>

  {publicProfileUrl && (
    <Link
      href={publicProfileUrl}
      target="_blank"
      className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/80"
    >
      Apri
    </Link>
  )}
</div>

        <section className="mt-16">
          <p className="text-sm font-bold tracking-[0.28em] text-[#00d084]">
            DASHBOARD
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            La tua pagina BioLinkr.
          </h1>

          <p className="mt-4 text-lg text-white/60">
            Account: <span className="font-semibold text-white">{email}</span>
          </p>
        </section>

        <nav className="sticky top-3 z-30 mt-8 hidden gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#17181e]/95 p-2 shadow-xl backdrop-blur lg:flex">
  {[
    { id: "links", label: "Links" },
    { id: "appearance", label: "Aspetto" },
    { id: "social", label: "Social" },
    { id: "analytics", label: "Analytics" },
    { id: "abtest", label: "A/B Test" },
    { id: "preview", label: "Anteprima" },
    { id: "pro", label: "Pro", gem: true },
  ].map((item) => {
    const isActive = activeSection === item.id;

    return (
      <button
  key={item.id}
  type="button"
  onClick={() =>
    setActiveSection(
      item.id as "links" | "appearance" | "social" | "analytics" | "abtest" | "preview" | "pro"
    )
  }
  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
    isActive
      ? "bg-[#00d084] text-[#07100d]"
      : "text-white/60 hover:bg-white/10 hover:text-white"
  }`}
>
  {item.gem ? (
    <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1.5 inline h-4 w-4 shrink-0" aria-hidden="true"><defs><linearGradient id="menuGemGradient" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#effffc" /><stop offset="24%" stopColor="#aafbf0" /><stop offset="52%" stopColor="#3bddca" /><stop offset="100%" stopColor="#056963" /></linearGradient></defs><path d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z" fill="url(#menuGemGradient)" stroke="#d9fffa" strokeWidth="0.95" strokeLinejoin="round" /><path d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z" fill="#b8fff6" /><path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" /><path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" /><path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" /></svg>Pro</>
  ) : (
    item.label
  )}
</button>
    );
  })}
</nav>

        {activeSection === "analytics" && (
  <section className="mt-12">
    {/* INIZIO BLOCCO FUNNEL / CARD ANALYTICS */}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
          ANALYTICS
        </p>
        <h2 className="mt-1 text-2xl font-black">
          Il tuo funnel
        </h2>
        <p className="mt-1 text-sm text-white/55">
          Visite alla pagina → click verso i tuoi link esterni.
        </p>
      </div>

      <button
        type="button"
        onClick={() => loadAnalytics(userId, links)}
        disabled={analyticsLoading}
        className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {analyticsLoading ? "Aggiornamento..." : "Aggiorna dati"}
      </button>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* Visite totali */}
      <article className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
        <p className="text-sm font-bold text-white/50">Visite totali</p>
        <p className="mt-2 text-3xl font-black text-white">{totalViews}</p>
        <p className="mt-1 text-xs text-white/45">{todayViews} nelle ultime 24 ore</p>
      </article>

      {/* Click social */}
      <article className="rounded-2xl border border-[#00d084]/30 bg-[#00d084]/10 p-4">
        <p className="text-sm font-bold text-[#00d084]/80">Click social</p>
        <p className="mt-2 text-3xl font-black text-white">{totalSocialClicks}</p>
        <p className="mt-1 text-xs text-white/55">{todaySocialClicks} nelle ultime 24 ore</p>
      </article>

      {/* Visite ultimi 7 giorni */}
      <article className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
        <p className="text-sm font-bold text-white/50">Visite ultimi 7 giorni</p>
        <p className="mt-2 text-3xl font-black text-white">{weekViews}</p>
        <p className="mt-1 text-xs text-white/45">Traffico recente al profilo</p>
      </article>

      {/* Click totali */}
      <article className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
        <p className="text-sm font-bold text-white/50">Click totali</p>
        <p className="mt-2 text-3xl font-black text-white">{totalClicks}</p>
        <p className="mt-1 text-xs text-white/45">{todayClicks} nelle ultime 24 ore</p>
      </article>

      {/* Click ultimi 7 giorni */}
      <article className="rounded-2xl border border-white/10 bg-[#17181e] p-4">
        <p className="text-sm font-bold text-white/50">Click ultimi 7 giorni</p>
        <p className="mt-2 text-3xl font-black text-white">{weekClicks}</p>
        <p className="mt-1 text-xs text-white/45">Interesse recente verso i link</p>
      </article>

      {/* CTR complessivo */}
      <article className="rounded-2xl border border-[#00d084]/30 bg-[#00d084]/10 p-4">
        <p className="text-sm font-bold text-[#00d084]/80">CTR complessivo</p>
        <p className="mt-2 text-3xl font-black text-white">{totalCtr}%</p>
        <p className="mt-1 text-xs text-white/55">Click esterni ÷ visite profilo</p>
      </article>

      {/* Link migliore */}
      <article className="rounded-2xl border border-[#00d084]/25 bg-[#17181e] p-4">
        <p className="text-sm font-bold text-[#00d084]/80">Link migliore</p>
        <p className="mt-2 truncate text-xl font-black text-white">
          {topLink && topLinkClicks > 0 ? topLink.title : "Nessun dato"}
        </p>
        <p className="mt-1 text-xs text-white/55">
          {topLinkClicks > 0 ? `${topLinkClicks} click ricevuti` : "Clicca i link per testare"}
        </p>
      </article>
    </div>
    {/* FINE BLOCCO FUNNEL / CARD ANALYTICS */}

    {/* TRAFFICO (quello che avevi già) */}
    <article className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10 mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
            TRAFFICO
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Fonti di traffico
          </h2>
        </div>

        <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/55">
          {trafficSources.length}
        </span>
      </div>

      <p className="mt-3 text-white/55">
        Da dove arrivano le visite alla tua pagina.
      </p>

      {trafficSources.length === 0 ? (
        <p className="mt-8 text-white/45">
          Non ci sono ancora visite da analizzare.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {trafficSources.map((source) => (
            <div key={source.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <p className="truncate font-bold text-white/85">
                  {source.label}
                </p>

                <p className="shrink-0 text-white/50">
                  {source.visits} visite · {source.percentage}%
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#00d084] transition-all"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>

{geoAnalyticsLoading ? (
  <p className="text-sm text-white/50">
    Caricamento paesi, dispositivi e sorgenti…
  </p>
) : (
  <>
  {/* Paesi */}
<section>
  <h3 className="mb-3 text-lg font-semibold">
    Paesi principali
  </h3>

  <div className="grid grid-cols-2 gap-3">
    {countriesByVisits.slice(0, 6).map((country) => {
      const code = country.name || "Unknown";

      return (
        <div
          key={code}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {flagFromCode(code)}
            </span>

            <span className="font-medium">
              {code === "Unknown"
                ? "Sconosciuto"
                : code.toUpperCase()}
            </span>
          </div>

          <div className="text-sm text-white/60">
            {country.value} visite
          </div>
        </div>
      );
    })}
  </div>
</section>

   {/* Dispositivi */}
<section className="mt-6">
  <h3 className="mb-3 text-lg font-semibold">
    Dispositivi
  </h3>

  <div className="grid grid-cols-3 gap-3">
    {devicesByVisits.map((device) => (
      <div
        key={device.name}
        className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
      >
        <div className="text-sm capitalize text-white/60">
          {device.name}
        </div>

        <div className="text-lg font-semibold">
          {device.value}
        </div>
      </div>
    ))}
  </div>
</section>

   {/* Sorgenti */}
<section className="mt-6">
  <h3 className="mb-3 text-lg font-semibold">
    Sorgenti
  </h3>

  <div className="grid grid-cols-2 gap-3">
    {sourcesByVisits.map((source) => (
      <div
        key={source.name}
        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
      >
        <span className="font-medium capitalize">
          {source.name}
        </span>

        <span className="text-sm text-white/60">
          {source.value} visite
        </span>
      </div>
    ))}
  </div>
</section>
  </>
)}

    {/* CLICK PER LINK (quello che avevi già) */}
    {links.length > 0 && (
      <section className="biolinkr-card mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#17181e]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-[#00d084]">
              PERFORMANCE LINK
            </p>

            <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
              Click per link
            </h3>

            <p className="mt-1 text-sm text-white/45">
              Scopri quali link ricevono più attenzione.
            </p>
          </div>

          <div className="w-fit rounded-xl border border-[#00d084]/20 bg-[#00d084]/10 px-3 py-2">
            <p className="text-[9px] font-black tracking-[0.12em] text-[#5cf0bd]/70">
              CLICK TOTALI
            </p>

            <p className="mt-0.5 text-lg font-black tracking-[-0.05em] text-[#5cf0bd]">
              {totalClicks}
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {totalClicks === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6 sm:py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00d084]/20 bg-[#00d084]/10 text-xl font-black text-[#5cf0bd]">
                ↗
              </div>

              <h4 className="mt-5 text-lg font-black tracking-[-0.035em] text-white">
                I tuoi primi dati stanno arrivando.
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                Condividi la tua pagina BioLinkr nella bio: qui vedrai quali link
                ricevono più click e dove vale la pena intervenire.
              </p>

              <p className="mt-5 text-xs font-bold text-[#5cf0bd]">
                I dati compariranno automaticamente al primo click.
              </p>
            </div>
          ) : (
            links.map((link, index) => {
              // LOG TEMPORANEO PER DEBUG A/B
  console.log("LINK:", {
    id: link.id,
    title: link.title,
    ab_group: link.ab_group,
    is_variant: link.is_variant,
    variant_of: link.variant_of,
  });
              const clicks = clicksByLink[link.id] ?? 0;
              const percentage =
                totalClicks > 0
                  ? Math.round((clicks / totalClicks) * 100)
                  : 0;

              const isTopLink = index === 0 && clicks > 0;

              return (
                <div
                  key={link.id}
                  className={`px-5 py-4 transition duration-300 sm:px-6 ${
                    isTopLink
                      ? "bg-[#00d084]/[0.045]"
                      : "hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
  <p className="truncate font-bold text-white/85">
    {link.title}
  </p>

  {/* Badge "PIÙ FORTE" */}
  {isTopLink && (
    <span className="shrink-0 rounded-md bg-[#00d084]/15 px-2 py-1 text-[9px] font-black tracking-[0.1em] text-[#5cf0bd]">
      PIÙ FORTE
    </span>
  )}

  {/* Badge A/B per link principale con varianti */}
{link.ab_group &&
  !link.is_variant &&
  links.some(
    (l) => l.ab_group === link.ab_group && l.is_variant && l.id !== link.id
  ) && (
    <span className="shrink-0 rounded-md bg-[#9d7bff]/15 px-2 py-1 text-[9px] font-black tracking-[0.1em] text-[#d3b8ff]">
      A/B
    </span>
  )}

  {/* Badge "Variante" per le varianti */}
  {link.is_variant && (
    <span className="shrink-0 rounded-md bg-[#9d7bff]/15 px-2 py-1 text-[9px] font-black tracking-[0.1em] text-[#d3b8ff]">
      Variante
    </span>
  )}
</div>

                      <p className="mt-1 text-xs text-white/40">
                        {percentage}% dei click registrati
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-lg font-black tracking-[-0.05em] text-white">
                        {clicks}
                      </p>

                      <p className="text-[10px] font-black tracking-[0.12em] text-white/40">
                        CLICK
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTopLink ? "bg-[#00d084]" : "bg-[#00d084]/65"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    )}
  </section>
)}

{activeSection === "abtest" && (
  <section className="mt-12">
    {/* Intestazione */}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
          A/B TEST
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          I tuoi test
        </h2>
        <p className="mt-2 text-sm text-white/55">
          Confronta due versioni di un link e rendi definitiva quella che performa meglio.
        </p>
      </div>
      <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/10 px-3 py-2 text-sm font-bold text-[#00d084]">
        {abGroups.length} {abGroups.length === 1 ? "test" : "test"}
      </span>
    </div>

    {/* Box spiegazione / mini-tutorial */}
    <div className="mt-6 rounded-2xl border border-[#00d084]/20 bg-[#00d084]/[0.06] p-5 sm:p-6">
      <p className="text-sm font-black text-white">
        Cos’è un A/B test su BioLinkr
      </p>
      <p className="mt-2 text-sm leading-6 text-white/60">
        Un A/B test ti permette di mostrare a caso due versioni dello stesso link
        (titolo e/o URL diversi) e vedere quale delle due riceve più click.
        Dopo un periodo di test, puoi rendere definitiva la versione vincente
        ed eliminare le altre.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-3">
          <p className="text-xs font-black text-white/80">
            1. Crea una variante
          </p>
          <p className="mt-1 text-xs text-white/50">
            Dalla lista Link, apri un link e premi “Crea variante”. Cambia titolo e/o URL.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-3">
          <p className="text-xs font-black text-white/80">
            2. Raccogli click
          </p>
          <p className="mt-1 text-xs text-white/50">
            BioLinkr mostra a caso la versione A o B. Qui vedi quanti click riceve ciascuna.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-3">
          <p className="text-xs font-black text-white/80">
            3. Rendi definitiva
          </p>
          <p className="mt-1 text-xs text-white/50">
            Quando una variante vince, premi “Rendi definitiva” e tieni solo quella.
          </p>
        </div>
      </div>
    </div>

    {abGroups.length === 0 ? (
      <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-[#0c0d12] px-5 py-10 text-center">
        <p className="font-bold text-white">
          Nessun test A/B attivo
        </p>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Quando creerai una seconda variante per un link, qui vedrai il confronto
          tra le versioni e potrai rendere definitiva quella che riceve più click.
        </p>
        <button
          type="button"
          onClick={() => setActiveSection("links")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#00d084]/25 bg-[#00d084]/10 px-4 py-2.5 text-sm font-black text-[#5cf0bd] transition hover:border-[#00d084]/55 hover:bg-[#00d084]/15"
        >
          Vai ai link
          <span className="text-lg">→</span>
        </button>
      </div>
    ) : (
      <div className="mt-8 space-y-8">
        {abGroups.map((group) => {
          if (!group.winner) return null;

          return (
            <div
              key={group.ab_group}
              className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6"
            >
              {/* Header del test */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white">
                    Test A/B: {group.links[0].title}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {group.links.length} varianti · {group.totalClicksInGroup} click totali
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openConfirmWinnerModal(group, group.winner!)}
                  className="rounded-xl border border-[#9d7bff]/40 px-4 py-2 text-sm font-bold text-[#d3b8ff] transition hover:bg-[#9d7bff] hover:text-[#0c0d12]"
                >
                  Rendi definitiva
                </button>
              </div>

              {/* Lista varianti (nessun titolo aggiuntivo) */}
              <div className="mt-6 space-y-4">
                {group.stats.map((stat) => {
                  const percentage =
                    group.totalClicksInGroup > 0
                      ? Math.round((stat.clicks / group.totalClicksInGroup) * 100)
                      : 0;

                  const isWinner =
                    group.winner && stat.link.id === group.winner.link.id;

                  return (
                    <div key={stat.link.id}>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-bold text-white/85">
                              {stat.link.title}
                            </p>
                            {isWinner && (
                              <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/15 px-2 py-0.5 text-xs font-bold text-[#00d084]">
                                Vincitore
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-white/40">
                            {stat.link.url}
                          </p>
                        </div>
                        <p className="shrink-0 text-right text-white/50">
                          {stat.clicks} click · {percentage}%
                        </p>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isWinner ? "bg-[#00d084]" : "bg-white/30"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
)}

        {(activeSection === "analytics" || activeSection === "social") && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
          SOCIAL
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Performance social
        </h2>

        <p className="mt-2 text-sm text-white/55">
          Scopri quali profili ricevono più click dalla tua pagina BioLinkr.
        </p>
      </div>

      <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/10 px-3 py-2 text-sm font-bold text-[#00d084]">
        {totalSocialClicks}{" "}
        {totalSocialClicks === 1 ? "click totale" : "click totali"}
      </span>
    </div>

    {totalSocialClicks === 0 ? (
      <div className="mt-7 rounded-2xl border border-dashed border-white/15 bg-[#0c0d12] px-5 py-8 text-center">
        <p className="font-bold text-white">
          Nessun click social ancora
        </p>

        <p className="mt-2 text-sm text-white/45">
          Quando qualcuno cliccherà una delle icone social nella tua pagina,
          qui vedrai la classifica delle piattaforme più visitate.
        </p>
      </div>
    ) : (
      <div className="mt-7 space-y-4">
        {Object.entries(socialClicksByPlatform)
          .sort(([, clicksA], [, clicksB]) => clicksB - clicksA)
          .map(([platform, clicks]) => {
            const percentage =
              totalSocialClicks > 0
                ? Math.round((clicks / totalSocialClicks) * 100)
                : 0;

            const platformLabel =
              platform.charAt(0).toUpperCase() + platform.slice(1);

            return (
              <div
                key={platform}
                className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-white">
                    {platformLabel}
                  </p>

                  <p className="shrink-0 text-sm text-white/55">
                    <span className="font-black text-white">
                      {clicks}
                    </span>{" "}
                    click · {percentage}%
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#00d084] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    )}
  </section>
)}

        {activeSection === "analytics" && (
  <section className="mt-12">
    <article className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
            TRAFFICO
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Fonti di traffico
          </h2>
        </div>

        <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/55">
          {trafficSources.length}
        </span>
      </div>

      <p className="mt-3 text-white/55">
        Da dove arrivano le visite alla tua pagina.
      </p>

      {trafficSources.length === 0 ? (
        <p className="mt-8 text-white/45">
          Non ci sono ancora visite da analizzare.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {trafficSources.map((source) => (
            <div key={source.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <p className="truncate font-bold text-white/85">
                  {source.label}
                </p>

                <p className="shrink-0 text-white/50">
                  {source.visits} visite · {source.percentage}%
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#00d084] transition-all"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  </section>
)}

        {activeSection === "analytics" && abGroups.length > 0 && (
          <section className="mt-8">
            <article className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold tracking-[0.22em] text-[#9d7bff]">
                    A/B TEST
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Risultati dei test
                  </h2>
                </div>

                <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/55">
                  {abGroups.length} test
                </span>
              </div>

              <p className="mt-3 text-white/55">
                Confronta le varianti e rendi definitiva quella che performa
                meglio.
              </p>

              <div className="mt-8 space-y-8">
                {abGroups.map((group) => {
                  if (!group.winner) {
                    return null;
                  }

                  return (
                    <div
                      key={group.ab_group}
                      className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white">
                            Test A/B: {group.links[0].title}
                          </p>
                          <p className="mt-1 text-sm text-white/45">
                            {group.links.length} varianti Â·{" "}
                            {group.totalClicksInGroup} click totali
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openConfirmWinnerModal(group, group.winner!)
                          }
                          className="rounded-xl border border-[#9d7bff]/40 px-4 py-2 text-sm font-bold text-[#d3b8ff] transition hover:bg-[#9d7bff] hover:text-[#0c0d12]"
                        >
                          Rendi definitiva
                        </button>
                      </div>

                      <div className="mt-6 space-y-4">
                        {group.stats.map((stat) => {
                          const percentage =
                            group.totalClicksInGroup > 0
                              ? Math.round(
                                  (stat.clicks / group.totalClicksInGroup) *
                                    100
                                )
                              : 0;

                          const isWinner =
                            group.winner &&
                            stat.link.id === group.winner.link.id;

                          return (
                            <div key={stat.link.id}>
                              <div className="flex items-center justify-between gap-4 text-sm">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate font-bold text-white/85">
                                      {stat.link.title}
                                    </p>

                                    {isWinner && (
                                      <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/15 px-2 py-0.5 text-xs font-bold text-[#00d084]">
                                        Vincitore
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 truncate text-xs text-white/40">
                                    {stat.link.url}
                                  </p>
                                </div>

                                <p className="shrink-0 text-right text-white/50">
                                  {stat.clicks} click Â· {percentage}%
                                </p>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isWinner
                                      ? "bg-[#00d084]"
                                      : "bg-white/30"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        )}

        {activeSection === "preview" && (
  <section className="mt-12">
    <div className="rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
      <div>
        <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
          ANTEPRIMA
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          La tua pagina BioLinkr
        </h2>
        <p className="mt-2 text-white/60">
          Vedi come appare la tua pagina su mobile.
        </p>
      </div>

      {/* Preview mobile (stesso identico layout della sezione Link) */}
      <div className="mt-8">
        <div className="mx-auto w-full max-w-[390px]">
          <div
            className={`overflow-hidden rounded-[32px] border-[8px] border-[#080a0d] shadow-[0_24px_70px_rgba(0,0,0,0.45)]`}
          >
            <div className="sticky top-6 mx-auto w-full max-w-[740px]">
              <IPhonePreview>
                <ProfilePreview
                  displayName={displayName ?? ""}
                  username={(username ?? "").trim().toLowerCase()}
                  bio={bio ?? ""}
                  avatarUrl={avatarUrl ?? ""}
                  bannerImageUrl={bannerImageUrl}
                  avatarWidth={profileImageWidth}
                  avatarPositionX={profileImagePositionX}
                  bgColor={bgColor ?? ""}
                  bgImageUrl={bgImageUrl ?? ""}
                  bgVideoUrl={bgVideoUrl}
                  videoOpacity={videoOpacity}
                  buttonStyle={(buttonStyle ?? "solid") as "solid" | "outline" | "glass"}
                  profileLayout={profileLayout}
                  displayNameColor={displayNameColor ?? "#ffffff"}
                  usernameColor={usernameColor ?? "#00d084"}
                  bioColor={bioColor ?? "rgba(255,255,255,0.7)"}
                  displayNameSize={displayNameSize ?? "text-4xl"}
                  bioSize={bioSize ?? "text-base"}
                  links={previewLinks}
                  products={previewProducts}
                  socialLinks={socialLinks}
                  socialPosition={socialPosition}
                />
              </IPhonePreview>
            </div>
          </div>
        </div>
      </div>

      {publicProfileUrl && (
        <Link
          href={publicProfileUrl}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-[#00d084]/60 px-4 py-3 font-bold text-[#00d084] transition hover:bg-[#00d084] hover:text-[#07100d]"
        >
          Apri la pagina pubblica
        </Link>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-white/70">{message}</p>
      )}
    </div>
  </section>
)}

        {/* {activeSection === "store" && (
  <section className="mt-12">
    <article className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
            STORE
          </p>

          <h2 className="mt-2 text-2xl font-black">
            I tuoi prodotti
          </h2>
        </div>

        <button
          type="button"
          onClick={openNewProductModal}
          className="rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
        >
          + Nuovo prodotto
        </button>
      </div>

      <p className="mt-3 text-white/55">
        Vendi prodotti digitali direttamente dalla tua pagina BioLinkr.
      </p>

      {products.length === 0 ? (
        <p className="mt-8 text-white/45">
          Non hai ancora creato nessun prodotto.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map((product) => {
            const orders = ordersByProduct[product.id] ?? [];
            const totalRevenue = orders.reduce(
              (sum, o) => sum + o.amount_cents,
              0
            );

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">
                      {product.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-white/55">
                      {product.description}
                    </p>

                    <p className="mt-3 text-lg font-black text-[#00d084]">
                      {formatPrice(product.price_cents, product.currency)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(product)}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]"
                    >
                      Modifica
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400 hover:text-[#0c0d12]"
                    >
                      Elimina
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs font-bold text-white/50">
                      Vendite
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {orders.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white/50">
                      Ricavo totale
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {formatPrice(totalRevenue, product.currency)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  </section>
)} */}
        
        <section className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-6">
  <div className="space-y-6">
    {activeSection === "appearance" && (
  <form
    onSubmit={handleSaveProfile}
    className="overflow-hidden rounded-[28px] border border-white/10 bg-[#12151b] shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
  >
    <div className="mb-6 rounded-3xl border border-white/10 bg-[#17181e] p-4 sm:p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00d084]">
        Aspetto
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        Personalizza la tua pagina
      </h2>

      <p className="mt-2 text-sm text-white/55">
        Scegli un look, poi rifinisci solo ciò che ti serve.
      </p>
    </div>

    <span className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-[#00d084]/25 bg-[#00d084]/10 px-3 py-1.5 text-xs font-bold text-[#5cf0bd]">
      <span className="h-2 w-2 rounded-full bg-[#00d084] shadow-[0_0_10px_#00d084]" />
      Live
    </span>
  </div>

  <div className="mt-6 space-y-3">
    
    {[
  {
    id: "layout" as const,
    icon: "▣",
    title: "Layout",
    value:
      profileLayout === "classic"
        ? "Classic"
        : profileLayout.charAt(0).toUpperCase() + profileLayout.slice(1),
    description: "Scegli la struttura del profilo.",
  },
  {
    id: "theme" as const,
    icon: "✦",
    title: "Tema",
    value: buttonStyle === "glass" ? "Glass" : buttonStyle === "outline" ? "Outline" : "Pieno",
    description: "Una base pronta per il tuo stile.",
  },
  {
    id: "background" as const,
        icon: "◐",
        title: "Sfondo",
        value: bgImageUrl
          ? "Immagine"
          : bgColor.includes("gradient")
            ? "Gradiente"
            : "Colore",
        description: "Colore, gradiente o immagine.",
      },
      {
        id: "buttons" as const,
        icon: "▭",
        title: "Pulsanti",
        value: buttonStyle === "glass" ? "Trasparenti" : buttonStyle === "outline" ? "Outline" : "Pieni",
        description: "Forma e presenza dei tuoi link.",
      },
      {
        id: "profile" as const,
        icon: "◉",
        title: "Profilo",
        value: avatarUrl ? "Foto impostata" : "Da completare",
        description: "Nome, bio e immagine profilo.",
      },
    ].map((item) => {
      const isOpen = appearancePanel === item.id;

      return (
        <div
          key={item.id}
          className={`overflow-hidden rounded-2xl border transition ${
  isOpen
    ? "border-white/20 bg-[#0f1117]"
    : "border-white/10 bg-[#0c0d12] hover:border-white/25"
}`}
        >
          <button
            type="button"
            onClick={() =>
              setAppearancePanel((current) =>
                current === item.id ? null : item.id
              )
            }
            className="flex min-h-16 w-full items-center gap-3 px-4 text-left"
            aria-expanded={isOpen}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg ${
                isOpen
                  ? "border-[#00d084]/35 bg-[#00d084]/15 text-[#5cf0bd]"
                  : "border-white/10 bg-white/[0.04] text-white/70"
              }`}
            >
              {item.icon}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-bold text-white">{item.title}</span>

              <span className="mt-0.5 block truncate text-xs text-white/45">
                {item.description}
              </span>
            </span>

            <span className="hidden max-w-28 truncate text-right text-xs font-bold text-white/45 sm:block">
              {item.value}
            </span>

            <span
              className={`text-xl text-white/45 transition ${
                isOpen ? "rotate-90 text-[#00d084]" : ""
              }`}
              aria-hidden="true"
            >
              ›
            </span>
                    </button>
                    {isOpen && item.id === "layout" && (
  <div className="border-t border-white/10 px-4 pb-4 pt-3">
    <div className="rounded-2xl border border-[#40e0d0]/20 bg-[#40e0d0]/[0.06] p-4">
      <p className="text-sm font-black text-white">
        Scegli il layout del profilo
      </p>

      <p className="mt-1 text-xs leading-5 text-white/55">
        Classic è incluso per tutti. Hero, Banner e Shape sono layout PRO.
      </p>
    </div>

    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
      {[
        {
          id: "classic" as const,
          label: "Classic",
          description: "Pulito e intramontabile",
          pro: false,
        },
        {
          id: "hero" as const,
          label: "Hero",
          description: "Ritratto grande",
          pro: true,
        },
        {
          id: "banner" as const,
          label: "Banner",
          description: "Copertina in evidenza",
          pro: true,
        },
        {
          id: "shape" as const,
          label: "Shape",
          description: "Forma creativa",
          pro: true,
        },
      ].map((layoutOption) => {
        const hasPro =
          plan === "premium" || subscriptionStatus === "trialing";

        const isLocked = layoutOption.pro && !hasPro;
        const isSelected = profileLayout === layoutOption.id;

        return (
          <button
            key={layoutOption.id}
            type="button"
            onClick={() => {
              if (isLocked) {
                setLockedFeature("Layout profilo PRO");
                setProModalOpen(true);
                return;
              }

              setProfileLayout(layoutOption.id);
            }}
            className={`group relative w-36 shrink-0 overflow-visible rounded-2xl border p-2 text-left transition ${
              isSelected
                ? "border-[#00d084] bg-[#00d084]/10 ring-2 ring-[#00d084]/20"
                : "border-white/10 bg-[#0c0d12] hover:border-white/30"
            }`}
          >
            {layoutOption.pro && (
  <span
    aria-label="Disponibile con PRO"
className="pointer-events-none absolute right-2 top-2 z-20 h-7 w-7"
  >
    {/* Pill che cresce verso sinistra */}
    <span className="absolute right-0 top-0 flex h-7 w-7 items-center justify-start overflow-hidden rounded-full border border-[#40e0d0]/50 bg-[#080b0d]/95 shadow-[0_3px_10px_rgba(0,0,0,0.35),0_0_10px_rgba(64,224,208,0.28)] transition-[width,border-color,box-shadow,background-color] duration-400 ease-out group-hover:w-[54px] group-hover:border-[#40e0d0]/80 group-hover:bg-[#091110] group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_16px_rgba(64,224,208,0.48)] group-focus-visible:w-[54px] group-focus-visible:border-[#40e0d0]/80 group-focus-visible:bg-[#091110] group-focus-visible:shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_16px_rgba(64,224,208,0.48)]">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.1em] text-[#d9fffa] opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        PRO
      </span>
    </span>

    {/* Diamante: resta fermo mentre la pill si espande */}
    <span className="absolute inset-0 grid place-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-[17px] w-[17px] overflow-visible drop-shadow-[0_2px_2px_rgba(0,44,50,0.85)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`layoutProGemBase-${layoutOption.id}`}
            x1="5"
            y1="4"
            x2="19"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#effffc" />
            <stop offset="20%" stopColor="#aafbf0" />
            <stop offset="48%" stopColor="#3bddca" />
            <stop offset="76%" stopColor="#099e95" />
            <stop offset="100%" stopColor="#045d5b" />
          </linearGradient>

          <linearGradient
            id={`layoutProGemTop-${layoutOption.id}`}
            x1="7"
            y1="5"
            x2="16"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#b8fff6" />
            <stop offset="100%" stopColor="#39cfbf" />
          </linearGradient>
        </defs>

        <path
          d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
          fill={`url(#layoutProGemBase-${layoutOption.id})`}
          stroke="#d9fffa"
          strokeWidth="0.95"
          strokeLinejoin="round"
        />
        <path
          d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z"
          fill={`url(#layoutProGemTop-${layoutOption.id})`}
        />
        <path
          d="M6.4 5.25 9.1 9.4H3.4l3-4.15Z"
          fill="#9effef"
          opacity="0.82"
        />
        <path
          d="m17.6 5.25-2.7 4.15h5.7l-3-4.15Z"
          fill="#2dbdaf"
          opacity="0.94"
        />
        <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
        <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
        <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />
        <path
          d="M7.1 6.4h4.75L9.7 8.45H5.65L7.1 6.4Z"
          fill="#ffffff"
          opacity="0.62"
        />
        <path
          d="M3.4 9.4h17.2M9.1 9.4 12 19.85l2.9-10.45M6.4 5.25l2.7 4.15m8.5-4.15-2.7 4.15"
          fill="none"
          stroke="#034c49"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </span>
  </span>
)}

            {layoutOption.id === "classic" && (
              <div className="relative h-24 rounded-xl border border-white/10 bg-gradient-to-br from-[#222632] to-[#0c0d12]">
                <div className="absolute left-1/2 top-4 h-10 w-10 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f2c7b6] to-[#8a4d42]" />
                <div className="absolute left-1/2 top-16 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/80" />
                <div className="absolute left-1/2 top-[4.8rem] h-1 w-10 -translate-x-1/2 rounded-full bg-white/35" />
              </div>
            )}

            {layoutOption.id === "hero" && (
              <div className="relative h-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#c43d47] via-[#4d2026] to-[#0c0d12]">
                <div className="absolute left-1/2 top-2 h-20 w-16 -translate-x-1/2 rounded-t-[2rem] bg-gradient-to-b from-[#1f1716] via-[#b77d6b] to-[#f0b8a4]" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0c0d12] to-transparent" />
              </div>
            )}

            {layoutOption.id === "banner" && (
              <div className="relative h-24 overflow-hidden rounded-xl border border-white/10 bg-[#f0e4e1]">
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-r from-[#f6c7d0] via-[#fff5f4] to-[#e7a8b6]" />
                <div className="absolute left-1/2 top-5 h-10 w-10 -translate-x-1/2 rounded-full border-2 border-white bg-gradient-to-br from-[#2b1a1b] to-[#edb9a6]" />
                <div className="absolute bottom-4 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#34303a]" />
              </div>
            )}

            {layoutOption.id === "shape" && (
              <div className="relative h-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#5a1c25] via-[#d04a55] to-[#f19e9e]">
                <div className="absolute left-1/2 top-3 h-16 w-20 -translate-x-1/2 bg-gradient-to-br from-[#241313] via-[#b77666] to-[#f0b49f] [border-radius:42%_58%_55%_45%/45%_42%_58%_55%]" />
              </div>
            )}

            <p
              className={`mt-3 text-sm font-black ${
                isSelected ? "text-[#5cf0bd]" : "text-white"
              }`}
            >
              {layoutOption.label}
            </p>

            <p className="mt-1 min-h-8 text-[11px] leading-4 text-white/45">
              {layoutOption.description}
            </p>

            {isLocked && (
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#78f5df]">
                Richiede PRO
              </p>
            )}

            {isSelected && (
              <span className="mt-2 inline-flex rounded-full bg-[#00d084] px-2 py-1 text-[10px] font-black text-[#07100d]">
                Attivo
              </span>
            )}
          </button>
        );
      })}
    </div>

    {profileLayout === "banner" && (
  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-black text-white">
          Logo o immagine banner
        </p>

        <p className="mt-1 text-xs leading-5 text-white/50">
          Carica un logo o una cover orizzontale. Per un risultato migliore,
          usa PNG, JPG o WEBP in formato 3:1 oppure 4:1.
        </p>
      </div>

      {bannerImageUrl ? (
        <img
          src={bannerImageUrl}
          alt="Anteprima banner"
          className="h-14 w-28 rounded-xl border border-white/15 object-cover"
        />
      ) : (
        <div className="flex h-14 w-28 items-center justify-center rounded-xl border border-dashed border-white/20 px-2 text-center text-[10px] font-bold text-white/35">
          Nessun banner
        </div>
      )}
    </div>

    <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
      {uploadingBanner ? "Caricamento..." : "Carica logo o banner"}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleBannerImageChange}
        disabled={uploadingBanner}
        className="sr-only"
      />
    </label>

    {bannerImageUrl && (
      <button
        type="button"
        onClick={() => {
          setBannerImageUrl("");
          setMessage(
            "Banner rimosso. Premi “Salva modifiche” per pubblicare la modifica."
          );
        }}
        className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
      >
        Rimuovi banner
      </button>
    )}
  </div>
)}

    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs leading-5 text-white/45">
    L’anteprima si aggiorna subito. Premi Salva modifiche per pubblicare il layout.
  </p>

  <button
    type="submit"
    disabled={savingProfile || uploadingAvatar || uploadingBg}
    className="min-h-11 shrink-0 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {savingProfile ? "Salvataggio..." : "Salva modifiche"}
  </button>
</div>
  </div>
)}
{isOpen && item.id === "theme" && (
  <div className="border-t border-white/10 px-4 pb-4 pt-3">
<div className="rounded-2xl border border-[#00d084]/20 bg-[#00d084]/[0.06] p-4">
  <div className="flex items-start gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00d084]/25 bg-[#00d084]/10 text-sm text-[#5cf0bd]">
      ✦
    </span>

    <div className="min-w-0">
      <p className="text-sm font-black text-white">
        Scegli un tema di partenza
      </p>

      <p className="mt-1 text-xs leading-5 text-white/55">
        Applica uno stile pronto e poi personalizza sfondo e pulsanti come
        preferisci.
      </p>

      <p className="mt-2 text-xs font-medium text-[#7af5bf]">
        Midnight per un look scuro, Aurora per uno stile più elegante.
      </p>
    </div>
  </div>
</div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        {
          name: "Midnight",
          description: "Scuro smeraldo",
          bg: "#062b24",
          style: "solid",
          avatar: "#dfffe8",
          button: "bg-white text-[#111318]",
        },
        {
          name: "Aurora",
          description: "Gradiente glass",
          bg: "linear-gradient(145deg, #2c135f 0%, #0b766a 100%)",
          style: "glass",
          avatar: "#ffffff",
          button:
            "border border-white/60 bg-white/15 text-white backdrop-blur",
        },
        {
          name: "Studio",
          description: "Chiaro editoriale",
          bg: "#f2efe8",
          style: "outline",
          avatar: "#20231f",
          button: "border border-[#20231f]/70 text-[#20231f]",
        },
        {
          name: "Sunset",
          description: "Caldo creativo",
          bg: "linear-gradient(145deg, #4a1020 0%, #d26537 100%)",
          style: "solid",
          avatar: "#fff2d9",
          button: "bg-[#fff2d9] text-[#3a1620]",
        },
      ].map((theme) => {
        const selected =
          buttonStyle === theme.style && bgColor === theme.bg;

        return (
          <button
            key={theme.name}
            type="button"
            onClick={() => {
              setBgColor(theme.bg);
              setButtonStyle(theme.style);
              setBgImageUrl("");
              setBackgroundMode(
                theme.bg.includes("gradient") ? "gradient" : "color"
              );
            }}
            className={`overflow-hidden rounded-2xl border p-2 text-left transition active:scale-[0.98] ${
              selected
                ? "border-[#00d084] bg-[#00d084]/10 ring-2 ring-[#00d084]/20"
                : "border-white/10 bg-white/[0.03] hover:border-white/30"
            }`}
          >
            <span
              className="block h-16 rounded-xl p-2"
              style={{ background: theme.bg }}
            >
              <span
                className="mx-auto block h-4 w-4 rounded-full"
                style={{ backgroundColor: theme.avatar }}
              />

              <span
                className={`mx-auto mt-2 block h-2 w-10 rounded ${theme.button}`}
              />

              <span
                className={`mx-auto mt-2 block h-2 w-12 rounded ${theme.button}`}
              />
            </span>

            <span className="mt-2 block text-xs font-black text-white">
              {theme.name}
            </span>

            <span className="mt-0.5 block text-[11px] text-white/45">
              {theme.description}
            </span>

            {selected && (
              <span className="mt-2 inline-flex rounded-full bg-[#00d084] px-2 py-1 text-[10px] font-black text-[#07100d]">
                Attivo
              </span>
            )}
          </button>
        );
      })}
    </div>
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs leading-5 text-white/45">
    Le modifiche saranno visibili dopo il salvataggio.
  </p>

  <button
    type="submit"
    disabled={savingProfile || uploadingAvatar || uploadingBg}
    className="min-h-11 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {savingProfile ? "Salvataggio..." : "Salva modifiche"}
  </button>
</div>
  </div>
)}
          {isOpen && item.id === "background" && (
  <div className="border-t border-white/10 px-4 pb-4 pt-3">
    <p className="text-xs font-bold text-white/55">
      Scegli un colore, un gradiente o una foto. L&apos;anteprima si aggiorna
      subito; premi “Salva modifiche” per pubblicare.
    </p>

    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-black/20 p-1 sm:grid-cols-4">
  {/* Colore */}
  <button
    type="button"
    onClick={() => {
      setBackgroundMode("color");
      setBgImageUrl("");
    }}
    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
      backgroundMode === "color"
        ? "bg-white/10 text-white shadow-sm"
        : "text-white/45 hover:text-white/75"
    }`}
  >
    Colore
  </button>

  {/* Gradiente */}
  <button
    type="button"
    onClick={() => {
      setBackgroundMode("gradient");
      setBgImageUrl("");
    }}
    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
      backgroundMode === "gradient"
        ? "bg-white/10 text-white shadow-sm"
        : "text-white/45 hover:text-white/75"
    }`}
  >
    Gradiente
  </button>

  {/* Immagine */}
  <button
    type="button"
    onClick={() => {
      setBackgroundMode("image");
    }}
    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
      backgroundMode === "image"
        ? "bg-white/10 text-white shadow-sm"
        : "text-white/45 hover:text-white/75"
    }`}
  >
    Immagine
  </button>

  {/* Video PRO */}
  <button
  type="button"
  onClick={() => {
    if (plan !== "premium") {
  setLockedFeature("Sfondi video");
  setProModalOpen(true);
  return;
}

    setBackgroundMode("video");
  }}
  className={`group relative overflow-visible rounded-lg border px-3 py-2 text-xs font-bold transition ${
    backgroundMode === "video"
      ? "border-[#00d084] bg-[#00d084]/10 text-white shadow-[0_0_12px_rgba(0,208,132,0.35)]"
      : "border-[#00d084]/40 bg-[#00d084]/5 text-[#00d084] hover:border-[#00d084] hover:bg-[#00d084]/10"
  }`}
>
  {/* Ancora fissa: il diamante è sempre al centro di questo cerchio da 28 px */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 h-7 w-7"
  >
    {/* Pill PRO: compare e si apre solo a SINISTRA del diamante */}
    <span
      className="absolute right-0 top-0 flex h-7 w-7 items-center justify-start overflow-hidden rounded-full border border-[#40e0d0]/50 bg-[#080b0d]/95 shadow-[0_3px_10px_rgba(0,0,0,0.35),0_0_10px_rgba(64,224,208,0.28)] transition-[width,border-color,box-shadow,background-color] duration-400 ease-out group-hover:w-[54px] group-hover:border-[#40e0d0]/80 group-hover:bg-[#091110] group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_16px_rgba(64,224,208,0.48)] group-focus-visible:w-[54px] group-focus-visible:border-[#40e0d0]/80 group-focus-visible:bg-[#091110] group-focus-visible:shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_16px_rgba(64,224,208,0.48)]"
    >
      {/* PRO: sta nella parte nuova che si apre verso sinistra */}
      <span className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.1em] text-[#d9fffa] opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        PRO
      </span>
    </span>

    {/* Diamante: layer separato, MAI animato e perfettamente centrale */}
    <span className="absolute inset-0 grid place-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-[17px] w-[17px] overflow-visible drop-shadow-[0_2px_2px_rgba(0,44,50,0.85)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="proGemBase"
            x1="5"
            y1="4"
            x2="19"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#effffc" />
            <stop offset="20%" stopColor="#aafbf0" />
            <stop offset="48%" stopColor="#3bddca" />
            <stop offset="76%" stopColor="#099e95" />
            <stop offset="100%" stopColor="#045d5b" />
          </linearGradient>

          <linearGradient
            id="proGemTop"
            x1="7"
            y1="5"
            x2="16"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#b8fff6" />
            <stop offset="100%" stopColor="#39cfbf" />
          </linearGradient>

          <clipPath id="proGemClip">
            <path d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z" />
          </clipPath>

          <linearGradient id="proGemShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#d9fffa" stopOpacity="0.12" />
            <stop offset="72%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
          fill="url(#proGemBase)"
          stroke="#d9fffa"
          strokeWidth="0.95"
          strokeLinejoin="round"
        />
        <path
          d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z"
          fill="url(#proGemTop)"
        />
        <path d="M6.4 5.25 9.1 9.4H3.4l3-4.15Z" fill="#9effef" opacity="0.82" />
        <path d="m17.6 5.25-2.7 4.15h5.7l-3-4.15Z" fill="#2dbdaf" opacity="0.94" />
        <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
        <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
        <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />

        <path
          d="M7.1 6.4h4.75L9.7 8.45H5.65L7.1 6.4Z"
          fill="#ffffff"
          opacity="0.62"
        />

        {/* Riflesso leggero, interno alla gemma */}
        <g clipPath="url(#proGemClip)" opacity="0.42">
          <rect
            x="-12"
            y="-2"
            width="7"
            height="30"
            fill="url(#proGemShine)"
            transform="rotate(18 12 12)"
          >
            <animate
              attributeName="x"
              values="-12;28"
              dur="5.2s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        <path
          d="M3.4 9.4h17.2M9.1 9.4 12 19.85l2.9-10.45M6.4 5.25l2.7 4.15m8.5-4.15-2.7 4.15"
          fill="none"
          stroke="#034c49"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </span>
  </span>

  <span className="flex items-center justify-center pr-2">
    Video
  </span>
</button>
</div>

{plan !== "premium" && backgroundMode === "video" && (
  <p className="mt-2 text-center text-[11px] text-white/50">
    Il video di sfondo è una funzionalità Premium.
  </p>
)}

    

    {backgroundMode === "color" && (
      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-white">Colore di sfondo</p>

          <span className="text-xs text-white/40">Tocca un colore</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "#062b24",
            "#0c0d12",
            "#1d2540",
            "#4a1020",
            "#f2efe8",
            "#ffffff",
          ].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                setBgColor(color);
                setBgImageUrl("");
              }}
              aria-label={`Imposta sfondo ${color}`}
              className={`h-10 w-10 rounded-xl border transition active:scale-95 ${
                bgColor === color
                  ? "border-[#00d084] ring-2 ring-[#00d084]/25"
                  : "border-white/20"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}

          <label className="flex h-10 min-w-[132px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#0c0d12] px-3 focus-within:border-[#00d084]">
            <span className="h-3 w-3 shrink-0 rounded-full border border-white/25 bg-white/10" />

            <input
              type="text"
              value={bgColor}
              onChange={(event) => {
                setBgColor(event.target.value);
                setBgImageUrl("");
              }}
              placeholder="#0c0d12"
              className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
            />
          </label>

          <input
            type="color"
            value={
              bgColor.startsWith("#") && !bgColor.includes("(")
                ? bgColor
                : "#0c0d12"
            }
            onChange={(event) => {
              setBgColor(event.target.value);
              setBgImageUrl("");
            }}
            aria-label="Scegli colore di sfondo"
            className="h-10 w-11 cursor-pointer rounded-xl border border-white/15 bg-transparent p-1"
          />
        </div>
      </div>
    )}

    {backgroundMode === "gradient" && (
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-white">Gradienti rapidi</p>

          <span
            className="h-7 w-16 rounded-lg border border-white/10"
            style={{
              background: `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            {
              name: "Aurora",
              start: "#2c135f",
              end: "#0b766a",
              angle: "145deg",
            },
            {
              name: "Sunset",
              start: "#4a1020",
              end: "#d26537",
              angle: "145deg",
            },
            {
              name: "Ocean",
              start: "#09203f",
              end: "#537895",
              angle: "135deg",
            },
            {
              name: "Berry",
              start: "#3b0a45",
              end: "#d64780",
              angle: "135deg",
            },
          ].map((preset) => {
            const presetValue = `linear-gradient(${preset.angle}, ${preset.start} 0%, ${preset.end} 100%)`;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  updateGradient(preset.start, preset.end, preset.angle);
                  setBgImageUrl("");
                }}
                className={`overflow-hidden rounded-xl border p-1.5 text-left transition active:scale-[0.98] ${
                  bgColor === presetValue
                    ? "border-[#00d084] ring-2 ring-[#00d084]/20"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <span
                  className="block h-10 rounded-lg"
                  style={{ background: presetValue }}
                />

                <span className="mt-1.5 block truncate px-0.5 text-[11px] font-bold text-white/70">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-3">
          <p className="text-xs font-bold text-white/70">
            Gradiente personalizzato
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-white/45">
                Colore iniziale
              </span>

              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={gradientStart}
                  onChange={(event) =>
                    updateGradient(event.target.value, gradientEnd)
                  }
                  className="h-10 w-11 shrink-0 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1"
                />

                <input
                  type="text"
                  value={gradientStart}
                  onChange={(event) =>
                    updateGradient(event.target.value, gradientEnd)
                  }
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#17181e] px-2 py-2 text-xs text-white outline-none focus:border-[#00d084]"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold text-white/45">
                Colore finale
              </span>

              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={gradientEnd}
                  onChange={(event) =>
                    updateGradient(gradientStart, event.target.value)
                  }
                  className="h-10 w-11 shrink-0 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1"
                />

                <input
                  type="text"
                  value={gradientEnd}
                  onChange={(event) =>
                    updateGradient(gradientStart, event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#17181e] px-2 py-2 text-xs text-white outline-none focus:border-[#00d084]"
                />
              </div>
            </label>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-white/45">Direzione</p>

            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { label: "↘", angle: "135deg" },
                { label: "↓", angle: "180deg" },
                { label: "↙", angle: "225deg" },
                { label: "→", angle: "90deg" },
              ].map((direction) => (
                <button
                  key={direction.angle}
                  type="button"
                  onClick={() =>
                    updateGradient(
                      gradientStart,
                      gradientEnd,
                      direction.angle
                    )
                  }
                  className={`rounded-lg border px-2 py-2 text-sm font-black transition ${
                    gradientAngle === direction.angle
                      ? "border-[#00d084] bg-[#00d084]/10 text-[#00d084]"
                      : "border-white/10 bg-[#17181e] text-white/55 hover:border-white/30"
                  }`}
                >
                  {direction.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {backgroundMode === "image" && (
  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-white">
          Immagine di sfondo
        </p>

        <p className="mt-1 text-xs text-white/45">
          JPG, PNG o WEBP · massimo 3 MB
        </p>
      </div>

      {bgImageUrl ? (
        <img
          src={bgImageUrl}
          alt="Anteprima sfondo"
          className="h-12 w-12 shrink-0 rounded-xl border border-white/15 object-cover"
        />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/20 text-lg text-white/35">
          +
        </span>
      )}
    </div>

    <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
      {uploadingBg ? "Caricamento..." : "Carica immagine"}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleBgChange}
        disabled={uploadingBg}
        className="sr-only"
      />
    </label>

    {bgImageUrl && (
      <button
        type="button"
        onClick={() => setBgImageUrl("")}
        className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
      >
        Rimuovi immagine
      </button>
    )}
  </div>
)}

{backgroundMode === "video" && (
  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-white">Video di sfondo (Premium)</p>
        <p className="mt-1 text-xs text-white/45">
          Carica un video MP4/MOV/WEBM o una GIF animata da usare come sfondo della pagina · massimo 20 MB
        </p>
      </div>
      {bgVideoUrl && (
        <p className="flex items-center gap-2 text-xs font-bold text-[#00d084]">
          <span aria-hidden="true">✓</span>
          Video caricato
        </p>
      )}
    </div>

    <label className="mt-4 flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
      {uploadingBg ? "Caricamento..." : "Carica video"}
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,image/gif,.gif"
        onChange={handleBgVideoChange}
        disabled={uploadingBg}
        className="sr-only"
      />
    </label>

    {bgVideoUrl && (
      <button
        type="button"
        onClick={async () => {
          setBgVideoUrl(null);
          setMessage("");

          const { error } = await supabase
            .from("profiles")
            .update({
              bg_video_url: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

          if (error) {
            setMessage("Non è stato possibile rimuovere il video.");
            return;
          }

          setMessage("Video di sfondo rimosso.");
        }}
        className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
      >
        Rimuovi video
      </button>
    )}

    {bgVideoUrl && (
      <div className="mt-4">
        <label htmlFor="video-opacity" className="block text-sm font-medium text-white/70">
          Opacità sfondo video
        </label>

        <input
          id="video-opacity"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={videoOpacity}
          onChange={(e) => setVideoOpacity(Number(e.target.value))}
          className="mt-2 w-full accent-[#00d084]"
        />

        <p className="mt-1 text-xs text-white/50">
          Valore: {(videoOpacity * 100).toFixed(0)}%
        </p>
      </div>
    )}
  </div>
)}

    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs leading-5 text-white/45">
    Le modifiche saranno visibili dopo il salvataggio.
  </p>

  <button
    type="submit"
    disabled={savingProfile || uploadingAvatar || uploadingBg}
    className="min-h-11 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {savingProfile ? "Salvataggio..." : "Salva modifiche"}
  </button>
</div>
  </div>
)}
{isOpen && item.id === "buttons" && (
  <div className="border-t border-white/10 px-4 pb-4 pt-3">
    <p className="text-xs font-bold text-white/55">
      Scegli lo stile base dei pulsanti. I link personalizzati possono
      comunque avere il proprio colore e badge.
    </p>

    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {[
        {
          id: "solid",
          title: "Pieno",
          description: "Netto e ad alta visibilità",
        },
        {
          id: "outline",
          title: "Outline",
          description: "Essenziale ed editoriale",
        },
        {
          id: "glass",
          title: "Glass",
          description: "Leggero e contemporaneo",
        },
      ].map((style) => {
        const selected = buttonStyle === style.id;

        return (
          <button
            key={style.id}
            type="button"
            onClick={() => setButtonStyle(style.id)}
            className={`rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
              selected
                ? "border-[#00d084] bg-[#00d084]/10 ring-2 ring-[#00d084]/20"
                : "border-white/10 bg-[#0c0d12] hover:border-white/30"
            }`}
          >
            <div
              className={`flex h-12 items-center justify-center rounded-xl text-xs font-black ${
                style.id === "solid"
                  ? "bg-white text-[#111318] shadow-[0_8px_18px_rgba(0,0,0,0.22)]"
                  : style.id === "outline"
                    ? "border border-white/80 text-white"
                    : "border border-white/35 bg-white/10 text-white backdrop-blur"
              }`}
            >
              Il tuo link
            </div>

            <p className="mt-3 text-sm font-black text-white">{style.title}</p>

            <p className="mt-1 text-xs text-white/45">
              {style.description}
            </p>

            {selected && (
              <span className="mt-3 inline-flex rounded-full bg-[#00d084] px-2 py-1 text-[10px] font-black text-[#07100d]">
                Attivo
              </span>
            )}
          </button>
        );
      })}
    </div>

    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00d084]/25 bg-[#00d084]/10 text-sm text-[#5cf0bd]">
          ✦
        </span>

        <div>
          <p className="text-sm font-bold text-white">Suggerimento</p>

          <p className="mt-1 text-xs leading-5 text-white/50">
            Usa Pieno per evidenziare un&apos;azione importante, Outline per
            uno stile pulito e Glass quando vuoi far risaltare sfondo o
            immagine.
          </p>
        </div>
      </div>
    </div>
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-xs leading-5 text-white/45">
    Le modifiche saranno visibili dopo il salvataggio.
  </p>

  <button
    type="submit"
    disabled={savingProfile || uploadingAvatar || uploadingBg}
    className="min-h-11 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {savingProfile ? "Salvataggio..." : "Salva modifiche"}
  </button>
</div>
  </div>
)}
{isOpen && item.id === "profile" && (
  <div className="border-t border-white/10 px-4 pb-4 pt-3">
  <p className="text-xs font-bold text-white/55">
    Queste informazioni sono visibili nella parte alta della tua pagina
    pubblica.
  </p>

  <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
    <div className="flex flex-wrap items-start gap-5">
      <div
  ref={avatarDragRef}
  onPointerDown={handleAvatarPointerDown}
  onPointerMove={handleAvatarPointerMove}
  onPointerUp={handleAvatarPointerUp}
  onPointerCancel={handleAvatarPointerUp}
  className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#17181e] touch-none select-none"
  title={avatarUrl ? "Trascina a sinistra o destra per posizionare l’immagine" : undefined}
>
  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="Anteprima immagine profilo"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="select-none object-cover"
      style={{
        width: `${profileImageWidth ?? 120}px`,
        height: `${profileImageWidth ?? 120}px`,
        objectPosition: `${profileImagePositionX}% 50%`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  ) : (
    <span className="text-4xl font-black text-[#00d084]">
      {displayName ? displayName.charAt(0).toUpperCase() : "B"}
    </span>
  )}
</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">Immagine profilo</p>

        <p className="mt-1 text-xs text-white/45">
          JPG, PNG o WEBP · massimo 2 MB
        </p>

        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
          {uploadingAvatar ? "Caricamento..." : "Cambia foto"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
            className="sr-only"
          />
        </label>
      </div>
    </div>

    <div className="mt-5 space-y-5 border-t border-white/10 pt-5">
    <div>
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-bold text-white/80">
          Dimensione immagine
        </label>

        <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-[#00d084]">
{profileImageWidth ?? 120}px
        </span>
      </div>

      <input
  type="range"
  min={80}
  max={260}
  step={1}
  value={profileImageWidth ?? 120}
  onChange={(event) =>
    setProfileImageWidth(Number(event.target.value))
  }
  className="mt-3 w-full cursor-pointer accent-[#00d084]"
/>
    </div>

  </div>
  </div>

    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-xs font-bold text-white/75">Nome visibile</span>

        <input
          type="text"
value={displayName ?? ""}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Il tuo nome o brand"
          minLength={1}
          maxLength={80}
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c0d12] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00d084]"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold text-white/75">Username</span>

        <span className="mt-2 flex overflow-hidden rounded-xl border border-white/10 bg-[#0c0d12] focus-within:border-[#00d084]">
          <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/35">
            @
          </span>

          <input
            type="text"
            value={username ?? ""}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="tuo_username"
            minLength={3}
            maxLength={30}
            required
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
          />
        </span>
      </label>
    </div>

    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-xs font-bold text-white/75">
        Bio

        <span className="font-medium text-white/35">{(bio ?? "").length}/160</span>
      </span>

      <textarea
        value={bio ?? ""}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Racconta brevemente chi sei."
        maxLength={160}
        rows={3}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0c0d12] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00d084]"
      />
    </label>
    

    {/* Dimensione bio */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
  <p className="text-sm font-black text-white">Dimensione bio</p>

  <div className="mt-3 grid grid-cols-3 gap-2">
    <button
      type="button"
      onClick={() => setBioSize("text-sm")}
      className={`rounded-xl border px-2.5 py-2 text-xs font-black transition ${
        bioSize === "text-sm"
          ? "border-[#00d084] bg-[#00d084]/10 text-[#00d084]"
          : "border-white/10 bg-[#17181e] text-white/70 hover:border-white/25"
      }`}
    >
      Piccola
    </button>

    <button
      type="button"
      onClick={() => setBioSize("text-base")}
      className={`rounded-xl border px-2.5 py-2 text-xs font-black transition ${
        bioSize === "text-base"
          ? "border-[#00d084] bg-[#00d084]/10 text-[#00d084]"
          : "border-white/10 bg-[#17181e] text-white/70 hover:border-white/25"
      }`}
    >
      Normale
    </button>

    <button
      type="button"
      onClick={() => setBioSize("text-lg")}
      className={`rounded-xl border px-2.5 py-2 text-xs font-black transition ${
        bioSize === "text-lg"
          ? "border-[#00d084] bg-[#00d084]/10 text-[#00d084]"
          : "border-white/10 bg-[#17181e] text-white/70 hover:border-white/25"
      }`}
    >
      Grande
    </button>
  </div>
</div>

    {/* Stile testo profilo */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
      <p className="text-sm font-black text-white">Stile testo profilo</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-bold text-white/75">Nome visibile</span>

          <input
            type="color"
            value={displayNameColor}
            onChange={(e) => setDisplayNameColor(e.target.value)}
            className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-[#17181e] p-1"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-white/75">Username</span>

          <input
            type="color"
            value={usernameColor}
            onChange={(e) => setUsernameColor(e.target.value)}
            className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-[#17181e] p-1"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-white/75">Bio</span>

          <input
            type="color"
            value={bioColor}
            onChange={(e) => setBioColor(e.target.value)}
            className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-[#17181e] p-1"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-white/75">Dimensione nome</span>

          <select
            value={displayNameSize}
            onChange={(e) => setDisplayNameSize(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#17181e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d084]"
          >
            <option value="text-lg">Grande</option>
            <option value="text-xl">Molto grande</option>
            <option value="text-2xl">Enorme</option>
          </select>
        </label>
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs leading-5 text-white/45">
        Le modifiche saranno visibili dopo il salvataggio.
      </p>

      <button
        type="submit"
        disabled={savingProfile || uploadingAvatar || uploadingBg}
        className="min-h-11 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {savingProfile ? "Salvataggio..." : "Salva modifiche"}
      </button>
    </div>
  </div>
)}
        </div>
      );
    })}
  </div>
</div>
    <div className="hidden border-b border-white/10 bg-[#151920] px-5 py-5 sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#00d084]/25 bg-[#00d084]/10 text-sm text-[#00d084]">
              ✦
            </span>
            <p className="text-[11px] font-black tracking-[0.18em] text-[#00d084]">
              DESIGN STUDIO
            </p>
          </div>

          <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-2xl">
            Crea un look che ti rappresenta.
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Personalizza la tua pagina e guarda il risultato in tempo reale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d084]/20 bg-[#00d084]/10 px-3 py-2 text-xs font-bold text-[#7af5bf]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d084]" />
            Pronto a salvare
          </span>

          <button
            type="submit"
            disabled={savingProfile || uploadingAvatar || uploadingBg}
            className="rounded-xl bg-[#00d084] px-4 py-2.5 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingProfile ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>

    <div className="hidden space-y-7 p-5 sm:p-7">
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-white">Temi</p>
            <p className="mt-1 text-xs text-white/45">
              Parti da uno stile, poi personalizzalo.
            </p>
          </div>

          <span className="text-[11px] font-bold text-white/35">
            4 preset
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => {
              setBgColor("#062b24");
              setButtonStyle("solid");
            }}
            className={`group overflow-hidden rounded-2xl border p-2 text-left transition ${
              bgColor === "#062b24" && buttonStyle === "solid"
                ? "border-[#00d084] bg-[#00d084]/10 shadow-[0_0_0_3px_rgba(0,208,132,0.10)]"
                : "border-white/10 bg-[#181d25] hover:border-white/25"
            }`}
          >
            <div className="h-16 rounded-xl bg-[#062b24] p-2">
              <div className="mx-auto h-4 w-4 rounded-full bg-[#dfffe8]/85" />
              <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-white/90" />
              <div className="mx-auto mt-2 h-2 w-12 rounded-full bg-white/90" />
            </div>
            <p className="mt-2 text-xs font-black text-white">Midnight</p>
            <p className="mt-0.5 text-[10px] text-white/45">Scuro · Smeraldo</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setBgColor("linear-gradient(145deg, #2c135f 0%, #0b766a 100%)");
              setButtonStyle("glass");
            }}
            className={`group overflow-hidden rounded-2xl border p-2 text-left transition ${
              bgColor.includes("#2c135f") && buttonStyle === "glass"
                ? "border-[#00d084] bg-[#00d084]/10 shadow-[0_0_0_3px_rgba(0,208,132,0.10)]"
                : "border-white/10 bg-[#181d25] hover:border-white/25"
            }`}
          >
            <div className="h-16 rounded-xl bg-[linear-gradient(145deg,#2c135f_0%,#0b766a_100%)] p-2">
              <div className="mx-auto h-4 w-4 rounded-full bg-white/85" />
              <div className="mx-auto mt-2 h-2 w-10 rounded-full border border-white/60 bg-white/15" />
              <div className="mx-auto mt-2 h-2 w-12 rounded-full border border-white/60 bg-white/15" />
            </div>
            <p className="mt-2 text-xs font-black text-white">Aurora</p>
            <p className="mt-0.5 text-[10px] text-white/45">Gradiente · Glass</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setBgColor("#f2efe8");
              setButtonStyle("outline");
            }}
            className={`group overflow-hidden rounded-2xl border p-2 text-left transition ${
              bgColor === "#f2efe8" && buttonStyle === "outline"
                ? "border-[#00d084] bg-[#00d084]/10 shadow-[0_0_0_3px_rgba(0,208,132,0.10)]"
                : "border-white/10 bg-[#181d25] hover:border-white/25"
            }`}
          >
            <div className="h-16 rounded-xl bg-[#f2efe8] p-2">
              <div className="mx-auto h-4 w-4 rounded-full bg-[#20231f]" />
              <div className="mx-auto mt-2 h-2 w-10 rounded-full border border-[#20231f]/70" />
              <div className="mx-auto mt-2 h-2 w-12 rounded-full border border-[#20231f]/70" />
            </div>
            <p className="mt-2 text-xs font-black text-white">Studio</p>
            <p className="mt-0.5 text-[10px] text-white/45">Chiaro · Editoriale</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setBgColor("linear-gradient(145deg, #4a1020 0%, #d26537 100%)");
              setButtonStyle("solid");
            }}
            className={`group overflow-hidden rounded-2xl border p-2 text-left transition ${
              bgColor.includes("#4a1020") && buttonStyle === "solid"
                ? "border-[#00d084] bg-[#00d084]/10 shadow-[0_0_0_3px_rgba(0,208,132,0.10)]"
                : "border-white/10 bg-[#181d25] hover:border-white/25"
            }`}
          >
            <div className="h-16 rounded-xl bg-[linear-gradient(145deg,#4a1020_0%,#d26537_100%)] p-2">
              <div className="mx-auto h-4 w-4 rounded-full bg-[#fff2d9]" />
              <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-[#fff2d9]" />
              <div className="mx-auto mt-2 h-2 w-12 rounded-full bg-[#fff2d9]" />
            </div>
            <p className="mt-2 text-xs font-black text-white">Sunset</p>
            <p className="mt-0.5 text-[10px] text-white/45">Caldo · Creativo</p>
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171b22]">
  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3.5">
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base">
        ◐
      </span>

      <div>
        <h3 className="text-sm font-black text-white">Sfondo</h3>
        <p className="mt-0.5 text-[11px] text-white/45">
          Crea l'atmosfera della tua pagina.
        </p>
      </div>
    </div>

    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-white/50">
      Live
    </span>
  </div>

  <div className="p-4">
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#101318] p-1">
      <button
        type="button"
        onClick={() => setBackgroundMode("color")}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
          backgroundMode === "color"
            ? "bg-[#252c36] text-white shadow-sm"
            : "text-white/40 hover:text-white/75"
        }`}
      >
        Colore
      </button>

      <button
        type="button"
        onClick={() => setBackgroundMode("gradient")}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
          backgroundMode === "gradient"
            ? "bg-[#252c36] text-white shadow-sm"
            : "text-white/40 hover:text-white/75"
        }`}
      >
        Gradiente
      </button>

      <button
        type="button"
        onClick={() => setBackgroundMode("image")}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
          backgroundMode === "image"
            ? "bg-[#252c36] text-white shadow-sm"
            : "text-white/40 hover:text-white/75"
        }`}
      >
        Immagine
      </button>
    </div>

    {backgroundMode === "color" && (
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-white/80">
              Colore base
            </p>

            <span className="text-[10px] font-medium text-white/35">
              Personalizzato
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              "#062b24",
              "#0c0d12",
              "#1d2540",
              "#4a1020",
              "#f2efe8",
              "#ffffff",
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBgColor(color)}
                aria-label={`Imposta sfondo ${color}`}
                className={`h-9 w-9 rounded-xl border transition ${
                  bgColor === color
                    ? "border-[#00d084] ring-2 ring-[#00d084]/20"
                    : "border-white/15 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}

            <label className="flex h-9 min-w-[130px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#101318] px-3 focus-within:border-[#00d084]">
              <span className="h-3 w-3 rounded-full border border-white/30 bg-white/10" />
              <input
                type="text"
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                placeholder="#0c0d12"
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
              />
            </label>

            <input
              type="color"
              value={
                bgColor?.startsWith("#") && !bgColor.includes("(")
                  ? bgColor
                  : "#0c0d12"
              }
              onChange={(event) => setBgColor(event.target.value)}
              aria-label="Scegli un colore di sfondo"
              className="h-9 w-10 cursor-pointer rounded-xl border border-white/15 bg-transparent p-1"
            />
          </div>
        </div>
      </div>
    )}

    {backgroundMode === "gradient" && (
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-white/80">
              Combinazioni rapide
            </p>

            <span className="text-[10px] font-medium text-white/35">
              Tocca per applicare
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              {
                name: "Aurora",
                start: "#2c135f",
                end: "#0b766a",
                angle: "145deg",
              },
              {
                name: "Sunset",
                start: "#4a1020",
                end: "#d26537",
                angle: "145deg",
              },
              {
                name: "Ocean",
                start: "#09203f",
                end: "#537895",
                angle: "135deg",
              },
              {
                name: "Berry",
                start: "#3b0a45",
                end: "#d64780",
                angle: "135deg",
              },
            ].map((preset) => {
              const gradientValue = `linear-gradient(${preset.angle}, ${preset.start} 0%, ${preset.end} 100%)`;

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    updateGradient(
                      preset.start,
                      preset.end,
                      preset.angle
                    )
                  }
                  className={`overflow-hidden rounded-xl border p-1.5 text-left transition ${
                    bgColor === gradientValue
                      ? "border-[#00d084] ring-2 ring-[#00d084]/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span
                    className="block h-9 rounded-lg"
                    style={{ background: gradientValue }}
                  />
                  <span className="mt-1.5 block truncate px-0.5 text-[10px] font-bold text-white/65">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#101318] p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-white">
              Gradiente personalizzato
            </p>

            <span
              className="h-7 w-16 rounded-lg border border-white/10"
              style={{
                background: `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold text-white/50">
                Colore iniziale
              </span>

              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={gradientStart}
                  onChange={(event) =>
                    updateGradient(event.target.value, gradientEnd)
                  }
                  className="h-9 w-10 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1"
                />

                <input
                  type="text"
                  value={gradientStart}
                  onChange={(event) =>
                    updateGradient(event.target.value, gradientEnd)
                  }
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#171b22] px-2.5 py-2 text-[11px] text-white outline-none focus:border-[#00d084]"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold text-white/50">
                Colore finale
              </span>

              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={gradientEnd}
                  onChange={(event) =>
                    updateGradient(gradientStart, event.target.value)
                  }
                  className="h-9 w-10 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1"
                />

                <input
                  type="text"
                  value={gradientEnd}
                  onChange={(event) =>
                    updateGradient(gradientStart, event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#171b22] px-2.5 py-2 text-[11px] text-white outline-none focus:border-[#00d084]"
                />
              </div>
            </label>
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-bold text-white/50">
              Direzione
            </p>

            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { label: "↘", angle: "135deg" },
                { label: "↓", angle: "180deg" },
                { label: "↙", angle: "225deg" },
                { label: "→", angle: "90deg" },
              ].map((direction) => (
                <button
                  key={direction.angle}
                  type="button"
                  onClick={() =>
                    updateGradient(
                      gradientStart,
                      gradientEnd,
                      direction.angle
                    )
                  }
                  className={`rounded-lg border px-2 py-2 text-sm font-black transition ${
                    gradientAngle === direction.angle
                      ? "border-[#00d084] bg-[#00d084]/10 text-[#00d084]"
                      : "border-white/10 bg-[#171b22] text-white/55 hover:border-white/30"
                  }`}
                >
                  {direction.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {backgroundMode === "image" && (
      <div className="mt-4 rounded-xl border border-white/10 bg-[#101318] p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {bgImageUrl ? (
              <img
                src={bgImageUrl}
                alt="Anteprima sfondo"
                className="h-12 w-12 rounded-lg border border-white/15 object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-white/20 text-base text-white/35">
                ⧉
              </span>
            )}

            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                Immagine di sfondo
              </p>

              <p className="mt-1 truncate text-[10px] text-white/40">
                JPG, PNG o WEBP · massimo 3 MB
              </p>
            </div>
          </div>

          <label className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
            {uploadingBg ? "Caricamento..." : "Carica"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleBgChange}
              disabled={uploadingBg}
              className="sr-only"
            />
          </label>
        </div>

        {bgImageUrl && (
          <button
            type="button"
            onClick={() => setBgImageUrl("")}
            className="mt-3 text-[11px] font-bold text-red-300 transition hover:text-red-200"
          >
            Rimuovi immagine
          </button>
        )}
      </div>
    )}

    {/* Video di sfondo (Premium) */}
    {backgroundMode === "video" && (
  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-white">Video di sfondo (Premium)</p>
        <p className="mt-1 text-xs text-white/45">
           Carica un video MP4/MOV/WEBM o una GIF animata da usare come sfondo della pagina. · massimo 20 MB
        </p>
      </div>
      {bgVideoUrl && (
  <p className="flex items-center gap-2 text-xs font-bold text-[#00d084]">
    <span aria-hidden="true">✓</span>
    Video caricato
  </p>
)}
    </div>

    <label className="mt-4 flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
      {uploadingBg ? "Caricamento..." : "Carica video"}
      <input
        type="file"
        accept="video/mp4,video/webm"
        onChange={handleBgVideoChange}
        disabled={uploadingBg}
        className="sr-only"
      />
    </label>

    {bgVideoUrl && (
      <button
        type="button"
        onClick={async () => {
          setBgVideoUrl(null);
          setMessage("");

          const { error } = await supabase
            .from("profiles")
            .update({
              bg_video_url: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

          if (error) {
            setMessage("Non è stato possibile rimuovere il video.");
            return;
          }

          setMessage("Video di sfondo rimosso.");
        }}
        className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
      >
        Rimuovi video
      </button>
    )}
  </div>
)}
  </div>
</section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171b22]">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base">
            ▭
          </span>
          <div>
            <h3 className="text-sm font-black text-white">Bottoni</h3>
            <p className="mt-0.5 text-[11px] text-white/45">
              Scegli come appaiono i tuoi link.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4">
          {[
            {
              value: "solid",
              label: "Pieno",
              preview:
                "bg-white text-[#111318] shadow-[0_6px_14px_rgba(0,0,0,0.2)]",
            },
            {
              value: "outline",
              label: "Outline",
              preview: "border border-white/80 text-white",
            },
            {
              value: "glass",
              label: "Glass",
              preview:
                "border border-white/30 bg-white/10 text-white backdrop-blur",
            },
          ].map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setButtonStyle(style.value)}
              className={`rounded-xl border p-2.5 text-center transition ${
                buttonStyle === style.value
                  ? "border-[#00d084] bg-[#00d084]/10 shadow-[0_0_0_3px_rgba(0,208,132,0.08)]"
                  : "border-white/10 bg-[#101318] hover:border-white/25"
              }`}
            >
              <span
                className={`flex h-8 items-center justify-center rounded-lg text-[10px] font-black ${style.preview}`}
              >
                Link
              </span>
              <span className="mt-2 block text-[11px] font-bold text-white/75">
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171b22]">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base">
            Aa
          </span>
          <div>
            <h3 className="text-sm font-black text-white">Testo</h3>
            <p className="mt-0.5 text-[11px] text-white/45">
              Mantieni nome e messaggio chiari.
            </p>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-white/80">Nome visibile</span>
            <input
              type="text"
              value={displayName ?? ""}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Il tuo nome o brand"
              minLength={1}
              maxLength={80}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#101318] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00d084]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-white/80">Username</span>
            <div className="mt-2 flex overflow-hidden rounded-xl border border-white/10 bg-[#101318] focus-within:border-[#00d084]">
              <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/35">
                /
              </span>
              <input
                type="text"
                value={username ?? ""}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="tuo_username"
                minLength={3}
                maxLength={30}
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
              />
            </div>
          </label>

          <label className="block sm:col-span-2">
            <span className="flex items-center justify-between gap-3 text-xs font-bold text-white/80">
              Bio
              <span className="font-medium text-white/35">{(bio ?? "").length}/160</span>
            </span>
            <textarea
              value={bio ?? ""}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Racconta brevemente chi sei."
              maxLength={160}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#101318] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00d084]"
            />
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171b22]">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base">
            ◉
          </span>
          <div>
            <h3 className="text-sm font-black text-white">Profilo</h3>
            <p className="mt-0.5 text-[11px] text-white/45">
              La prima impressione della tua pagina.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Foto profilo"
                className="h-14 w-14 rounded-2xl border border-white/15 object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00d084] text-lg font-black text-[#07100d]">
                {displayName ? displayName.charAt(0).toUpperCase() : "B"}
              </span>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                {displayName || "Il tuo nome"}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/45">
                /{username || "tuo_username"}
              </p>
            </div>
          </div>

          <label className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-xs font-bold text-white/75 transition hover:border-[#00d084] hover:text-[#00d084]">
            {uploadingAvatar ? "Caricamento..." : "Cambia foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="sr-only"
            />
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/40">
          Le modifiche diventano pubbliche dopo il salvataggio.
        </p>

        <button
          type="submit"
          disabled={savingProfile || uploadingAvatar || uploadingBg}
          className="w-full rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {savingProfile ? "Salvataggio..." : "Salva modifiche"}
        </button>
      </div>
    </div>
  </form>
)}

    {activeSection === "social" && (
      <section className="rounded-3xl border border-white/10 bg-[#17181e] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
              SOCIAL
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              I tuoi social
            </h2>

            <p className="mt-2 text-sm text-white/55">
              Inserisci gli URL dei profili che vuoi mostrare nella tua pagina.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#00d084]/30 bg-[#00d084]/10 px-3 py-2 text-xs font-black text-[#00d084]">
              {socialLinks.filter((s) => s.url.trim()).length}{" "}
              {socialLinks.filter((s) => s.url.trim()).length === 1
                ? "profilo"
                : "profili"}{" "}
              collegati
            </span>

            <button
              type="button"
              onClick={() => setSocialEditorOpen((open) => !open)}
              className="rounded-xl bg-[#00d084] px-4 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
            >
              {socialEditorOpen ? "Chiudi social" : "Modifica social"}
            </button>
          </div>
        </div>

        {socialEditorOpen && (
          <div className="mt-6 space-y-5">
            {[
              {
                platform: "instagram" as SocialPlatform,
                label: "Instagram",
                placeholder: "https://instagram.com/tuo_username",
              },
              {
                platform: "tiktok" as SocialPlatform,
                label: "TikTok",
                placeholder: "https://tiktok.com/@tuo_username",
              },
              {
                platform: "youtube" as SocialPlatform,
                label: "YouTube",
                placeholder: "https://youtube.com/@tuo_canale",
              },
              {
                platform: "x" as SocialPlatform,
                label: "X / Twitter",
                placeholder: "https://x.com/tuo_username",
              },
              {
                platform: "facebook" as SocialPlatform,
                label: "Facebook",
                placeholder: "https://facebook.com/tuo_username",
              },
              {
                platform: "linkedin" as SocialPlatform,
                label: "LinkedIn",
                placeholder: "https://linkedin.com/in/tuo_username",
              },
              {
                platform: "telegram" as SocialPlatform,
                label: "Telegram",
                placeholder: "https://t.me/tuo_username",
              },
              {
                platform: "whatsapp" as SocialPlatform,
                label: "WhatsApp",
                placeholder: "https://wa.me/391234567890",
              },
              {
                platform: "twitch" as SocialPlatform,
                label: "Twitch",
                placeholder: "https://twitch.tv/tuo_canale",
              },
              {
                platform: "kick" as SocialPlatform,
                label: "Kick",
                placeholder: "https://kick.com/tuo_canale",
              },
              {
                platform: "discord" as SocialPlatform,
                label: "Discord",
                placeholder: "https://discord.gg/tuo-invito",
              },
              {
                platform: "spotify" as SocialPlatform,
                label: "Spotify",
                placeholder: "https://open.spotify.com/artist/...",
              },
              {
                platform: "patreon" as SocialPlatform,
                label: "Patreon",
                placeholder: "https://patreon.com/tuo_username",
              },
              {
                platform: "onlyfans" as SocialPlatform,
                label: "OnlyFans",
                placeholder: "https://onlyfans.com/tuo_username",
              },
              {
                platform: "fansly" as SocialPlatform,
                label: "Fansly",
                placeholder: "https://fansly.com/tuo_username",
              },
            ].map((social) => {
              const currentSocial = socialLinks.find(
                (item) => item.platform === social.platform
              );

              return (
                <label
                  key={social.platform}
                  className="block text-sm font-bold text-white/90"
                >
                  {social.label}

                  <input
                    type="url"
                    value={currentSocial?.url ?? ""}
                    onChange={(event) => {
                      const url = event.target.value;

                      setSocialLinks((current) => {
                        const existing = current.find(
                          (item) => item.platform === social.platform
                        );

                        if (existing) {
                          return current.map((item) =>
                            item.platform === social.platform
                              ? { ...item, url }
                              : item
                          );
                        }

                        return [
                          ...current,
                          {
                            id: `new-${social.platform}`,
                            profile_id: userId,
                            platform: social.platform,
                            url,
                            position: current.length,
                          },
                        ];
                      });
                    }}
                    placeholder={social.placeholder}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#0c0d12] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#00d084]"
                  />
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-7 border-t border-white/10 pt-5">
          <p className="text-xs font-bold tracking-[0.16em] text-white/45">
            ANTEPRIMA
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSocialDragEnd}
          >
            <SortableContext
              items={socialLinks.map((socialLink) => socialLink.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks
                  .filter((s) => s.url.trim())
                  .map((socialLink) => (
                    <SortableSocialPreviewIcon
                      key={socialLink.id}
                      socialLink={socialLink}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#17181e] p-5">
          <div>
            <p className="text-sm font-bold text-white">
              Posizione delle icone social
            </p>

            <p className="mt-1 text-sm text-white/45">
              Scegli dove mostrare i social nella tua pagina pubblica.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSocialPosition("below_profile")}
              className={`rounded-xl border p-4 text-left transition ${
                socialPosition === "below_profile"
                  ? "border-[#00d084] bg-[#00d084]/10"
                  : "border-white/10 bg-[#0c0d12] hover:border-white/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    socialPosition === "below_profile"
                      ? "border-[#00d084] bg-[#00d084]"
                      : "border-white/30"
                  }`}
                >
                  {socialPosition === "below_profile" && (
                    <span className="h-2 w-2 rounded-full bg-[#07100d]" />
                  )}
                </span>

                <div>
                  <p className="font-bold text-white">
                    Sotto nome, username e bio
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Le icone appariranno subito sotto la descrizione del profilo.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSocialPosition("footer")}
              className={`rounded-xl border p-4 text-left transition ${
                socialPosition === "footer"
                  ? "border-[#00d084] bg-[#00d084]/10"
                  : "border-white/10 bg-[#0c0d12] hover:border-white/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    socialPosition === "footer"
                      ? "border-[#00d084] bg-[#00d084]"
                      : "border-white/30"
                  }`}
                >
                  {socialPosition === "footer" && (
                    <span className="h-2 w-2 rounded-full bg-[#07100d]" />
                  )}
                </span>

                <div>
                  <p className="font-bold text-white">
                    Nel footer
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Le icone appariranno in fondo alla pagina, sopra “Creato con bioLinkr”.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleSaveSocialSettings}
              disabled={savingSocials}
              className="mt-6 w-full rounded-xl bg-[#00d084] px-5 py-4 text-base font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingSocials ? "Salvataggio..." : "Salva modifiche"}
            </button>
          </div>

          <p className="mt-4 text-xs text-white/40">
            La modifica diventa effettiva sulla pagina pubblica dopo aver premuto
            “Salva profilo”.
          </p>
        </div>
      </section>
    )}
    {activeSection === "links" && (
  <>
    <form
      onSubmit={handleAddLink}
      className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10"
    >
      <h2 className="text-2xl font-black">Aggiungi un link</h2>

      <p className="mt-3 text-white/60">
        Inserisci un link e programmalo solo quando ne hai bisogno.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
        <p className="text-sm font-bold text-white">Tipo di link</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setNewLinkDisplayType("button")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              newLinkDisplayType === "button"
                ? "bg-[#00d084] text-[#07100d]"
                : "border border-white/15 text-white/65 hover:border-[#00d084] hover:text-[#00d084]"
            }`}
          >
            Pulsante
          </button>

          <button
            type="button"
            onClick={() => setNewLinkDisplayType("image")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              newLinkDisplayType === "image"
                ? "bg-[#00d084] text-[#07100d]"
                : "border border-white/15 text-white/65 hover:border-[#00d084] hover:text-[#00d084]"
            }`}
          >
            Immagine
          </button>
        </div>

        <p className="mt-3 text-xs text-white/45">
          Un pulsante mostra un titolo. Un link immagine mostra un banner cliccabile.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <label className="block text-sm font-bold text-white/90">
          {newLinkDisplayType === "image"
            ? "Descrizione immagine (opzionale)"
            : "Titolo del pulsante"}

          <input
            type="text"
            value={linkTitle}
            onChange={(event) => setLinkTitle(event.target.value)}
            placeholder={
              newLinkDisplayType === "image"
                ? "Es. Vai al mio shop"
                : "Instagram"
            }
            minLength={newLinkDisplayType === "button" ? 1 : undefined}
            maxLength={80}
            required={newLinkDisplayType === "button"}
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#00d084]"
          />

          {newLinkDisplayType === "image" && (
            <span className="mt-2 block font-normal text-white/45">
              Non verrà mostrata sul banner, ma aiuta accessibilità e lettori di schermo.
            </span>
          )}
        </label>

        <label className="block text-sm font-bold text-white/90">
          URL
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://instagram.com/tuo_username"
            required
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#00d084]"
          />
        </label>

        {newLinkDisplayType === "image" && (
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
            <p className="text-sm font-bold text-white">Immagine cliccabile</p>

            <p className="mt-1 text-sm text-white/45">
              Carica un banner, un logo o una creatività da usare al posto del titolo.
            </p>

            <div className="mt-4 flex items-center gap-4">
              {newLinkImagePreview ? (
                <img
                  src={newLinkImagePreview}
                  alt="Anteprima immagine link"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="h-20 w-28 rounded-xl border border-white/15 object-contain"
                />
              ) : (
                <div className="flex h-20 w-28 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/40">
                  Banner
                </div>
              )}

              <div className="min-w-0 flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleNewLinkImageChange}
                  className="block w-full cursor-pointer text-sm text-white/65 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-bold file:text-white file:transition hover:file:bg-[#00d084] hover:file:text-[#07100d]"
                />

                <p className="mt-2 text-xs text-yellow-300">
                  File selezionato: {newLinkImageFile ? newLinkImageFile.name : "nessuno"}
                </p>

                <p className="mt-2 text-xs text-white/45">
                  JPG, PNG o WEBP · massimo 3 MB
                </p>

                {newLinkImageFile && (
                  <p className="mt-2 truncate text-xs text-[#00d084]">
                    Pronta: {newLinkImageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
          <p className="text-sm font-bold text-white">Icona del link</p>

          <p className="mt-1 text-sm text-white/45">
            Carica un’icona opzionale per rendere il pulsante più riconoscibile.
          </p>

          <div className="mt-4 flex items-center gap-3">
            {newLinkIconFile ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00d084]/30 bg-[#00d084]/10 text-lg text-[#00d084]">
                ✓
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/40">
                +
              </div>
            )}

            <div className="min-w-0 flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleNewLinkIconChange}
                className="block w-full cursor-pointer text-sm text-white/65 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-bold file:text-white file:transition hover:file:bg-[#00d084] hover:file:text-[#07100d]"
              />

              <p className="mt-2 text-xs text-white/45">
                JPG, PNG o WEBP · massimo 1 MB
              </p>

              {newLinkIconFile && (
                <p className="mt-2 truncate text-xs text-[#00d084]">
                  Pronta: {newLinkIconFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-white">Programmazione</p>
              <p className="mt-1 text-sm text-white/45">
                Il link è visibile subito finché non lo programmi.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleNewScheduleToggle(!linkScheduleEnabled)
              }
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                linkScheduleEnabled
                  ? "bg-[#00d084] text-[#07100d]"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              {linkScheduleEnabled ? "Programmato" : "Sempre attivo"}
            </button>
          </div>

          {linkScheduleEnabled && (
            <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyQuickSchedule("hour", "new")}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                >
                  +1 ora
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickSchedule("tonight", "new")}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                >
                  Stasera
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickSchedule("tomorrow", "new")}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                >
                  Domani
                </button>

                <button
                  type="button"
                  onClick={() => applyQuickSchedule("week", "new")}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#00d084] hover:text-[#00d084]"
                >
                  7 giorni
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-white/75">
                  Pubblica da
                  <input
                    type="datetime-local"
                    value={linkStartsAt}
                    onChange={(event) =>
                      setLinkStartsAt(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none transition focus:border-[#00d084]"
                  />
                </label>

                <label className="block text-sm font-bold text-white/75">
                  Nascondi dopo
                  <input
                    type="datetime-local"
                    value={linkEndsAt}
                    onChange={(event) =>
                      setLinkEndsAt(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/20 bg-[#17181e] px-4 py-3 text-white outline-none transition focus:border-[#00d084]"
                  />
                </label>
              </div>

              <p className="text-xs text-white/45">
                Lascia “Pubblica da” vuoto per renderlo visibile subito.
                Lascia “Nascondi dopo” vuoto per evitare una scadenza.
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={savingLink}
        className="mt-8 w-full rounded-xl bg-[#00d084] px-5 py-4 text-lg font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {savingLink ? "Aggiunta..." : "Aggiungi link"}
      </button>
    </form>

    {/* I tuoi link – unico blocco, senza titolo duplicato */}
    <section className="mt-12">
      <section className="rounded-3xl border border-white/10 bg-[#17181e] p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">I tuoi link</h2>
            <p className="mt-2 text-sm text-white/50">
              Trascina l'icona ⋮⋮ per cambiare l'ordine dei pulsanti.
            </p>
          </div>

          <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/55">
            {links.length}
          </span>
        </div>

        {links.length === 0 ? (
          <p className="mt-6 text-white/55">
            Non hai ancora aggiunto nessun link.
          </p>
        ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className={`mt-6 space-y-3 ${
                reordering ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  variants={getVariantsForLink(link)}
                  isEditing={editingLinkId === link.id}
                  editingTitle={editingTitle}
                  editingUrl={editingUrl}
                  editingIconUrl={editingIconUrl}
                  editingIconObjectX={editingIconObjectX}
                  editingIconObjectY={editingIconObjectY}
                  editingIconSize={editingIconSize}
                  editingIconPositionX={editingIconPositionX}
                  editingIconPositionY={editingIconPositionY}
                  editingImageHeight={editingImageHeight}
                  editingBackgroundColor={editingBackgroundColor}
                  editingBadgeText={editingBadgeText}
                  editingTextColor={editingTextColor}
                  editingHoverEffect={editingHoverEffect}
                  editingScheduleEnabled={editingScheduleEnabled}
                  editingStartsAt={editingStartsAt}
                  editingEndsAt={editingEndsAt}
                  savingEdit={savingEdit}
                  deleting={deletingLinkId === link.id}
                  uploadingIcon={uploadingLinkIcon}
                  onIconFileChange={handleLinkIconChange}
                  onEdit={startEditingLink}
                  onTitleChange={setEditingTitle}
                  onUrlChange={setEditingUrl}
                  onIconUrlChange={setEditingIconUrl}
                  onIconObjectPositionChange={(x, y) => {
  seteditingIconObjectX(x);
  seteditingIconObjectY(y);
}}
onResetIconObjectPosition={() => {
  seteditingIconObjectX(50);
  seteditingIconObjectY(50);
}}
                  onIconSizeChange={setEditingIconSize}
                  onIconPositionXChange={setEditingIconPositionX}
                  onIconPositionYChange={setEditingIconPositionY}
                  onImageHeightChange={setEditingImageHeight}
                  onBackgroundColorChange={setEditingBackgroundColor}
                  onBadgeTextChange={setEditingBadgeText}
                  onTextColorChange={setEditingTextColor}
                  onHoverEffectChange={setEditingHoverEffect}
                  onScheduleEnabledChange={handleEditingScheduleToggle}
                  onStartsAtChange={setEditingStartsAt}
                  onEndsAtChange={setEditingEndsAt}
                  onQuickSchedule={applyQuickSchedule}
                  onSave={handleSaveLinkEdit}
                  onCancel={cancelEditingLink}
                  onDelete={handleDeleteLink}
                  onAddVariant={openAddVariantModal}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
    </section>
  </>
)}

    
  </div>

  {(activeSection === "links" || activeSection === "appearance") && (
    <aside className="h-fit space-y-4 lg:sticky lg:top-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold tracking-[0.22em] text-[#00d084]">
          ANTEPRIMA
        </p>

        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#17181e] p-1">
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              previewMode === "mobile"
                ? "bg-[#00d084] text-[#07100d]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Mobile
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              previewMode === "desktop"
                ? "bg-[#00d084] text-[#07100d]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Desktop
          </button>
        </div>
      </div>

      <div
  className={`mx-auto w-full transition-all duration-300 ${
    previewMode === "mobile"
      ? "max-w-[390px]"
      : "max-w-[760px]"
  }`}
>
  <div
    className={`overflow-hidden transition-all duration-300 ${
      previewMode === "mobile"
        ? "rounded-[32px] border-[8px] border-[#080a0d] shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
        : "rounded-[24px] border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
    }`}
  >
    <div className="sticky top-6 mx-auto w-full max-w-[740px]">

  {previewMode === "mobile" ? (
    <IPhonePreview>
  <ProfilePreview
    displayName={displayName ?? ""}
    username={(username ?? "").trim().toLowerCase()}
    bio={bio ?? ""}
    avatarUrl={avatarUrl ?? ""}
    bannerImageUrl={bannerImageUrl}
    avatarWidth={profileImageWidth}
    avatarPositionX={profileImagePositionX}
    bgColor={bgColor ?? ""}
    bgImageUrl={bgImageUrl ?? ""}
    bgVideoUrl={bgVideoUrl}
    videoOpacity={videoOpacity}
    buttonStyle={(buttonStyle ?? "solid") as "solid" | "outline" | "glass"}
    profileLayout={profileLayout}
    displayNameColor={displayNameColor ?? "#ffffff"}
    usernameColor={usernameColor ?? "#00d084"}
    bioColor={bioColor ?? "rgba(255,255,255,0.7)"}
    displayNameSize={displayNameSize ?? "text-4xl"}
    bioSize={bioSize ?? "text-base"}
    links={previewLinks}
    products={previewProducts}
    socialLinks={socialLinks}
    socialPosition={socialPosition}
    onSocialLinksReorder={async (reorderedSocialLinks) => {
      const nextSocialLinks = reorderedSocialLinks.map((socialLink) => ({
        ...socialLink,
        profile_id: userId,
        platform: socialLink.platform as SocialPlatform,
      })) as SocialLinkRow[];

      const previousSocialLinks = socialLinks;

      setSocialLinks(nextSocialLinks);
      setSavingSocials(true);
      setMessage("");

      const error = await saveSocialLinksOrder(nextSocialLinks);

      setSavingSocials(false);

      if (error) {
        setSocialLinks(previousSocialLinks);
        setMessage(
          `Non è stato possibile salvare l'ordine dei social: ${error.message}`
        );
        return;
      }

      setMessage("Ordine delle icone social salvato.");
    }}
  />
</IPhonePreview>
  ) : (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c0d12] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#00d084]/80" />

        <span className="ml-3 truncate rounded-md bg-black/20 px-3 py-1 text-[10px] font-medium text-white/40">
          biolinkr.app/{username.trim().toLowerCase() || "tuo_username"}
        </span>
      </div>

      <div className="max-h-[718px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ProfilePreview
          displayName={displayName}
          username={username.trim().toLowerCase()}
          bio={bio}
          avatarUrl={avatarUrl}
          bannerImageUrl={bannerImageUrl}
          bgColor={bgColor}
          bgImageUrl={bgImageUrl}
          bgVideoUrl={bgVideoUrl ?? null}
          buttonStyle={buttonStyle as "solid" | "outline" | "glass"}
          profileLayout={profileLayout}
                  displayNameColor={displayNameColor}
        usernameColor={usernameColor}
        bioColor={bioColor}
        bioSize={bioSize}
        displayNameSize={displayNameSize}
          links={previewLinks}
          products={previewProducts}
          socialLinks={socialLinks}
          socialPosition={socialPosition}
          onSocialLinksReorder={async (reorderedSocialLinks) => {
            const nextSocialLinks = reorderedSocialLinks.map((socialLink) => ({
              ...socialLink,
              profile_id: userId,
              platform: socialLink.platform as SocialPlatform,
            })) as SocialLinkRow[];

            const previousSocialLinks = socialLinks;

            setSocialLinks(nextSocialLinks);
            setSavingSocials(true);
            setMessage("");

            const error = await saveSocialLinksOrder(nextSocialLinks);

            setSavingSocials(false);

            if (error) {
              setSocialLinks(previousSocialLinks);
              setMessage(
                `Non è stato possibile salvare l'ordine dei social: ${error.message}`
              );
              return;
            }

            setMessage("Ordine delle icone social salvato.");
          }}
        />
      </div>
    </div>
  )}
</div>
  </div>
</div>

      {publicProfileUrl && (
        <Link
          href={publicProfileUrl}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[#00d084]/60 px-4 py-3 font-bold text-[#00d084] transition hover:bg-[#00d084] hover:text-[#00d084]"
        >
          Apri la pagina pubblica
        </Link>
      )}

      {message && (
        <p className="text-center text-sm text-white/70">{message}</p>
      )}
    </aside>
  )}
</section>
      </div>

{activeSection === "pro" && (
<section className="mt-12 max-w-7xl mx-auto">
    <div className="relative overflow-hidden rounded-[2rem] border border-[#40e0d0]/25 bg-[#0c0f0e] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3),0_0_42px_rgba(64,224,208,0.08)] sm:p-10">
      {/* Luci decorative */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#40e0d0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#00d084]/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#40e0d0]/25 bg-[#40e0d0]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#a8fff0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="proHubGemGradient"
                    x1="5"
                    y1="4"
                    x2="19"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#effffc" />
                    <stop offset="24%" stopColor="#aafbf0" />
                    <stop offset="52%" stopColor="#3bddca" />
                    <stop offset="100%" stopColor="#056963" />
                  </linearGradient>
                </defs>

                <path
                  d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
                  fill="url(#proHubGemGradient)"
                  stroke="#d9fffa"
                  strokeWidth="0.95"
                  strokeLinejoin="round"
                />
                <path d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z" fill="#b8fff6" />
                <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
                <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
                <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />
              </svg>

              BioLinkr PRO
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Il tuo profilo,
              <span className="block text-[#78f5df]">senza limiti.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Porta la tua pagina oltre il link in bio essenziale: più impatto,
              più personalizzazione e strumenti pensati per distinguerti.
            </p>
          </div>

          <div className="rounded-2xl border border-[#40e0d0]/20 bg-[#40e0d0]/[0.07] px-4 py-3 text-right">
  <p className="text-lg font-black text-white">
    {plan === "premium" || subscriptionStatus === "trialing"
      ? "Pro attivo"
      : "Gratuito"}
  </p>

  {(plan === "premium" || subscriptionStatus === "trialing") &&
    subscriptionEndDate && (
      <p className="mt-1 text-xs text-white/55">
        {subscriptionStatus === "trialing" ? "Prova gratuita fino al " : "Rinnovo il "}
        {new Date(subscriptionEndDate).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    )}
</div>
        </div>

        {/* Riscatta codice PRO */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-base font-black text-white">Riscatta codice PRO</h3>
          <p className="mt-1 text-sm text-white/55">
            Hai un codice promozionale? Inseriscilo qui per attivare BioLinkr PRO.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder="Inserisci il codice ..."
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-[#0c0d12] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#00d084]"
            />
            <button
              type="button"
              onClick={handleRedeemCode}
              disabled={redeemingCode}
              className="shrink-0 rounded-xl bg-[#00d084] px-5 py-3 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redeemingCode ? "Attivazione..." : "Riscatta codice"}
            </button>
          </div>

          {redeemMessage && (
            <p
              className={`mt-3 text-sm ${
                redeemMessage.startsWith("✅")
                  ? "text-[#00d084]"
                  : "text-red-400"
              }`}
            >
              {redeemMessage}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#40e0d0]/20 bg-black/20 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#40e0d0]/25 bg-[#40e0d0]/10 text-[#8fffe9]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m10 9 5 3-5 3V9Z" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-black text-white">
              Sfondi video
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Aggiungi movimento, atmosfera e personalità alla tua pagina.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.05] text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 6h16" />
                <path d="M4 12h10" />
                <path d="M4 18h16" />
                <path d="M17 10v4" />
                <path d="M15 12h4" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-black text-white">
              Personalizzazione avanzata
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Stili, layout e dettagli visivi più evoluti per il tuo brand.
            </p>

            <span className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
              In arrivo
            </span>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.05] text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="m7 15 3-4 3 2 4-6" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-black text-white">
              Analytics avanzati
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Scopri cosa funziona davvero e fai crescere il tuo pubblico.
            </p>

            <span className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
              In arrivo
            </span>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">
              Pronto a rendere la tua pagina indimenticabile?
            </p>

            <p className="mt-1 text-sm text-white/50">
              PRO sarà disponibile a breve: stiamo preparando tutto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("Le attivazioni PRO apriranno presto.");
            }}
            className="shrink-0 rounded-xl bg-[#40e0d0] px-5 py-3 text-sm font-black text-[#061110] shadow-[0_8px_24px_rgba(64,224,208,0.24)] transition hover:bg-[#7af7e4] hover:shadow-[0_10px_30px_rgba(64,224,208,0.34)]"
          >
            Voglio PRO
          </button>
        </div>
      </div>
    </div>
  </section>
)}

      <AddVariantModal
        originalLink={
          links.find((l) => l.id === addingVariantLinkId) ??
          ({
            id: "",
            profile_id: "",
            title: "",
            url: "",
            position: 0,
            starts_at: null,
            ends_at: null,
            ab_group: null,
            is_variant: false,
            variant_of: null,
          } as BioLink)
        }
        isOpen={Boolean(addingVariantLinkId)}
        saving={savingVariant}
        variantTitle={variantTitle}
        variantUrl={variantUrl}
        message={variantMessage}
        onTitleChange={setVariantTitle}
        onUrlChange={setVariantUrl}
        onSave={createVariant}
        onClose={closeAddVariantModal}
      />

      <ConfirmMakeWinnerModal
        isOpen={Boolean(confirmWinnerLink)}
        winnerLink={
          confirmWinnerLink ??
          ({
            id: "",
            profile_id: "",
            title: "",
            url: "",
            position: 0,
            starts_at: null,
            ends_at: null,
            ab_group: null,
            is_variant: false,
            variant_of: null,
          } as BioLink)
        }
        otherVariants={confirmOtherVariants}
        saving={savingWinner}
        message={winnerMessage}
        onConfirm={makeWinnerDefinitive}
        onClose={closeConfirmWinnerModal}
      />
      

      <ProductModal
        isOpen={productModalOpen}
        product={editingProduct}
        saving={savingProduct}
        form={productForm}
        message={productMessage}
        onFormChange={setProductForm}
        onSave={saveProduct}
        onClose={closeProductModal}
      />

      {proModalOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050706]/80 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="pro-modal-title"
    onMouseDown={() => setProModalOpen(false)}
  >
    <div
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#40e0d0]/25 bg-[#0c0f0e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(64,224,208,0.12)] sm:p-8"
      onMouseDown={(event) => event.stopPropagation()}
    >
      {/* Bagliore decorativo */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#40e0d0]/10 blur-3xl" />

      {/* Chiudi */}
      <button
        type="button"
        onClick={() => setProModalOpen(false)}
        aria-label="Chiudi finestra"
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/60 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
      >
        ×
      </button>

      <div className="relative">
        {/* Gemma */}
        <div className="mb-6 inline-grid h-14 w-14 place-items-center rounded-2xl border border-[#40e0d0]/35 bg-[#40e0d0]/10 shadow-[0_0_24px_rgba(64,224,208,0.2)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-8 w-8 drop-shadow-[0_2px_3px_rgba(0,44,50,0.9)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="proModalGemBase"
                x1="5"
                y1="4"
                x2="19"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#effffc" />
                <stop offset="22%" stopColor="#aafbf0" />
                <stop offset="50%" stopColor="#3bddca" />
                <stop offset="78%" stopColor="#099e95" />
                <stop offset="100%" stopColor="#045d5b" />
              </linearGradient>
            </defs>

            <path
              d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
              fill="url(#proModalGemBase)"
              stroke="#d9fffa"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />
            <path d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z" fill="#b8fff6" />
            <path d="M6.4 5.25 9.1 9.4H3.4l3-4.15Z" fill="#9effef" opacity="0.82" />
            <path d="m17.6 5.25-2.7 4.15h5.7l-3-4.15Z" fill="#2dbdaf" opacity="0.94" />
            <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
            <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
            <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />
            <path
              d="M7.1 6.4h4.75L9.7 8.45H5.65L7.1 6.4Z"
              fill="#ffffff"
              opacity="0.72"
            />
            <path
              d="M3.4 9.4h17.2M9.1 9.4 12 19.85l2.9-10.45M6.4 5.25l2.7 4.15m8.5-4.15-2.7 4.15"
              fill="none"
              stroke="#034c49"
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
        </div>

        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#78f5df]">
          Piano PRO
        </p>

        <h2
          id="pro-modal-title"
          className="max-w-[18rem] text-2xl font-black tracking-tight text-white sm:text-3xl"
        >
          Sblocca {lockedFeature}
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/60">
          Dai più carattere al tuo profilo con uno sfondo video personalizzato:
          movimento, atmosfera e un risultato che si distingue davvero.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#40e0d0]/15 text-xs font-black text-[#8fffe9]">
              ✓
            </span>

            <p className="text-sm leading-5 text-white/75">
              Carica un tuo video e rendi il tuo profilo più vivo, riconoscibile
              e memorabile.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          <button
            type="button"
            onClick={() => {
  setProModalOpen(false);
  setActiveSection("pro");
  window.scrollTo({ top: 0, behavior: "smooth" });
}}
            className="rounded-xl bg-[#40e0d0] px-5 py-3.5 text-sm font-black text-[#061110] shadow-[0_8px_24px_rgba(64,224,208,0.25)] transition hover:bg-[#7af7e4] hover:shadow-[0_10px_30px_rgba(64,224,208,0.35)]"
          >
            Scopri PRO
          </button>

          <button
            type="button"
            onClick={() => setProModalOpen(false)}
            className="rounded-xl px-5 py-3 text-sm font-bold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
          >
            Continua con il piano gratuito
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {mobilePreviewOpen && (
  <div className="fixed inset-0 z-[100] bg-[#0c0d12] lg:hidden">
    <div className="flex items-center justify-between border-b border-white/10 bg-[#17181e] px-4 py-3">
      <div>
        <p className="text-sm font-black text-white">Anteprima pagina</p>
        <p className="mt-0.5 text-xs text-white/45">
          {username.trim().toLowerCase() || "tuo_username"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setMobilePreviewOpen(false)}
        className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition active:scale-[0.98]"
      >
        Chiudi
      </button>
    </div>

    <div className="h-[calc(100dvh-65px)] overflow-y-auto">
      <ProfilePreview
  displayName={displayName ?? ""}
  username={(username ?? "").trim().toLowerCase()}
  bio={bio ?? ""}
  avatarUrl={avatarUrl ?? ""}
  bannerImageUrl={bannerImageUrl}
  bgColor={bgColor ?? ""}
  bgImageUrl={bgImageUrl ?? ""}
  bgVideoUrl={bgVideoUrl ?? null}
  buttonStyle={
    (buttonStyle ?? "solid") as "solid" | "outline" | "glass"
  }
  profileLayout={profileLayout}
  displayNameColor={displayNameColor ?? "#ffffff"}
  usernameColor={usernameColor ?? "#00d084"}
  bioColor={bioColor ?? "rgba(255,255,255,0.7)"}
  displayNameSize={displayNameSize ?? "text-4xl"}
  bioSize={bioSize ?? "text-base"}
  links={previewLinks}
  products={previewProducts}
  socialLinks={socialLinks}
  socialPosition={socialPosition}
        onSocialLinksReorder={async (reorderedSocialLinks) => {
          const nextSocialLinks = reorderedSocialLinks.map((socialLink) => ({
            ...socialLink,
            profile_id: userId,
            platform: socialLink.platform as SocialPlatform,
          })) as SocialLinkRow[];

          const previousSocialLinks = socialLinks;

          setSocialLinks(nextSocialLinks);
          setSavingSocials(true);
          setMessage("");

          const error = await saveSocialLinksOrder(nextSocialLinks);

          setSavingSocials(false);

          if (error) {
            setSocialLinks(previousSocialLinks);
            setMessage(
              `Non è stato possibile salvare l'ordine dei social: ${error.message}`
            );
            return;
          }

          setMessage("Ordine delle icone social salvato.");
        }}
      />
    </div>
  </div>
)}

<nav className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-[#111218]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
  <div className="mx-auto flex max-w-full gap-1 overflow-x-auto px-1">
    {[
      { id: "pro", label: "Pro", gem: true },
      { id: "links", label: "Link", icon: "↗" },
      { id: "appearance", label: "Aspetto", icon: "✦" },
      { id: "social", label: "Social", icon: "◎" },
      { id: "analytics", label: "Dati", icon: "◫" },
      { id: "abtest", label: "A/B", icon: "⚗" },
      { id: "preview", label: "Anteprima", icon: "📱" },

    ].map((item) => {
      const isActive = activeSection === item.id;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() =>
            setActiveSection(
              item.id as
                | "links"
                | "appearance"
                | "social"
                | "analytics"
                | "abtest"
                | "preview"
                | "pro"
            )
          }
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-bold transition active:scale-95 ${
            isActive
              ? "bg-[#00d084]/15 text-[#5cf0bd]"
              : "text-white/45 active:bg-white/10"
          }`}
        >
          <span
            className={`text-base leading-none ${
              isActive ? "text-[#00d084]" : "text-white/55"
            }`}
          >
            {item.gem ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mx-auto block h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="mobileGemIcon"
                    x1="5"
                    y1="4"
                    x2="19"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#effffc" />
                    <stop offset="24%" stopColor="#aafbf0" />
                    <stop offset="52%" stopColor="#3bddca" />
                    <stop offset="100%" stopColor="#056963" />
                  </linearGradient>
                </defs>
                <path
                  d="M6.4 5.25h11.2l3 4.15L12 19.85 3.4 9.4l3-4.15Z"
                  fill="url(#mobileGemIcon)"
                  stroke="#d9fffa"
                  strokeWidth="0.95"
                  strokeLinejoin="round"
                />
                <path d="M6.4 5.25h11.2l-2.7 4.15H9.1L6.4 5.25Z" fill="#b8fff6" />
                <path d="M3.4 9.4h17.2L12 19.85 3.4 9.4Z" fill="#078f88" />
                <path d="m3.4 9.4 8.6 10.45V9.4H3.4Z" fill="#25c5b6" />
                <path d="M12 9.4v10.45l8.6-10.45H12Z" fill="#056963" />
              </svg>
            ) : (
              item.icon
            )}
          </span>

          <span className="whitespace-nowrap">{item.label}</span>
        </button>
      );
    })}
  </div>
</nav>
    </main>
  );
}