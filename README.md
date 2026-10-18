# Hasnaa & Abdullah invitation — RSVP to GitHub

## 1. GitHub
Upload `index.html`, `styles.css`, `script.js`, `rsvp.json` to the root of `mennatullahra/hassnaa-engagment`. Keep your existing `engagement-song.mp3` (do not delete it). **Do not upload worker.js to the website repo unless you want it public; it contains no token, but is meant for Cloudflare Workers.**

## 2. GitHub fine-grained token
GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate. Repository access: Only `hassnaa-engagment`. Permission: Contents = Read and write. Use an expiration date and store the token privately. NEVER put the token in script.js, GitHub files, or chat.

## 3. Cloudflare Worker
Sign in to Cloudflare dashboard → Workers & Pages → Create Worker → Edit code. Replace code with `worker.js` and Deploy. Under Worker Settings → Variables and Secrets add:
- `GITHUB_TOKEN` = the token above (Secret / encrypted)
- `ALLOWED_ORIGIN` = your exact published GitHub Pages origin, e.g. `https://mennatullahra.github.io` (no trailing slash or repository path). If using Netlify instead, use its exact origin.

Copy your deployed Worker URL (`https://...workers.dev`). Edit `script.js`: replace `PASTE_CLOUDFLARE_WORKER_URL_HERE` with that URL, commit changes. The Worker must be deployed separately; putting worker.js in GitHub Pages does not run it.

## 4. Test
Open the invitation, send one test RSVP, then check `rsvp.json` in GitHub. If it stays empty, check the Worker URL and ALLOWED_ORIGIN, and Worker logs. GitHub Pages can take a few minutes to update.

## Counting guests
Each RSVP is appended to `rsvp.json`. Count the `count` fields where `attending` is `yes` to estimate attendees. Duplicate submissions are possible; this is not identity-verified. Entries contain guest names and timestamps. For privacy, use a private repo if your hosting plan supports it, or a private database instead. On public GitHub repositories, RSVP names are publicly visible. Never collect phone numbers or other sensitive information in this setup.

## Security notes
Origin checks are not authentication; automated spam or false RSVPs are still possible. A GitHub token must remain only in Worker secrets. Worker writes may fail if the GitHub API is down or the token expires. Use GitHub branch history to restore accidental edits.
