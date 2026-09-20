import { useState } from "react";
import { Ban, Check, Gift, GripVertical, Info, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BulkDragChips } from "./BulkDragChips";
import {
  CAMPAIGN_BULK_DRAG_TYPE,
  CAMPAIGN_DRAG_TYPE,
  GROUP_META,
  setVariantPromotion,
  useMarketing,
  type AudienceKey,
  type BulkScope,
  type CampaignGroup,
  type MarketingCampaign,
  type Promotion,
} from "@/lib/marketing";

const GROUPS: CampaignGroup[] = ["invites", "transactional", "in_property"];
const AUDIENCE_KEYS: AudienceKey[] = ["direct", "ota"];
const AUDIENCE_SHORT: Record<AudienceKey, string> = { direct: "Direct", ota: "OTA" };

/** Guest segments of a campaign that carry no offer yet. */
const freeAudiences = (campaign: MarketingCampaign): AudienceKey[] =>
  AUDIENCE_KEYS.filter((audience) => campaign.variants[audience].promotionMode !== "custom");

const onPromotion = (campaign: MarketingCampaign, promotionId: string): AudienceKey[] =>
  AUDIENCE_KEYS.filter(
    (audience) =>
      campaign.variants[audience].promotionMode === "custom" &&
      campaign.variants[audience].promotionId === promotionId,
  );

/**
 * Assignment board for one offer: campaigns still free on the left, then one
 * column per campaign section. Drag a campaign (or a whole collection) into a
 * section to give it this offer, and use the segment boxes to fine-tune it.
 */
export function PromotionAssignOverlay({
  promotion,
  onClose,
}: {
  promotion: Promotion;
  onClose: () => void;
}) {
  const { campaigns, promotions } = useMarketing();
  const [dragging, setDragging] = useState<string | null>(null);
  const [bulk, setBulk] = useState<BulkScope | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const available = campaigns.filter(
    (campaign) => freeAudiences(campaign).length > 0 && onPromotion(campaign, promotion.id).length === 0,
  );
  const assigned = campaigns.filter((campaign) => onPromotion(campaign, promotion.id).length > 0);

  const otherOffer = (campaign: MarketingCampaign, audience: AudienceKey) => {
    const id = campaign.variants[audience].promotionId;
    if (campaign.variants[audience].promotionMode !== "custom" || !id || id === promotion.id) return null;
    return promotions.find((p) => p.id === id)?.name ?? "another offer";
  };

  const beginDrag = (event: React.DragEvent, campaignId: string) => {
    event.dataTransfer.setData(CAMPAIGN_DRAG_TYPE, campaignId);
    event.dataTransfer.setData("text/plain", campaignId);
    event.dataTransfer.effectAllowed = "move";
    setDragging(campaignId);
  };

  const allow = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const scopeOf = (event: React.DragEvent): BulkScope | null =>
    (event.dataTransfer.getData(CAMPAIGN_BULK_DRAG_TYPE) as BulkScope) || bulk;

  const idOf = (event: React.DragEvent) => {
    if (scopeOf(event)) return null;
    const plain = event.dataTransfer.getData("text/plain");
    return event.dataTransfer.getData(CAMPAIGN_DRAG_TYPE) || (plain.startsWith("bulk:") ? "" : plain) || dragging;
  };

  /** Only still-free segments move, so another offer is never overwritten. */
  const assign = (campaignId: string, group: CampaignGroup) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    if (campaign.group !== group) {
      setNote(`${campaign.name} belongs to ${GROUP_META[campaign.group].title}. Drop it in that section.`);
      return;
    }
    const free = freeAudiences(campaign);
    if (free.length === 0) {
      setNote(`${campaign.name} already carries an offer for both guest segments.`);
      return;
    }
    free.forEach((audience) => setVariantPromotion(campaignId, audience, promotion.id));
    setNote(null);
  };

  const assignCollection = (scope: BulkScope, group: CampaignGroup) => {
    const audiences = scope === "both" ? AUDIENCE_KEYS : [scope];
    const moved = campaigns.filter(
      (c) => c.group === group && audiences.every((a) => c.variants[a].promotionMode !== "custom"),
    );
    moved.forEach((c) => audiences.forEach((a) => setVariantPromotion(c.id, a, promotion.id)));
    setNote(
      moved.length
        ? `${moved.length} campaign${moved.length === 1 ? "" : "s"} now carry this offer.`
        : "Every campaign in that section already carries an offer.",
    );
  };

  const release = (campaignId: string) =>
    onPromotion(campaigns.find((c) => c.id === campaignId) ?? ({} as MarketingCampaign), promotion.id).forEach(
      (audience) => setVariantPromotion(campaignId, audience, null),
    );

  const resetDrag = () => {
    setOver(null);
    setDragging(null);
    setBulk(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
          <Gift size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">Assign campaigns</p>
          <h2 className="truncate text-[17px] font-semibold text-card-foreground">{promotion.name}</h2>
          <p className="flex items-center gap-1.5 truncate text-[11.5px] text-muted-foreground">
            <Tag size={11} /> {promotion.code} · {assigned.length} campaign{assigned.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button variant="brand" size="sm" onClick={onClose}>
          Done
        </Button>
      </header>

      <p className="flex items-start gap-2 border-b border-border bg-brand-soft/50 px-4 py-2 text-[11.5px] text-muted-foreground sm:px-6">
        <Info size={13} className="mt-[1px] shrink-0 text-brand" />
        Drag a campaign — or a whole collection — into its section. Direct and OTA guests are handled separately, so a
        segment that already carries another offer is left untouched.
      </p>

      {note && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-amber-500/10 px-4 py-2 text-[12px] text-foreground sm:px-6">
          <span className="min-w-0">{note}</span>
          <button type="button" onClick={() => setNote(null)} aria-label="Dismiss" className="shrink-0 text-muted-foreground hover:text-foreground">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4 p-4 sm:p-5">
        {/* Available campaigns */}
        <section
          onDragOver={(event) => { allow(event); setOver("available"); }}
          onDragLeave={() => setOver((c) => (c === "available" ? null : c))}
          onDrop={(event) => {
            event.preventDefault();
            const scope = scopeOf(event);
            if (scope) {
              const audiences = scope === "both" ? AUDIENCE_KEYS : [scope];
              campaigns.forEach((c) =>
                audiences.forEach((a) => {
                  if (c.variants[a].promotionId === promotion.id) setVariantPromotion(c.id, a, null);
                }),
              );
            } else {
              const id = idOf(event);
              if (id) release(id);
            }
            resetDrag();
          }}
          className={`flex w-[250px] shrink-0 flex-col rounded-xl border p-4 transition-colors sm:w-[270px] ${
            over === "available" ? "border-brand bg-brand-soft" : "border-border bg-card"
          }`}
        >
          <div className="flex items-start gap-2 border-b border-border pb-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Ban size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-card-foreground">Available campaigns</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {available.length} with a free guest segment
              </p>
            </div>
          </div>
          <BulkDragChips count={available.length} onDragStart={setBulk} onDragEnd={resetDrag} />
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
            {available.map((campaign) => {
              const free = freeAudiences(campaign);
              return (
                <article
                  key={campaign.id}
                  draggable
                  onDragStart={(event) => beginDrag(event, campaign.id)}
                  onDragEnd={resetDrag}
                  className={`cursor-grab rounded-md border border-border bg-background px-2.5 py-2.5 shadow-sm active:cursor-grabbing ${
                    dragging === campaign.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={12} className="shrink-0 text-muted-foreground/60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-card-foreground">{campaign.name}</p>
                      <p className="truncate text-[10.5px] text-muted-foreground">{GROUP_META[campaign.group].title}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex gap-1 pl-5">
                    {AUDIENCE_KEYS.map((audience) => {
                      const isFree = free.includes(audience);
                      return (
                        <span
                          key={audience}
                          title={isFree ? `${AUDIENCE_SHORT[audience]} guests are free` : `${AUDIENCE_SHORT[audience]} guests already carry an offer`}
                          className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            isFree
                              ? "border-border text-muted-foreground"
                              : "border-transparent bg-muted text-muted-foreground/40 line-through"
                          }`}
                        >
                          {audience}
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })}
            {available.length === 0 && (
              <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                Drop a campaign here to take this offer off it
              </p>
            )}
          </div>
        </section>

        {/* Section columns */}
        <div className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto pb-1">
          {GROUPS.map((group) => {
            const rows = assigned.filter((campaign) => campaign.group === group);
            return (
              <section
                key={group}
                onDragOver={(event) => { allow(event); setOver(group); }}
                onDragLeave={() => setOver((c) => (c === group ? null : c))}
                onDrop={(event) => {
                  event.preventDefault();
                  const scope = scopeOf(event);
                  if (scope) assignCollection(scope, group);
                  else {
                    const id = idOf(event);
                    if (id) assign(id, group);
                  }
                  resetDrag();
                }}
                className={`flex min-w-[280px] flex-1 flex-col rounded-xl border p-4 transition-colors ${
                  over === group
                    ? "border-brand bg-brand-soft ring-2 ring-brand/30"
                    : "border-brand/30 bg-brand-soft/25"
                }`}
              >
                <div className="border-b border-border pb-2.5">
                  <p className="text-[12.5px] font-semibold text-card-foreground">{GROUP_META[group].title}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                    {rows.length} campaign{rows.length === 1 ? "" : "s"} with this offer
                  </p>
                </div>
                <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
                  {rows.map((campaign) => {
                    const on = onPromotion(campaign, promotion.id);
                    return (
                      <article
                        key={campaign.id}
                        draggable
                        onDragStart={(event) => beginDrag(event, campaign.id)}
                        onDragEnd={resetDrag}
                        className="cursor-grab rounded-md border border-border bg-background px-2.5 py-2 shadow-sm active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical size={12} className="shrink-0 text-muted-foreground/60" />
                          <p className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-card-foreground">
                            {campaign.name}
                          </p>
                          <button
                            type="button"
                            aria-label={`Remove ${campaign.name} from this offer`}
                            onClick={() => release(campaign.id)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <X size={11} />
                          </button>
                        </div>
                        <div className="mt-1.5 flex gap-1 pl-5">
                          {AUDIENCE_KEYS.map((audience) => {
                            const checked = on.includes(audience);
                            const blocked = otherOffer(campaign, audience);
                            return (
                              <label
                                key={audience}
                                title={blocked ? `${AUDIENCE_SHORT[audience]} guests already receive ${blocked}` : undefined}
                                className={`flex cursor-pointer items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                                  checked
                                    ? "border-brand/50 bg-brand-soft text-brand"
                                    : "border-border text-muted-foreground hover:border-brand/40"
                                } ${blocked ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={checked}
                                  disabled={Boolean(blocked)}
                                  onChange={(event) =>
                                    setVariantPromotion(campaign.id, audience, event.target.checked ? promotion.id : null)
                                  }
                                />
                                <span className="grid size-2.5 place-items-center rounded-[2px] border border-current">
                                  {checked && <Check size={8} strokeWidth={3.5} />}
                                </span>
                                {audience}
                              </label>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                  {rows.length === 0 && (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                      Drop a campaign here
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
