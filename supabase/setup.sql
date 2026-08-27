-- =====================================================================
--  BEN PORTFOLIO — COMPLETE SUPABASE SETUP
--  Run this ONCE in: Supabase Dashboard -> SQL Editor -> New query
--  Project: https://oavchmjzxjhwkltiowll.supabase.co
-- =====================================================================
--  OWNER EMAIL: r.prakaash@yahoo.com  (set in section 1 below)
--  That address is the ONLY one allowed to log in and edit the site.
--  It must match VITE_OWNER_EMAIL in the website's .env file.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. OWNER CONFIG
--    Kept separate from the public "contact email" shown on the site, so
--    editing that field on the page can never lock you out of editing.
-- ---------------------------------------------------------------------
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);

alter table public.app_config enable row level security;
-- No policies granted: default-deny for anon/authenticated. It is only ever
-- read through the security-definer function below, which bypasses RLS.

insert into public.app_config (key, value)
values ('owner_email', 'r.prakaash@yahoo.com')
on conflict (key) do update set value = excluded.value;


-- ---------------------------------------------------------------------
-- 2. OWNERSHIP CHECK
--    Returns true only when the caller's JWT email matches owner_email.
-- ---------------------------------------------------------------------
create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.app_config
    where key = 'owner_email'
      and lower(value) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to anon, authenticated;


-- ---------------------------------------------------------------------
-- 3. PORTFOLIO CONTENT (single row, whole site as JSON)
-- ---------------------------------------------------------------------
create table if not exists public.portfolio_content (
  id         smallint primary key default 1,
  content    jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  constraint portfolio_content_singleton check (id = 1)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists portfolio_content_set_updated_at on public.portfolio_content;
create trigger portfolio_content_set_updated_at
before insert or update on public.portfolio_content
for each row execute function public.set_updated_at();

alter table public.portfolio_content enable row level security;

-- Anyone (including logged-out visitors) may READ the site content
drop policy if exists "portfolio_content_public_read" on public.portfolio_content;
create policy "portfolio_content_public_read"
  on public.portfolio_content
  for select
  to anon, authenticated
  using (true);

-- Only the verified owner may CREATE or CHANGE it
drop policy if exists "portfolio_content_owner_insert" on public.portfolio_content;
create policy "portfolio_content_owner_insert"
  on public.portfolio_content
  for insert
  to authenticated
  with check (public.is_owner());

drop policy if exists "portfolio_content_owner_update" on public.portfolio_content;
create policy "portfolio_content_owner_update"
  on public.portfolio_content
  for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Deliberately NO delete policy: the singleton row must never be removed.


-- ---------------------------------------------------------------------
-- 4. IMAGE STORAGE BUCKET
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio_media_public_read" on storage.objects;
create policy "portfolio_media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio-media');

drop policy if exists "portfolio_media_owner_insert" on storage.objects;
create policy "portfolio_media_owner_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_owner());

drop policy if exists "portfolio_media_owner_update" on storage.objects;
create policy "portfolio_media_owner_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_owner())
  with check (bucket_id = 'portfolio-media' and public.is_owner());

drop policy if exists "portfolio_media_owner_delete" on storage.objects;
create policy "portfolio_media_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_owner());


-- ---------------------------------------------------------------------
-- 5. SEED THE INITIAL ROW
--    Creates an empty shell row. The website fills it with your real
--    default content the first time you open the editor and hit Save.
-- ---------------------------------------------------------------------
insert into public.portfolio_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- DONE. Verify with:
--   select id, jsonb_typeof(content), updated_at from public.portfolio_content;
-- ---------------------------------------------------------------------
