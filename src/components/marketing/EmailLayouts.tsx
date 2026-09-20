import type { ReactNode } from "react";
import { renderPreview, type EmailContent, type EmailLayout } from "@/lib/marketing";

/** Layouts rendered by the richer, hotel-style template renderer below. */
export const RICH_LAYOUTS: EmailLayout[] = [
  "newsletter_grid",
  "logo_header",
  "centered_invite",
  "offer_first",
  "two_column_cards",
  "postcard",
  "list_highlights",
  "magazine",
  "dark_luxe",
  "stay_receipt",
];

export const isRichLayout = (l: EmailLayout) => RICH_LAYOUTS.includes(l);

type Args = {
  value: EmailContent;
  layout: EmailLayout;
  accent: string;
  /** Photograph for image slot i. */
  heroOf: (i: number) => string;
  /** Promotion banner block, when one is attached. */
  offer: ReactNode;
  property: string;
};

const Photo = ({ src, height, className = "" }: { src: string; height: number; className?: string }) => (
  <div className={`overflow-hidden ${className}`} style={{ height }}>
    <img src={src} alt="" loading="lazy" className="size-full object-cover" />
  </div>
);

/** Body copy split into paragraphs; the first ones feed card captions too. */
const linesOf = (body: string) =>
  renderPreview(body)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function RichEmailLayout({ value, layout, accent, heroOf, offer, property }: Args) {
  const lines = linesOf(value.body);
  const heading = renderPreview(value.heading);
  const kicker = renderPreview(value.preheader);
  const cta = (style: "solid" | "outline" | "dark" = "solid") => (
    <span
      className={`inline-block rounded px-6 py-3 text-[12.5px] font-semibold uppercase tracking-wide ${
        style === "outline" ? "border" : "text-white"
      }`}
      style={
        style === "outline"
          ? { borderColor: accent, color: accent }
          : { background: style === "dark" ? "#111827" : accent }
      }
    >
      {value.ctaLabel}
    </span>
  );
  const brandBar = (
    <div className="border-b border-border px-6 py-4 text-center">
      <p className="text-[15px] font-black uppercase tracking-[0.22em] text-card-foreground">{property}</p>
    </div>
  );
  const bodyText = (className = "text-muted-foreground") => (
    <div className={`space-y-2 text-[13px] leading-relaxed ${className}`}>
      {(lines.length ? lines : [""]).map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );

  if (layout === "newsletter_grid") {
    const cards = (lines.length ? lines : ["Highlight"]).slice(0, 4);
    return (
      <div>
        {brandBar}
        <Photo src={heroOf(0)} height={150} />
        <div className="px-7 py-6 text-center">
          <p className="text-[13px] italic text-muted-foreground">{kicker}</p>
          <h3 className="mt-1 text-[19px] font-semibold uppercase tracking-wide text-card-foreground">{heading}</h3>
          <div className="mt-3">{bodyText()}</div>
          {offer}
        </div>
        <div className="bg-muted/60 px-6 py-5 text-center">{cta()}</div>
        <div className="px-6 py-6 text-center" style={{ background: accent }}>
          <p className="text-[12.5px] italic text-white/85">{renderPreview(value.subject)}</p>
          <p className="mt-1 text-[15px] font-semibold uppercase tracking-wide text-white">What&apos;s happening</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            {cards.map((c, i) => (
              <div key={i}>
                <Photo src={heroOf(i + 1)} height={82} />
                <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-wide text-white">{c.slice(0, 30)}</p>
                <p className="mt-1 text-[11px] leading-snug text-white/80">{c}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <span className="inline-block rounded border border-white/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white">
              {value.ctaLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "logo_header") {
    return (
      <div>
        {brandBar}
        <Photo src={heroOf(0)} height={140} />
        <div className="px-6 py-6">
          <h3 className="text-[19px] font-semibold leading-snug text-card-foreground">{heading}</h3>
          <div className="mt-2.5">{bodyText()}</div>
          {offer}
          <div className="mt-5">{cta()}</div>
        </div>
      </div>
    );
  }

  if (layout === "centered_invite") {
    return (
      <div className="px-8 py-9 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>
          {property}
        </p>
        <div className="mx-auto mt-4 h-px w-16 bg-border" />
        <h3 className="mt-4 text-[22px] font-light leading-snug text-card-foreground">{heading}</h3>
        <p className="mt-2 text-[12.5px] italic text-muted-foreground">{kicker}</p>
        <div className="mt-4">{bodyText()}</div>
        {offer}
        <div className="mx-auto mt-6 h-px w-16 bg-border" />
        <div className="mt-5">{cta("outline")}</div>
      </div>
    );
  }

  if (layout === "offer_first") {
    return (
      <div>
        <div className="px-6 py-6 text-center" style={{ background: accent }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">{kicker}</p>
          <h3 className="mt-1.5 text-[24px] font-black uppercase leading-none text-white">{heading}</h3>
        </div>
        <Photo src={heroOf(0)} height={120} />
        <div className="px-6 py-6">
          {bodyText()}
          {offer}
          <div className="mt-5">{cta()}</div>
        </div>
      </div>
    );
  }

  if (layout === "two_column_cards") {
    const cards = (lines.length ? lines : ["Highlight", "Highlight"]).slice(0, 2);
    return (
      <div>
        <Photo src={heroOf(0)} height={128} />
        <div className="px-6 py-6">
          <h3 className="text-[19px] font-semibold leading-snug text-card-foreground">{heading}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{lines[0] ?? ""}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {cards.map((c, i) => (
              <div key={i} className="overflow-hidden rounded border border-border">
                <Photo src={heroOf(i + 1)} height={84} />
                <p className="px-2.5 py-2 text-[11.5px] leading-snug text-muted-foreground">{c}</p>
              </div>
            ))}
          </div>
          {offer}
          <div className="mt-5">{cta()}</div>
        </div>
      </div>
    );
  }

  if (layout === "postcard") {
    return (
      <div>
        <Photo src={heroOf(0)} height={168} />
        <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-6">
          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold leading-snug text-card-foreground">{heading}</h3>
            <div className="mt-2">{bodyText()}</div>
            {offer}
            <div className="mt-4">{cta()}</div>
          </div>
          <div className="w-16 border-l border-dashed border-border pl-3">
            <div className="h-12 rounded-sm border border-border" style={{ background: `${accent}1a` }} />
            <p className="mt-2 text-[9.5px] uppercase leading-tight text-muted-foreground">{property}</p>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "list_highlights") {
    const items = (lines.length ? lines : ["Highlight"]).slice(0, 5);
    return (
      <div className="px-6 py-6">
        <h3 className="text-[19px] font-semibold leading-snug text-card-foreground">{heading}</h3>
        <p className="mt-1.5 text-[12.5px] italic text-muted-foreground">{kicker}</p>
        <ol className="mt-4 space-y-2.5">
          {items.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                style={{ background: accent }}
              >
                {i + 1}
              </span>
              <span className="text-[12.5px] leading-relaxed text-muted-foreground">{l}</span>
            </li>
          ))}
        </ol>
        {offer}
        <div className="mt-5">{cta()}</div>
      </div>
    );
  }

  if (layout === "magazine") {
    return (
      <div className="flex gap-5 px-6 py-6">
        <div className="w-2/5 shrink-0">
          <Photo src={heroOf(0)} height={210} className="rounded" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
            {property}
          </p>
          <h3 className="mt-2 text-[20px] font-light leading-tight text-card-foreground">{heading}</h3>
          <p className="mt-3 border-l-2 pl-3 text-[12.5px] italic leading-relaxed text-card-foreground" style={{ borderColor: accent }}>
            {kicker}
          </p>
          <div className="mt-3">{bodyText()}</div>
          {offer}
          <div className="mt-4">{cta("outline")}</div>
        </div>
      </div>
    );
  }

  if (layout === "dark_luxe") {
    return (
      <div className="bg-[#111827] px-7 py-8 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-white/60">{property}</p>
        <h3 className="mt-4 text-[22px] font-light leading-snug text-white">{heading}</h3>
        <p className="mt-2 text-[12.5px] italic text-white/70">{kicker}</p>
        <div className="mx-auto mt-4 max-w-[330px] space-y-2 text-[12.5px] leading-relaxed text-white/75">
          {(lines.length ? lines : [""]).map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded">
          <Photo src={heroOf(0)} height={120} />
        </div>
        {offer}
        <div className="mt-6">
          <span className="inline-block rounded bg-white px-6 py-3 text-[12.5px] font-semibold uppercase tracking-wide text-[#111827]">
            {value.ctaLabel}
          </span>
        </div>
      </div>
    );
  }

  // stay_receipt
  const rows = (lines.length ? lines : ["Details to follow"]).slice(0, 4);
  return (
    <div className="px-6 py-6">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h3 className="mt-2 text-[19px] font-semibold leading-snug text-card-foreground">{heading}</h3>
      <div className="mt-4 overflow-hidden rounded border border-border">
        {rows.map((l, i) => (
          <div
            key={i}
            className={`flex items-start justify-between gap-3 px-3.5 py-2.5 text-[12px] ${i % 2 ? "bg-muted/40" : "bg-background"}`}
          >
            <span className="font-semibold text-card-foreground">{l.split(":")[0]?.slice(0, 22)}</span>
            <span className="text-right text-muted-foreground">{l.includes(":") ? l.split(":").slice(1).join(":").trim() : "—"}</span>
          </div>
        ))}
      </div>
      {offer}
      <div className="mt-5">{cta("dark")}</div>
      <Photo src={heroOf(0)} height={96} className="mt-5 rounded" />
    </div>
  );
}
