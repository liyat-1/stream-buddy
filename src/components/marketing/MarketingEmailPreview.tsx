import { LAYOUT_PRESETS, normalizeLayout, renderPreview, type EmailContent, type EmailTemplate, type Promotion } from "@/lib/marketing";
import { PromoBanner } from "./PromoBanner";
import { RichEmailLayout, isRichLayout } from "./EmailLayouts";

function Photo({ src, height }: { src: string; height: number }) {
  return <img src={src} alt="" loading="lazy" className="w-full object-cover" style={{ height }} />;
}

export function MarketingEmailPreview({
  value,
  template,
  promotion,
  className = "",
}: {
  value: EmailContent;
  template: EmailTemplate;
  promotion?: Promotion | null;
  className?: string;
}) {
  const accent = template.accent;
  const layout = normalizeLayout(String(value.layout || template.layout));
  const heroOf = (index: number) => index === 0 ? template.hero : LAYOUT_PRESETS[index % LAYOUT_PRESETS.length].photo;
  const offer = promotion ? (
    <div className="my-5"><PromoBanner promotion={promotion} property="Holiday Inn Times Square" className="shadow-none" /></div>
  ) : null;
  const action = (extra = "") => (
    <span className={`inline-block rounded px-5 py-3 text-[13px] font-semibold text-brand-foreground ${extra}`} style={{ background: accent }}>
      {value.ctaLabel}
    </span>
  );

  return (
    <div className={`mx-auto w-full max-w-[460px] overflow-hidden rounded-md border border-border bg-card shadow-lift ${className}`}>
      <div className="border-b border-border bg-background px-5 py-3">
        <p className="text-[13px] font-semibold text-card-foreground">{renderPreview(value.subject)}</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{renderPreview(value.preheader)}</p>
      </div>
      {isRichLayout(layout) ? (
        <RichEmailLayout value={value} layout={layout} accent={accent} heroOf={heroOf} offer={offer} property="Holiday Inn Times Square" />
      ) : layout === "full_bleed" ? (
        <div className="relative px-6 py-14 text-center">
          <img src={heroOf(0)} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-foreground/65" />
          <div className="relative text-background">
            <h3 className="text-[24px] font-semibold leading-snug">{renderPreview(value.heading)}</h3>
            <p className="mx-auto mt-3 max-w-[330px] whitespace-pre-wrap text-[13.5px] leading-relaxed opacity-90">{renderPreview(value.body)}</p>
            {offer}<span className="mt-6 inline-block rounded bg-background px-6 py-3 text-[13px] font-semibold" style={{ color: accent }}>{value.ctaLabel}</span>
          </div>
        </div>
      ) : layout === "split" || layout === "image_left" || layout === "image_right" ? (
        <div className={`grid grid-cols-2 ${layout === "image_right" ? "[&>*:first-child]:order-2" : ""}`}>
          <Photo src={heroOf(0)} height={300} />
          <div className="flex flex-col justify-center px-5 py-7">
            <h3 className="text-[18px] font-semibold leading-snug text-card-foreground">{renderPreview(value.heading)}</h3>
            <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-relaxed text-muted-foreground">{renderPreview(value.body)}</p>
            {offer}<div className="mt-5">{action()}</div>
          </div>
        </div>
      ) : (
        <>
          {(layout === "hero_top" || layout === "gallery_three") && <Photo src={heroOf(0)} height={190} />}
          <div className={`${layout === "text_only" ? "px-10 py-10 text-center" : "px-7 py-7"}`}>
            <h3 className="text-[22px] font-semibold leading-snug text-card-foreground">{renderPreview(value.heading)}</h3>
            <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-muted-foreground">{renderPreview(value.body)}</p>
            {layout === "headline_first" && <div className="mt-5 overflow-hidden rounded"><Photo src={heroOf(0)} height={150} /></div>}
            {layout === "cta_focus" && <div className="mt-5 overflow-hidden rounded"><Photo src={heroOf(0)} height={100} /></div>}
            {layout === "gallery_two" && <div className="mt-5 grid grid-cols-2 gap-2">{[0, 1].map((i) => <div key={i} className="overflow-hidden rounded"><Photo src={heroOf(i)} height={120} /></div>)}</div>}
            {layout === "gallery_three" && <div className="mt-5 grid grid-cols-3 gap-2">{[1, 2, 3].map((i) => <div key={i} className="overflow-hidden rounded"><Photo src={heroOf(i)} height={92} /></div>)}</div>}
            {offer}<div className="mt-6">{action()}</div>
          </div>
        </>
      )}
      <div className="border-t border-border bg-background px-6 py-4 text-[11px] text-muted-foreground">Holiday Inn New York City – Times Square · Unsubscribe</div>
    </div>
  );
}

export function templateEmailContent(template: EmailTemplate): EmailContent {
  return {
    templateId: template.id,
    layout: template.layout,
    subject: template.heading,
    preheader: template.desc,
    heading: template.heading,
    body: template.body,
    ctaLabel: template.ctaLabel,
    ctaUrl: "https://directful.com/book",
    mediaIds: [],
  };
}