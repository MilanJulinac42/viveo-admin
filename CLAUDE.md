# Viveo Admin

Admin panel za Viveo platformu. Zasebna Next.js aplikacija koja koristi isti backend API.

## Tech Stack
- Next.js 16.1.6 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (isti theme kao viveo-client: primary=purple, secondary=amber, accent=emerald, + danger=red)
- Framer Motion

## Projekat struktura
- `src/app/prijava/page.tsx` — Login stranica (samo admin role)
- `src/app/(admin)/` — Route group sa AdminLayout wrapperom
  - `page.tsx` — Dashboard (stat kartice, poslednjih 5 narudžbina, pending prijave, dnevni chart)
  - `korisnici/` — Lista korisnika + detalji (promena uloge)
  - `zvezde/` — Lista zvezda + detalji (edit, verifikacija, brisanje)
  - `narudzbine/` — Lista narudžbina + detalji (status override)
  - `prijave/` — Lista prijava + detalji (odobri/odbij)
  - `kategorije/` — CRUD sa modalom
- `src/components/layout/` — AdminSidebar, AdminLayout, AdminHeader
- `src/components/ui/` — Button, Badge, DataTable, StatCard, Modal, SearchInput, LoadingSpinner
- `src/context/AuthContext.tsx` — auth state (localStorage: viveo_admin_token, viveo_admin_user)
- `src/lib/api/client.ts` — API client (isti pattern kao viveo-client, ali sa admin token keyevima)
- `src/lib/api/auth.ts` — login sa admin role provera
- `src/lib/api/admin.ts` — svi admin API pozivi (getStats, getUsers, getCelebrities, getOrders, getApplications, getCategories + CRUD)
- `src/lib/types.ts` — admin-specifični tipovi
- `src/middleware.ts` — Next.js middleware (redirect na /prijava ako nema cookie tokena)

## API
- `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- Svi pozivi idu na `/api/admin/*` endpointe (requireAuth + requireRole('admin'))

## Povezani projekti
- **viveo-backend** (`../viveo-backend`) — Express 5 API na portu 3001
- **viveo-client** (`../viveo-client`) — Glavni frontend

## Git
- Samo `main` grana (za sada)
- Repo: github.com/MilanJulinac42/viveo-admin

## Da bi testirao
1. U Supabase dashboard-u, promeni `role` na `'admin'` u `profiles` tabeli za željenog korisnika
2. Pokreni backend: `cd ../viveo-backend && npm run dev` (port 3001)
3. Pokreni admin: `npm run dev` (default port 3000 ili sledeći slobodan)
4. Otvori `/prijava` i uloguj se sa admin email/password
5. CORS: backend FRONTEND_URL mora da sadrži port na kom admin radi

## Važne napomene
- Login na admin panel setuje cookie `viveo_admin_token` za middleware, i localStorage za auth context
- Admin provera je dupla: frontend (AuthContext + middleware) + backend (requireRole('admin'))
- Nema registracije — admin se kreira ručno u Supabase
- robots: noindex, nofollow na svim stranicama
