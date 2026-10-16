# simpla-object: "From Abstract to Object"

The new Simpla site, approach A from the October 2026 research: one continuous clay film scrubbed by scroll,
then seven solutions, the Object Track, packages by client type, work, films, teaching, about, contact.

Live: https://eyalg1980.github.io/simpla-lab/simpla-object/

## The film
One single-take seedance_2_5 render per aspect, 30s, 720p, no audio, omni_reference with the 7 navy plates.
Beats: rough lump, cinema camera, wireframe phone, node tiles with coral strings, clay classroom, clay city, polished sphere.

| | job | scrub file (keyframe every 4 frames) |
|---|---|---|
| 16:9 | 5d71d29f-22e3-485e-95d9-b3e4f1e827ba | d2ol7oe51mr4n9 .../404425f7-3224-4767-8e51-a1a4725c17e7.mp4 (6.6MB) |
| 9:16 | d6f40b68-4fcb-4f56-8d43-7c61a29e57fa | d2ol7oe51mr4n9 .../7ada9d0a-e524-4256-9076-97ecc6d8fd3c.mp4 (5.0MB) |

Chapter end times differ per render because the morphs land at different moments:
- wide `cutsWide: [4.1, 10.8, 14.9, 18.0, 21.2, 26.7, 30.0]`
- tall `cutsTall: [4.6, 9.4, 15.5, 19.6, 23.6, 27.4, 30.0]`
- scroll `weights: [1.2, 1.9, 1.7, 1.7, 1.7, 1.8, 1.6]`

Re-encode used for smooth scrubbing (run in the Higgsfield sandbox, the only place that reaches the CDN):
```
ffmpeg -i wide.mp4 -an -vf "scale=1280:720,format=yuv420p" -c:v libx264 -preset slow -crf 22 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart so-film-wide.mp4
ffmpeg -i tall.mp4 -an -vf "scale=720:1280,format=yuv420p" -c:v libx264 -preset slow -crf 24 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart so-film-tall.mp4
```
Higgsfield presigned uploads need the header `If-None-Match: *` or the PUT is rejected.

## Plates (nano_banana_pro, 16:9, deep navy void #0D1533)
1 lump 087a34c9-4d79-44fe-abee-0babc1fed230 (the reference for all others),
2 camera cba2f395-281c-4a45-93b4-998c1032024f, 3 phone 77878dfe-10cd-47df-a059-8e64bf479238,
4 nodes 41022eb9-7b61-4c82-8d41-22f2c885d4ff, 5 classroom db8f7f2d-91f5-47d8-8773-e00591276878,
6 city f4630504-e225-49bc-8f35-911f659e4330, 7 sphere ce3e8fc4-18b4-4476-847f-eb73d46e05d3.

## Page
Single self-contained `index.html`, Hebrew RTL, Rubik + Poppins, dark (default) and light with a stored toggle.
The stage is one sticky video, scroll maps to `currentTime` with easing, poster first for LCP.
Falls back to seven stacked stills on `prefers-reduced-motion` or when the video fails to load.
Content lives in the JS constants `SOLUTIONS`, `AUDIENCES`, `CASES`, `FILMS` at the top of the script.

Open items: client names Finout and Broni Gas appear anonymised until approved; no English version yet.
