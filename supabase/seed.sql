-- Catalog seed only. Synthetic community scores live in the frontend demo fixture, never in production review tables.
insert into public.brands (id, slug, name, country_code, is_local_indonesia) values
('10000000-0000-0000-0000-000000000001', 'adidas', 'adidas', 'DE', false),
('10000000-0000-0000-0000-000000000002', 'nike', 'Nike', 'US', false),
('10000000-0000-0000-0000-000000000003', 'asics', 'ASICS', 'JP', false),
('10000000-0000-0000-0000-000000000004', 'hoka', 'HOKA', 'US', false),
('10000000-0000-0000-0000-000000000005', '910-nineten', '910 Nineten', 'ID', true),
('10000000-0000-0000-0000-000000000006', 'ortuseight', 'Ortuseight', 'ID', true),
('10000000-0000-0000-0000-000000000007', 'mills', 'Mills', 'ID', true),
('10000000-0000-0000-0000-000000000008', 'specs', 'Specs', 'ID', true)
on conflict (id) do nothing;

insert into public.shoes (id, brand_id, slug, model, category, terrain, weight_g, drop_mm, heel_stack_mm, forefoot_stack_mm, midsole, plate_type, msrp_idr, source_url, source_status, source_verified_at, is_published) values
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'adidas-adizero-evo-sl', 'Adizero EVO SL', 'tempo', 'road', 224, 6, 38, 32, 'LIGHTSTRIKE PRO', 'None', 2500000, 'https://www.adidas.co.id/id/sepatu-adizero-evo-sl/JR3414.html', 'verified', '2026-08-18T00:00:00Z', true),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'nike-pegasus-41', 'Pegasus 41', 'daily', 'road', 297, 10, null, null, 'ReactX + Air Zoom', 'None', 2099000, 'https://www.nike.com/id/t/pegasus-41-road-running-shoes-RZm89S/FD2722-102', 'verified', '2026-08-18T00:00:00Z', true),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'asics-novablast-5', 'Novablast 5', 'daily', 'road', null, null, null, null, null, 'None', null, null, 'catalog-only', null, true),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'hoka-clifton-10', 'Clifton 10', 'max-cushion', 'road', null, null, null, null, null, 'None', null, null, 'catalog-only', null, true)
on conflict (id) do nothing;
