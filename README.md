# Hasnaa & Abdullah — Engagement Invitation

A static, responsive bilingual Arabic/English invitation website. No build tools or backend required.

## Preview
Open `index.html` in a browser. For best results, serve the folder using `python -m http.server 8000` and visit `http://localhost:8000`.

## Publish
Upload the folder to Netlify Drop, GitHub Pages, Cloudflare Pages, or another static web host. Share the resulting URL with guests.

## Included
- Click-to-open animated envelope and invitation card
- Arabic/English names and copy
- Live countdown to **November 14, 2026 at 7:00 PM Cairo time**
- November 2026 calendar with engagement date highlighted
- Google Calendar event link
- Google Maps venue button using the supplied link
- RSVP form that prepares a WhatsApp message (guest chooses the recipient)
- Music button with a gentle, locally synthesized melody; starts only after user clicks
- Mobile-friendly layout, keyboard access, reduced-motion support

## Notes
- No couple photo or music file is required; the envelope has an elegant typographic placeholder. Add a photo later if desired.
- RSVP does **not** save responses or automatically send them to the couple. To collect RSVPs centrally, add a WhatsApp number or connect a form backend.
- The venue name was not provided, so the site shows a map button instead of an invented address.
- Fonts load from Google Fonts when online, with local fallbacks.
- `script.js` contains the event date, location link and calendar details for future editing.
