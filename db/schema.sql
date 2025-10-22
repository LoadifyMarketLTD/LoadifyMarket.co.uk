create table if not exists products(id uuid primary key default gen_random_uuid(),name text not null,price integer not null,created_at timestamp default now());
create table if not exists orders(id uuid primary key default gen_random_uuid(),stripe_payment_intent text,amount integer not null,status text not null default 'pending',email text,created_at timestamp default now());
create table if not exists order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders(id),product_id uuid references products(id),qty integer not null default 1,price integer not null);
create table if not exists jobs(id uuid primary key default gen_random_uuid(),title text, pickup text, dropoff text, budget integer, created_at timestamp default now());
create table if not exists bids(id uuid primary key default gen_random_uuid(),job_id uuid references jobs(id),amount integer not null,created_at timestamp default now());
create table if not exists messages(id uuid primary key default gen_random_uuid(),"to" text, text text, created_at timestamp default now());
create table if not exists reviews(id uuid primary key default gen_random_uuid(),"for" text, rating int, text text, created_at timestamp default now());
