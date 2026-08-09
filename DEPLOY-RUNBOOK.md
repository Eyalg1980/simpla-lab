# DEPLOY-RUNBOOK

**The single source of truth for publishing any of Eyal's three sites.** Every skill, scheduled task and interactive session follows this file. Do not copy these rules into a prompt, a skill or a memory file: point at this file instead. Copying is what caused the 5.8 push-form drift that broke the morning brief for weeks.

Last verified end to end: 9.8.2026 (clone + no-op push on `simpla-lab` and `daily-board`).

---

## 0. The bootstrap exception

You cannot read this file before you can clone, and you cannot clone before you have the token. So **section 1 (token) and section 3 (push) must also live verbatim inside every scheduled-task prompt**. Everything else is read from here after the clone.

That is the only permitted duplication in the system. If you change section 1 or section 3, update both scheduled-task prompts in the same sitting and add a CHANGELOG line.

---

## 1. Get the token

The token is the fine-grained PAT **`claude-deploy`** (issued 4.8.2026, valid one year, Contents + Pages read/write on the three repos).

It lives in exactly one place: the prompt of the **"Daily Content Engines"** scheduled task.

```bash
# 1. call mcp__claude-code-remote__list_triggers
# 2. the output is ~140k chars and lands in a file; take the path from the tool result
# 3. pull the token out with a regex, never read the whole file:
TOKEN=$(grep -o 'github_pat_[A-Za-z0-9_]*' <PATH_FROM_TOOL_RESULT> | head -1)
```

Facts that save you turns:

- The memory file `/areas/git-deploy.md` deliberately does **not** hold the token value. The memory backend rejects any write containing a GitHub PAT and reports it as a generic `service unavailable`. Do not retry that write, it will never succeed.
- The sandbox's ambient `GH_TOKEN` and `GITHUB_TOKEN` belong to the Cowork connector and are **rejected for push**. There is no GitHub connector in the Claude directory. Do not try them.
- The older tokens `claude-cowork` (fine-grained) and the classic `ghp_` one are **revoked**. The scheduled task "Git Credentials" was **deleted** on 4.8.2026. Do not look for either.
- Never echo the token into chat, a commit, a log line, or a file that gets pushed.

Set the auth header once and reuse it:

```bash
AUTH="Authorization: Basic $(printf 'x-access-token:%s' "$TOKEN" | base64 -w0)"
```

---

## 2. Clone

**Repo visibility differs, and this bites.**

| repo | visibility | clone command |
|---|---|---|
| `simpla-lab` | public | plain URL works |
| `ai-post-brainstorm` | public | plain URL works |
| `daily-board` | **private** | **needs the auth header** |

```bash
# public repos
git clone --depth 1 https://github.com/Eyalg1980/simpla-lab.git

# daily-board is private: a plain clone fails with
#   fatal: could not read Username for 'https://github.com': terminal prompts disabled
git -c http.extraHeader="$AUTH" clone --depth 1 https://github.com/Eyalg1980/daily-board.git
```

Never embed the token in the URL, not even for clone. Use the header.

**Sandbox path trap:** `$HOME` is `/root`, so a repo cloned after `cd ~` lands in `/root/<repo>`, while the Write tool resolves relative-looking paths under `/home/claude` and silently creates a SECOND tree there. Files written that way never reach git. Always write repo files with an explicit absolute path into the clone, and `ls` before committing.

---

## 3. Push

**Never embed the token in the push URL.** The sandbox git proxy strips URL-embedded credentials on push and rejects with `403 not in this session's authorized repository set`, even when the token is valid and even when an earlier push in the same session succeeded. That error means you used the URL method. Switch to the header, do not report the push as impossible.

```bash
git -c http.extraHeader="$AUTH" push https://github.com/Eyalg1980/REPO.git main
```

- **Push to `main` only**, in all three repos. Pages serves from `main` since 4.8.2026 and the `gh-pages` branches were deleted. Do not recreate or push them.
- Several Claude sessions edit these repos in parallel. On rejection: `git pull --rebase` (add `-X theirs` only for the daily data files), then push again. **Never force-push.**

---

## 4. STEP 0: check the push before doing any work

A run that cannot publish must cost two minutes, not an hour. Before any research, image generation or file editing:

```bash
git -c http.extraHeader="$AUTH" push https://github.com/Eyalg1980/REPO.git main   # expect: Everything up-to-date
```

If this fails for any auth or permission reason, **stop the run immediately**: send a loud FAILED notification naming the exact error, write the run-log entry, and end. Do not loop, and do not spend a single web search on a day the site cannot be published.

---

## 5. The syntax gate: never push a broken app

The Daily Board and the engine apps are single-file HTML with one inline `<script>`. One bad character blanks the entire app for Eyal, and he only finds out when he opens the site. **A push without a passing syntax check is a failed run.**

The checker lives in the repo at `daily-board/tools/jscheck.py`. It extracts every inline script block and runs `node --check` on it.

```bash
python3 daily-board/tools/jscheck.py daily-board/index.html   # exit 0 = safe to push
```

The trap it exists to catch: a single quote inside a single-quoted JS string. Hebrew text carrying a geresh, most often `ג'ון` or `ג'אנה`, terminates the string and kills the whole file. Inside JS strings use the geresh `׳` (U+05F3) or double quotes. This applies to **every** Hebrew string in the script, not only the date stamp line.

---

## 6. Verify the push actually landed

```bash
# public repos
git fetch origin main
# daily-board is private, the fetch needs the header too
git -c http.extraHeader="$AUTH" fetch origin main

git log origin/main..main    # must be empty
```

The fetch first is not optional: after pushing by explicit URL rather than through the `origin` remote, the local `origin/main` tracking ref stays stale and `git log origin/main..main` falsely reports unpushed commits.

On `daily-board` a bare `git fetch origin main` fails with `could not read Username`, exactly like a bare clone does, because the repo is private. If you see that error **after a push that printed a new commit range, the push succeeded** and only the verification failed. Re-run the fetch with the header before concluding anything.

Do **not** verify by fetching the live site:

- The egress proxy blocks direct `curl` to `*.github.io`.
- `WebFetch` against a github.io page fails in **unattended scheduled runs** with `PROVENANCE_REQUIRED`, because there is nobody to approve it. This is not a failure of the run, it is expected. Verify by re-cloning and reading the file instead.
- Even when WebFetch works, pages whose body is rendered at runtime (the storyboard pages via `sb.js`) return only the head.

**Corollary for reading data:** never read `posts.json`, `videos.json`, `competitions.json` or the meeting-room data over WebFetch in a scheduled run. Shallow-clone the repo and read the file from disk.

---

## 7. What automated runs may edit

| repo / path | automated runs may edit | never touch |
|---|---|---|
| `daily-board/index.html` | the data objects only: `DATA`, `DATED`, `READY`, `ROUTINE`, `DAILY` | CSS, JS, markup, existing task `id`s |
| `daily-board/brief.txt` | full replace | |
| `ai-post-brainstorm/` | `posts.json`, `links.json`, `approaches.json` | `index.html`, `SPEC.md` |
| `simpla-lab/daily-director/` | `videos.json`, `competitions.json`, `inspiration.json` | `index.html`, anything under `storyboards/` |
| `simpla-lab/meeting-room/` | `data/*.json` | `index.html`, `BUILDER-SPEC.md`, `img/` |

Product rules for the Daily Board live in `daily-board/BOARD-SPEC.md`. Content rules for the engines live in their own SPEC files.

---

## 8. Things the sandbox cannot do

Do not spend turns rediscovering these:

- `api.github.com` Pages endpoints are blocked. Repo creation and Pages configuration must be done by Eyal in the browser.
- Netlify is unusable, `api.netlify.com` is blocked.
- The Higgsfield CDN cannot be reached from the Cowork sandbox, so generated images cannot be downloaded here. Either embed the CDN URL directly, or move the file inside the Higgsfield sandbox (`sandbox_exec`), which does have egress to both the CDN and github.com.
- Pushing files under `.github/workflows/` requires the token to carry Workflows read/write. As of 9.8.2026 `claude-deploy` does **not** have it. Adding a workflow file will be rejected.

---

## 9. Live URLs

- https://eyalg1980.github.io/simpla-lab/
- https://eyalg1980.github.io/ai-post-brainstorm/
- https://eyalg1980.github.io/daily-board/

---

## Changelog of this runbook

- **9.8.2026** amended same day: private-repo `git fetch` also needs the auth header, added to section 6 after hitting it live.
- **9.8.2026** created, by extracting the deploy section out of `CLAUDE.md` so there is exactly one copy. Added: `daily-board` is private and needs the auth header to clone (previously documented everywhere as "plain URL, no token needed", which is false for that repo); the `jscheck.py` syntax gate; STEP 0 as a general rule rather than one task's habit.
