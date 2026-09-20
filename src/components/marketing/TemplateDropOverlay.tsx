import { useState } from "react";
import { Ban, GripVertical, Info, Layout, Plus, Repeat2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayoutThumb } from "./LayoutLibrary";
import { TemplateLibrary } from "./TemplateLibrary";
import { BulkDragChips } from "./BulkDragChips";
import {
  CAMPAIGN_BULK_DRAG_TYPE,
  CAMPAIGN_DRAG_TYPE,
  GROUP_META,
  applyTemplateToCampaign,
  campaignTemplateId,
  mutate,
  useMarketing,
  type AudienceKey,
  type BulkScope,
  type EmailTemplate,
  type MarketingCampaign,
} from "@/lib/marketing";

const AUDIENCE_KEYS: AudienceKey[] = ["direct", "ota"];

/** Clears the template link on a campaign without touching its written copy. */
function clearTemplate(campaignId: string) {
  mutate((draft) => {
    const campaign = draft.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    AUDIENCE_KEYS.forEach((audience) => {
      campaign.variants[audience].email.templateId = "";
    });
  });
}

/**
 * Template board: campaigns without a template on the left, one column per
 * email template on the right. Drag campaigns onto a template to apply it —
 * the same model as Manage promos.
 */
export function TemplateDropOverlay({
  campaigns,
  onClose,
}: {
  campaigns: MarketingCampaign[];
  onClose: () => void;
}) {
  const { templates } = useMarketing();
  const ids = new Set(campaigns.map((c) => c.id));
  const live = useMarketing().campaigns.filter((c) => ids.has(c.id));

  const initial = Array.from(new Set(live.map(campaignTemplateId).filter(Boolean)));
  const [columns, setColumns] = useState<string[]>(initial.length ? initial : templates.slice(0, 3).map((t) => t.id));
  const [picking, setPicking] = useState<"new" | string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [bulk, setBulk] = useState<BulkScope | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const unassigned = live.filter((c) => !campaignTemplateId(c));
  const byTemplate = (templateId: string) => live.filter((c) => campaignTemplateId(c) === templateId);
  const templateOf = (id: string) => templates.find((t) => t.id === id) ?? null;

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
    const plain = event.dataTransfer.getData("text/plain");
    return event.dataTransfer.getData(CAMPAIGN_DRAG_TYPE) || (plain.startsWith("bulk:") ? "" : plain) || dragging;
  };

  const resetDrag = () => {
    setOver(null);
    setDragging(null);
    setBulk(null);
  };

  const dropOn = (event: React.DragEvent, templateId: string) => {
    event.preventDefault();
    if (scopeOf(event)) unassigned.forEach((c) => applyTemplateToCampaign(c.id, templateId));
    else {
      const id = idOf(event);
      if (id) applyTemplateToCampaign(id, templateId);
    }
    resetDrag();
  };

  const choose = (template: EmailTemplate) => {
    if (picking === "new") setColumns((c) => (c.includes(template.id) ? c : [...c, template.id]));
    else if (picking) {
      const replacing = picking;
      byTemplate(replacing).forEach((c) => applyTemplateToCampaign(c.id, template.id));
      setColumns((c) => Array.from(new Set(c.map((id) => (id === replacing ? template.id : id)))));
    }
    setPicking(null);
  };

  const card = (campaign: MarketingCampaign, onRemove?: () => void) => (
    <article
      key={campaign.id}
      draggable
      onDragStart={(event) => beginDrag(event, campaign.id)}
      onDragEnd={resetDrag}
      className={`flex cursor-grab items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 shadow-sm active:cursor-grabbing ${
        dragging === campaign.id ? "opacity-50" : ""
      }`}
    >
      <GripVertical size={12} className="shrink-0 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-card-foreground">{campaign.name}</p>
        <p className="truncate text-[10.5px] text-muted-foreground">{GROUP_META[campaign.group].title}</p>
      </div>
      {onRemove && (
        <button type="button" aria-label={`Remove template from ${campaign.name}`} onClick={onRemove} className="shrink-0 text-muted-foreground hover:text-destructive">
          <X size={11} />
        </button>
      )}
    </article>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
          <Layout size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">Email templates</p>
          <h2 className="truncate text-[17px] font-semibold text-card-foreground">Select email template</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPicking("new")}>
          <Plus size={14} />
          Add template
        </Button>
        <Button variant="brand" size="sm" onClick={onClose}>
          Done
        </Button>
      </header>

      <p className="flex items-start gap-2 border-b border-border bg-brand-soft/50 px-4 py-2 text-[11.5px] text-muted-foreground sm:px-6">
        <Info size={13} className="mt-[1px] shrink-0 text-brand" />
        Drag campaigns onto a template to give them that design. Each column shows a miniature of the layout, and you
        can change the template or open its details at any time.
      </p>

      <div className="flex min-h-0 flex-1 gap-4 p-4 sm:p-5">
        {/* Campaigns without a template */}
        <section
          onDragOver={(event) => { allow(event); setOver("none"); }}
          onDragLeave={() => setOver((c) => (c === "none" ? null : c))}
          onDrop={(event) => {
            event.preventDefault();
            const id = idOf(event);
            if (id && !scopeOf(event)) clearTemplate(id);
            resetDrag();
          }}
          className={`flex w-[250px] shrink-0 flex-col rounded-xl border p-4 transition-colors sm:w-[270px] ${
            over === "none" ? "border-brand bg-brand-soft" : "border-border bg-card"
          }`}
        >
          <div className="flex items-start gap-2 border-b border-border pb-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Ban size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-card-foreground">No template</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">{unassigned.length} campaigns waiting</p>
            </div>
          </div>
          <BulkDragChips count={unassigned.length} onDragStart={setBulk} onDragEnd={resetDrag} />
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
            {unassigned.map((campaign) => card(campaign))}
            {unassigned.length === 0 && (
              <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                Every campaign has a template
              </p>
            )}
          </div>
        </section>

        {/* Template columns */}
        <div className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto pb-1">
          {columns.map((templateId) => {
            const template = templateOf(templateId);
            if (!template) return null;
            const rows = byTemplate(templateId);
            const open = details === templateId;
            return (
              <section
                key={templateId}
                onDragOver={(event) => { allow(event); setOver(templateId); }}
                onDragLeave={() => setOver((c) => (c === templateId ? null : c))}
                onDrop={(event) => dropOn(event, templateId)}
                className={`flex min-w-[268px] flex-1 flex-col rounded-xl border p-4 transition-colors ${
                  over === templateId
                    ? "border-brand bg-brand-soft ring-2 ring-brand/30"
                    : "border-brand/30 bg-brand-soft/25"
                }`}
              >
                <div className="border-b border-border pb-3">
                  <LayoutThumb layout={template.layout} accent={template.accent} photo={template.hero} />
                  <p className="mt-2 truncate text-[12.5px] font-semibold text-card-foreground">{template.name}</p>
                  <p className="truncate text-[10.5px] text-muted-foreground">
                    {template.category} · {rows.length} campaign{rows.length === 1 ? "" : "s"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={() => setPicking(templateId)}>
                      <Repeat2 size={12} />
                      Change template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] text-destructive"
                      onClick={() => {
                        rows.forEach((c) => clearTemplate(c.id));
                        setColumns((c) => c.filter((id) => id !== templateId));
                      }}
                    >
                      <Trash2 size={12} />
                      Clear column
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDetails(open ? null : templateId)}
                      className="text-[11px] font-medium text-brand underline-offset-2 hover:underline"
                    >
                      {open ? "Hide details" : "See template details"}
                    </button>
                  </div>
                  {open && (
                    <dl className="mt-2 space-y-1 rounded-md border border-border bg-background p-2.5 text-[11px]">
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-muted-foreground">Layout</dt><dd className="min-w-0 flex-1 text-card-foreground">{template.layout.replace(/_/g, " ")}</dd></div>
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-muted-foreground">Heading</dt><dd className="min-w-0 flex-1 text-card-foreground">{template.heading}</dd></div>
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-muted-foreground">Body</dt><dd className="min-w-0 flex-1 text-muted-foreground">{template.body}</dd></div>
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-muted-foreground">Button</dt><dd className="min-w-0 flex-1 text-card-foreground">{template.ctaLabel}</dd></div>
                    </dl>
                  )}
                </div>
                <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
                  {rows.map((campaign) => card(campaign, () => clearTemplate(campaign.id)))}
                  {rows.length === 0 && (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                      Drop a campaign here
                    </p>
                  )}
                </div>
              </section>
            );
          })}

          <button
            type="button"
            onClick={() => setPicking("new")}
            className="flex min-w-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 text-[12px] font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
          >
            <Plus size={16} />
            Add template
          </button>
        </div>
      </div>

      <TemplateLibrary
        open={picking !== null}
        selectedId={picking && picking !== "new" ? picking : undefined}
        onClose={() => setPicking(null)}
        onSelect={choose}
      />
    </div>
  );
}
