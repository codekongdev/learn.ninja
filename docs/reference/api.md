---
title: Publish API
description: The HTTP API behind publishing. The CLI uses it; you can too.
---

Base URL: `https://learn.ninja`. Requests and responses are JSON. There's no account or API key: publishing returns an edit token for that one lesson.

## Publish a lesson

```http
POST /api/lessons
Content-Type: application/json
```

The body is the lesson file. A valid lesson returns `201`:

```json
{
  "ok": true,
  "id": "k3x9a2mq",
  "url": "https://learn.ninja/l/how-compound-interest-works-k3x9a2mq",
  "editToken": "…",
  "expiresAt": "2026-10-09T09:00:00.000Z",
  "spec": "0.3"
}
```

Keep `editToken` private: it's the only way to update the lesson, and it's shown once.

## Update a lesson

```http
PUT /api/lessons/{id}
Content-Type: application/json
Authorization: Bearer <editToken>
```

The body is the new lesson file. The link and the expiry stay the same. Returns `200` with the same fields as publishing, without `editToken`.

## Errors

Errors return `"ok": false` with an `error` code and a `message`.

| Status | `error` | Meaning |
| --- | --- | --- |
| 401 | `unauthorized` | The edit token doesn't match this lesson |
| 404 | `not_found` | The lesson doesn't exist or has expired |
| 413 | `too_large` | The lesson file is too big |
| 422 | `invalid_lesson` | The lesson breaks the format; the response lists each issue |
| 422 | `unsupported_spec` | The lesson's `spec` version isn't supported |
| 429 | `rate_limited` | Too many publishes from one place; try again later |

## Limits

- 20 publishes or updates an hour from one place.
- Lessons expire 24 hours after they're first published.
