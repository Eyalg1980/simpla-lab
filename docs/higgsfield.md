# Higgsfield: images, films and credits

Read before any Higgsfield generation, image import or film edit. Linked from [`CLAUDE.md`](../CLAUDE.md).

## Moving Higgsfield images into the repo (verified 8.8.2026)

The Cowork sandbox proxy blocks the Higgsfield CDN (cloudfront), but the **Higgsfield sandbox (`sandbox_exec`) has open egress to both the CDN and github.com**. So never relay images through context/subagents again — run the whole pipeline inside `sandbox_exec`: sparse-clone the repo (`--depth 1 --filter=blob:none --sparse`), `curl` each CDN URL from the project's `imgfetch.txt`, convert with ImageMagick (`-resize '1600>' -quality 82` to webp into `<project>/img/N.webp`), one commit, push with the usual Basic-auth `http.extraHeader`. 33 images took ~45s. Use `background:true` + polling, and delete the auth file from the sandbox when done. Each new-world page maps images via its `IMAGES` object and `imgfetch.txt` holds `N URL` lines — keep that convention.

## Burning Hebrew captions into a film (learned 1.8.2026, the hard way)

The edit runs inside the Higgsfield sandbox (`sandbox_exec`), because the Cowork sandbox proxy blocks the Higgsfield CDN and the clips cannot be downloaded here.

- **Do NOT run caption text through `python-bidi`.** Pillow in that sandbox is built WITH libraqm, so it already applies bidi and shaping. Pre-reversing double-flips every line and the film ships with mirrored Hebrew. Pass the logical string straight to `draw.text(..., direction="rtl")`.
- **Assert before you encode.** Render `"או"`, split the ink into glyph clusters, and require narrow-then-wide left to right: `א` is wide and belongs on the right. Fail the build if it is not, a wrong caption costs a full re-render.
- Punctuation after a Latin or digit run is a separate bug from letter order, see the `sub` field and the SRT builder in `daily-director/storyboards/shared/sb.js`.
- `sandbox_exec` is hard-killed at about 60 seconds no matter what `timeout_seconds` says, and both `nohup` and `background:true` proved unreliable. Split the render into chunks of about three shots per call. A killed call leaves zombie `ffmpeg` processes that silently corrupt the next run, so pass `restart:true` when anything looks off.
- Deliver the result with `media_upload` plus a `curl -X PUT`, then `media_confirm`, and point the page's `film.src` at the returned URL.

## Credit economics (measured 12.8.2026, not from docs)

Every number here came from a `get_cost` preflight or from differencing `balance` across a known batch. Check them again if a run comes back unexpectedly expensive.

- **`kling3_0` std with `sound:"off"` bills 1.25 credits per second of requested duration.** Verified: 17 clips totalling 211 seconds cost exactly 263.75. The `get_cost` preflight quotes **1.5** per second for the same call, so preflight over-estimates by 20%; budget with 1.5 and expect to come in under.
- `sound:"on"` costs +33% (2.0/sec). `mode:"pro"` is 1.75/sec. `mode:"4k"` is **6.0/sec**, four times std. Never touch 4k or Topaz (38 per pass) until a film is picked for submission.
- `kling3_0_turbo` is the same 1.5/sec as std and only accepts `start_image`, so it breaks the two-frame method for zero saving. Not a budget option.
- Genuinely cheaper video at 1.0/sec: `veo3_1_lite` (audio off, durations 4/6/8 only) and `seedance_2_0_mini` at 480p. Both keep `start_image` plus `end_image`.
- `flux_3_video` is a flat **90 credits per generation**. It is almost never the right call here.
- Images: `nano_banana_2_lite` costs **1**, `nano_banana_pro` and `nano_banana_2` cost 2, GPT Image 2.0 costs 7. Lite takes `image_references`, so it does frame-consistency work at half price. Default to it for storyboard frames.
- Narration: `Voiceover` is 0.3 per line, `Text to Speech` is 2. Use Voiceover.
- **Images are not free in aggregate.** On 11.8 the day cost 767.75 credits and it split almost evenly: 393.75 on 26 Kling clips and 374 on 189 Nano Banana Pro frames. Each frame felt free at 2 credits and together they matched a whole film. Count frames, not just clips.
- **Bursts are deliberate waste.** A five-cut burst generates 15 seconds to use 6. Kling will not go under 3 seconds, so short cuts are trimmed long clips. Cut bursts first when credits are tight.
- **The scheduled tasks spend from the same balance, concurrently.** On 12.8 the daily automation spent 300 credits on 19 Kling clips inside the same two minutes as a manual batch, plus 22 on TTS and 8 on frames. Read `balance` immediately before and after any planned batch, and never plan a budget as though this session is the only spender.
