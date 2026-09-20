import { Gift, Sparkles, Tag } from "lucide-react";
import {
  BANNER_THEMES,
  CODE_TYPE_LABEL,
  CURRENT_USER,
  bannerTemplateOf,
  promotionValidity,
  useMarketing,
  type BannerTheme,
  type Promotion,
} from "@/lib/marketing";

type BannerPromotion = Pick<Promotion, "name" | "code" | "codeType" | "discountPercent" | "minNights" | "tagline"> &
  Partial<Promotion>;

/** Deterministic banner tint so every offer keeps the same colour everywhere. */
export function bannerTheme(seed: string, chosen?: string) {
  const picked = BANNER_THEMES.find((theme) => theme.id === chosen);
  if (picked) return picked;
  let n = 0;
  for (let i = 0; i < seed.length; i += 1) n = (n + seed.charCodeAt(i)) % 997;
  return BANNER_THEMES[n % BANNER_THEMES.length];
}

export function bannerTint(seed: string, chosen?: string) {
  return bannerTheme(seed, chosen).gradient;
}

function defaultKicker(fullName: string) {
  const first = fullName.split(" ")[0]?.toUpperCase() ?? "GUEST";
  return `${first}, YOU UNLOCKED`;
}

function useBannerArt(promotion: BannerPromotion) {
  const { media } = useMarketing();
  const pick = (id?: string) => media.find((m) => m.id === id && m.type === "image")?.url;
  return { logo: pick(promotion.logoId), photo: pick(promotion.bannerImageId) };
}

type BannerCtx = {
  promotion: BannerPromotion;
  kicker: string;
  propertyName: string;
  headline: string;
  theme: BannerTheme;
  logo?: string;
  photo?: string;
};

function RibbonBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo } = ctx;
  return (
    <div className={`relative bg-gradient-to-br ${theme.gradient} px-4 py-7`}>
      {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-20" />}
      <div className="relative flex items-start justify-between gap-2">
        {logo ? (
          <img src={logo} alt="" loading="lazy" className="size-9 rounded-full bg-white/95 object-contain p-1 shadow-sm" />
        ) : (
          <span className="size-9" />
        )}
        <p className="text-right text-[11px] font-semibold text-white/90">{propertyName}</p>
      </div>
      <div className="relative mt-5 pb-3">
        <span className="absolute -top-3 left-1 z-10 -rotate-[4deg] rounded-[3px] bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-foreground shadow-sm">
          {kicker}
        </span>
        <div className={`rotate-[-2deg] rounded-[3px] ${theme.ribbon} px-4 py-4 pl-8 shadow-md`}>
          <p className="text-[19px] font-extrabold uppercase leading-tight tracking-wide text-white">{headline}</p>
        </div>
      </div>
    </div>
  );
}

function TicketBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className={`relative bg-gradient-to-br ${theme.gradient} px-4 py-5`}>
      {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-15" />}
      <div className="relative flex items-stretch gap-3">
        <div className="min-w-0 flex-1 text-white">
          {logo && (
            <img src={logo} alt="" loading="lazy" className="size-8 rounded-full bg-white/95 object-contain p-0.5 shadow-sm" />
          )}
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/80">{kicker}</p>
          <p className="mt-1.5 text-[16px] font-extrabold uppercase leading-tight">{headline}</p>
        </div>
        <div className="flex w-[92px] shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-white/50 pl-3 text-center text-white">
          <p className="text-[19px] font-extrabold leading-none">{promotion.discountPercent ? `${promotion.discountPercent}%` : "★"}</p>
          <p className="mt-1.5 break-all text-[10px] font-bold uppercase tracking-wider">{promotion.code || "OFFER"}</p>
        </div>
      </div>
      <p className="relative mt-3 text-right text-[10px] font-semibold text-white/85">{propertyName}</p>
    </div>
  );
}

function SpotlightBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className={`relative min-h-[158px] bg-gradient-to-br ${theme.gradient} px-4 py-6`}>
      {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
      <div className="relative flex min-h-[134px] flex-col items-center justify-center text-center text-white">
        {logo && (
          <img src={logo} alt="" loading="lazy" className="size-11 rounded-full bg-white/95 object-contain p-1 shadow" />
        )}
        <p className="mt-2 text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/85">
          {propertyName} · {kicker}
        </p>
        <p className="mt-1.5 max-w-[95%] text-[17px] font-extrabold uppercase leading-tight [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          {headline}
        </p>
        {promotion.discountPercent ? (
          <span className="mt-2.5 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold" style={{ color: theme.swatch }}>
            {promotion.discountPercent}% OFF
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FrameBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className={`relative bg-gradient-to-br ${theme.gradient} p-2.5`}>
      {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-10" />}
      <div className="relative rounded-[3px] border-2 border-white/70 bg-card px-4 py-5 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{propertyName}</p>
        {logo && <img src={logo} alt="" loading="lazy" className="mx-auto mt-2 size-12 object-contain" />}
        <p className="mt-2 text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.swatch }}>
          {kicker}
        </p>
        <p className="mt-1 text-[17px] font-extrabold uppercase leading-tight text-foreground">{headline}</p>
        <span
          className="mt-3 inline-block rounded-sm px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: theme.swatch }}
        >
          {promotion.code || "OFFER"}
        </span>
      </div>
    </div>
  );
}

function MinimalBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, promotion } = ctx;
  return (
    <div className="relative bg-card px-4 pb-4 pt-5">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      <div className="flex items-center gap-4">
        <div className="shrink-0 text-center">
          <p className="text-[30px] font-extrabold leading-none" style={{ color: theme.swatch }}>
            {promotion.discountPercent ? `${promotion.discountPercent}%` : "★"}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {promotion.discountPercent ? "off" : "offer"}
          </p>
        </div>
        <div className="min-w-0 flex-1 border-l border-border pl-4">
          <p className="truncate text-[9.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {kicker} · {propertyName}
          </p>
          <p className="mt-1 text-[15.5px] font-extrabold uppercase leading-tight text-foreground">{headline}</p>
          {logo && <img src={logo} alt="" loading="lazy" className="mt-2 size-7 object-contain" />}
        </div>
      </div>
    </div>
  );
}

function SplitBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className="grid min-h-[150px] grid-cols-[42%_58%] bg-card">
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="relative grid h-full place-items-center p-3">
          {logo ? <img src={logo} alt="" loading="lazy" className="max-h-14 max-w-[72px] rounded bg-card/90 object-contain p-1.5" /> : <span className="text-[28px] font-black text-white">{promotion.discountPercent ? `${promotion.discountPercent}%` : "★"}</span>}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center px-4 py-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{propertyName}</p>
        <p className="mt-2 text-[9.5px] font-bold uppercase" style={{ color: theme.swatch }}>{kicker}</p>
        <p className="mt-1 text-[16px] font-extrabold uppercase leading-tight text-foreground">{headline}</p>
        {promotion.code && <p className="mt-3 text-[10.5px] font-semibold text-muted-foreground">Use {promotion.code}</p>}
      </div>
    </div>
  );
}

function EditorialBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, promotion } = ctx;
  return (
    <div className="relative overflow-hidden bg-card px-5 py-6">
      <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: theme.swatch }} />
      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{propertyName} · {kicker}</p>
          <p className="mt-2 max-w-[320px] text-[22px] font-black uppercase leading-[1.05] text-foreground">{headline}</p>
          <p className="mt-3 text-[11px] font-semibold" style={{ color: theme.swatch }}>{promotion.discountPercent ? `${promotion.discountPercent}% off` : "Exclusive guest offer"}</p>
        </div>
        {logo && <img src={logo} alt="" loading="lazy" className="size-11 shrink-0 object-contain" />}
      </div>
    </div>
  );
}

function BadgeBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className={`relative min-h-[170px] overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0 bg-foreground/45" />
      <div className="relative flex min-h-[170px] items-center justify-center p-5 text-center">
        <div className="grid size-32 place-items-center rounded-full border border-white/60 bg-card/95 p-4 shadow-lift">
          {logo && <img src={logo} alt="" loading="lazy" className="h-6 max-w-16 object-contain" />}
          <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{kicker}</p>
          <p className="text-[14px] font-black uppercase leading-tight text-foreground">{headline}</p>
          <p className="text-[9px] font-semibold" style={{ color: theme.swatch }}>{promotion.discountPercent ? `${promotion.discountPercent}% OFF` : propertyName}</p>
        </div>
      </div>
    </div>
  );
}

function UpgradeBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className="bg-card">
      <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 to-foreground/15" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-white/80">{kicker}</p>
          <p className="mt-1 text-[15px] font-semibold leading-tight">{headline}</p>
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          {logo ? <img src={logo} alt="" loading="lazy" className="size-8 shrink-0 rounded-md object-contain" /> : <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-soft text-[15px]">▣</span>}
          <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Room upgrade</p><p className="text-[13px] font-semibold text-foreground">{promotion.name}</p></div>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-md bg-muted/60 px-3 py-2.5 text-[10px]">
          <span className="text-muted-foreground">Your stay</span><span style={{ color: theme.swatch }}>→</span><span className="text-right font-semibold" style={{ color: theme.swatch }}>{promotion.discountPercent ? `${promotion.discountPercent}% saving` : "Upgraded stay"}</span>
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">{promotion.detail}</p>
        <p className="mt-2 text-[9.5px] font-medium text-muted-foreground">{propertyName}</p>
      </div>
    </div>
  );
}

function ScheduleBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  return (
    <div className="bg-card">
      <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        {photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="relative flex h-full flex-col justify-end p-3 text-white"><p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-white/80">{kicker}</p><p className="mt-1 text-[15px] font-semibold leading-tight">{headline}</p></div>
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2.5">{logo ? <img src={logo} alt="" loading="lazy" className="size-8 rounded-md object-contain" /> : <span className="grid size-8 rounded-md bg-brand-soft place-items-center text-brand">◷</span>}<div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Flexible timing</p><p className="text-[13px] font-semibold text-foreground">{promotion.name}</p></div></div>
        <div className="mt-3 rounded-md bg-muted/60 px-3 py-2.5"><div className="flex justify-between text-[9.5px] text-muted-foreground"><span>11:00</span><strong style={{ color: theme.swatch }}>Your stay</strong><span>15:00</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card"><span className="block h-full w-2/3 rounded-full" style={{ backgroundColor: theme.swatch }} /></div></div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">{promotion.detail}</p>
        <p className="mt-2 text-[9.5px] font-medium text-muted-foreground">{propertyName}</p>
      </div>
    </div>
  );
}

function IncludedBanner({ ctx }: { ctx: BannerCtx }) {
  const { theme, kicker, propertyName, headline, logo, photo, promotion } = ctx;
  const benefits = [promotion.detail, promotion.discountPercent ? `${promotion.discountPercent}% off your stay` : "Included with this offer", promotion.minNights ? `Available for stays of ${promotion.minNights}+ nights` : "Available on eligible stays"];
  return (
    <div className="bg-card">
      <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${theme.gradient}`}>{photo && <img src={photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-foreground/75 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-3 text-white"><p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-white/80">{kicker}</p><p className="mt-1 text-[15px] font-semibold leading-tight">{headline}</p></div></div>
      <div className="p-3.5"><div className="flex items-center gap-2.5">{logo ? <img src={logo} alt="" loading="lazy" className="size-8 rounded-md object-contain" /> : <span className="grid size-8 place-items-center rounded-md bg-brand-soft text-brand">◇</span>}<div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Included perks</p><p className="text-[13px] font-semibold text-foreground">{promotion.name}</p></div></div><div className="mt-3 space-y-1.5">{benefits.map((benefit) => <p key={benefit} className="flex gap-2 text-[10.5px] leading-relaxed text-muted-foreground"><span style={{ color: theme.swatch }}>✓</span><span>{benefit}</span></p>)}</div><p className="mt-2 text-[9.5px] font-medium text-muted-foreground">{propertyName}</p></div>
    </div>
  );
}

function NeonTicketBanner({ ctx }: { ctx: BannerCtx }) {
  const { kicker, propertyName, headline, promotion } = ctx;
  return (
    <div className="relative min-h-[320px] overflow-hidden bg-zinc-950 px-6 py-7 text-white">
      <Tag className="absolute left-7 top-7 size-10 rotate-[-12deg] rounded-full bg-cyan-400 p-2 text-zinc-950" />
      <div className="absolute -right-5 -top-6 grid size-28 place-items-center [clip-path:polygon(50%_0%,59%_13%,72%_5%,77%_20%,93%_18%,89%_34%,100%_43%,87%_53%,94%_67%,78%_69%,76%_85%,62%_78%,51%_92%,41%_78%,26%_86%,22%_70%,6%_67%,14%_52%,1%_42%,15%_33%,10%_18%,27%_20%,32%_4%,43%_14%)] bg-fuchsia-400 text-4xl font-black text-white">%</div>
      <p className="text-center text-[12px] font-bold uppercase tracking-[0.25em]">{kicker}</p>
      <div className="relative mx-auto mt-8 max-w-[300px] bg-gradient-to-br from-yellow-100 via-cyan-100 to-violet-200 px-7 py-8 text-zinc-950 [clip-path:polygon(7%_0,93%_0,95%_8%,100%_10%,96%_16%,100%_22%,96%_28%,100%_34%,96%_40%,100%_46%,96%_52%,100%_58%,96%_64%,100%_70%,96%_76%,100%_82%,95%_88%,93%_100%,7%_100%,5%_92%,0_90%,4%_84%,0_78%,4%_72%,0_66%,4%_60%,0_54%,4%_48%,0_42%,4%_36%,0_30%,4%_24%,0_18%,4%_12%,5%_7%)]">
        <p className="text-center font-serif text-[26px] font-black uppercase leading-[0.95]">{headline}</p>
        <div className="mt-7 flex items-end justify-between gap-3"><span className="h-8 w-28 bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_5px)]" /><span className="text-[8px] tracking-[0.2em]">{promotion.code}</span></div>
      </div>
      <p className="mt-8 text-center text-[11px] uppercase tracking-[0.18em]">{promotion.endsAt ? `Until ${promotionValidity(promotion as Promotion).replace("Ends ", "")}` : propertyName}</p>
      <Sparkles className="absolute bottom-12 right-10 size-7 text-amber-300" />
    </div>
  );
}

function TapeSaleBanner({ ctx }: { ctx: BannerCtx }) {
  const { kicker, propertyName, promotion } = ctx;
  return (
    <div className="relative min-h-[330px] overflow-hidden bg-red-700 px-6 py-8 text-center text-white">
      <p className="text-[11px] font-bold uppercase">{kicker}</p>
      <p className="mt-2 text-[82px] font-black leading-[0.78]">{promotion.discountPercent ?? 50}%</p>
      <p className="text-[66px] font-black leading-none">OFF</p>
      <div className="absolute inset-x-[-12%] top-[45%] rotate-[-5deg] bg-amber-400 py-1.5 text-[10px] font-bold uppercase text-white">{propertyName} · {promotion.name} · {propertyName} · {promotion.name}</div>
      <p className="mt-4 text-[24px] font-black uppercase">{promotion.tagline || "Your next stay"}</p>
      <span className="mt-6 inline-block bg-amber-400 px-5 py-2 text-[11px] font-bold uppercase">Use {promotion.code}</span>
      <p className="mt-3 text-[10px] font-semibold uppercase">{promotionValidity(promotion as Promotion)}</p>
    </div>
  );
}

function CouponNoteBanner({ ctx }: { ctx: BannerCtx }) {
  const { headline, promotion } = ctx;
  return (
    <div className="grid min-h-[260px] place-items-center bg-card px-7 py-10 text-center">
      <div className="relative w-full max-w-[280px] rounded-2xl border-2 border-sky-500 bg-card px-6 py-8 shadow-[10px_10px_0_0_var(--color-brand-soft)] before:absolute before:-left-3 before:top-1/2 before:size-6 before:-translate-y-1/2 before:rounded-full before:border-r-2 before:border-sky-500 before:bg-card after:absolute after:-right-3 after:top-1/2 after:size-6 after:-translate-y-1/2 after:rounded-full after:border-l-2 after:border-sky-500 after:bg-card">
        <p className="text-[22px] font-bold leading-tight text-foreground">{headline}</p>
        <p className="mt-6 text-[11px] text-muted-foreground">Use {CODE_TYPE_LABEL[promotion.codeType ?? "promo"].toLowerCase()}:</p>
        <div className="my-4 border-t border-dashed border-border" />
        <p className="font-mono text-[18px] tracking-wide text-foreground">{promotion.code}</p>
      </div>
    </div>
  );
}

function StackedPosterBanner({ ctx }: { ctx: BannerCtx }) {
  const { kicker, headline, promotion } = ctx;
  return (
    <div className="relative min-h-[350px] overflow-hidden bg-cyan-100 px-8 py-7 text-center text-zinc-800">
      <p className="text-[9px] font-bold uppercase tracking-[0.28em]">{kicker}</p>
      <p className="mt-4 text-[15px] font-bold uppercase tracking-[0.25em]">{headline}</p>
      <div className="mx-auto mt-4 max-w-[300px] bg-rose-400 px-3 pb-6 pt-3 text-white [clip-path:polygon(0_7%,12%_3%,12%_0,21%_7%,43%_0,52%_7%,66%_0,78%_7%,89%_0,100%_9%,100%_100%,0_100%)]">
        <p className="text-[76px] font-black leading-[0.83] [text-shadow:-9px_8px_0_rgba(120,55,85,.35)]">{promotion.discountPercent ?? 15}%</p>
        <p className="text-[70px] font-black leading-[0.9]">OFF</p>
        <p className="mt-2 text-[18px] font-bold uppercase tracking-[0.22em]">{promotion.name}</p>
        <p className="mt-5 text-[10px] font-semibold tracking-[0.15em]">USE CODE: {promotion.code}</p>
        <span className="mt-5 inline-block bg-card px-8 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800">Book now →</span>
      </div>
    </div>
  );
}

function ClassicVoucherBanner({ ctx }: { ctx: BannerCtx }) {
  const { headline, kicker, propertyName, promotion } = ctx;
  return (
    <div className="min-h-[340px] bg-slate-400 px-7 py-8 text-center text-stone-100">
      <p className="text-[12px] font-semibold">{propertyName}</p>
      <p className="mt-2 font-serif text-[28px] font-bold uppercase">{headline}</p>
      <div className="mx-auto mt-8 flex max-w-[330px] rotate-[-3deg] bg-stone-100 text-slate-500 [clip-path:polygon(3%_0,97%_0,100%_8%,97%_16%,100%_24%,97%_32%,100%_40%,97%_48%,100%_56%,97%_64%,100%_72%,97%_80%,100%_88%,97%_100%,3%_100%,0_90%,3%_82%,0_74%,3%_66%,0_58%,3%_50%,0_42%,3%_34%,0_26%,3%_18%,0_10%)]">
        <div className="flex-1 px-5 py-7"><p className="text-[11px] font-bold uppercase italic">{kicker}</p><p className="mt-2 font-serif text-[54px] leading-none">{promotion.discountPercent ? `${promotion.discountPercent}%` : promotion.code}</p><p className="mt-3 text-[9px]">{promotionValidity(promotion as Promotion)}</p></div>
        <div className="grid w-20 place-items-center border-l-2 border-dashed border-slate-400"><span className="grid size-14 place-items-center rounded-full bg-slate-500 text-[15px] font-bold text-stone-100">GET</span></div>
      </div>
      <p className="mt-9 text-right font-serif text-[12px]">{promotion.detail}</p>
    </div>
  );
}

function FashionSaleBanner({ ctx }: { ctx: BannerCtx }) {
  const { kicker, propertyName, promotion } = ctx;
  return (
    <div className="bg-card px-6 py-7 text-center text-foreground">
      <p className="font-serif text-[23px]">{propertyName}</p>
      <div className="mt-6 bg-muted px-5 py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]">{kicker}</p>
        <p className="mt-2 font-serif text-[20px] italic">take</p>
        <div className="flex items-center justify-center"><span className="text-[88px] font-black leading-none">{promotion.discountPercent ?? 70}</span><span className="text-left text-[35px] font-black leading-[0.8]">%<br/><small className="text-[21px]">OFF</small></span></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]">{promotion.name}</p>
        <p className="mx-auto mt-5 max-w-[250px] text-[9px] uppercase tracking-[0.18em]">{promotion.detail}</p>
        <span className="mt-6 inline-block border-2 border-foreground px-6 py-2 text-[11px] font-bold uppercase tracking-[0.18em]">Use {promotion.code}</span>
      </div>
    </div>
  );
}

function SplitSaleBanner({ ctx }: { ctx: BannerCtx }) {
  const { headline, kicker, promotion } = ctx;
  return (
    <div className="relative min-h-[220px] bg-red-600 p-5 text-stone-100"><div className="flex min-h-[180px] items-center border border-stone-100/70 px-6 py-5">
      <div className="w-1/2 border-r border-stone-100/70 pr-5"><p className="font-serif text-[34px] uppercase leading-[0.9]">{kicker}</p><p className="font-serif text-[32px] italic">Only!</p></div>
      <div className="w-1/2 pl-6"><p className="font-serif text-[16px] italic">extra</p><p className="font-serif text-[64px] leading-[0.75]">{promotion.discountPercent ?? 40}%</p><p className="font-serif text-[18px] uppercase">Off {headline}</p></div>
      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card px-6 py-1 text-[9px] font-bold uppercase text-red-600">{promotion.code}</span>
    </div></div>
  );
}

function TypeCouponBanner({ ctx }: { ctx: BannerCtx }) {
  const { promotion } = ctx;
  return (
    <div className="min-h-[340px] bg-stone-100 px-6 py-6 text-zinc-950">
      <div className="flex items-center gap-4"><span className="h-4 flex-1 bg-zinc-950 [clip-path:polygon(0_25%,85%_25%,85%_0,100%_50%,85%_100%,85%_75%,0_75%)]"/><span className="text-[10px] tracking-wide">{promotion.code}</span><span className="h-4 flex-1 rotate-180 bg-zinc-950 [clip-path:polygon(0_25%,85%_25%,85%_0,100%_50%,85%_100%,85%_75%,0_75%)]"/></div>
      <p className="mt-5 text-[104px] font-black leading-[0.74] tracking-tight">{promotion.discountPercent ?? 15}%</p>
      <div className="mt-5 grid grid-cols-[1fr_1.35fr] items-stretch"><div className="grid aspect-square place-items-center rounded-full border-[14px] border-zinc-950 p-3 text-center text-[14px] leading-tight">Your<br/>one-time<br/>{CODE_TYPE_LABEL[promotion.codeType ?? "promo"]}</div><p className="text-[108px] font-black leading-[0.68]">OFF</p></div>
    </div>
  );
}

function GiftOfferBanner({ ctx }: { ctx: BannerCtx }) {
  const { kicker, headline, promotion } = ctx;
  return (
    <div className="bg-stone-100 p-4"><div className="min-h-[300px] bg-sky-950 px-6 py-7 text-center text-stone-100">
      <p className="text-[12px] uppercase tracking-[0.25em]">{kicker}</p>
      <div className="relative mx-auto mt-8 w-56 pt-16"><div className="absolute left-8 top-0 h-20 w-20 rotate-[-35deg] rounded-[70%_15%] bg-stone-100"/><div className="absolute right-8 top-0 h-20 w-20 rotate-[35deg] rounded-[15%_70%] bg-stone-100"/><div className="relative rounded-b-lg rounded-t-3xl bg-stone-100 px-5 py-5 text-sky-950"><Gift className="mx-auto mb-1 size-5"/><p className="text-[10px] font-bold uppercase tracking-[0.2em]">{headline}</p><p className="mt-1 text-[54px] leading-none">{promotion.discountPercent ?? 25}%</p><p className="text-[44px] leading-none">OFF</p></div></div>
    </div><div className="px-4 py-5 text-center text-sky-950"><p className="text-[22px] uppercase tracking-[0.22em]">{promotion.name}</p><p className="mt-1 text-[11px] uppercase tracking-[0.2em]">Use {promotion.code}</p></div></div>
  );
}

function BannerFooter({ promotion, showCode = true, showDescription = true }: { promotion: BannerPromotion; showCode?: boolean; showDescription?: boolean }) {
  return (
    <div className="space-y-1 border-t border-border/60 px-3.5 py-2.5">
      {showDescription && promotion.detail && <p className="text-[11px] leading-relaxed text-card-foreground">{promotion.detail}</p>}
      {showCode && (
        <p className="text-[11.5px] font-semibold text-card-foreground">
          {CODE_TYPE_LABEL[promotion.codeType ?? "promo"]}: {promotion.code || "—"}
        </p>
      )}
      <p className="text-[10.5px] text-muted-foreground">
        {promotion.discountPercent ? `${promotion.discountPercent}% off` : "No discount set"}
        {promotion.minNights ? ` · min ${promotion.minNights} night${promotion.minNights === 1 ? "" : "s"}` : ""}
      </p>
      <p className="text-[10.5px] text-muted-foreground">{promotionValidity(promotion as Promotion)}</p>
    </div>
  );
}

/**
 * The offer banner a guest sees. Eight layout templates, eight colour themes,
 * optional logo and background photo from the media library, and fully
 * editable wording. Used as the live preview while an offer is being edited
 * and as the visual for an offer everywhere else.
 */
export function PromoBanner({
  promotion,
  property = "Your hotel",
  className = "",
}: {
  promotion: BannerPromotion;
  property?: string;
  className?: string;
}) {
  const template = bannerTemplateOf(promotion);
  const { logo, photo } = useBannerArt(promotion);
  const kicker = promotion.kicker?.trim() || defaultKicker(CURRENT_USER.name);
  const propertyName = promotion.propertyName?.trim() || property;
  const headline = (promotion.tagline || promotion.name || "The best rate").toUpperCase();
  const theme = bannerTheme(promotion.code || promotion.name || "offer", promotion.bannerStyle);
  const ctx: BannerCtx = { promotion, kicker, propertyName, headline, theme, logo, photo };

  const body =
    template === "neon-ticket" ? (
      <NeonTicketBanner ctx={ctx} />
    ) : template === "tape-sale" ? (
      <TapeSaleBanner ctx={ctx} />
    ) : template === "coupon-note" ? (
      <CouponNoteBanner ctx={ctx} />
    ) : template === "stacked-poster" ? (
      <StackedPosterBanner ctx={ctx} />
    ) : template === "classic-voucher" ? (
      <ClassicVoucherBanner ctx={ctx} />
    ) : template === "fashion-sale" ? (
      <FashionSaleBanner ctx={ctx} />
    ) : template === "split-sale" ? (
      <SplitSaleBanner ctx={ctx} />
    ) : template === "type-coupon" ? (
      <TypeCouponBanner ctx={ctx} />
    ) : template === "gift-offer" ? (
      <GiftOfferBanner ctx={ctx} />
    ) : template === "ticket" ? (
      <TicketBanner ctx={ctx} />
    ) : template === "spotlight" ? (
      <SpotlightBanner ctx={ctx} />
    ) : template === "frame" ? (
      <FrameBanner ctx={ctx} />
    ) : template === "minimal" ? (
      <MinimalBanner ctx={ctx} />
    ) : template === "split" ? (
      <SplitBanner ctx={ctx} />
    ) : template === "editorial" ? (
      <EditorialBanner ctx={ctx} />
    ) : template === "badge" ? (
      <BadgeBanner ctx={ctx} />
    ) : template === "upgrade" ? (
      <UpgradeBanner ctx={ctx} />
    ) : template === "schedule" ? (
      <ScheduleBanner ctx={ctx} />
    ) : template === "included" ? (
      <IncludedBanner ctx={ctx} />
    ) : (
      <RibbonBanner ctx={ctx} />
    );

  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-card shadow-card ${className}`}>
      {body}
      <BannerFooter promotion={promotion} showCode={template !== "ticket"} showDescription={!(["upgrade", "schedule", "included"] as string[]).includes(template)} />
    </div>
  );
}
