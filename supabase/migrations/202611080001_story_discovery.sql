alter table public.exhibits
  add column search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(curated_title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(curated_description, '')), 'B')
  ) stored;

create index exhibits_public_search on public.exhibits using gin(search_document)
  where status = 'approved';

revoke select on public.exhibits from anon, authenticated;
grant select (
  id,
  exhibit_number,
  category_id,
  curated_title,
  curated_description,
  public_display_name,
  is_anonymous,
  classification,
  published_at
) on public.exhibits to anon, authenticated;

create or replace function public.search_public_exhibits(
  search_text text,
  filter_category text,
  sort_mode text,
  requested_page_size integer,
  requested_page_offset integer
)
returns table (
  id uuid,
  exhibit_number bigint,
  category_id uuid,
  category_slug text,
  classification text,
  curated_title text,
  curated_description text,
  public_display_name text,
  is_anonymous boolean,
  published_at timestamptz,
  reaction_count bigint,
  total_count bigint
)
language sql
stable
set search_path = public
as $$
  with matching as (
    select
      e.id,
      e.exhibit_number,
      e.category_id,
      c.slug as category_slug,
      e.classification,
      e.curated_title,
      e.curated_description,
      e.public_display_name,
      e.is_anonymous,
      e.published_at,
      count(r.id)::bigint as reaction_count
    from public.exhibits e
    join public.categories c on c.id = e.category_id
    left join public.reactions r on r.exhibit_id = e.id
    where e.status = 'approved'
      and (filter_category is null or c.slug = filter_category)
      and (
        nullif(btrim(search_text), '') is null
        or e.search_document @@ websearch_to_tsquery('english', search_text)
      )
    group by e.id, c.slug
  ),
  counted as (
    select matching.*, count(*) over ()::bigint as total_count
    from matching
  )
  select
    counted.id,
    counted.exhibit_number,
    counted.category_id,
    counted.category_slug,
    counted.classification,
    counted.curated_title,
    counted.curated_description,
    counted.public_display_name,
    counted.is_anonymous,
    counted.published_at,
    counted.reaction_count,
    counted.total_count
  from counted
  order by
    case when sort_mode = 'popular' then counted.reaction_count end desc,
    counted.published_at desc nulls last,
    counted.id asc
  limit greatest(1, least(coalesce(requested_page_size, 24), 60))
  offset greatest(coalesce(requested_page_offset, 0), 0);
$$;

revoke all on function public.search_public_exhibits(text, text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.search_public_exhibits(text, text, text, integer, integer) to service_role;
