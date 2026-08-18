-- Popular catalog seed only. Keep the catalog intentionally curated rather than exhaustive.
-- Selection basis: current flagship/bestseller signals plus Indonesian market availability.
-- Prices are inserted only when a current Indonesian source was verified on 2026-08-18.

insert into public.brands (slug, name, country_code, is_local_indonesia) values
('adidas', 'adidas', 'DE', false),
('nike', 'Nike', 'US', false),
('asics', 'ASICS', 'JP', false),
('hoka', 'HOKA', 'US', false),
('new-balance', 'New Balance', 'US', false),
('puma', 'Puma', 'DE', false),
('saucony', 'Saucony', 'US', false),
('brooks', 'Brooks', 'US', false),
('on', 'On', 'CH', false),
('mizuno', 'Mizuno', 'JP', false),
('skechers', 'Skechers', 'US', false),
('910-nineten', '910 Nineten', 'ID', true),
('ortuseight', 'Ortuseight', 'ID', true),
('mills', 'MILLS', 'ID', true),
('specs', 'Specs', 'ID', true)
on conflict (slug) do update set
  name = excluded.name,
  country_code = excluded.country_code,
  is_local_indonesia = excluded.is_local_indonesia;

with popular(brand_slug, slug, model, category, terrain, msrp_idr, source_url, source_status) as (values
  ('adidas','adidas-adizero-evo-sl','Adizero EVO SL','tempo','road',2500000,'https://www.adidas.co.id/id/sepatu-adizero-lari','verified'),
  ('adidas','adidas-adizero-boston-13','Adizero Boston 13','tempo','road',2500000,'https://www.adidas.co.id/id/sepatu-adizero-lari','verified'),
  ('nike','nike-pegasus-42','Pegasus 42','daily','road',2199000,'https://www.nike.com/id/w/best-running-shoes-2eqihz37v7jz76m50zy7ok','verified'),
  ('nike','nike-vomero-18','Vomero 18','max-cushion','road',2249000,'https://www.nike.com/id/w/best-road-running-shoes-37v7jz76m50z8kwewzy7ok','verified'),
  ('asics','asics-superblast-3','Superblast 3','tempo','road',null,'https://corp3.asics.com/jp/press/article/2026-02-16_superblast_3','verified'),
  ('asics','asics-novablast-6','Novablast 6','daily','road',null,'https://www.asics.com/jp/ja-jp/mk/running/recommendshoes_by_style','verified'),
  ('hoka','hoka-clifton-10','Clifton 10','daily','road',null,null,'catalog-only'),
  ('hoka','hoka-bondi-9','Bondi 9','max-cushion','road',null,null,'catalog-only'),
  ('new-balance','new-balance-rebel-v5','FuelCell Rebel v5','tempo','road',2499000,'https://www.newbalance.co.id/rebel-v5.html','verified'),
  ('new-balance','new-balance-1080-v14','Fresh Foam X 1080 v14','max-cushion','road',2999000,'https://www.newbalance.co.id/catalog/category/view/id/1063/','verified'),
  ('puma','puma-velocity-nitro-5','Velocity NITRO 5','daily','road',2099000,'https://id.puma.com/en/men/sports/running','verified'),
  ('puma','puma-deviate-nitro-4','Deviate NITRO 4','tempo','road',2699000,'https://id.puma.com/en/sport/running/deviate-nitro%E2%84%A2','verified'),
  ('saucony','saucony-ride-19','Ride 19','daily','road',null,'https://www.saucony.com/en/running/','verified'),
  ('saucony','saucony-endorphin-speed-5','Endorphin Speed 5','tempo','road',null,'https://www.saucony.com/en/running/','verified'),
  ('brooks','brooks-ghost-18','Ghost 18','daily','road',null,'https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/adrenaline-gts-25/1104541D040.100.html','verified'),
  ('brooks','brooks-adrenaline-gts-25','Adrenaline GTS 25','daily','road',null,'https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/adrenaline-gts-25/1104541D040.100.html','verified'),
  ('on','on-cloudmonster-3','Cloudmonster 3','max-cushion','road',3200000,'https://www.on.com/en-id/shop/shoes/road-running','verified'),
  ('on','on-cloudsurfer-2','Cloudsurfer 2','daily','road',2700000,'https://www.on.com/en-id/shop/shoes/running','verified'),
  ('mizuno','mizuno-wave-rider-29','Wave Rider 29','daily','road',null,null,'catalog-only'),
  ('mizuno','mizuno-hyperwarp-elite','Hyperwarp Elite','race','road',null,null,'catalog-only'),
  ('skechers','skechers-aero-razor','AERO Razor','tempo','road',null,'https://www.skechers.com/stories/tech-explainer/legacy-reimagined-meet-all-new-skechers.html','verified'),
  ('skechers','skechers-aero-burst','AERO Burst','max-cushion','road',null,'https://www.skechers.com/aero-running/','verified'),
  ('910-nineten','910-haze-tempo-2','Haze Tempo 2.0','tempo','road',799900,'https://910.id/','verified'),
  ('910-nineten','910-geist-ekiden-hyperpulse','Geist Ekiden Hyperpulse','race','road',679900,'https://shopee.co.id/riseupstore','catalog-only'),
  ('ortuseight','ortuseight-hypersonic-2','Hypersonic 2.0','race','road',1599000,'https://www.facebook.com/ortuseight/posts/hypersonic-20-is-officialy-registered-and-approved-by-world-athletic-federation-/1054208796738928/','verified'),
  ('ortuseight','ortuseight-hyperglide-3-1','Hyperglide 3.1','daily','road',749000,'https://shopee.co.id/list/Ortuseight/Official%20Store?page=1','catalog-only'),
  ('mills','mills-enerpro-zenith','Enerpro Zenith','tempo','road',899000,'https://mills.co.id/collections/running-footwear','catalog-only'),
  ('mills','mills-enermax-dynaplate','Enermax Dynaplate','daily','road',549000,'https://mills.co.id/collections/running-footwear','catalog-only'),
  ('specs','specs-novaspeed-subsx','Novaspeed SUBSX','tempo','road',899800,'https://www.blibli.com/jual/running-shoes-indonesia','catalog-only'),
  ('specs','specs-airglide','Airglide','daily','road',399800,'https://www.blibli.com/jual/running-shoes-indonesia','catalog-only')
)
insert into public.shoes (
  brand_id, slug, model, category, terrain, msrp_idr, source_url, source_status, source_verified_at, is_published
)
select
  b.id, p.slug, p.model, p.category, p.terrain, p.msrp_idr, p.source_url, p.source_status,
  case when p.source_status = 'verified' then '2026-08-18T00:00:00Z'::timestamptz else null end,
  true
from popular p
join public.brands b on b.slug = p.brand_slug
on conflict (slug) do update set
  model = excluded.model,
  category = excluded.category,
  terrain = excluded.terrain,
  msrp_idr = excluded.msrp_idr,
  source_url = excluded.source_url,
  source_status = excluded.source_status,
  source_verified_at = excluded.source_verified_at,
  is_published = true,
  updated_at = now();

-- Current Indonesian price sources. Historical observations can be appended later by the ingestion job.
insert into public.retailers (slug, name, website_url, country_code, is_official) values
('adidas-indonesia','adidas Indonesia','https://www.adidas.co.id','ID',true),
('nike-indonesia','Nike Indonesia','https://www.nike.com/id','ID',true),
('new-balance-indonesia','New Balance Indonesia','https://www.newbalance.co.id','ID',true),
('puma-indonesia','PUMA Indonesia','https://id.puma.com','ID',true),
('on-indonesia','On Indonesia','https://www.on.com/en-id','ID',true),
('910-indonesia','910 Indonesia','https://910.id','ID',true),
('ortuseight-market','Ortuseight Official / market signal','https://shopee.co.id/list/Ortuseight/Official%20Store?page=1','ID',true),
('mills-indonesia','MILLS Official','https://mills.co.id','ID',true),
('blibli-running','Blibli Indonesia','https://www.blibli.com/jual/running-shoes-indonesia','ID',false)
on conflict (slug) do update set
  name = excluded.name,
  website_url = excluded.website_url,
  is_official = excluded.is_official;

with prices(shoe_slug, retailer_slug, price_idr, product_url, source_type) as (values
  ('adidas-adizero-evo-sl','adidas-indonesia',2500000,'https://www.adidas.co.id/id/sepatu-adizero-lari','official-brand'),
  ('adidas-adizero-boston-13','adidas-indonesia',2500000,'https://www.adidas.co.id/id/sepatu-adizero-lari','official-brand'),
  ('nike-pegasus-42','nike-indonesia',2199000,'https://www.nike.com/id/w/best-running-shoes-2eqihz37v7jz76m50zy7ok','official-brand'),
  ('nike-vomero-18','nike-indonesia',2249000,'https://www.nike.com/id/w/best-road-running-shoes-37v7jz76m50z8kwewzy7ok','official-brand'),
  ('new-balance-rebel-v5','new-balance-indonesia',2499000,'https://www.newbalance.co.id/rebel-v5.html','official-brand'),
  ('new-balance-1080-v14','new-balance-indonesia',2999000,'https://www.newbalance.co.id/catalog/category/view/id/1063/','official-brand'),
  ('puma-velocity-nitro-5','puma-indonesia',2099000,'https://id.puma.com/en/men/sports/running','official-brand'),
  ('puma-deviate-nitro-4','puma-indonesia',2699000,'https://id.puma.com/en/sport/running/deviate-nitro%E2%84%A2','official-brand'),
  ('on-cloudmonster-3','on-indonesia',3200000,'https://www.on.com/en-id/shop/shoes/road-running','official-brand'),
  ('on-cloudsurfer-2','on-indonesia',2700000,'https://www.on.com/en-id/shop/shoes/running','official-brand'),
  ('910-haze-tempo-2','910-indonesia',799900,'https://910.id/','official-brand'),
  ('ortuseight-hypersonic-2','ortuseight-market',1599000,'https://shopee.co.id/list/Ortuseight/Official%20Store?page=1','official-marketplace'),
  ('ortuseight-hyperglide-3-1','ortuseight-market',749000,'https://shopee.co.id/list/Ortuseight/Official%20Store?page=1','official-marketplace'),
  ('mills-enerpro-zenith','mills-indonesia',899000,'https://mills.co.id/collections/running-footwear','official-brand'),
  ('mills-enermax-dynaplate','mills-indonesia',549000,'https://mills.co.id/collections/running-footwear','official-brand'),
  ('specs-novaspeed-subsx','blibli-running',899800,'https://www.blibli.com/jual/running-shoes-indonesia','retailer'),
  ('specs-airglide','blibli-running',399800,'https://www.blibli.com/jual/running-shoes-indonesia','retailer')
)
insert into public.shoe_prices (shoe_id, retailer_id, price_idr, product_url, in_stock, observed_at, source_type)
select s.id, r.id, p.price_idr, p.product_url, true, '2026-08-18T00:00:00Z'::timestamptz, p.source_type
from prices p
join public.shoes s on s.slug = p.shoe_slug
join public.retailers r on r.slug = p.retailer_slug
on conflict (shoe_id, retailer_id, product_url) do update set
  price_idr = excluded.price_idr,
  in_stock = excluded.in_stock,
  observed_at = excluded.observed_at,
  source_type = excluded.source_type;
