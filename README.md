# AceDenide

Website of **AceDenide**, a small web and app studio. *From failures, we forge success.*

Team: Hariharan, Ajmal Haroon, Ajai, Arshad Ahmed.

A single static page (`index.html`): no build step, no dependencies.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: AceDenide website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy on Vercel

1. Go to https://vercel.com/new and import the GitHub repository.
2. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
3. Click **Deploy**. Every push to `main` redeploys automatically.

## Licence

Copyright (c) 2026 AceDenide. **All rights reserved.** This is not open source:
you may not copy, modify, redistribute or reuse this code without written
permission. See [LICENSE](LICENSE). Third-party parts (8B template, fonts) keep
their own licences, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
