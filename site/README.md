# My World Blueprint

Netlify build and automatic deployment setup is documented in
[`docs/netlify-deployment.md`](../docs/netlify-deployment.md).

A single-page Hugo site based on the preserved `../final-mockup-home-page.html`.
Blueprint generation runs locally in the browser as a demonstration.

## Preview

From this directory:

```sh
hugo server --bind 127.0.0.1 --disableFastRender
```

Open http://localhost:1313/.

## Build

```sh
hugo
```

The generated website is in `public/`. Set `baseURL` in `hugo.toml` to the
deployment URL before publishing, or pass `--baseURL` to Hugo.

From the repository root, use `hugo --source site` to build or
`hugo server --source site --bind 127.0.0.1 --port 1313 --disableFastRender`
to preview. Keep the preview running during review. Restart it after adding new
asset directories if filesystem watching misses their changes.

## Source map

- `layouts/baseof.html`: document shell, metadata, header, footer definition.
- `layouts/home.html`: homepage composition.
- `layouts/partials/home/`: Spark, Discovery, system diagram, and Blueprint HTML.
- `layouts/partials/assets.html`: explicit CSS order and Hugo asset builds.
- `assets/css/`: layered tokens/theme, layout, components, and feature styling.
- `assets/js/main.js`: workflow coordinator; `components/` and `features/` own behavior.

Homepage copy stays in the HTML. Contextual prompts, runtime messages, and
generator prose stay in JavaScript. Blue Studio styling works before JavaScript
loads. Production builds minify and fingerprint CSS/JS and emit integrity
attributes; the preview uses readable assets. No npm build step is required.

See [frontend architecture](../docs/frontend-architecture.md) for ownership,
contracts, and verification. The browser's speech service is optional; Three.js
is fetched lazily from jsDelivr after Discovery begins and can fail without
blocking the experience. Written ideas are not sent to a generation service.
