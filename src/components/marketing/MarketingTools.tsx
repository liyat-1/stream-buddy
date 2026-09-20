import { useState } from "react";
import { Layers, Gift, Image, Layout } from "lucide-react";
import { StrategyOverlay } from "./StrategyOverlay";
import { PromoDropOverlay } from "./PromoDropOverlay";
import { MediaAssignOverlay } from "./MediaAssignOverlay";
import { TemplateDropOverlay } from "./TemplateDropOverlay";
import { Button } from "@/components/ui/button";
import {
  campaignMediaIds,
  campaignTemplateId,
  campaignPromotionIds,
  useMarketing,
  type MarketingCampaign,
} from "@/lib/marketing";

function ToolButton({
  icon: Icon,
  title,
  summary,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  summary: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-3 text-left shadow-card transition-colors hover:border-brand/45 hover:bg-muted/40"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-brand-soft text-brand">
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-card-foreground">{title}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{summary}</span>
      </span>
    </button>
  );
}

/**
 * Tool rail above the campaign grid: one channel-strategy launcher plus direct
 * management buttons for promotions and text media. All guidance lives inside
 * the overlays each button opens.
 */
export function MarketingTools({ campaigns }: { campaigns: MarketingCampaign[] }) {
  const [overlay, setOverlay] = useState<"strategy" | "promo" | "media" | "template" | null>(null);

  const withPromo = campaigns.filter((c) => {
    const ids = campaignPromotionIds(c);
    return ids.direct || ids.ota;
  });
  const withMedia = campaigns.filter((c) => campaignMediaIds(c).length > 0);
  const withTemplate = campaigns.filter((c) => Boolean(campaignTemplateId(c)));

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <ToolButton
        icon={Layers}
        title="Manage channel strategy"
        summary={`How each of the ${campaigns.length} campaigns is delivered`}
        onClick={() => setOverlay("strategy")}
      />
      <ToolButton
        icon={Gift}
        title="Manage promos"
        summary={`${withPromo.length} of ${campaigns.length} campaigns carry an offer`}
        onClick={() => setOverlay("promo")}
      />
      <ToolButton
        icon={Layout}
        title="Select email template"
        summary={`${withTemplate.length} of ${campaigns.length} campaigns use a saved template`}
        onClick={() => setOverlay("template")}
      />
      <ToolButton
        icon={Image}
        title="Text media"
        summary={`${withMedia.length} of ${campaigns.length} campaigns have a file attached`}
        onClick={() => setOverlay("media")}
      />

      <StrategyOverlay open={overlay === "strategy"} campaigns={campaigns} onClose={() => setOverlay(null)} />
      {overlay === "promo" && <PromoDropOverlay campaigns={campaigns} onClose={() => setOverlay(null)} />}
      {overlay === "template" && <TemplateDropOverlay campaigns={campaigns} onClose={() => setOverlay(null)} />}
      {overlay === "media" && <MediaAssignOverlay campaigns={campaigns} onClose={() => setOverlay(null)} />}
    </div>
  );
}
