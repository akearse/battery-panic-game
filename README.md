# Game Boy Arcade

A static four-game arcade. Open the hub at `index.html`.

| Game | Entry |
| --- | --- |
| Battery Panic | `battery_panic.html` |
| Pattern Matching | `pattern_matching.html` |
| SOAP | `soap.html` |
| Matching | `matching.html` |

The original Battery Panic inline CSS and JavaScript are preserved. Its localStorage key remains `battery-panic-best`, so scores on the existing origin remain available after publishing. Each game includes only a scoped navigation stylesheet, a body class, and a Back to Arcade link for integration.

## Preview

With Node installed, run `node qa/serve.cjs` from this folder. Visit http://127.0.0.1:4173/battery-panic-game/ . The server intentionally uses the repository subpath. The website itself needs no Node, installation, build step, or framework.

## Verify

`node qa/preserve.cjs` checks the original game against the original commit pinned inside the script, so this preservation check remains valid after committing the new hub.

Browser checks are in `qa/test.cjs`. Install Playwright as local test tooling with PowerShell:

```powershell
npm install --prefix "$env:TEMP/battery-panic-qa" playwright --no-audit --no-fund
node qa/test.cjs
```

Start the preview server first. The tests use installed Google Chrome, exercise mouse and emulated touch gameplay, and write ignored screenshots and `qa/results.json`. See `qa/REPORT.md` for executed checks and limitations. Nothing in the browser test package ships as a runtime dependency.

## Existing GitHub Pages deployment

Repository: https://github.com/akearse/battery-panic-game

Verified live URL: https://akearse.github.io/battery-panic-game/

Public deployment records identify `main` and the `github-pages` environment. The existing live document matched the committed root `index.html` when inspected. The private Pages settings endpoint was unavailable, so the exact configured publishing-directory setting could not be directly inspected. No configuration changes were made. The root `index.html` is now the arcade hub locally.

Do not publish until the owner approves. No push or deployment was performed for this change.

## Assets

`assets/fonts/Sora-Variable.ttf` is self-hosted Sora from the Google Fonts repository (https://github.com/google/fonts/tree/main/ofl/sora). Its SIL Open Font License is included at `assets/fonts/OFL.txt`. All preview art and console geometry are authored inline SVG/CSS. Preview artwork is a themed representation; the games retain their own original visuals.

For live verification, set the PowerShell environment variable `ARCADE_BASE_URL` to `https://akearse.github.io/battery-panic-game/` before running `node qa/test.cjs`. The same browser assertions then exercise the published site.

