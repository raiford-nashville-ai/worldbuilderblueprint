# Project workflow

- The Hugo site lives in `site/`.
- `final-mockup-home-page.html` is the approved reference; preserve it.
- Keep the local Hugo preview running after changes so the user can test.
- Build with `hugo --source site` and verify affected interactions before committing.

## Frontend ownership

- Read `docs/frontend-architecture.md` before changing frontend boundaries.
- `site/layouts/baseof.html` owns the document shell, metadata, header, and footer definition. `home.html` composes the four `partials/home/` sections.
- Keep homepage copy in HTML partials. Runtime prompts, status messages, and generated prose belong in their JavaScript feature modules.
- CSS lives in `site/assets/css/`. Preserve the declared layer order: reset, tokens, themes, base, layout, components, features, utilities.
- Each layer/supporting CSS file wraps its rules in its named layer. Update the explicit resource list in `partials/assets.html` when adding a stylesheet; do not add browser CSS imports.
- Use reference tokens for palette values and semantic tokens for their roles. Blue Studio is CSS-owned; do not initialize appearance in JavaScript.
- `site/assets/js/main.js` coordinates stages; feature modules own their DOM behavior and resources. Use IDs/data attributes as behavior hooks rather than style-class selectors.
- Preserve editable answers across generation and return navigation. Render user text with text nodes, not HTML interpolation.
- Keep Three.js lazy and optional. Release voice tracks, audio contexts, animation frames, listeners, and renderer resources at their ownership boundaries.
- For structural or styling changes, capture a baseline and compare desktop/mobile Spark, open system panel, Discovery, and Blueprint views. Settle animations before screenshots.
- Verify validation, optional answers, generation, edit/regenerate, Markdown copy/download, keyboard focus, reduced motion, and enhancement failure paths as affected.
- Production assets use Hugo ordered CSS concat and `js.Build`, followed by minification/fingerprints. Do not edit generated `site/public/` output.

## Git practices

- Use `274983938+raiford-brookshire@users.noreply.github.com` for both commit author and committer email. Never publish a personal email in commit metadata. Supply `GIT_AUTHOR_EMAIL` and `GIT_COMMITTER_EMAIL` when committing, and verify metadata before pushing.

- Keep `main` as the stable baseline. Work on descriptive feature branches.
- The restructuring work starts on `feat/restructure-site`.
- Use branch names such as `feat/<description>`, `fix/<description>`, or `chore/<description>`.
- Commit, merge, and push only when explicitly requested by the user.
- Before committing, inspect `git status`, `git diff`, and recent commit history.
- Stage specific intended files; review `git diff --cached` before committing.
- Preserve unrelated user changes. Never commit credentials, local secrets, generated output, or dependency caches.
- Keep commits focused and coherent. Run checks appropriate to the change and report any testing limitations.
- Do not amend, rewrite history, force-push, bypass hooks, or change Git configuration without explicit permission.

## Commit messages

- Use `type(scope): short imperative description`.
- Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore`, `perf`, `revert`.
- Choose a meaningful scope such as `site`, `hugo`, `styles`, `scripts`, or `repo`.
- Use `refactor` for structural changes that preserve behavior.
- Keep the subject concise; add a body when the reason or tradeoffs need explanation.
- Examples:
  - `feat(site): add initial homepage generation`
  - `refactor(site): extract inline styles and scripts`
  - `fix(scripts): preserve answers when editing a blueprint`
  - `docs(repo): document local preview workflow`
