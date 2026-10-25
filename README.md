# The Internet Museum of Bad Decisions

A responsive museum for anonymously submitted stories of everyday questionable judgment. Submissions remain private until an administrator approves them.

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, Supabase PostgreSQL and Auth, optional server-side OpenAI curation, and Vercel.

## Local setup

1. Install Node.js 20.9 or newer.
2. Create a Supabase project and apply `supabase/migrations/202610240001_initial.sql` in the SQL editor or with the Supabase CLI.
3. In Supabase Auth, enable email/password sign-in. Create the first staff account from the Supabase dashboard, then add its UUID to `public.admin_roles` using the SQL editor:

   ```sql
   insert into public.admin_roles(user_id) values ('YOUR_AUTH_USER_UUID');
   ```

   Do not expose administrator provisioning through the public application or trust user metadata/email as a role.
4. Copy `.env.example` to `.env.local` and fill in the project URL, publishable key, and service-role key. The service-role key is server-only. Choose a random `RATE_LIMIT_SALT` for hashing the IP rate limit identifier. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin for production links and metadata.
5. Optionally set `OPENAI_API_KEY` and `OPENAI_MODEL`. The app falls back to a safe local curator when no key is set.
6. Run `npm install`, then `npm run dev` and open http://localhost:3000.

## Scripts

```sh
npm run dev
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm start
```

Before the first browser test run, install Playwright's Chromium binary with `npx playwright install chromium`.

## Vercel deployment

1. Push this project to a GitHub repository.
2. Import the repository in Vercel; the Next.js framework preset is detected automatically.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_SALT`, and `NEXT_PUBLIC_SITE_URL` to the Vercel Production environment. Add `OPENAI_API_KEY` only if AI curation is wanted.
4. Deploy. No Docker, persistent filesystem, or background worker is required.
5. Confirm the migration is applied, the administrator role row exists, and that Auth site URL/redirect URLs include the production domain.
6. Smoke test: load the homepage and empty galleries; submit a story; confirm it is not public; sign in at `/admin/login`; edit and approve the story; open `/exhibit/<id>`; add a reaction; file a report; test the generated `/api/og/<id>` image; hide the exhibit and confirm public routes no longer expose it.

## Security and moderation

- Public reads use approved-only RLS; pending and rejected stories are not visible through the public database role.
- Writes are handled by server routes using the service-role secret. Never use that key in a `NEXT_PUBLIC_` variable or browser bundle.
- Admin access requires a Supabase authenticated user plus a row in `admin_roles`; UI state, email, and editable user metadata do not grant access.
- Anonymous submissions are validated, rate-limited in PostgreSQL, and checked for common email/phone patterns. This is a baseline filter, not a substitute for moderation. Review all submissions before approval.
- IP identifiers are SHA-256 hashed with a configurable secret salt and stored only in the rate-limit table. Periodically delete old rate-limit rows if operationally useful.
- Reactions use the request's visitor IP as a best-effort uniqueness key. For stronger abuse resistance, add a privacy-respecting signed visitor cookie or a CAPTCHA provider.

## Current implementation notes

The app deliberately starts with empty galleries; no fabricated stories or engagement metrics are seeded. The Hall of Shame currently lists approved exhibits in newest-first order and is not yet a true weekly ranking. The certificate action prints the exhibit page so users can save it as PDF/image through the browser; a native PNG download can be added later. Administrator category management and a dedicated report-resolution action are not included yet. The privacy and terms copy is a product baseline, not jurisdiction-specific legal advice.
