# CareerPilot Tracker

A capstone-level React job application tracker for students with authentication, CRUD, multi-step forms, analytics, API job listings, dark mode, search/filter/sort, pagination, and localStorage persistence.

## Run locally

```bash
npm install
npm run dev
```

## Optional API key

The app supports JSearch via RapidAPI. Copy `.env.example` to `.env` and add:

```bash
VITE_RAPIDAPI_KEY=your_key
VITE_RAPIDAPI_HOST=jsearch.p.rapidapi.com
```

If no key is configured, the UI falls back to the public Arbeitnow job API.

## Deploy

- Vercel: import the repo and use `npm run build`.
- Netlify: import the repo or use the included `netlify.toml`.
