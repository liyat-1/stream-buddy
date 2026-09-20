# Improve campaign landing previews and email templates

## What will change

- Add a polished mobile landing-page preview beside the existing text-message phone.
  - The text link and attached offer become clickable inside the preview.
  - Clicking them opens the landing experience in the second phone.
  - With a promotion, the page leads with that offer, its chosen banner design, code, validity, and booking action.
  - Without a promotion, the page uses the campaign’s own purpose, timing, copy, imagery, and action so it still feels relevant.
  - Keep the page warm, credible, and hotel-focused rather than using a generic app style.
- Keep every new promotion banner available in both **Add promotion** and **Change promotion**, with a visual preview in the chooser so designs are recognizable before selection.
- Rework email templates so selecting a template changes the complete email structure, not only its photo and wording.
  - Preserve genuinely different structures such as invitation, editorial, newsletter, postcard, offer-led, split-image, gallery, receipt, and dark-luxe.
  - Give each template warmer hospitality styling, more natural hotel content, and appropriate imagery.
- Remove **Change layout** from the campaign email editor. The selected template owns its structure; users can still edit the email content.
- Polish the email template selector and assignment board.
  - Render the actual template design instead of a generic miniature.
  - Use taller, correctly proportioned previews so the complete structure is visible and not squashed.
  - Add an eye icon to open a large, scrollable full-template preview before choosing it.
  - Clean up the template-column header so the preview, name, campaign count, and actions have a clear hierarchy.

## Interaction rules

- The landing preview updates immediately when campaign copy, imagery, audience, or promotion changes.
- Promotion actions use the promotion’s configured banner design; non-promotion pages never show empty offer placeholders.
- Choosing a template applies that template’s structure and starter content; changing an already-customized email keeps the user’s copy while applying the new structure.
- Template previews show the same renderer used by the campaign email preview, preventing the picker and final result from drifting apart.
- The eye action previews without selecting; selecting remains an explicit action.

## Technical details

- Extract the marketing email preview into a reusable renderer shared by the campaign editor, template library, assignment board, and full-preview dialog.
- Add a dedicated contextual landing-preview component rendered inside the existing phone frame.
- Use campaign and promotion data already stored in the marketing state; no new account or database work is included.
- Replace schematic template thumbnails with scaled full email renders using stable aspect ratios and scroll-safe modal sizing.
- Remove the standalone layout-picker state and control from the email editor while retaining layout as part of each template definition.

## Verification

- Test text campaigns with and without promotions for both Direct and OTA audiences.
- Click the link and offer in the message preview and confirm the correct landing content appears.
- Confirm every new banner design is visible and selectable from Add/Change promotion.
- Inspect several email templates to confirm visibly different structures and full-height previews.
- Test the eye preview, selecting a template, preserving customized copy, and assigning templates from the board.
- Check the campaign editor and selectors at desktop and mobile widths for clipping, overlap, and unreadable scaling.
