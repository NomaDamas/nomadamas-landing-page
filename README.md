# nomadamas-landing-page

Terminal-style landing page for [nomadamas.org](https://nomadamas.org) — NomaDamas, an AI open-source hacker house in Seoul.

## Stack

Single `public/index.html` (self-contained; assets embedded as base64 via a custom bundler tag — fonts, data, rendered template all live inside the file). Deployed to Cloudflare Pages on push to `main`.

```
request → Cloudflare Pages (edge) → public/index.html
```

The `public/` folder is the Pages build output directory; `node_modules/`, `package.json`, etc. stay at the repo root and are ignored by Pages.

## Local development

```bash
npm install
npm start   # serves on http://127.0.0.1:3030
```

Because `http-server` runs with `-c-1`, any edit to `public/index.html` is visible on browser refresh with no server restart.

## Deployment

Cloudflare Pages, project `nomadamas-landing-page` connected to `NomaDamas/nomadamas-landing-page` on GitHub.

- **Build command**: `exit 0`
- **Build output directory**: `public`
- **Framework preset**: None
- **Custom domains**: `nomadamas.org`, `landing.nomadamas.org`

Push to `main` → Pages auto-builds (no-op) and publishes contents of `public/`. Live within ~30 seconds.

Rollback: Cloudflare Dashboard → Workers & Pages → `nomadamas-landing-page` → Deployments → past deployment → Rollback.

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

Editing the template CSS/JS must go through a JSON round-trip because the stored bytes use `\"` and `\n` as escape sequences. See `AGENTS.md` for the safe patch pattern, and any `python3 <<EOF ... json.loads ... json.dumps(ensure_ascii=False) ...` example from the commit history.

**Gotcha**: `json.dumps` normalizes `<\/script>` back to `</script>`, which breaks the outer `<script type="__bundler/template">` tag. Always re-apply `.replace('</script>', '<\\/script>')` on the JSON output before splicing back.

## Mobile

Tested at 360 / 375 / 393 / 768 px viewports. Members table becomes a card stack at ≤600px, ASCII logo scales down to 7px/6px at ≤480/≤380px.
