# My World Blueprint

A single-page Hugo site based on `../final-mockup-home-page.html`.
The homepage template in `layouts/home.html` contains all HTML, CSS, and
JavaScript. Blueprint generation runs locally in the browser as a demonstration.

## Preview

From this directory:

```sh
hugo server --bind 127.0.0.1
```

Open http://localhost:1313/.

## Build

```sh
hugo --cleanDestinationDir
```

The generated website is in `public/`. Set `baseURL` in `hugo.toml` to the
deployment URL before publishing, or pass `--baseURL` to Hugo.

The site publishes only the homepage. A later phase can extract the inline
styles and scripts into separate assets.
