// Cloudflare Worker — deploy separately. Secrets: GITHUB_TOKEN, ALLOWED_ORIGIN.
const OWNER = 'mennatullahra';
const REPO = 'hassnaa-engagment';
const BRANCH = 'main';
const FILE = 'rsvp.json';
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const encode64 = text => {
  const bytes = encoder.encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};
const decode64 = text => {
  const binary = atob(text.replace(/\\n/g, ''));
  return decoder.decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
};
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const headers = { 'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
    const respond = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (!allowed || origin !== allowed) return respond({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);
    if (!env.GITHUB_TOKEN) return respond({ error: 'Server not configured' }, 500);
    let body;
    try { body = JSON.parse(await request.text()); } catch { return respond({ error: 'Invalid JSON' }, 400); }
    const name = typeof body.name === 'string' ? body.name.trim().replace(/[<>]/g, '') : '';
    const attending = body.attending;
    const count = Number(body.count);
    if (name.length < 2 || name.length > 80 || !['yes', 'no'].includes(attending) || !Number.isInteger(count) || (attending === 'yes' && (count < 1 || count > 5)) || (attending === 'no' && count !== 0)) return respond({ error: 'Invalid RSVP' }, 400);
    const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;
    const githubHeaders = { 'Authorization': `Bearer ${env.GITHUB_TOKEN}`, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'engagement-rsvp-worker' };
    const entry = { name, attending, count, submittedAt: new Date().toISOString(), id: crypto.randomUUID() };
    for (let attempt = 0; attempt < 6; attempt++) {
      const current = await fetch(api + `?ref=${BRANCH}&t=${Date.now()}`, { headers: githubHeaders });
      let entries = [], sha;
      if (current.ok) {
        const file = await current.json(); sha = file.sha;
        try { entries = JSON.parse(decode64(file.content)); if (!Array.isArray(entries)) throw Error(); }
        catch { return respond({ error: 'Invalid existing RSVP file' }, 500); }
      } else if (current.status !== 404) return respond({ error: 'GitHub read error' }, 502);
      entries.push(entry);
      const payload = { message: 'Save engagement RSVP', branch: BRANCH, content: encode64(JSON.stringify(entries, null, 2) + '\n'), ...(sha ? { sha } : {}) };
      const saved = await fetch(api, { method: 'PUT', headers: { ...githubHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (saved.ok) return respond({ ok: true });
      if (![409, 422].includes(saved.status)) return respond({ error: 'GitHub write error' }, 502);
      await new Promise(resolve => setTimeout(resolve, 120 * (attempt + 1)));
    }
    return respond({ error: 'Busy, retry' }, 503);
  }
};
