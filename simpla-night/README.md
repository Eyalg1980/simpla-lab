# simpla-night: "Night Broadcast"

Approach B for the new Simpla site. Rebuilt on 17.10.2026 after Eyal's review: the first version made you
scroll through every channel on the TV before reaching any content, which broke the hierarchy on mobile.

Live: https://eyalg1980.github.io/simpla-lab/simpla-night/

## Structure: one page per channel
- `./` is CH 00, the hub: program guide (every channel as a row) and packages by client type.
- `?ch=01` Studio, `?ch=02` Spec, `?ch=03` Flows, `?ch=04` Lab (plus Academy as VOD), `?ch=05` Adopt (plus the Object series), `?ch=99` Guide (plus behind the scenes).
- Every channel page opens with a compact TV that loops that channel's cut, the headline beside it (below it on mobile),
  then the channel's own blocks: works, the offer, extras, and an "up next" card. Contact sits at the bottom of every page.
- It is a single file: channels render from the `CHANNELS` array and switch with `history.pushState`, so each channel has its
  own URL, the back gesture works, and the TV zaps with a static burst instead of a page reload.
- Ways to change channel: the remote under the TV, swiping the TV, number keys (0 to 5, 9 for 99), the nav links on desktop,
  the guide sheet on smaller screens, and the "up next" card.
- Works open in a full-screen viewer with prev/next inside the channel. Deep link: `?ch=01#w-savior`.

## The TV
`0656125a` is one 800x600 file with every channel's cut (CH 00 is 0 to 3s, then 4s per channel), keyframe every 4 frames.
`CFG.starts` / `CFG.cuts` bound each channel; a rAF watcher keeps playback inside the current cut. The TV photo is
`670097f7` (1600x1194); the screen overlay sits at left 25.5%, top 27.23%, 39.54% x 41.13% of it.
On reduced motion or a load error the TV shows the channel still (`CH` array) instead.
