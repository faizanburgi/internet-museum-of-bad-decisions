# The Internet Museum of Bad Decisions

A small, slightly unserious museum for the decisions we would rather learn from than repeat. Visitors can browse curated stories, search the collection, react to exhibits, and submit a story anonymously. New submissions stay private until a curator reviews and approves them.

## What the museum can do

- Browse approved stories by department, keyword, newest, or most-reacted; search and pagination state are kept in the URL so a collection view can be shared.
- Read individual exhibits, add one reaction per type, report an exhibit for review, share its link, or download its certificate as a PNG.
- Submit a story without creating an account. Submissions enter a private moderation queue and are not searchable or visible to visitors unless approved.
- Curate stories in a protected staff area: edit the public title and description, approve or reject submissions, and hide or republish exhibits.
- Create social preview images for exhibits. Optional OpenAI curation has a local fallback, so the submission flow does not require an AI API key.

## Built with

Next.js App Router, React, TypeScript, Tailwind CSS v4, Supabase PostgreSQL and Auth, optional server-side OpenAI curation, and Vercel. The site uses locally bundled fonts and artwork. Image sources and reuse details are in [the artwork credits](docs/homepage-art-credits.md).

## Run locally

### Requirements

- Node.js 20.9 or newer
- A Supabase project for submissions, search, reactions, reports, and administrator access

### Configure Supabase

1. Apply every SQL file in `supabase/migrations/` in filename order. The current migrations are:
   - `202610240001_initial.sql`
   - `202611080001_story_discovery.sql`
2. In Supabase Auth, enable email/password sign-in and create an account for each curator.
3. Grant staff access to each curator by adding their Auth user UUID in the SQL editor:

   ```sql
   insert into public.admin_roles (user_id)
   values ('YOUR_AUTH_USER_UUID');
   ```

   Administrator access depends on this role row; an email address or editable user metadata does not grant access. Do not add a public administrator registration flow.

### Configure the app

1. Copy `.env.example` to `.env.local`.
2. Set the Supabase project URL, publishable key, and server-only service-role key. Never prefix the service-role key with `NEXT_PUBLIC_`.
3. Set `NEXT_PUBLIC_SITE_URL` to the local or deployed origin. In production, configure a strong random `RATE_LIMIT_SALT` as well; it salts the hashed network identifier used for submission and reaction limits.
4. Optionally set `OPENAI_API_KEY` to enable AI-assisted curation. `OPENAI_MODEL` can select a model; without a key, the app uses its built-in curator. The OpenAI key is used only on the server.

Then install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages and routes

| Route | Purpose |
| --- | --- |
| `/` | The museum entrance and carousel rooms |
| `/museum` | Search and browse all approved stories |
| `/gallery/[slug]` | Search stories in a department |
| `/exhibit/[id]` | Read and share an approved exhibit, react, report, or download its certificate |
| `/hall-of-shame` | Community favorites, ordered by total reactions |
| `/submit` | Send a story to the private curation queue |
| `/about` | The museum’s purpose, privacy expectations, and curation process |
| `/privacy`, `/terms` | Privacy and terms information |
| `/admin/login`, `/admin` | Staff sign-in and moderation desk |
| `/api/og/[id]` | Exhibit social preview image |
| `/api/certificate/[id]` | Downloadable exhibit certificate PNG |

Collection search matches only curator-approved titles and descriptions. It does not index original submissions. Browse and department pages support keyword search, newest or most-reacted sorting, and URL-based pagination.

## Commands

```sh
npm run dev       # Start the local development server
npm run typecheck # Generate Next.js types and check TypeScript
npm run lint      # Run ESLint
npm test          # Run Vitest unit tests
npm run build     # Create a production build
npm start         # Serve the production build locally
npm run test:e2e  # Build and run Playwright end-to-end tests
```

For the first Playwright run, install its Chromium browser:

```sh
npx playwright install chromium
```

## Deploy to Vercel

1. Push the project to GitHub and import the repository in Vercel. Vercel detects the Next.js framework automatically.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, and a strong `RATE_LIMIT_SALT` to the Vercel Production environment. Add `OPENAI_API_KEY` only if AI curation is desired; set `OPENAI_MODEL` only when selecting a non-default model.
3. Apply all Supabase migrations and add at least one curator to `public.admin_roles`.
4. Add the production domain to the Supabase Auth site URL and redirect URL configuration.
5. Deploy. The app does not require a persistent filesystem, Docker image, or background worker.

### Production smoke check

After deployment, verify the following using a real Supabase project and a staff account:

1. Open the homepage, museum, and department pages. Empty collections are normal before stories have been approved.
2. Submit a story. Confirm it stays out of public search and exhibit routes while pending.
3. Sign in at `/admin/login`, edit the curated title or description, and approve the story.
4. Find it by curated text; try department filtering, both sort modes, pagination, and clearing filters.
5. Open the exhibit, add a reaction, share its URL, file a report, and download the certificate PNG.
6. Open its `/api/og/<id>` preview, then hide the exhibit in the staff area and confirm it is no longer publicly available.

## Privacy and moderation notes

- Submissions are anonymous and do not require an account, email address, photo, or location. Visitors should leave out identifying or sensitive details about themselves and other people.
- New submissions are private and pending until a curator approves them. Visitors see curated public text, not the original submission.
- Public database permissions and the discovery query are restricted to approved exhibits and curated fields. Mutations that require elevated database access run on the server.
- Staff access requires both an authenticated Supabase user and a matching `public.admin_roles` row. Moderation actions are recorded in the moderation events table.
- Submissions are validated, checked for common email and phone patterns, and rate-limited using a salted hash of the request network identifier. This is a baseline anti-abuse measure, not a replacement for human review.
- Reactions are deduplicated per exhibit, visitor network identifier, and reaction type. This is best-effort abuse prevention and is not strong identity verification.
- Reports enter the staff review queue. The current admin interface does not provide a separate report-resolution status action.
- The project starts with an empty collection; it does not seed fictional exhibits or engagement counts. The Hall of Shame is sorted by total reactions, not a time-limited weekly score.
- The privacy and terms pages are a product baseline. Review and adapt them for the operator’s jurisdiction and actual data practices before a public launch.

## Project layout

```text
src/app/                 App Router pages and server routes
src/components/          Shared interface and collection controls
src/lib/                 Supabase, discovery, curation, and domain logic
supabase/migrations/     Database schema, permissions, and search function
public/art/              Locally bundled illustrations and archival images
docs/                    Artwork credits and project documentation
```
