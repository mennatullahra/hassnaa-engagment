# Invitation update — 18 Oct 2026

Upload `index.html` and `script.js` to the root of the GitHub repository, replacing the old versions. Keep `styles.css` and `engagement-song.mp3` unchanged. The music seeks to 00:51 before playback; on iPhone, tap the envelope to allow audio. The guest count selector is removed; each accepted RSVP counts as one person.

## IMPORTANT: RSVP storage is NOT automatic

`rsvp.json` cannot update from GitHub Pages alone. The Cloudflare Worker in `worker.js` must be deployed, with secret `GITHUB_TOKEN` (fine-grained token, Contents: Read and write for the repository), and `ALLOWED_ORIGIN` set to the exact site origin (for GitHub Pages: `https://mennatullahra.github.io`). Then set `RSVP_API_URL` inside `script.js` to your deployed Worker URL. Without these steps, the form deliberately shows “RSVP is not configured yet” and `rsvp.json` will not change. Do not put a GitHub token in frontend code. `rsvp.json` in a public repository exposes guest names publicly; use private storage if privacy matters.

If a Worker is already configured but saving fails, inspect the Worker logs and GitHub token permissions. Test with one submission and verify `rsvp.json` changed. Multiple submissions may create duplicates.
