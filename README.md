# nomadamas-landing-page

Terminal-style landing page for [nomadamas.org](https://nomadamas.org) — NomaDamas, an AI open-source hacker house in Seoul.

## Stack

Single `public/index.html` (self-contained; assets embedded as base64 via a custom bundler tag — fonts, data, rendered template all live inside the file). Served locally by `http-server public/` via pm2, and deployed to Cloudflare Pages on push to `main` (Pages `Build output directory: public`).

```
request → Cloudflare Pages (or cloudflared tunnel during migration) → public/index.html
```

The `public/` folder is the Pages build output directory; `node_modules/`, `package.json`, etc. stay at the repo root and are ignored by Pages.

## Local development

```bash
npm install
npm start   # serves on http://127.0.0.1:3030
```

Because the served file has `Cache-Control: no-cache, no-store, must-revalidate` and `http-server` runs with `-c-1`, any edit to `public/index.html` is visible on browser refresh without restarting pm2.

## Production layout

- **Cloudflare Pages**: auto-deploys `public/` on push to `main` (project `nomadamas-landing-page`, `https://nomadamas.org`). Build command: `exit 0`. Output directory: `public`.
- **(legacy, during migration only) pm2 process `nomadamas-landing`**: serves `public/` locally via http-server for dev mirroring; see `ecosystem.config.cjs`.
- **cloudflared tunnel `nomadamas-tunnel`**: still serves other subdomains (`jeffrey-blog.nomadamas.org`, `k-skill-proxy.nomadamas.org`, etc.). The `nomadamas.org` ingress rule should be removed once Pages takes over.

Update HTML → `git add public/index.html && git commit -m 'update content' && git push` → Pages auto-deploys within ~30 seconds.

## Structure of `public/index.html`

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
