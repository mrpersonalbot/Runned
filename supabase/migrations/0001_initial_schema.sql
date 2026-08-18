-- Runned MVP schema: catalog + runner identity + structured experience + commerce signals.
create extension if not exists pgcrypto;
create extension if not exists citext;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique,
  display_name text,
  avatar_url text,
  country_code char(2) not null default 'ID',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.runner_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  sex text check (sex in ('male','female','other','prefer_not_to_say')),
  birth_year smallint check (birth_year between 1900 and 2100),
  height_cm numeric(5,2) check (height_cm > 0),
  weight_kg numeric(5,2) check (weight_kg > 0),
  weekly_km numeric(6,2) check (weekly_km >= 0),
  typical_pace_seconds_per_km integer check (typical_pace_seconds_per_km > 0),
  five_k_pr_seconds integer check (five_k_pr_seconds > 0),
  ten_k_pr_seconds integer check (ten_k_pr_seconds > 0),
  half_marathon_pr_seconds integer check (half_marathon_pr_seconds > 0),
  foot_width text check (foot_width in ('narrow','standard','wide','extra_wide')),
  arch_type text check (arch_type in ('low','normal','high','unknown')),
  strike_pattern text check (strike_pattern in ('heel','midfoot','forefoot','mixed','unknown')),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  country_code char(2),
  website_url text,
  is_local_indonesia boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.shoes (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  slug text not null unique,
  model text not null,
  generation text,
  release_year smallint,
  category text not null check (category in ('daily','tempo','race','max-cushion','trail')),
  terrain text not null default 'road' check (terrain in ('road','trail','mixed')),
  weight_g numeric(6,1),
  drop_mm numeric(5,1),
  heel_stack_mm numeric(5,1),
  forefoot_stack_mm numeric(5,1),
  midsole text,
  plate_type text,
  msrp_idr integer check (msrp_idr is null or msrp_idr >= 0),
  source_url text,
  source_status text not null default 'catalog-only' check (source_status in ('verified','catalog-only')),
  source_verified_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, model, generation)
);

create table public.shoe_use_cases (
  shoe_id uuid not null references public.shoes(id) on delete cascade,
  use_case text not null check (use_case in ('daily','easy','recovery','long_run','tempo','intervals','race_5k','race_10k','race_half','race_marathon','walking')),
  primary key (shoe_id, use_case)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  shoe_id uuid not null references public.shoes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating_overall numeric(2,1) not null check (rating_overall between 1 and 5),
  softness smallint not null check (softness between 1 and 5),
  energy_return smallint not null check (energy_return between 1 and 5),
  stability smallint not null check (stability between 1 and 5),
  fit_width smallint not null check (fit_width between 1 and 5),
  toe_box smallint not null check (toe_box between 1 and 5),
  heel_lockdown smallint not null check (heel_lockdown between 1 and 5),
  grip smallint not null check (grip between 1 and 5),
  durability smallint not null check (durability between 1 and 5),
  breathability smallint not null check (breathability between 1 and 5),
  value smallint not null check (value between 1 and 5),
  would_buy_again boolean not null,
  size_eu numeric(4,1),
  distance_km numeric(7,1) check (distance_km is null or distance_km >= 0),
  summary text check (char_length(summary) <= 160),
  body text check (char_length(body) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shoe_id, user_id)
);

create table public.review_votes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  helpful boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create table public.user_shoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  shoe_id uuid not null references public.shoes(id) on delete cascade,
  status text not null check (status in ('current','past','race','wishlist')),
  distance_km numeric(7,1) not null default 0 check (distance_km >= 0),
  acquired_at date,
  retired_at date,
  created_at timestamptz not null default now(),
  unique (user_id, shoe_id, status)
);

create table public.retailers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text,
  country_code char(2) not null default 'ID',
  is_official boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.shoe_prices (
  id uuid primary key default gen_random_uuid(),
  shoe_id uuid not null references public.shoes(id) on delete cascade,
  retailer_id uuid not null references public.retailers(id) on delete cascade,
  price_idr integer not null check (price_idr >= 0),
  product_url text not null,
  in_stock boolean,
  observed_at timestamptz not null default now(),
  unique (shoe_id, retailer_id, product_url)
);

create index reviews_shoe_id_idx on public.reviews(shoe_id);
create index reviews_user_id_idx on public.reviews(user_id);
create index shoes_brand_id_idx on public.shoes(brand_id);
create index shoe_prices_shoe_id_observed_at_idx on public.shoe_prices(shoe_id, observed_at desc);
create index user_shoes_user_id_idx on public.user_shoes(user_id);

create or replace view public.shoe_community_summary as
select
  shoe_id,
  count(*)::integer as review_count,
  round(avg(rating_overall)::numeric, 2) as overall_rating,
  round(avg(softness)::numeric, 2) as softness,
  round(avg(energy_return)::numeric, 2) as energy_return,
  round(avg(stability)::numeric, 2) as stability,
  round(avg(fit_width)::numeric, 2) as fit_width,
  round(avg(toe_box)::numeric, 2) as toe_box,
  round(avg(heel_lockdown)::numeric, 2) as heel_lockdown,
  round(avg(grip)::numeric, 2) as grip,
  round(avg(durability)::numeric, 2) as durability,
  round(avg(breathability)::numeric, 2) as breathability,
  round(avg(value)::numeric, 2) as value,
  round((100.0 * avg(case when would_buy_again then 1 else 0 end))::numeric, 1) as buy_again_pct
from public.reviews
group by shoe_id;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.runner_profiles enable row level security;
alter table public.brands enable row level security;
alter table public.shoes enable row level security;
alter table public.shoe_use_cases enable row level security;
alter table public.reviews enable row level security;
alter table public.review_votes enable row level security;
alter table public.user_shoes enable row level security;
alter table public.retailers enable row level security;
alter table public.shoe_prices enable row level security;

create policy "public reads brands" on public.brands for select using (true);
create policy "public reads published shoes" on public.shoes for select using (is_published = true);
create policy "public reads use cases" on public.shoe_use_cases for select using (exists (select 1 from public.shoes s where s.id = shoe_id and s.is_published));
create policy "public reads reviews" on public.reviews for select using (true);
create policy "public reads retailers" on public.retailers for select using (true);
create policy "public reads prices" on public.shoe_prices for select using (true);

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage own runner profile" on public.runner_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users insert own reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "users update own reviews" on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own reviews" on public.reviews for delete using (auth.uid() = user_id);
create policy "users manage own votes" on public.review_votes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own shoe collection" on public.user_shoes for select using (auth.uid() = user_id);
create policy "users manage own shoe collection" on public.user_shoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
