-- Catalog scale + price freshness
-- Keeps canonical shoe identity separate from time-varying retailer offers.

alter table public.shoe_prices
  add column if not exists list_price_idr integer check (list_price_idr is null or list_price_idr >= 0),
  add column if not exists currency_code char(3) not null default 'IDR',
  add column if not exists source_type text not null default 'retailer'
    check (source_type in ('official-brand','official-marketplace','retailer'));

create index if not exists shoe_prices_retailer_observed_idx
  on public.shoe_prices(retailer_id, observed_at desc);

create or replace view public.shoe_latest_prices as
select distinct on (sp.shoe_id)
  sp.shoe_id,
  sp.price_idr,
  sp.list_price_idr,
  sp.currency_code,
  sp.product_url,
  sp.in_stock,
  sp.source_type,
  sp.observed_at,
  r.id as retailer_id,
  r.name as retailer_name,
  r.is_official
from public.shoe_prices sp
join public.retailers r on r.id = sp.retailer_id
where sp.currency_code = 'IDR'
order by sp.shoe_id,
  case when coalesce(sp.in_stock, true) then 0 else 1 end,
  sp.observed_at desc;

create or replace view public.shoe_catalog as
select
  s.id,
  s.slug,
  s.model,
  s.generation,
  s.release_year,
  s.category,
  s.terrain,
  s.weight_g,
  s.drop_mm,
  s.heel_stack_mm,
  s.forefoot_stack_mm,
  s.midsole,
  s.plate_type,
  s.msrp_idr,
  s.source_url,
  s.source_status,
  s.source_verified_at,
  b.id as brand_id,
  b.slug as brand_slug,
  b.name as brand_name,
  b.country_code as brand_country_code,
  b.is_local_indonesia,
  lp.price_idr as current_price_idr,
  lp.list_price_idr as current_list_price_idr,
  lp.product_url as current_price_url,
  lp.source_type as current_price_source_type,
  lp.retailer_name as current_price_source,
  lp.observed_at as current_price_observed_at,
  lp.in_stock as current_price_in_stock
from public.shoes s
join public.brands b on b.id = s.brand_id
left join public.shoe_latest_prices lp on lp.shoe_id = s.id
where s.is_published = true;

comment on view public.shoe_catalog is 'Public catalog projection with latest IDR price snapshot and source freshness.';
