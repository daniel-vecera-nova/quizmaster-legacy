# rozlucka-michal — recreated source

This directory contains a fully recreated source tree for the
**rozlucka-michal** Cloudflare Pages app (live at
`https://rozlucka-michal.pages.dev`).

The original app shipped to production with **no Functions/Worker
deployed** (only static assets), so every API call from the SPA was
landing on Cloudflare's static-asset handler and returning **HTTP 405**
with an empty body. The form looked dead because the frontend was
catching the failed `fetch` and silently setting an error state.

Everything in this directory is reconstructed from the live deploy by
reverse-engineering the SPA bundle — there is no upstream source repo
referenced.

## Layout

```
rozlucka-michal-recreated/
├── dist/                  # Static SPA bytes pulled from the live site
│   ├── index.html
│   ├── sw.js              # Push notification handler (PWA)
│   ├── manifest.webmanifest
│   ├── assets/            # JS bundle + CSS (JS is patched: see below)
│   ├── icons/
│   └── michal-photos/     # 40 background photos
├── functions/             # Pages Functions implementation (TS)
│   ├── _middleware.ts     # CORS
│   ├── _lib/
│   │   ├── storage.ts     # KV schema + helpers
│   │   └── vapid.ts       # ES256 JWT signer + empty-payload push
│   └── api/
│       ├── submissions.ts            # POST   /api/submissions
│       ├── feed/index.ts             # GET    /api/feed
│       ├── feed/[id]/index.ts        # DELETE /api/feed/:id
│       ├── feed/[id]/read.ts         # POST   /api/feed/:id/read
│       ├── push/subscribe.ts         # POST   /api/push/subscribe
│       ├── push/vapid-public.ts      # GET    /api/push/vapid-public
│       ├── photo/[id].ts             # GET    /api/photo/:id  (serves KV-stored photo)
│       └── admin/export.ts           # GET    /api/admin/export?format=json|csv  (Bearer)
├── worker.mjs             # Same logic flattened to a single Module Worker
│                          # (used when deploying via Workers Scripts API
│                          # instead of Pages Functions)
└── wrangler.toml          # Pages build config
```

## API contract (reverse-engineered from the SPA bundle)

The SPA's compiled JS calls these endpoints on the same origin:

| Method | Path                       | Auth      | Notes |
|--------|----------------------------|-----------|-------|
| POST   | /api/submissions           | none      | multipart/form-data: `language`, `q1_name`..`q9_one_sentence`, `extra`, `photo` |
| GET    | /api/feed[?limit=N]        | none      | Returns `{ submissions: [...], count: N }` |
| POST   | /api/feed/:id/read         | none      | Marks Michal-read (used in `michalo` view) |
| DELETE | /api/feed/:id              | none      | Hard delete (used in `michalo` view) |
| GET    | /api/push/vapid-public     | none      | `{ publicKey }` |
| POST   | /api/push/subscribe        | none      | Body: `{ endpoint, keys: { p256dh, auth }, userAgent, label }` |
| GET    | /api/admin/export?format=  | Bearer    | `format=json|csv`, downloads dump (used at `/admin`) |

The submission shape stored and returned by `/api/feed` is:

```
{ id, language, name,
  q1_name, q2_relation, q3_meeting,
  q4_realised?, q5_growth?, q6_story?, q7_taught?, q8_wish_more?, q9_one_sentence?,
  extra?,
  photoUrl,                  // points to /api/photo/:id (served from KV)
  photoContentType,
  submittedAt,               // Date.now() ms
  michaloReadAt? }           // Date.now() ms, set when Michal opens the card
```

## Storage (Cloudflare KV)

Namespace: `KV` → `e2ebb64fd0544e0e85fb1e73522f59b6` (`ROZLUCKA`)

| Key pattern        | Value                                   |
|--------------------|------------------------------------------|
| `submission:<id>`  | JSON submission record                   |
| `photo:<id>`       | image bytes + metadata `{ contentType }` |
| `feed_snapshot`    | JSON array `[{ id, submittedAt }, ...]` sorted desc |
| `push:<sha256-of-endpoint>` | JSON push subscription             |

## Required environment variables

| Name             | Type        | Value                                                |
|------------------|-------------|------------------------------------------------------|
| `ADMIN_KEY`      | secret_text | random 24-byte url-safe base64 (set during deploy)   |
| `VAPID_PUBLIC`   | secret_text | b64url of P-256 public key (65 bytes, prefix 0x04)   |
| `VAPID_PRIVATE`  | secret_text | b64url of P-256 private scalar (32 bytes)            |
| `VAPID_SUBJECT`  | plain_text  | `mailto:daniel.vecera@nova.cz`                       |
| `PUBLIC_URL`     | plain_text  | Public origin used to build `photoUrl`               |

Generate VAPID keys with:

```
openssl ecparam -name prime256v1 -genkey -noout -out vapid.pem
openssl ec -in vapid.pem -text -noout              # extract priv scalar (32 bytes)
openssl ec -in vapid.pem -pubout -outform DER | tail -c 65   # raw public 65 bytes
```

Encode both as base64url (no padding).

## Push notification flow

The service worker (`dist/sw.js`) only handles **empty pushes**: when
a push arrives without a payload, it fetches `/api/feed?limit=1` and
shows a notification for the latest entry. So the worker code only
needs to send VAPID-signed empty POSTs to each subscription endpoint
(`worker.mjs:notifySubscribers`) — no payload encryption needed.

## Two deployment paths

This account currently has **Workers execution blocked** (HTTP 429 /
`error code: 1027` on every worker route). Until that is unblocked once
in the dashboard (Workers & Pages → accept ToS), the form will keep
returning 405 in production. After that:

### Path A — Pages Functions (preferred, same origin)

```
cd rozlucka-michal-recreated
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=f321662ae21d0592d8b75bd8ddecc241
npx wrangler pages deploy dist --project-name rozlucka-michal --branch main
```

This works only if the Pages API issues an upload-token with
`features: ["files","functions"]`. The current token gets
`features: ["files"]` only, so Functions are silently dropped.

### Path B — Standalone Worker behind a custom domain

```
# Already deployed during this session:
#   script:  rozlucka-michal-api
#   route:   https://rozlucka-api.agenticprague.com/*
# SPA bundle has been patched: var ve = `https://rozlucka-api.agenticprague.com`
# Just needs the account-level Workers gate cleared.
```
