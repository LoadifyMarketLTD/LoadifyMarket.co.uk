-- Loadify Market — Enterprise schema (Postgres/Supabase)

-- Users & roles
create table if not exists profiles (
  id uuid primary key,
  email text unique,
  role text check (role in ('client','driver','admin')) default 'client',
  display_name text,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id text primary key,
  name text not null,
  price integer not null, -- in pence
  stock integer default 0,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id text primary key,
  email text,
  total integer not null default 0,
  currency text default 'gbp',
  status text default 'paid',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id text references orders(id) on delete cascade,
  product_id text references products(id),
  qty integer default 1,
  price integer not null default 0
);

-- Jobs & bids
create table if not exists jobs (
  id bigint primary key,
  pickup text,
  dropoff text,
  price numeric,
  vehicle text,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists bids (
  id bigint primary key,
  job_id bigint references jobs(id) on delete cascade,
  amount numeric,
  created_at timestamptz default now()
);

-- Messaging
create table if not exists messages (
  id bigint primary key,
  to_email text,
  subject text,
  body text,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id bigint primary key,
  target text,
  stars int check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
