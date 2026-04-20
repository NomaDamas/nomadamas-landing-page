# nomadamas-landing-page

Terminal-style landing page for [nomadamas.org](https://nomadamas.org) — NomaDamas, an AI open-source hacker house in Seoul.

## Stack

Single `index.html` (self-contained; assets embedded as base64 via a custom bundler tag — fonts, data, rendered template all live inside the file). Served locally by `http-server` via pm2, exposed to the internet through a Cloudflare Tunnel.

```
request → Cloudflare edge → cloudflared tunnel → pm2 (http-server :3030) → index.html
```

## Local development

```bash
npm install
npm start   # serves on http://127.0.0.1:3030
```

Because the served file has `Cache-Control: no-cache, no-store, must-revalidate` and `http-server` runs with `-c-1`, any edit to `index.html` is visible on browser refresh without restarting pm2.

## Production layout

- **pm2 process**: `nomadamas-landing` (see `ecosystem.config.cjs`)
- **Tunnel**: `~/.cloudflared/config.yml` ingress `nomadamas.org → http://localhost:3030`
- **pm2 process**: `nomadamas-tunnel` runs `cloudflared tunnel run --token ...`

Update HTML → `cp newfile index.html` → reflected immediately. No deploy step.

## Structure of `index.html`

The file is a single terminal-themed page with:
- Boot sequence animation
- Hero (mission + whoami.yml stats)
- Members table (card-stack on mobile)
- Project cards (15 repos across NomaDamas / Marker-Inc-Korea / vkehfdl1)
- Interactive shell (auto-types `whoami` then `manifesto`, then accepts user input)
- Sequential line-by-line reveal animation after page load

The `<script type="__bundler/template">` block holds the actual rendered HTML as a JSON-encoded string. On page load, a bootstrap script:
1. Parses the template JSON
2. Inlines asset blob URLs (fonts) from the `__bundler/manifest` block
3. Replaces `document.documentElement` with the parsed DOM
4. Re-creates every `<script>` so inline scripts execute (DOMParser-created scripts are inert per spec)

### Editing tips

Editing the template CSS/JS must go through a JSON round-trip because the stored bytes use `\"` and `\n` as escape sequences. See example in any `python3 <<EOF ... json.loads ... json.dumps(ensure_ascii=False) ...` from the commit history.

**Gotcha**: `json.dumps` normalizes `<\/script>` back to `</script>`, which breaks the outer `<script type="__bundler/template">` tag. Always re-apply `.replace('</script>', '<\\/script>')` on the JSON output before splicing back.

## Mobile

Tested at 360 / 375 / 393 / 768 px viewports. Members table becomes a card stack at ≤600px, ASCII logo scales down to 7px/6px at ≤480/≤380px.
