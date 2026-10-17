# Project workflow

- The Hugo site lives in `site/`.
- `final-mockup-home-page.html` is the approved reference; preserve it.
- Keep the local Hugo preview running after changes so the user can test.
- Build with `hugo --source site` and verify affected interactions before committing.

## Git practices

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
