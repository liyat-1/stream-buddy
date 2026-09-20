import type { ReactNode } from "react";
import { renderPreview, type EmailContent, type EmailLayout } from "@/lib/marketing";

/** Bespoke, photo-led hotel marketing designs — each one a distinct structure. */
export const HOTEL_LAYOUTS: EmailLayout[] = [
  "resort_promo",
  "suite_reveal",
  "villa_services",
  "editorial_invite",
  "destination_layers",
  "museum_offer",
  "qr_service",
  "save_big",
  "room_duo",
  "member_welcome",
  "radio_newsletter",
];

export const isHotelLayout = (l: EmailLayout) => HOTEL_LAYOUTS.includes(l);

type Args = {
  value: EmailContent;
  layout: EmailLayout;
  accent: string;
  heroOf: (i: number) => string;
  offer: ReactNode;
  property: string;
};

const Photo = ({ src, height, className = "" }: { src: string; height: number; className?: string }) => (
  <div className={`overflow-hidden ${className}`} style={{ height }}>
    <img src={src} alt="" loading="lazy" className="size-full object-cover" />
  </div>
);

const linesOf = (body: string) =>
  renderPreview(body)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ atoms */

const Rule = ({ color, width = 44 }: { color: string; width?: number }) => (
  <span className="mx-auto mt-3 block h-px" style={{ width, background: color }} />
);

const Btn = ({
  label,
  bg,
  color,
  outline,
  radius = 2,
  wide = false,
}: {
  label: string;
  bg: string;
  color: string;
  outline?: string;
  radius?: number;
  wide?: boolean;
}) => (
  <span
    className={`inline-block text-[12px] font-semibold uppercase tracking-[0.12em] ${wide ? "px-10" : "px-7"} py-3`}
    style={{
      background: bg,
      color,
      borderRadius: radius,
      border: outline ? `1px solid ${outline}` : undefined,
    }}
  >
    {label}
  </span>
);

const Social = ({ tone }: { tone: string }) => (
  <div className="flex justify-center gap-2.5">
    {["f", "in", "@"].map((s) => (
      <span
        key={s}
        className="grid size-6 place-items-center rounded-full text-[9px] font-bold"
        style={{ border: `1px solid ${tone}`, color: tone }}
      >
        {s}
      </span>
    ))}
  </div>
);

/* ---------------------------------------------------------------- layouts */

export function HotelEmailLayout({ value, layout, accent, heroOf, offer, property }: Args) {
  const lines = linesOf(value.body);
  const L = (i: number, fallback = "") => lines[i] ?? fallback;
  const heading = renderPreview(value.heading);
  const kicker = renderPreview(value.preheader);
  const subject = renderPreview(value.subject);
  const cta = value.ctaLabel;

  /* 1 — Resort promotion: panoramic hero, cream offer panel, room thumbnails */
  if (layout === "resort_promo") {
    return (
      <div style={{ background: "#f6efe4" }}>
        <div className="px-6 py-4 text-center" style={{ background: "#ffffff" }}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>
            {property}
          </p>
        </div>
        <Photo src={heroOf(0)} height={176} />
        <div className="px-7 py-7 text-center">
          <div className="mx-auto max-w-[330px] px-6 py-7" style={{ background: "#fffaf2", border: `1px solid ${accent}33` }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>
              {kicker}
            </p>
            <h3 className="mt-3 text-[26px] font-light leading-tight" style={{ color: "#3b2d20", fontFamily: "Georgia, serif" }}>
              {heading}
            </h3>
            <Rule color={`${accent}66`} />
            <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: "#6b5844" }}>
              {L(0)}
            </p>
            {offer}
            <div className="mt-5">
              <Btn label={cta} bg={accent} color="#fff" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-6 pb-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Photo src={heroOf(i)} height={78} />
              <p className="mt-1.5 text-center text-[9.5px] uppercase tracking-[0.15em]" style={{ color: "#8a7560" }}>
                {L(i, "Rooms")?.slice(0, 22)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 text-center" style={{ background: "#3b2d20" }}>
          <p className="text-[10.5px] leading-relaxed text-white/70">{L(2, "Terms apply to selected dates.")}</p>
          <p className="mt-2 text-[12px] font-semibold tracking-[0.2em] text-white">{property}</p>
        </div>
      </div>
    );
  }

  /* 2 — Suite reveal: cinematic full-height image with oversized type */
  if (layout === "suite_reveal") {
    return (
      <div className="relative" style={{ background: "#14110e" }}>
        <div className="relative" style={{ height: 470 }}>
          <img src={heroOf(0)} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(15,12,10,.78) 0%,rgba(15,12,10,.25) 45%,rgba(15,12,10,.92) 100%)" }} />
          <div className="relative flex h-full flex-col justify-between p-7 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-white/70">{property}</p>
            <div>
              <h3 className="text-[42px] font-light uppercase leading-[0.95] tracking-tight text-white">{heading}</h3>
              <Rule color="rgba(255,255,255,.5)" width={56} />
              <p className="mx-auto mt-4 max-w-[300px] text-[12.5px] leading-relaxed text-white/80">{L(0)}</p>
            </div>
            <div>
              {offer}
              <Btn label={cta} bg="#ffffff" color="#14110e" />
              <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-white/50">{kicker}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* 3 — Villa services: cream newsletter with three arched service images */
  if (layout === "villa_services") {
    return (
      <div style={{ background: "#f7f3ea" }}>
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e0d7c6" }}>
          <p className="text-[9.5px] uppercase tracking-[0.2em]" style={{ color: "#9a8b74" }}>
            {kicker}
          </p>
          <p className="text-[15px] font-light uppercase tracking-[0.3em]" style={{ color: "#4a3f30", fontFamily: "Georgia, serif" }}>
            {property}
          </p>
          <p className="text-[9.5px] uppercase tracking-[0.2em]" style={{ color: "#9a8b74" }}>
            Menu
          </p>
        </div>
        <div className="px-8 py-9 text-center">
          <h3 className="text-[32px] font-light italic leading-[1.1]" style={{ color: "#3f3527", fontFamily: "Georgia, serif" }}>
            {heading}
          </h3>
          <p className="mx-auto mt-4 max-w-[300px] text-[12px] leading-relaxed" style={{ color: "#75674f" }}>
            {L(0)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 px-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-center">
              <div className="overflow-hidden" style={{ borderRadius: "999px 999px 6px 6px", height: 132 }}>
                <img src={heroOf(i)} alt="" className="size-full object-cover" />
              </div>
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.22em]" style={{ color: "#6a5c46" }}>
                {L(i, "Service").slice(0, 18)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-8 py-8 text-center">
          {offer}
          <Btn label={cta} bg="transparent" color="#4a3f30" outline="#4a3f30" />
        </div>
        <div className="border-t px-6 py-5 text-center" style={{ borderColor: "#e0d7c6" }}>
          <p className="text-[10.5px] tracking-[0.12em]" style={{ color: "#8b7c64" }}>
            {subject}
          </p>
          <div className="mt-3">
            <Social tone="#b3a48a" />
          </div>
        </div>
      </div>
    );
  }

  /* 4 — Editorial invitation: brown fashion-style RSVP */
  if (layout === "editorial_invite") {
    return (
      <div style={{ background: "#efe7dc" }}>
        <div className="px-6 py-5 text-center">
          <p className="text-[19px] font-light uppercase tracking-[0.45em]" style={{ color: "#4d3a28" }}>
            {property.split(" ")[0]}
          </p>
        </div>
        <Photo src={heroOf(0)} height={230} />
        <div className="px-9 py-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: "#9b7d5c" }}>
            {kicker}
          </p>
          <h3 className="mt-3 text-[27px] font-light leading-tight" style={{ color: "#3d2d1e", fontFamily: "Georgia, serif" }}>
            {heading}
          </h3>
          <p className="mx-auto mt-4 max-w-[300px] text-[12.5px] leading-relaxed" style={{ color: "#6f5a45" }}>
            {L(0)}
          </p>
          {offer}
          <div className="mt-6">
            <Btn label={cta} bg="#3d2d1e" color="#efe7dc" wide />
          </div>
        </div>
        <div className="mx-9 border-y py-5 text-center" style={{ borderColor: "#d4c4b0" }}>
          {[L(1, "Date to be confirmed"), L(2, "Reservations essential")].map((d, i) => (
            <p key={i} className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "#6f5a45" }}>
              {d}
            </p>
          ))}
        </div>
        <div className="px-6 py-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#9b7d5c" }}>
            {property}
          </p>
        </div>
      </div>
    );
  }

  /* 5 — Destination story: layered blue travel editorial */
  if (layout === "destination_layers") {
    return (
      <div style={{ background: "#eef5f9" }}>
        <div className="relative">
          <Photo src={heroOf(0)} height={210} />
          <div className="absolute inset-x-0 bottom-0 px-7 py-5" style={{ background: "linear-gradient(180deg,transparent,rgba(9,45,66,.9))" }}>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/75">{kicker}</p>
            <h3 className="mt-1 text-[24px] font-light leading-tight text-white">{heading}</h3>
          </div>
        </div>
        <div className="px-7 py-6">
          <p className="text-[13px] leading-relaxed" style={{ color: "#274d63" }}>
            {L(0)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4">
          <Photo src={heroOf(1)} height={130} />
          <Photo src={heroOf(2)} height={130} />
        </div>
        <div className="px-7 py-7">
          {[1, 2].map((i) => (
            <div key={i} className="mb-5 border-l-2 pl-4" style={{ borderColor: accent }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
                {`0${i}`}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: "#3c5e73" }}>
                {L(i, "More of the story to come.")}
              </p>
            </div>
          ))}
          {offer}
          <div className="text-center">
            <Btn label={cta} bg={accent} color="#fff" />
          </div>
        </div>
        <div className="px-6 py-6 text-center" style={{ background: "#0d3a52" }}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white">{property}</p>
          <p className="mt-1.5 text-[10.5px] text-white/65">{subject}</p>
          <div className="mt-3">
            <Social tone="rgba(255,255,255,.55)" />
          </div>
        </div>
      </div>
    );
  }

  /* 6 — Museum offer: white campaign with a blue offer panel */
  if (layout === "museum_offer") {
    return (
      <div className="bg-white">
        <div className="border-b px-6 py-4 text-center" style={{ borderColor: "#e6e8ec" }}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.34em]" style={{ color: "#12324f" }}>
            {property}
          </p>
        </div>
        <Photo src={heroOf(0)} height={190} />
        <div className="px-7 py-8 text-center" style={{ background: accent }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">{kicker}</p>
          <h3 className="mt-3 text-[25px] font-light leading-tight text-white">{heading}</h3>
          <p className="mx-auto mt-3 max-w-[300px] text-[12.5px] leading-relaxed text-white/85">{L(0)}</p>
          {offer}
          <div className="mt-5">
            <Btn label={cta} bg="#ffffff" color={accent} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-7 py-6 text-center">
          {["Book", "Call", "Concierge"].map((t, i) => (
            <div key={t}>
              <span className="mx-auto grid size-9 place-items-center rounded-full" style={{ border: `1px solid ${accent}55`, color: accent }}>
                <span className="text-[11px] font-bold">{t[0]}</span>
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: "#5b6b7a" }}>
                {L(i + 1, t).slice(0, 18)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-6" style={{ background: "#12324f" }}>
          <p className="text-center text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white">{property}</p>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-[9.5px] leading-relaxed text-white/55">
            {subject} · Offer subject to availability. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  }

  /* 7 — QR in-stay service card */
  if (layout === "qr_service") {
    return (
      <div style={{ background: "#1d241d" }}>
        <div className="px-7 pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">{property}</p>
          <h3 className="mt-3 text-[30px] font-light italic leading-tight text-white" style={{ fontFamily: "Georgia, serif" }}>
            {heading}
          </h3>
        </div>
        <div className="px-6 py-6">
          <Photo src={heroOf(0)} height={180} className="rounded-sm" />
        </div>
        <div className="mx-6 mb-6 flex items-center gap-4 rounded-sm px-5 py-5" style={{ background: "#f3f1e7" }}>
          <div className="grid size-16 shrink-0 place-items-center" style={{ background: "#1d241d" }}>
            <div className="grid grid-cols-4 gap-0.5 p-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="size-1.5" style={{ background: i % 3 === 0 ? "#f3f1e7" : "transparent" }} />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#4a5a45" }}>
              {kicker}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "#3b4637" }}>
              {L(0)}
            </p>
          </div>
        </div>
        {offer}
        <div className="px-7 pb-9 text-center">
          <Btn label={cta} bg="#f3f1e7" color="#1d241d" wide />
          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-white/45">{L(1, "Room service · 24 hours")}</p>
        </div>
      </div>
    );
  }

  /* 8 — Save big: warm beige sale email */
  if (layout === "save_big") {
    return (
      <div style={{ background: "#f4ece1" }}>
        <Photo src={heroOf(0)} height={175} />
        <div className="-mt-7 px-7 text-center">
          <span className="inline-block rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg" style={{ background: accent }}>
            {kicker}
          </span>
        </div>
        <div className="px-8 py-6 text-center">
          <h3 className="text-[28px] font-bold leading-tight" style={{ color: "#4a3626" }}>
            {heading}
          </h3>
          <p className="mx-auto mt-3 max-w-[310px] text-[12.5px] leading-relaxed" style={{ color: "#75604b" }}>
            {L(0)}
          </p>
          {offer}
          <div className="mt-5">
            <Btn label={cta} bg={accent} color="#fff" wide radius={999} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 pb-7">
          {[1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-sm bg-white">
              <Photo src={heroOf(i)} height={100} />
              <p className="px-3 py-3 text-[11px] leading-snug" style={{ color: "#6a563f" }}>
                {L(i, "Another reason to come back.")}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 text-center" style={{ background: "#e6d8c5" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#6a563f" }}>
            {property}
          </p>
          <div className="mt-3">
            <Social tone="#a68f72" />
          </div>
        </div>
      </div>
    );
  }

  /* 9 — Room duo: dark green hero with two room offer cards */
  if (layout === "room_duo") {
    return (
      <div className="bg-white">
        <div className="relative" style={{ background: accent }}>
          <Photo src={heroOf(0)} height={170} className="opacity-90" />
          <div className="absolute inset-0 grid place-items-center px-8 text-center" style={{ background: "rgba(12,40,30,.5)" }}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/75">{kicker}</p>
              <h3 className="mt-2 text-[24px] font-semibold leading-tight text-white">{heading}</h3>
            </div>
          </div>
          <div className="mx-auto -mt-4 w-max rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow" style={{ background: "#0c281e" }}>
            {subject.slice(0, 34)}
          </div>
        </div>
        <div className="space-y-4 px-6 py-7">
          {[1, 2].map((i) => (
            <div key={i} className="grid grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-sm" style={{ border: "1px solid #e2e6e3" }}>
              <Photo src={heroOf(i)} height={110} />
              <div className="flex flex-col justify-center px-4 py-3">
                <p className="text-[12.5px] font-semibold" style={{ color: "#12362a" }}>
                  {L(i - 1, "Room offer").slice(0, 34)}
                </p>
                <p className="mt-1 text-[11px] leading-snug" style={{ color: "#5d6f66" }}>
                  {L(i, "Book direct for the best rate.")}
                </p>
                <span className="mt-2.5 w-max rounded-sm px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white" style={{ background: accent }}>
                  {cta}
                </span>
              </div>
            </div>
          ))}
          {offer}
        </div>
        <div className="px-6 py-5 text-center" style={{ background: "#0c281e" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">{property}</p>
          <div className="mt-3">
            <Social tone="rgba(255,255,255,.5)" />
          </div>
        </div>
      </div>
    );
  }

  /* 10 — Member welcome: black panel, destination photo, benefit grid */
  if (layout === "member_welcome") {
    return (
      <div className="bg-white">
        <div className="px-7 py-9 text-center" style={{ background: "#111111" }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/55">{property}</p>
          <h3 className="mt-4 text-[30px] font-semibold leading-tight text-white">{heading}</h3>
          <p className="mx-auto mt-3 max-w-[300px] text-[12.5px] leading-relaxed text-white/70">{L(0)}</p>
        </div>
        <Photo src={heroOf(0)} height={185} />
        <div className="px-7 py-7 text-center">
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#4a4a4a" }}>
            {L(1, "Start planning where your membership takes you next.")}
          </p>
          {offer}
          <div className="mt-5">
            <Btn label={cta} bg="#111111" color="#fff" wide />
          </div>
        </div>
        <div className="border-t px-6 py-6" style={{ borderColor: "#ececec" }}>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "#9a9a9a" }}>
            {kicker}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Photo src={heroOf(i)} height={70} />
                <p className="mt-1.5 text-center text-[9.5px] uppercase tracking-[0.14em]" style={{ color: "#7c7c7c" }}>
                  {L(i + 1, "Benefit").slice(0, 18)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-6 text-center" style={{ background: "#f5f5f5" }}>
          <p className="text-[10px] leading-relaxed" style={{ color: "#8a8a8a" }}>
            {subject} · You receive this as a member. Manage preferences or unsubscribe.
          </p>
        </div>
      </div>
    );
  }

  /* 11 — Radio newsletter: logo bar, hero, story, red what's-on grid, dark footer */
  return (
    <div className="bg-white">
      <div className="px-6 py-5 text-center">
        <p className="text-[20px] font-black uppercase tracking-[0.14em]" style={{ color: "#111" }}>
          {property}
        </p>
      </div>
      <Photo src={heroOf(0)} height={175} />
      <div className="px-8 py-7 text-center">
        <p className="text-[13px] italic" style={{ color: "#555" }}>
          {kicker}
        </p>
        <h3 className="mt-1 text-[19px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#111" }}>
          {heading}
        </h3>
        <p className="mx-auto mt-4 max-w-[330px] text-[12.5px] leading-relaxed" style={{ color: "#4b4b4b" }}>
          {L(0)}
        </p>
        {lines[1] && (
          <p className="mx-auto mt-3 max-w-[330px] text-[12.5px] leading-relaxed" style={{ color: "#4b4b4b" }}>
            <strong>{L(1).split(":")[0]}</strong>
            {L(1).includes(":") ? `: ${L(1).split(":").slice(1).join(":")}` : ""}
          </p>
        )}
        {offer}
      </div>
      <div className="py-6 text-center" style={{ background: "#f0f0f0" }}>
        <Btn label={cta} bg="#111" color="#fff" wide />
      </div>
      <div className="px-6 py-7 text-center" style={{ background: accent }}>
        <p className="text-[13px] italic text-white/85">{subject}</p>
        <p className="mt-1.5 text-[15px] font-semibold uppercase tracking-[0.08em] text-white">
          What&apos;s happening
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 text-left">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <Photo src={heroOf(i + 1)} height={104} />
              <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-white">
                {L(i + 1, "Highlight").split(":")[0].slice(0, 26)}
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-white/80">
                {L(i + 1, "More details soon.")}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <span className="inline-block px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ background: "#fff", color: accent }}>
            {cta}
          </span>
        </div>
      </div>
      <div className="px-6 py-7 text-center" style={{ background: "#111" }}>
        <p className="text-[12px] font-semibold tracking-[0.12em] text-white">{property}</p>
        <p className="mt-2 text-[10.5px] leading-relaxed text-white/60">
          2420 Amsterdam Avenue · New York, NY 10033
        </p>
        <div className="mt-3">
          <Social tone="rgba(255,255,255,.55)" />
        </div>
        <p className="mt-4 text-[10px] underline text-white/45">Unsubscribe</p>
      </div>
    </div>
  );
}
