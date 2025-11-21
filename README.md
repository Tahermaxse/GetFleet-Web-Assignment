## GetFleet Fleet Tracking – Web Assignment

This repo contains the **Web** portion of the “Frontend Assignment (Web + Mobile)” from `Assignment.txt`. It implements the required login experience and fleet dashboard using **Next.js 14 (App Router) + Tailwind + shadcn/ui + Leaflet + React Query**. The app talks to GetFleet’s staging APIs through the proxy defined in `next.config.mjs`.

---

### Tech Stack

- **Framework**: Next.js 14 (app router, TypeScript, middleware)
- **State / Data**: React Query, React Hook Form + Zod
- **Styling and UI**: Tailwind CSS, shadcn/ui primitives, Lucide icons
- **Map**: React Leaflet + OpenStreetMap tiles
- **Build Tooling**: Vercel-ready config, PostCSS/Tailwind pipeline

---

### Project Structure

| Path | Description |
| --- | --- |
| `app/` | App router pages (`/login`, `/dashboard`), global layout, providers |
| `components/auth` | Login card UI + validation + session bootstrap |
| `components/dashboard` | Map, filters, list, header, bottom nav |
| `components/ui` | Local shadcn/ui primitives (button, checkbox, input, select, drawer, etc.) |
| `lib/api` | Fetch helpers for `/session`, `/devices`, `/positions` plus merging logic |
| `lib/session` | Token persistence (localStorage + cookie) |
| `lib/constants` | Token key, staging token seed, API base |
| `middleware.ts` | Route guards for `/dashboard` (redirect if token missing) |
| `next.config.mjs` | CORS proxy rewrites (`/api/* → https://gps-staging.getfleet.ai/*`) |
| `app/providers.tsx` | Client-only wrapper that initializes a React Query client |

---

### Key Features

- **Login flow (UI only)**: Validates email/password + ToS checkbox with Zod; on submit the staging token is stored, `/session` is validated, and successful auth navigates to `/dashboard`.
- **Session persistence**: Token saved in `localStorage` + cookie for middleware to read server-side; `middleware.ts` redirects to `/login` when visiting protected routes without a token.
- **Fleet dashboard**: 
  - Map shows all latest device positions with Leaflet markers, highlighting the selected vehicle.
  - Filters include status tabs, search, and “All Groups” toggle using shadcn `Checkbox`.
  - Vehicle list cards display status, speed, timestamps, and location; clicking a card syncs with the map selection.
  - Tabs (Vehicles/Drivers/Alerts) + mobile-style bottom navigation replicate the Figma layout.
- **Data fetching**: `fetchFleetData` validates the session, requests `/devices` and `/positions`, merges them client-side, and caches via React Query with auto-refetch + retry logic.
- **Design alignment**: Tailwind tokens + custom styles replicate the provided mock (rounded containers, gradients, icons, etc.).

---

### Environment & Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE` | `/api` | Base path used by the API helper; defaults to the rewrite proxy |
| `GETFLEET_STAGING_TOKEN` | hard-coded staging token | Seed token stored client-side upon login (see `lib/constants.ts`) |

`next.config.mjs` already configures the required proxy:

```js
export default {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://gps-staging.getfleet.ai/api/:path*",
      },
    ]
  },
}
```

No additional `.env` is required unless you want to override `NEXT_PUBLIC_API_BASE`.

---

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run dev server**

   ```bash
   npm run dev
   ```

   The app redirects `/` to `/login`. After pressing “Sign In” the seeded staging token is stored and `/dashboard` becomes accessible.

3. **Lint / typecheck / build**

   ```bash
   npm run lint   # ESLint (Next.js config)
   npm run build  # Production build
   npm run start  # Serve build locally
   ```

   Deploy to Vercel normally (`vercel deploy`)—no extra configuration is needed.

---

### Architecture Notes

- **App Router + Middleware**: Server-side middleware performs lightweight auth checks (by looking for `getfleet_token` cookie) before reaching protected routes.
- **Client Providers**: `app/providers.tsx` is a client component that encapsulates the React Query client (`QueryClientProvider`) to avoid passing class instances from the server layout.
- **React Query**: `useQuery` handles session validation + data loading, caches responses for 30s, and refetches every minute. A custom retry function stops retrying when the error is `NO_TOKEN`.
- **Map Rendering**: `components/dashboard/fleet-map.tsx` wraps Leaflet primitives in memoized React components to avoid re-rendering. Zoom controls are hidden, and markers showcase device info in popups.
- **Form Handling**: `react-hook-form` + `zodResolver` power the login form with inline messaging, custom toggles, and visual feedback for pending/error states.
- **Token Utilities**: `lib/session.ts` keeps localStorage and cookies in sync so both client components and middleware can read the same token.

---

