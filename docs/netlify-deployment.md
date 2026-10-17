# Netlify deployment

The root `netlify.toml` builds the Hugo project in `site/` and publishes
`site/public/`. It pins Hugo to 0.166.0 and builds production assets for every
deployment. No Node dependency installation or separate JavaScript build is
needed: Hugo bundles the local JavaScript and CSS.

## Connect the repository

1. Push this repository to a Git provider supported by Netlify.
2. In Netlify, import the existing repository or connect it to the existing site.
3. Set the production branch to `main`.
4. Leave the base directory at the repository root. Build and publish settings
   come from the root `netlify.toml`.
5. Enable automatic builds. Enable deploy previews for pull requests if desired.
6. Confirm the first production deploy succeeds and test the published homepage.

After connection, pushing commits to remote `main` triggers a production deploy.
Merging a pull request into remote `main` does this automatically; a local merge
must be pushed before Netlify sees it. Creating the configuration alone does not
connect the repository or enable deployment.

## URLs and previews

Netlify's `URL` supplies the production base URL, overriding the placeholder in
`site/hugo.toml`. Deploy previews and optional branch deploys use their own
`DEPLOY_PRIME_URL`. Configure custom domains through Netlify's domain settings.

The production environment is retained for previews so minified, fingerprinted
assets are tested before merging. Generated files stay out of Git.

## Verification

From the repository root, run:

```sh
hugo --source site --gc --minify --baseURL https://example.netlify.app/
```

After deployment, check idea entry, discovery, blueprint generation, Markdown
copy/download, and mobile layout. Voice input depends on browser support and
permission; the optional Three.js effect may fail without blocking the workflow.
