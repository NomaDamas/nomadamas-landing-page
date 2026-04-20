# AGENTS.md

Operating notes for AI agents working on this repo. Human-facing overview lives in `README.md`.

## What this is

Single-file landing page for `nomadamas.org`. `public/index.html` is self-contained — fonts are embedded as base64 WOFF2 inside `<script type="__bundler/manifest">`, the rendered DOM lives JSON-encoded inside `<script type="__bundler/template">`, and a small bootstrap script on page load reconstructs the real document via `DOMParser` + `document.documentElement.replaceWith(...)`.

No framework, no build step. Edit `public/index.html` → refresh → done.

## Why `public/`

Cloudflare Pages deploys the `Build output directory`. If that's the repo root, Pages also uploads `node_modules/` which can include `workerd` (>25 MiB per-file limit), failing the build. Keeping the frontend in `public/` and pointing Pages at `public/` cleanly separates deployable assets from dev tooling.

## Critical gotcha: editing CSS/JS inside the bundler template

The rendered HTML (and all its inline `<style>` / `<script>` blocks) is stored as a single JSON-encoded string. In the file bytes, every `"` in real CSS becomes `\"` (two bytes) and every newline becomes `\n` (two bytes). **Never** try to regex-edit CSS/JS by matching the raw file bytes with escape sequences — escape counting fails silently and corrupts the template.

**Always round-trip through `json.loads` / `json.dumps`:**

```python
import json, pathlib
path = pathlib.Path('public/index.html')
text = path.read_text()

MARKER = '<script type="__bundler/template">\n'
END    = '\n  </script>'
start  = text.index(MARKER) + len(MARKER)
end    = text.index(END, start)
tpl    = json.loads(text[start:end])      # plain CSS/JS/HTML text

# Edit as plain Python string (no escapes)
anchor = '@media (max-width:640px){ .ascii{font-size:9px} }'
assert tpl.count(anchor) == 1, 'anchor must be unique'
tpl = tpl.replace(anchor, anchor + '\n  /* new rule */ .x { color: red }', 1)

# IMPORTANT: json.dumps normalizes `<\/script>` → `</script>`, which
# prematurely closes the outer <script type="__bundler/template"> tag.
# Re-escape it before writing.
new_raw = json.dumps(tpl, ensure_ascii=False).replace('</script>', '<\\/script>')

text = text[:start] + new_raw + text[end:]
path.write_text(text)

# Round-trip sanity check
raw2 = path.read_text()
s2 = raw2.index(MARKER) + len(MARKER); e2 = raw2.index(END, s2)
assert json.loads(raw2[s2:e2]) == tpl, 'round-trip mismatch'
```

If the bundler fails after your edit, you'll see the site's red error banner (`__bundler_err`) showing `Bundle unpack error: SyntaxError: ...`. That banner is your signal.

## Other gotchas

- **`<input autofocus>` inside the template scrolls the page on load** when the bundler inserts DOM. Don't re-add `autofocus`. Any focus-on-click uses `input.focus({preventScroll: true})` — keep that flag.
- **`print()` in the shell doesn't auto-scroll unless `window.__userTyping` is true** (set on `Enter` keydown). This is intentional — initial auto-typed `whoami` / `manifesto` must not yank the viewport.
- **CF Bot Fight Mode injects a `/cdn-cgi/challenge-platform/scripts/jsd/main.js` loader** which creates a hidden iframe on `document.body`. After our bundler `replaceWith`s the documentElement, that iframe is orphaned and its `contentWindow.document` throws. The bundler's error handler filters this (`Cannot read properties of null (reading 'document')` + `/cdn-cgi/challenge-platform/` filename) — don't remove the filter even if Bot Fight Mode is currently off; the toggle can flip.
- **Cascade reveal animation is JS-driven, not CSS.** The list of selectors + delays lives inside the template script (search `const selectors = [`). Order matters: the `.hero > div:last-child` item is deliberately placed between the first pill (BUILD) and second pill (SHIP) so the whoami.yml block pops in alongside pills, not before or after.

## Local dev / verification

```bash
npm install            # installs http-server locally
pm2 start ecosystem.config.cjs   # daemon on 127.0.0.1:3030, pm2 name: nomadamas-landing
```

The pm2 service runs with `http-server -c-1 --cors -s` so cache is OFF — edits reflect on browser refresh with no restart.

Mobile verification with Playwright (MCP skill `playwright`):

```js
for (const v of [{w:360,h:800},{w:375,h:667},{w:393,h:852},{w:768,h:1024}]) {
  await page.setViewportSize(v);
  await page.goto('http://127.0.0.1:3030/?t=' + Date.now(), {waitUntil: 'load'});
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    projMax: Math.max(0, ...[...document.querySelectorAll('.proj')].map(p => p.scrollWidth)),
    table: document.querySelector('table.grid').scrollWidth,
  }));
  // overflow should be 0 on all four viewports
}
```

## Deployment

Production: **Cloudflare Pages** project `nomadamas-landing-page` connected to `NomaDamas/nomadamas-landing-page` on GitHub. Push to `main` → Pages auto-builds (no-op: `exit 0`) and publishes contents of `public/`. Live at `https://nomadamas.org`.

- **Build command**: `exit 0` (nothing to build; Pages must still run a command to unlock Pages Functions slot)
- **Build output directory**: `public`
- **Framework preset**: None

Legacy dev path (kept for local preview): `pm2` serves `public/` on `127.0.0.1:3030`. The `nomadamas-tunnel` pm2 service continues to handle *other* subdomains (`jeffrey-blog.nomadamas.org`, `k-skill-proxy.nomadamas.org`, etc.) — don't delete the tunnel, just remove the `nomadamas.org` ingress rule from `~/.cloudflared/config.yml` once Pages is live.

Rollback: Cloudflare Dashboard → Workers & Pages → `nomadamas-landing-page` → Deployments → any past deployment → **Rollback** (< 1 minute, no git history pollution).

## Data sources

- Project cards + member list are hardcoded in the `data` object inside the template's render script. To add/remove: edit `data.projects` or `data.members` via the JSON round-trip pattern above.
- GitHub stars are static snapshots, refreshed manually. If you update the project list, also update `stars` and `forks` — the stats bar (`15 repos · 10,444 ★`) auto-sums from `data.projects`.
- Non-NomaDamas repos use the `owner` field (e.g. `Marker-Inc-Korea/AutoRAG`, `vkehfdl1/slides-grab`). The card URL template uses `${p.owner}/${p.name}` — don't hardcode `NomaDamas/` back.

## Scope limits

- Don't change the bundler scheme (manifest/template/ext_resources script tags). The whole file depends on it.
- Don't add a build step or framework. The value proposition of this page is single-file, zero-deps, editable in any text editor.
- Don't touch `ecosystem.config.cjs` paths (`/Users/jeffrey/...`, `/opt/homebrew/bin/node`) without checking they exist on the target machine. The `/opt/homebrew/bin/node` path specifically avoids pm2's nvm-style resolution that misreads `node@22` directories as version tags.
