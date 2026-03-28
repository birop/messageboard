# MessageBoard

Egyszeru, publikusan elerheto uzenofal `Next.js` + `Supabase` + `Vercel` alapon.

## Funkciok

- uj uzenet mentese
- uzenetek listazasa forditott idorendben
- bejegyzes torlese egy kattintassal
- szerveroldali API route-ok a Supabase elereshez

## Technologia

- JavaScript
- Next.js 14
- Supabase
- Vercel

## Lokalis inditas

1. Telepits Node.js 20 vagy ujabb verziot.
2. Telepitsd a fuggosegeket:

```bash
npm install
```

3. Hozz letre egy `.env.local` fajlt a mintafajl alapjan:

```bash
cp .env.example .env.local
```

4. Add meg az alabbi ertekeket:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

5. Inditsd el a fejlesztoi szervert:

```bash
npm run dev
```

## Supabase tabla letrehozasa

Futtasd le az alabbi SQL-t a Supabase SQL Editorban:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);
```

Mivel ez az MVP teljesen publikus, engedelyezd a megfelelo RLS policy-kat vagy kapcsold ki az RLS-t a `messages` tablahan az elso teszteleshez. Ha az RLS be van kapcsolva, szukseges legalabb:

- `select` anonim olvasashoz
- `insert` anonim letrehozashoz
- `delete` anonim torleshez

## Vercel deploy

1. Toltsd fel a projektet egy GitHub repository-ba.
2. A Vercelben hozz letre uj projektet a GitHub repo alapjan.
3. A Vercel projekt beallitasainal add meg a kornyezeti valtozokat:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

4. Deploy utan a projekt publikus URL-en elerheto lesz.

## API vegpontok

- `GET /api/messages`
- `POST /api/messages`
- `DELETE /api/messages/:id`
