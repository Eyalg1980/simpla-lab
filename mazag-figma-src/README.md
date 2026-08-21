# mazag, Figma import copies

Figma renders PNG and JPEG image fills but not WebP: a webp upload returns
success with a valid imageHash and then draws as an empty rectangle.

The site under `mazag/` ships webp. These are the same images re-encoded for
importing into the Figma file, and they live outside `mazag/` on purpose so the
deployed folder stays free of files nothing references.
