# Luau Hub

A production-ready Next.js App Router interface for publishing Roblox Luau scripts to Pastefy or Pastebin, with generated raw URLs and loadstrings.

## Run locally

```bash
npm install
npm run dev
```

Pastebin uploads use `app/api/pastebin/route.ts` as a same-origin server proxy because Pastebin's API does not support browser CORS. Pastefy is called directly from the browser according to its API contract.
