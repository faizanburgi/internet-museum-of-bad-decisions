create extension if not exists pgcrypto;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.exhibits (
  id uuid primary key default gen_random_uuid(),
  exhibit_number bigint generated always as identity unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  original_story text not null check (char_length(original_story) between 30 and 1000),
  curated_title text not null check (char_length(curated_title) between 3 and 90),
  curated_description text not null check (char_length(curated_description) between 15 and 700),
  public_display_name text check (public_display_name is null or char_length(public_display_name) <= 50),
  is_anonymous boolean not null default true,
  classification text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','hidden')),
  submitted_at timestamptz not null default now(),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);
create index exhibits_public_recent on public.exhibits(status,published_at desc) where status='approved';
create index exhibits_category_public on public.exhibits(category_id,published_at desc) where status='approved';

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  exhibit_id uuid not null references public.exhibits(id) on delete cascade,
  visitor_key text not null,
  reaction_type text not null check (reaction_type in ('helpful','relatable','legendary','same')),
  created_at timestamptz not null default now(),
  unique(exhibit_id,visitor_key,reaction_type)
);
create index reactions_exhibit on public.reactions(exhibit_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  exhibit_id uuid not null references public.exhibits(id) on delete cascade,
  reason text not null check(char_length(reason) between 8 and 500),
  status text not null default 'open' check(status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);
create index reports_open on public.reports(status,created_at desc) where status='open';

create table public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  exhibit_id uuid references public.exhibits(id) on delete set null,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null check(action in ('approved','rejected','hidden','edited')),
  previous_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index moderation_events_exhibit on public.moderation_events(exhibit_id,created_at desc);

create table public.submission_rate_limits (
  visitor_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check(request_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.submission_rate_limits enable row level security;
revoke all on public.submission_rate_limits from anon,authenticated;

create or replace function public.consume_submission_rate_limit(visitor_hash text, maximum integer, window_minutes integer)
returns boolean language plpgsql security definer set search_path=public as $$
declare current_row public.submission_rate_limits%rowtype;
begin
  insert into public.submission_rate_limits(visitor_hash,window_started_at,request_count)
  values(consume_submission_rate_limit.visitor_hash,now(),1)
  on conflict(visitor_hash) do nothing;
  select * into current_row from public.submission_rate_limits where submission_rate_limits.visitor_hash=consume_submission_rate_limit.visitor_hash for update;
  if current_row.window_started_at < now() - make_interval(mins=>window_minutes) then
    update public.submission_rate_limits set window_started_at=now(),request_count=1,updated_at=now() where submission_rate_limits.visitor_hash=consume_submission_rate_limit.visitor_hash;
    return true;
  end if;
  if current_row.request_count >= maximum then return false; end if;
  update public.submission_rate_limits set request_count=request_count+1,updated_at=now() where submission_rate_limits.visitor_hash=consume_submission_rate_limit.visitor_hash;
  return true;
end $$;
revoke all on function public.consume_submission_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_submission_rate_limit(text,integer,integer) to service_role;

insert into public.categories(slug,title,description) values
('academic-miscalculations','The Academic Miscalculations Wing','A permanent record of scholarly confidence meeting practical reality.'),
('technology-crimes','The Technology Crimes Division','Digital disasters, accidental messages, and devices with evidence.'),
('romantic-catastrophes','The Romantic Catastrophes Hall','Tender intentions, regrettable texts, and courtship under review.'),
('kitchen-disasters','The Kitchen Disasters Wing','Culinary experiments that challenged the smoke detector.'),
('financial-regrets','The Financial Regrets Collection','Purchases made with confidence and explained with silence.'),
('social-embarrassments','The Social Embarrassments Gallery','Awkward encounters preserved at their most awkward.'),
('3am-decisions','The Department of 3 AM Decisions','Ideas that seemed excellent after midnight. Allegedly.'),
('miscellaneous-regrets','The Miscellaneous Hall of Regret','For incidents that defy every existing department.');

alter table public.categories enable row level security;
alter table public.exhibits enable row level security;
alter table public.reactions enable row level security;
alter table public.reports enable row level security;
alter table public.admin_roles enable row level security;
alter table public.moderation_events enable row level security;

create policy "categories are public" on public.categories for select to anon,authenticated using (true);
create policy "approved exhibits are public" on public.exhibits for select to anon,authenticated using (status='approved');
create policy "approved exhibit reactions are public" on public.reactions for select to anon,authenticated using (exists(select 1 from public.exhibits e where e.id=exhibit_id and e.status='approved'));
create policy "administrators read own role" on public.admin_roles for select to authenticated using (auth.uid()=user_id);
create policy "administrators read moderation events" on public.moderation_events for select to authenticated using (exists(select 1 from public.admin_roles r where r.user_id=auth.uid()));
revoke all on public.exhibits,public.reactions,public.reports,public.admin_roles,public.moderation_events from anon,authenticated;
grant select on public.categories to anon,authenticated;
grant select on public.exhibits to anon,authenticated;
grant select on public.reactions to anon,authenticated;
grant select on public.admin_roles,public.moderation_events to authenticated;
