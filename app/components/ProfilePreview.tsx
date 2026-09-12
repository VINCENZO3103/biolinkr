"use client";

import { useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SocialIcons, { SocialLink } from "./SocialIcons";

type BioLink = {
  id: string;
  title: string;
  url: string;
  icon_url: string | null;
  icon_size: number;
  icon_position_x: "left" | "center" | "right";
  icon_position_y: "top" | "center" | "bottom";
  display_type: "button" | "image";
  image_url: string | null;
  image_height?: number | null;
  background_color: string | null;
  badge_text?: string | null;
  text_color?: string | null;
  hover_effect?: string | null;
  icon_object_x?: number | null;
  icon_object_y?: number | null;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  cover_image_url: string | null;
};

type PreviewSocialLink = SocialLink & {
  id: string;
  position: number;
};

type SortableSocialIconProps = {
  socialLink: PreviewSocialLink;
  draggedSocialIdRef: React.MutableRefObject<string | null>;
};

function SortableSocialIcon({
  socialLink,
  draggedSocialIdRef,
}: SortableSocialIconProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: socialLink.id,
    transition: {
      duration: 110,
      easing: "ease-out",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? "transform 0ms"
      : transition || "transform 110ms ease-out",
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClickCapture={(event) => {
        if (draggedSocialIdRef.current !== socialLink.id) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        draggedSocialIdRef.current = null;
      }}
      className={`cursor-grab touch-none select-none active:cursor-grabbing ${
        isDragging ? "scale-105 opacity-70" : "hover:scale-[1.03]"
      }`}
      title="Clicca per aprire o trascina per riordinare"
    >
      <SocialIcons links={[socialLink]} className="justify-center" />
    </div>
  );
}

type ProfilePreviewProps = {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  avatarWidth?: number;
  avatarPositionX?: number;
  bgColor?: string;
  bgImageUrl?: string;
  buttonStyle?: "solid" | "outline" | "glass";
  displayNameColor?: string;
  usernameColor?: string;
  bioColor?: string;
  displayNameSize?: string;
  bioSize?: string;
  links: BioLink[];
  products: Product[];
  socialLinks?: PreviewSocialLink[];
  socialPosition?: "below_profile" | "footer";
  onSocialLinksReorder?: (links: PreviewSocialLink[]) => void;
};

export default function ProfilePreview({
  displayName = "",
  username = "",
  bio = "",
  avatarUrl = "",
  avatarWidth = 120,
  avatarPositionX = 50,
  bgColor = "",
  bgImageUrl,
  buttonStyle,
  links,
  products,
  socialLinks = [],
  socialPosition = "footer",
  onSocialLinksReorder,
  displayNameColor = "#ffffff",
  usernameColor = "#00d084",
  bioColor = "rgba(255,255,255,0.7)",
  displayNameSize = "text-4xl",
  bioSize = "text-base",
}: ProfilePreviewProps) {
  const [showProducts, setShowProducts] = useState(false);
  const draggedSocialIdRef = useRef<string | null>(null);

  const socialSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function handlePreviewSocialDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    draggedSocialIdRef.current = String(active.id);

    if (!over || active.id === over.id || !onSocialLinksReorder) {
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

    const reorderedSocialLinks = arrayMove(
      socialLinks,
      oldIndex,
      newIndex
    ).map((socialLink, position) => ({
      ...socialLink,
      position,
    }));

    onSocialLinksReorder(reorderedSocialLinks);
  }

  const cleanBgValue = bgColor?.trim() || "";
  const cleanBgImageUrl = bgImageUrl?.trim() || "";

  const hasCssGradient =
    cleanBgValue.includes("linear-gradient") ||
    cleanBgValue.includes("radial-gradient") ||
    cleanBgValue.includes("conic-gradient");

  const previewBackgroundStyle = cleanBgImageUrl
    ? {
        backgroundColor: "#0c0d12",
        backgroundImage: `linear-gradient(to bottom, rgba(12,13,18,0.55), rgba(12,13,18,0.82)), url("${cleanBgImageUrl}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }
    : hasCssGradient
      ? {
          backgroundColor: "#0c0d12",
          backgroundImage: cleanBgValue,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }
      : {
          backgroundColor: cleanBgValue || "#0c0d12",
          backgroundImage: "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        };

  function getButtonStyleClass() {
    if (buttonStyle === "outline") {
      return "border-2 border-white/25 bg-transparent text-white hover:border-[#00d084] hover:text-[#00d084]";
    }

    if (buttonStyle === "glass") {
      return "border border-white/15 bg-white/10 text-white backdrop-blur hover:bg-[#00d084] hover:text-[#07100d]";
    }

    return "border-2 border-transparent bg-[#00d084] text-[#07100d] hover:bg-[#19e49b]";
  }

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

  return (
    <div
      className="mx-auto h-full w-full max-w-md overflow-y-auto rounded-3xl border border-white/10"
      style={previewBackgroundStyle}
    >
      <div className="flex min-h-full flex-col items-center px-6 pb-10 pt-10">
        {avatarUrl ? (
  <div
    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15"
    // h-24 w-24 = 96px fissi, come il cerchio nella dashboard
  >
    <img
      src={avatarUrl}
      alt={`Foto profilo di ${displayName} su BioLinkr`}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      className="select-none object-cover"
      style={{
        width: `${avatarWidth ?? 120}px`,
        height: `${avatarWidth ?? 120}px`,
        objectPosition: `${avatarPositionX ?? 50}% 50%`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  </div>
) : (
  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00d084] text-3xl font-black text-[#07100d]">
    {displayName ? displayName.charAt(0).toUpperCase() : "B"}
  </div>
)}

        <h1
          className={`mt-5 text-center font-black ${
            displayNameSize || "text-2xl"
          }`}
          style={{
            color: displayNameColor || "#ffffff",
          }}
        >
          {displayName || "Il tuo nome"}
        </h1>

        <p
          className="mt-1 text-sm font-medium"
          style={{
            color: usernameColor || "#00d084",
          }}
        >
          @{username}
        </p>

        {bio && (
          <p
            className={`mt-4 whitespace-pre-wrap text-center ${
              bioSize || "text-base"
            }`}
            style={{
              color: bioColor || "rgba(255,255,255,0.7)",
            }}
          >
            {bio}
          </p>
        )}

        {socialPosition === "below_profile" && socialLinks.length > 0 && (
          <DndContext
            sensors={socialSensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => {
              draggedSocialIdRef.current = String(event.active.id);
            }}
            onDragEnd={handlePreviewSocialDragEnd}
          >
            <SortableContext
              items={socialLinks.map((socialLink) => socialLink.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {socialLinks.map((socialLink) => (
                  <SortableSocialIcon
                    key={socialLink.id}
                    socialLink={socialLink}
                    draggedSocialIdRef={draggedSocialIdRef}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {links.length === 0 ? (
          <div className="mt-8 w-full rounded-xl border border-dashed border-white/15 px-4 py-4 text-center text-sm text-white/40">
            Non ci sono link attivi in questo momento.
          </div>
        ) : (
          <div className="mt-8 w-full space-y-3">
            {links.map((link) =>
              link.display_type === "image" && link.image_url ? (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.title || "Apri link"}
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
                </a>
              ) : (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover-effect={link.hover_effect || "none"}
                  className={`group relative flex w-full items-center justify-center rounded-xl px-4 py-4 font-black transition ${getButtonStyleClass()}`}
                  style={
                    link.background_color
                      ? { background: link.background_color }
                      : undefined
                  }
                >
{link.icon_url && (
  <span
    className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
    style={{
      width: "36px",
      height: "36px",
      backgroundColor: link.background_color || "rgba(255,255,255,0.15)",
    }}
  >
    <img
      src={link.icon_url}
      alt=""
      aria-hidden="true"
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
                    style={
                      link.text_color
                        ? { color: link.text_color }
                        : undefined
                    }
                  >
                    {link.title}
                  </span>
                </a>
              )
            )}
          </div>
        )}

        {products.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowProducts((current) => !current)}
              className="mt-8 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[#00d084] hover:text-[#00d084]"
            >
              {showProducts ? "Nascondi prodotti" : "Mostra prodotti"}
            </button>

            {showProducts && (
              <div className="mt-4 w-full space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12]"
                  >
                    {product.cover_image_url && (
                      <img
                        src={product.cover_image_url}
                        alt={product.title}
                        className="h-40 w-full object-cover"
                      />
                    )}

                    <div className="p-4">
                      <p className="font-bold text-white">{product.title}</p>

                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-white/60">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-black text-[#00d084]">
                          {formatPrice(product.price_cents, product.currency)}
                        </p>

                        <button
                          type="button"
                          className="rounded-lg bg-[#00d084] px-3 py-2 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
                        >
                          Acquista
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {socialPosition === "footer" && socialLinks.length > 0 && (
          <div className="mt-10 w-full border-t border-white/10 pt-6">
            <DndContext
              sensors={socialSensors}
              collisionDetection={closestCenter}
              onDragStart={(event) => {
                draggedSocialIdRef.current = String(event.active.id);
              }}
              onDragEnd={handlePreviewSocialDragEnd}
            >
              <SortableContext
                items={socialLinks.map((socialLink) => socialLink.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {socialLinks.map((socialLink) => (
                    <SortableSocialIcon
                      key={socialLink.id}
                      socialLink={socialLink}
                      draggedSocialIdRef={draggedSocialIdRef}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-white/40">
          Creato con{" "}
          <span className="font-bold text-[#00d084]">
            bio<span className="text-[#00d084]">linkr</span>
          </span>
        </div>
      </div>
    </div>
  );
}