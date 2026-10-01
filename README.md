# Pastefy

Pastefy is a polished Next.js App Router workspace for publishing Roblox Luau scripts to Pastefy or Pastebin. It generates the raw URL and a copy-ready `loadstring(game:HttpGet(...))()` wrapper.

## Run locally

```bash
npm install
npm run dev
```

Pastebin uploads use `app/api/pastebin/route.ts` as a same-origin server proxy because Pastebin's API does not support browser CORS. Pastefy is called directly from the browser according to its API contract.

Only publish and execute code you own or trust, and follow the terms of Roblox and each paste provider.
