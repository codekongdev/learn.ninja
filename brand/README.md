# Brand files

Share images for the places that take an upload instead of a link. All three are the site's link
preview card (`apps/web/lib/og.tsx`) at another size. Regenerate them after changing the card:

```bash
npm run share -w web
```

| File | Size | Where it goes |
| --- | --- | --- |
| `github-social-preview.png` | 1280×640 | GitHub → repo Settings → Social preview |
| `x-banner.png` | 1500×500 | The X profile header |
| `square.png` | 1080×1080 | Posts on LinkedIn, WhatsApp, launch sites |

Link previews themselves are served live: `/opengraph-image` for the site and `/lessons/{slug}/opengraph-image` or `/l/{slug}-{id}/opengraph-image` for a lesson.
