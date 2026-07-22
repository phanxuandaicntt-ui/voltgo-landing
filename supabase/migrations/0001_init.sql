create extension if not exists pgcrypto;
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), order_code text unique not null,
 customer_name text not null, phone text not null, email text, address text not null, note text,
 total_amount bigint not null check(total_amount >= 0), payment_method text not null default 'sepay',
 payment_status text not null default 'pending' check(payment_status in ('pending','paid','failed','refunded')),
 status text not null default 'pending' check(status in ('pending','confirmed','processing','shipping','completed','cancelled')),
 payment_reference text, items jsonb not null default '[]', created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(), deleted_at timestamptz
);
create index if not exists orders_status_created_idx on public.orders(status,created_at desc) where deleted_at is null;
create index if not exists orders_phone_idx on public.orders(phone);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
create policy "service role manages orders" on public.orders for all to service_role using(true) with check(true);
