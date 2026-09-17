import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProfileViewTracker from "../components/ProfileViewTracker";
import TrackedPublicLink from "../components/TrackedPublicLink";
import ProductCheckoutModal from "../components/ProductCheckoutModal";
import SocialIcons, {
  SocialLink,
} from "../components/SocialIcons";


type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};


type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  avatar_width: number | null;
  avatar_position_x: number | null;
  bg_color: string | null;
  bg_image_url: string | null;
  banner_image_url: string | null;
  bg_video_url: string | null;
  video_opacity: number | null;
  button_style: string;
  display_name_color: string | null;
  username_color: string | null;
  bio_color: string | null;
  display_name_size: string | null;
  bio_size: string | null;
  social_position: "below_profile" | "footer" | null;
  profile_layout: "classic" | "hero" | "banner" | "shape" | null;
plan: "free" | "premium" | null;
subscription_status: string | null;
};


type BioLink = {
  id: string;
  title: string;
  url: string;
  position: number;
  starts_at: string | null;
  ends_at: string | null;
  ab_group: string | null;
  is_variant: boolean;
  variant_of: string | null;
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


type PublicSocialLink = SocialLink & {
  id: string;
  profile_id: string;
  position: number;
};


function isLinkActive(link: BioLink) {
  const now = new Date();

  if (link.starts_at && new Date(link.starts_at) > now) {
    return false;
  }

  if (link.ends_at && new Date(link.ends_at) <= now) {
    return false;
  }

  return true;
}


function pickOneVariantPerAbGroup(links: BioLink[]) {
  const activeLinks = links.filter(isLinkActive);

  // Link senza A/B: li teniamo tutti
  const nonAbLinks = activeLinks.filter((link) => !link.ab_group);

  // Link con A/B: li raggruppiamo per ab_group
  const abLinks = activeLinks.filter((link) => link.ab_group);

  const abGroups = new Map<string, BioLink[]>();

  for (const link of abLinks) {
    if (!link.ab_group) {
      continue;
    }

    const existing = abGroups.get(link.ab_group) ?? [];
    existing.push(link);
    abGroups.set(link.ab_group, existing);
  }

  // Per ogni gruppo A/B, scegliamo UNA sola variante a caso
  const chosen: BioLink[] = [];

  for (const groupLinks of abGroups.values()) {
    if (groupLinks.length === 0) {
      continue;
    }

    const randomIndex = Math.floor(Math.random() * groupLinks.length);
    chosen.push(groupLinks[randomIndex]);
  }

  // Risultato: tutti i link senza A/B + una sola variante per ogni gruppo A/B
  return [...nonAbLinks, ...chosen];
}


function getButtonClasses(buttonStyle: string) {
  switch (buttonStyle) {
    case "outline":
      return "rounded-xl border border-white/20 bg-transparent font-black text-white transition hover:border-[#00d084] hover:bg-white/5";

    case "glass":
      return "rounded-xl border border-white/10 bg-white/5 font-black text-white backdrop-blur transition hover:bg-white/10";

    default:
      return "rounded-xl bg-[#00d084] font-black text-[#07100d] transition hover:bg-[#19e49b]";
  }
}


export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase non configurato: aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY alle variabili d'ambiente."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select(
    "id, username, display_name, bio, avatar_url, avatar_width, avatar_height, avatar_position_x, avatar_position_y, bg_color, bg_image_url, banner_image_url, bg_video_url, button_style, social_position, display_name_color, username_color, bio_color, display_name_size, bio_size, video_opacity, plan, subscription_status, profile_layout"
  )
  .eq("username", username.toLowerCase())
  .maybeSingle();

  if (profileError || !profile) {
    notFound();
  }

  const publicProfile = profile as Profile;
  const isPro =
  publicProfile.plan === "premium" ||
  publicProfile.subscription_status === "trialing";

const selectedLayout =
  isPro &&
  ["hero", "banner", "shape"].includes(publicProfile.profile_layout ?? "")
    ? publicProfile.profile_layout
    : "classic";
  console.log("publicProfile.bg_video_url:", publicProfile.bg_video_url);
console.log("publicProfile.bg_image_url:", publicProfile.bg_image_url);
console.log("publicProfile.bg_color:", publicProfile.bg_color);

  const [linksResult, productsResult, socialLinksResult] = await Promise.all([
    supabase
      .from("links")
      .select(
        "id, title, url, position, starts_at, ends_at, ab_group, is_variant, variant_of, icon_url, icon_size, icon_object_x, icon_object_y, background_color, badge_text, text_color, hover_effect, display_type, image_url, image_height"
      )
      .eq("profile_id", publicProfile.id)
      .order("position", { ascending: true }),

    supabase
      .from("products")
      .select(
        "id, profile_id, title, description, price_cents, currency, file_url, external_url, cover_image_url"
      )
      .eq("profile_id", publicProfile.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("social_links")
      .select("id, profile_id, platform, url, position")
      .eq("profile_id", publicProfile.id)
      .order("position", { ascending: true }),
  ]);

  if (linksResult.error) {
    console.error("Errore nel caricamento dei link:", linksResult.error.message);
  }

  if (productsResult.error) {
    console.error(
      "Errore nel caricamento dei prodotti:",
      productsResult.error.message
    );
  }

  if (socialLinksResult.error) {
    console.error(
      "Errore nel caricamento dei social:",
      socialLinksResult.error.message
    );
  }

  const publicLinks = (linksResult.data ?? []) as BioLink[];
  const publicProducts = (productsResult.data ?? []) as Product[];
  const publicSocialLinks = (
    socialLinksResult.data ?? []
  ) as PublicSocialLink[];

  const socialPosition =
    publicProfile.social_position === "below_profile"
      ? "below_profile"
      : "footer";

  const linksToShow = pickOneVariantPerAbGroup(publicLinks);
  const hasContent = linksToShow.length > 0 || publicProducts.length > 0;

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
  <main className="relative min-h-screen px-6 py-12 text-white">
    {/* Sfondo: video > immagine > colore */}
    {publicProfile.bg_video_url ? (
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
    style={{
      zIndex: 0,
      opacity: publicProfile.video_opacity ?? 0.6,
    }}
  >
    <source src={publicProfile.bg_video_url} type="video/mp4" />
    <source src={publicProfile.bg_video_url} type="video/webm" />
  </video>
    ) : publicProfile.bg_image_url ? (
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url(${publicProfile.bg_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
    ) : (
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundColor: publicProfile.bg_color ?? "#0c0d12",
          zIndex: 0,
        }}
      />
    )}

    {/* Contenuto sopra lo sfondo */}
    <div className="relative z-10">
      <ProfileViewTracker profileId={publicProfile.id} />

<div className="flex w-full flex-col items-center">
        <Link
          href="/"
className="relative z-20 mb-8 text-3xl font-black tracking-tight text-white/60 transition hover:text-white"
        >
          bio<span className="text-[#00d084]">linkr</span>
        </Link>

        <section className="w-full">
  {/* CLASSIC — sempre disponibile */}
  {selectedLayout === "classic" && (
    <div className="flex flex-col items-center text-center">
      {publicProfile.avatar_url ? (
        <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15">
          <img
            src={publicProfile.avatar_url}
            alt={publicProfile.display_name}
            draggable={false}
            className="select-none object-cover"
            style={{
              width: `${publicProfile.avatar_width ?? 120}px`,
              height: `${publicProfile.avatar_width ?? 120}px`,
              objectPosition: `${publicProfile.avatar_position_x ?? 50}% 50%`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
      ) : (
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#00d084] text-3xl font-black text-[#07100d]">
          {publicProfile.display_name
            ? publicProfile.display_name.charAt(0).toUpperCase()
            : "B"}
        </div>
      )}

      <h1
        className={`mt-6 font-black tracking-tight ${
          publicProfile.display_name_size || "text-4xl"
        } text-center sm:text-5xl`}
        style={{
          color: publicProfile.display_name_color || "#ffffff",
        }}
      >
        {publicProfile.display_name}
      </h1>

      <p
        className="mt-3 text-lg"
        style={{
          color: publicProfile.username_color || "#00d084",
        }}
      >
        @{publicProfile.username}
      </p>

      {publicProfile.bio && (
        <p
          className={`mx-auto mt-6 max-w-md whitespace-pre-wrap leading-relaxed ${
            publicProfile.bio_size || "text-base"
          }`}
          style={{
            color: publicProfile.bio_color || "rgba(255,255,255,0.7)",
          }}
        >
          {publicProfile.bio}
        </p>
      )}

      {socialPosition === "below_profile" &&
        publicSocialLinks.length > 0 && (
          <SocialIcons
            links={publicSocialLinks}
            className="mt-6 justify-center"
          />
        )}
    </div>
  )}

  {/* HERO PRO — immagine centrata con bordo completamente invisibile */}
{selectedLayout === "hero" && (
  <div className="relative -mt-8 w-full px-6 pb-10 pt-8 text-center">
    <div className="relative mx-auto flex max-w-xl flex-col items-center">
      {publicProfile.avatar_url ? (
        <div className="relative h-52 w-full max-w-sm sm:h-64">
          {/* Bagliore molto morbido: non è una card */}
          <div className="pointer-events-none absolute inset-x-8 bottom-2 h-24 rounded-full bg-[#00d084]/20 blur-3xl" />

          {/* La foto è centrata, ma sfuma nei bordi */}
          <img
            src={publicProfile.avatar_url}
            alt={publicProfile.display_name}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: `${publicProfile.avatar_position_x ?? 50}% 40%`,
              pointerEvents: "none",
              userSelect: "none",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 95% at 50% 45%, black 48%, transparent 78%)",
              maskImage:
                "radial-gradient(ellipse 72% 95% at 50% 45%, black 48%, transparent 78%)",
            }}
          />

          {/* Una seconda maschera sfuma il fondo, senza colore di sfondo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 18%, black 58%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 18%, black 58%, transparent 100%)",
            }}
          />
        </div>
      ) : (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#00d084]/25 blur-3xl" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#00d084] text-5xl font-black text-[#07100d]">
            {publicProfile.display_name
              ? publicProfile.display_name.charAt(0).toUpperCase()
              : "B"}
          </div>
        </div>
      )}

      <p
        className="mt-3 text-[10px] font-black uppercase tracking-[0.38em]"
        style={{
          color: publicProfile.username_color || "#00d084",
          textShadow: "0 2px 16px rgba(0,0,0,0.65)",
        }}
      >
        @{publicProfile.username}
      </p>

      <h1
        className={`mt-5 max-w-xl text-balance font-black leading-[0.84] tracking-[-0.075em] ${
          publicProfile.display_name_size || "text-4xl"
        } sm:text-7xl`}
        style={{
          color: publicProfile.display_name_color || "#ffffff",
          textShadow: "0 8px 34px rgba(0,0,0,0.68)",
        }}
      >
        {publicProfile.display_name}
      </h1>

      {publicProfile.bio && (
        <p
          className={`mt-6 max-w-md whitespace-pre-wrap text-center leading-relaxed ${
            publicProfile.bio_size || "text-base"
          }`}
          style={{
            color: publicProfile.bio_color || "rgba(255,255,255,0.82)",
            textShadow: "0 3px 20px rgba(0,0,0,0.68)",
          }}
        >
          {publicProfile.bio}
        </p>
      )}

      {socialPosition === "below_profile" &&
        publicSocialLinks.length > 0 && (
          <SocialIcons
            links={publicSocialLinks}
            className="mt-7 justify-center"
          />
        )}
    </div>
  </div>
)}

{/* BANNER PRO — immagine orizzontale con bordi invisibili */}
{selectedLayout === "banner" && (
  <div className="relative -mt-8 w-full px-6 pb-10 pt-8 text-center">
    <div className="relative mx-auto flex max-w-xl flex-col items-center">
{(publicProfile.banner_image_url || publicProfile.avatar_url) ? (
        <div className="relative h-40 w-full max-w-lg sm:h-52">
          <div className="pointer-events-none absolute inset-x-10 top-8 h-28 rounded-full bg-[#00d084]/20 blur-3xl" />

          <img
src={publicProfile.banner_image_url || publicProfile.avatar_url || ""}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: `${publicProfile.avatar_position_x ?? 50}% 42%`,
              WebkitMaskImage:
                "radial-gradient(ellipse 92% 82% at 50% 48%, black 46%, transparent 80%)",
              maskImage:
                "radial-gradient(ellipse 92% 82% at 50% 48%, black 46%, transparent 80%)",
            }}
          />
        </div>
      ) : (
        <div className="relative h-32 w-full max-w-lg">
          <div className="absolute inset-x-10 top-5 h-20 rounded-full bg-[#00d084]/25 blur-3xl" />
        </div>
      )}

      <div className="-mt-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-[#00d084]/15 shadow-[0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur-sm">
        {publicProfile.avatar_url ? (
          <img
            src={publicProfile.avatar_url}
            alt={publicProfile.display_name}
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{
              objectPosition: `${publicProfile.avatar_position_x ?? 50}% 50%`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ) : (
          <span className="text-4xl font-black text-[#00d084]">
            {publicProfile.display_name
              ? publicProfile.display_name.charAt(0).toUpperCase()
              : "B"}
          </span>
        )}
      </div>

      <p
        className="mt-5 text-[10px] font-black uppercase tracking-[0.3em]"
        style={{
          color: publicProfile.username_color || "#00d084",
          textShadow: "0 2px 16px rgba(0,0,0,0.65)",
        }}
      >
        @{publicProfile.username}
      </p>

      <h1
        className={`mt-3 max-w-xl text-balance font-black leading-[0.9] tracking-[-0.06em] ${
          publicProfile.display_name_size || "text-4xl"
        } sm:text-6xl`}
        style={{
          color: publicProfile.display_name_color || "#ffffff",
          textShadow: "0 8px 34px rgba(0,0,0,0.58)",
        }}
      >
        {publicProfile.display_name}
      </h1>

      {publicProfile.bio && (
        <p
          className={`mt-5 max-w-md whitespace-pre-wrap text-center leading-relaxed ${
            publicProfile.bio_size || "text-base"
          }`}
          style={{
            color: publicProfile.bio_color || "rgba(255,255,255,0.78)",
            textShadow: "0 3px 20px rgba(0,0,0,0.55)",
          }}
        >
          {publicProfile.bio}
        </p>
      )}

      {socialPosition === "below_profile" &&
        publicSocialLinks.length > 0 && (
          <SocialIcons
            links={publicSocialLinks}
            className="mt-7 justify-center"
          />
        )}
    </div>
  </div>
)}

{/* SHAPE PRO — ritratto in forma organica, senza pannello */}
{selectedLayout === "shape" && (
  <div className="relative -mt-8 w-full px-6 pb-10 pt-8 text-center">
    <div className="relative mx-auto flex max-w-xl flex-col items-center">
      <div className="relative h-52 w-72 sm:h-60 sm:w-80">
        <div className="pointer-events-none absolute -left-12 top-6 h-40 w-40 rounded-full bg-[#00d084]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[#40e0d0]/20 blur-3xl" />

        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#00d084]/30 [border-radius:52%_48%_42%_58%/45%_55%_45%_55%] blur-[1px]" />

        {publicProfile.avatar_url ? (
          <img
            src={publicProfile.avatar_url}
            alt={publicProfile.display_name}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{
              objectPosition: `${publicProfile.avatar_position_x ?? 50}% 38%`,
              pointerEvents: "none",
              userSelect: "none",
              WebkitMaskImage:
                "radial-gradient(ellipse 78% 92% at 50% 48%, black 45%, transparent 82%)",
              maskImage:
                "radial-gradient(ellipse 78% 92% at 50% 48%, black 45%, transparent 82%)",
              borderRadius: "52% 48% 42% 58% / 45% 55% 45% 55%",
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00d084]/80 text-7xl font-black text-[#07100d] [border-radius:52%_48%_42%_58%/45%_55%_45%_55%]">
            {publicProfile.display_name
              ? publicProfile.display_name.charAt(0).toUpperCase()
              : "B"}
          </div>
        )}

        <div className="pointer-events-none absolute -left-2 bottom-8 h-8 w-8 rounded-full border border-white/40 bg-white/15 backdrop-blur" />
        <div className="pointer-events-none absolute right-0 top-7 h-5 w-5 rounded-full bg-[#5cf0bd] shadow-[0_0_22px_#00d084]" />
      </div>

      <h1
        className={`mt-7 max-w-xl text-balance font-black leading-[0.86] tracking-[-0.07em] ${
          publicProfile.display_name_size || "text-4xl"
        } sm:text-6xl`}
        style={{
          color: publicProfile.display_name_color || "#ffffff",
          textShadow: "0 8px 34px rgba(0,0,0,0.58)",
        }}
      >
        {publicProfile.display_name}
      </h1>

      <p
        className="mt-3 text-[10px] font-black uppercase tracking-[0.3em]"
        style={{
          color: publicProfile.username_color || "#00d084",
          textShadow: "0 2px 16px rgba(0,0,0,0.65)",
        }}
      >
        @{publicProfile.username}
      </p>

      {publicProfile.bio && (
        <p
          className={`mt-5 max-w-md whitespace-pre-wrap text-center leading-relaxed ${
            publicProfile.bio_size || "text-base"
          }`}
          style={{
            color: publicProfile.bio_color || "rgba(255,255,255,0.78)",
            textShadow: "0 3px 20px rgba(0,0,0,0.55)",
          }}
        >
          {publicProfile.bio}
        </p>
      )}

      {socialPosition === "below_profile" &&
        publicSocialLinks.length > 0 && (
          <SocialIcons
            links={publicSocialLinks}
            className="mt-7 justify-center"
          />
        )}
    </div>
  </div>
)}
</section>
<div className="mx-auto flex w-full max-w-xl flex-col items-center px-6"></div>
        {hasContent && (
          <section className="mt-10 w-full space-y-10">
            {linksToShow.length > 0 && (
              <div>
                <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.25em] text-white/50">
                  Link
                </h2>

                <div className="space-y-3">
                  {linksToShow.map((link) => {
                    const baseClasses = getButtonClasses(
                      publicProfile.button_style ?? "solid"
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
                              backgroundColor:
                                link.background_color || "rgba(255,255,255,0.15)",
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
                          style={
                            link.text_color
                              ? { color: link.text_color }
                              : undefined
                          }
                        >
                          {link.title}
                        </span>
                      </TrackedPublicLink>
                    );
                  })}
                </div>
              </div>
            )}

            {publicProducts.length > 0 && (
              <div>
                <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.25em] text-white/50">
                  Prodotti
                </h2>

                <div className="grid gap-4 sm:grid-cols-1">
                  {publicProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#17181e]"
                    >
                      {product.cover_image_url && (
                        <img
                          src={product.cover_image_url}
                          alt=""
                          className="h-40 w-full object-cover"
                        />
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-lg font-black text-white">
                              {product.title}
                            </p>

                            {product.description && (
                              <p className="mt-1 line-clamp-2 text-sm text-white/60">
                                {product.description}
                              </p>
                            )}

                            <p className="mt-3 text-base font-bold text-[#00d084]">
                              {formatPrice(product.price_cents, product.currency)}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <ProductCheckoutModal
                              product={product}
                              profileId={publicProfile.id}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {!hasContent && (
          <div className="mt-10 w-full">
            <div className="rounded-2xl border border-white/10 bg-[#17181e] px-6 py-5 text-center text-sm text-white/45">
              Questo profilo non ha link o prodotti attivi in questo momento.
            </div>
          </div>
        )}

        {socialPosition === "footer" && publicSocialLinks.length > 0 && (
          <div className="mt-10 w-full">
            <SocialIcons links={publicSocialLinks} className="justify-center" />
          </div>
        )}

        <footer className="mt-12 w-full border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            Creato con{" "}
            <span className="font-bold text-[#00d084]">
              bio<span className="text-[#00d084]">linkr</span>
            </span>
          </p>
        </footer>
      </div>
    </div>
  </main>
);
}