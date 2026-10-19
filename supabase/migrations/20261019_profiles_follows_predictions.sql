-- Applied to the Supabase project wfxotfqfgwtmhsnnobut on 19 Oct 2026.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Following someone is a friend request; two people who follow each other
-- are friends and can see each other's predictions.
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
create index follows_followee_idx on public.follows (followee_id);

create table public.predictions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  party_id text not null check (party_id ~ '^[a-z0-9]{2,20}$'),
  seats smallint not null check (seats between 0 and 120),
  updated_at timestamptz not null default now(),
  primary key (user_id, party_id)
);

-- Only answers for the signed-in user, never about two other people.
create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select a = auth.uid()
     and exists (select 1 from public.follows where follower_id = a and followee_id = b)
     and exists (select 1 from public.follows where follower_id = b and followee_id = a);
$$;
revoke execute on function public.are_friends(uuid, uuid) from public, anon;
grant execute on function public.are_friends(uuid, uuid) to authenticated;

-- Polls open at 07:00 Israel time on 27 Oct 2026 (05:00 UTC).
create or replace function public.predictions_open()
returns boolean
language sql stable set search_path = ''
as $$ select now() < timestamptz '2026-10-27 05:00:00+00' $$;

create or replace function public.check_prediction_total()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if (select coalesce(sum(seats), 0) from public.predictions where user_id = new.user_id) > 120 then
    raise exception 'predictions add up to more than 120 seats';
  end if;
  return null;
end;
$$;
create constraint trigger predictions_total
  after insert or update on public.predictions
  deferrable initially deferred
  for each row execute function public.check_prediction_total();

-- Create a profile when someone signs up (email or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  base text;
  name text;
  candidate text;
begin
  name := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(new.email, '@', 1)
  );
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base) < 3 then base := 'user' || base; end if;
  base := left(base, 14);
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base || floor(random() * 100000)::int::text;
  end loop;
  insert into public.profiles (id, username, display_name, avatar_url)
  values (new.id, candidate, left(name, 40), new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.predictions enable row level security;

create policy "signed-in users can find profiles" on public.profiles
  for select to authenticated using (true);
create policy "users edit their own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "see follows that involve you" on public.follows
  for select to authenticated
  using (follower_id = (select auth.uid()) or followee_id = (select auth.uid()));
create policy "follow as yourself" on public.follows
  for insert to authenticated with check (follower_id = (select auth.uid()));
create policy "unfollow, or remove a follower" on public.follows
  for delete to authenticated
  using (follower_id = (select auth.uid()) or followee_id = (select auth.uid()));

create policy "see your own and your friends' predictions" on public.predictions
  for select to authenticated
  using (user_id = (select auth.uid()) or public.are_friends((select auth.uid()), user_id));
create policy "add your own predictions before the vote" on public.predictions
  for insert to authenticated
  with check (user_id = (select auth.uid()) and public.predictions_open());
create policy "change your own predictions before the vote" on public.predictions
  for update to authenticated
  using (user_id = (select auth.uid()) and public.predictions_open())
  with check (user_id = (select auth.uid()) and public.predictions_open());
create policy "remove your own predictions before the vote" on public.predictions
  for delete to authenticated
  using (user_id = (select auth.uid()) and public.predictions_open());

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.check_prediction_total() from public, anon, authenticated;
