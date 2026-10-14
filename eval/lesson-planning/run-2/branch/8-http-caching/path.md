# HTTP caching (from MDN's "HTTP caching" guide)

Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching

Why this order: a cache first decides whether a stored response is still fresh; then what it does with a stale one (revalidation); then who may store it and the directives that control that; and finally how those pieces combine into a caching setup for a real site.

| # | Title | One idea | Status |
| --- | --- | --- | --- |
| 1 | Fresh or stale: how long caches reuse responses | Freshness: `max-age`, `Age`, heuristic caching, and `Expires` decide how long a stored response is reused without asking the server | http://localhost:3000/l/fresh-or-stale-how-long-caches-reuse-responses-fzwpv8ma (expires Thu, 15 Oct 2026 07:31:59 GMT) |
| 2 | Revalidation: ETag, If-None-Match, and 304 | A stale response is checked with a conditional request (`If-Modified-Since` / `If-None-Match`) and refreshed by a cheap `304 Not Modified` | not made yet |
| 3 | private, no-cache, no-store: who may keep it | Private vs shared caches; `private` stops sharing, `no-cache` forces revalidation, `no-store` stops storing (and what it costs); `Vary` splits the cache key | not made yet |
| 4 | Caching a real site: cache busting and HTML | Versioned asset URLs with a long `max-age` (+ `immutable`), `no-cache` (+ `private`) for HTML, and why stored responses can't be deleted except in managed caches | not made yet |
