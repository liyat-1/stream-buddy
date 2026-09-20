import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";
import { PromoBanner } from "@/components/marketing/PromoBanner";
import { renderPreview, type Promotion } from "@/lib/marketing";

export function LandingPreview({
  campaignName,
  purpose,
  timing,
  heading,
  body,
  imageUrl,
  promotion,
  scale = 0.55,
}: {
  campaignName: string;
  purpose: string;
  timing: string;
  heading: string;
  body: string;
  imageUrl?: string | null;
  promotion?: Promotion | null;
  scale?: number;
}) {
  return (
    <PhoneMockup scale={scale} statusBar contentClassName="bg-background">
      <main className="min-h-full bg-background pb-8">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Holiday Inn</p><p className="text-[16px] font-semibold text-card-foreground">Times Square</p></div>
          <span className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-card-foreground">My stay</span>
        </header>
        {promotion ? (
          <div className="px-5 pt-5"><PromoBanner promotion={promotion} property="Holiday Inn Times Square" className="shadow-lift" /></div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Hotel experience" className="h-52 w-full object-cover" />
        ) : (
          <div className="grid h-36 place-items-center bg-brand-soft px-8 text-center"><p className="text-[22px] font-semibold leading-tight text-card-foreground">{campaignName}</p></div>
        )}
        <section className="px-6 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">{promotion ? promotion.kicker || "Exclusive guest offer" : timing}</p>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight text-card-foreground">{promotion ? promotion.tagline || promotion.name : renderPreview(heading)}</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{promotion ? promotion.detail : renderPreview(body || purpose)}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-card p-3"><CalendarDays size={15} className="text-brand" /><p className="mt-2 text-[10px] uppercase text-muted-foreground">Timing</p><p className="mt-0.5 text-[12px] font-semibold text-card-foreground">{timing}</p></div>
            <div className="rounded-md border border-border bg-card p-3"><MapPin size={15} className="text-brand" /><p className="mt-2 text-[10px] uppercase text-muted-foreground">Property</p><p className="mt-0.5 text-[12px] font-semibold text-card-foreground">Times Square</p></div>
          </div>
          {promotion?.code && <div className="mt-4 rounded-md border border-dashed border-brand/50 bg-brand-soft p-3 text-center"><p className="text-[10px] uppercase text-muted-foreground">Guest code</p><p className="mt-1 text-[17px] font-bold text-brand">{promotion.code}</p></div>}
          <button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3.5 text-[14px] font-semibold text-brand-foreground shadow-card">{promotion ? "Book this offer" : "Continue"}<ArrowRight size={16} /></button>
          <p className="mt-5 text-center text-[10.5px] leading-relaxed text-muted-foreground">Best rate promise · Flexible booking · Direct hotel support</p>
        </section>
      </main>
    </PhoneMockup>
  );
}