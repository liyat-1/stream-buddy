# Creative hotel email templates and scrollable selectors

## Goal
Replace the current compressed, repetitive email choices with a polished hotel-focused template collection inspired by the supplied references. Every design will render the active campaign copy and promotion, and all long previews and selection windows will scroll normally.

## What will change

### 1. Ten distinct hotel email designs
Create ten genuinely different structures rather than recoloring one layout:

1. **Resort promotion** — panoramic pool image, centered offer panel, room-image strip, terms, and booking action.
2. **Suite spotlight** — full-height cinematic suite image with oversized editorial heading and overlaid action.
3. **Concierge services** — elegant brand header with three arched experience panels for dining, transport, and local experiences.
4. **Seasonal invitation** — framed editorial event layout with image, RSVP action, event copy, and formal footer.
5. **Destination story** — tall travel feature with layered destination imagery, alternating story blocks, and a strong final action.
6. **Limited-time offer** — luxury campaign image with a centered offer panel, concise promotional copy, booking/contact actions, and terms footer.
7. **In-stay service** — immersive property image, restrained headline, and a prominent guest-service action area.
8. **Return-stay offer** — warm resort feature, offer callout, secondary room section, and social/footer strip.
9. **Room collection** — curved image treatment with two room offer cards and separate actions.
10. **Membership welcome** — bold welcome panel, feature image, primary action, and a structured benefits section.

The references will guide composition and hospitality tone without copying their hotel names, logos, or exact branded artwork.

### 2. Campaign content stays editable
- Use the existing campaign subject, preheader, heading, body, button label, button link, selected promotion, and campaign imagery throughout every design.
- Keep a campaign’s written copy when switching templates; only its visual structure changes.
- Split longer body copy into appropriate story, feature, list, or supporting sections where a design needs multiple blocks.
- Show the attached promotion naturally inside promotional templates; non-promotional campaigns retain context-appropriate hotel content without an empty offer area.
- Use the same renderer in the campaign editor, template library, assignment board, and full preview so the chosen design is consistent everywhere.

### 3. Full-height template selection
- Replace fixed-height cropped thumbnails with proportionate poster-like previews that show each template’s real silhouette.
- Give template cards enough vertical space to distinguish structures clearly without squashing their content.
- Keep an eye action for a larger full-email preview.
- Make both the template grid and full-preview window vertically scrollable, with the title and actions remaining accessible.

### 4. Scrollable promotion selection
- Make the promotion chooser a bounded vertical layout with a fixed heading/action area and an independently scrollable list.
- Ensure wheel, trackpad, and touch scrolling work even when banners are tall.
- Preserve full banner proportions instead of clipping or flattening them.

### 5. Quality checks
- Verify template switching preserves campaign copy and updates every preview location.
- Verify all ten structures visibly differ at normal and compact preview sizes.
- Verify template selection, full template preview, and promotion selection scroll from first to last item.
- Check close, cancel, and selection actions restore the underlying screen without freezing.
- Check desktop and narrow-screen layouts for clipping, overlap, or unreadable text.

## Technical details
- Extend the existing shared email renderer rather than creating separate preview-only mockups.
- Keep visual colors within reusable email-template theme data and the app’s semantic design tokens.
- Remove fixed-height scaling assumptions from selection cards; use a stable preview viewport plus vertical scrolling where full content is shown.
- Keep current campaign and promotion data models unless a small optional presentation field is required for a specific reusable block.
