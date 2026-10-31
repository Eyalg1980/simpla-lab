# simplaux-site

The production copy of the Simpla site that www.simplaux.com serves (Vercel project `simplaux`, root directory `simplaux-site`).

- Source of truth: `../simpla-hybrid/index.html`. Edit that page, then run `python3 simplaux-site/build.py` from the repo root and commit both.
- `terms-and-conditions.html` (served as `/terms-and-conditions`) is the page LinkedIn lead forms link to as the privacy policy, ported verbatim from the old Webflow site on 31.10.2026. Keep the URL.
- `vercel.json` redirects the old Webflow `/solutions/*` pages to the home page.
- Vercel skips the build when nothing under this folder changed, so the daily automation pushes to simpla-lab do not redeploy the site.
