-- =====================================================
-- EXTENSIONS
-- =====================================================

create extension if not exists "pgcrypto";


-- =====================================================
-- ENUM TYPES
-- =====================================================

create type user_role as enum ('customer', 'vendor', 'admin');

create type plan_type_enum as enum ('veg', 'non_veg');

create type meal_type_enum as enum ('lunch');

create type subscription_status_enum as enum 
('pending', 'active', 'paused', 'cancelled', 'completed');

create type instance_status_enum as enum 
('scheduled', 'skipped', 'delivered', 'cancelled');

create type skipped_by_enum as enum ('user', 'admin');

create type refund_status_enum as enum 
('none', 'pending', 'approved', 'rejected', 'refunded');

create type payment_status_enum as enum 
('pending', 'paid', 'failed');


-- =====================================================
-- TABLES
-- =====================================================

create table buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  active boolean default true,
  created_at timestamptz default now()
);

create table building_settings (
  building_id uuid primary key 
    references buildings(id) on delete cascade,
  delivery_start_time time not null,
  delivery_end_time time not null,
  skip_cutoff_time time not null,
  admin_skip_cutoff_time time not null
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

create table vendor_buildings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null 
    references vendors(id) on delete cascade,
  building_id uuid not null 
    references buildings(id) on delete cascade,
  active boolean default true,
  unique (vendor_id, building_id)
);

create table users (
  id uuid primary key 
    references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  building_id uuid references buildings(id),
  full_name text,
  phone text,
  created_at timestamptz default now()
);

create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  name text not null,
  meal_type meal_type_enum not null,
  plan_type plan_type_enum not null,
  duration_days int not null check (duration_days in (1,7,30)),
  price numeric(10,2) not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table weekly_menu_templates (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  meal_type meal_type_enum not null,
  plan_type plan_type_enum not null,
  title text not null,
  description text,
  image text,
  created_at timestamptz default now(),
  unique (vendor_id, day_of_week, meal_type, plan_type)
);

create table menu_overrides (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  date date not null,
  plan_type plan_type_enum not null,
  title text not null,
  description text,
  image text,
  created_at timestamptz default now(),
  unique (vendor_id, date, plan_type)
);

create table menu_availability (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  building_id uuid not null references buildings(id) on delete cascade,
  date date not null,
  plan_type plan_type_enum not null,
  available boolean default true,
  unique (vendor_id, building_id, date, plan_type)
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  vendor_id uuid not null references vendors(id),
  building_id uuid not null references buildings(id),
  plan_id uuid not null references subscription_plans(id),
  start_date date not null,
  end_date date not null,
  status subscription_status_enum default 'pending',
  auto_renew boolean default false,
  cancellation_requested boolean default false,
  refund_status refund_status_enum default 'none',
  created_at timestamptz default now(),
  check (end_date >= start_date)
);

create table subscription_instances (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  building_id uuid not null references buildings(id),
  date date not null,
  plan_type plan_type_enum not null,
  menu_snapshot jsonb not null,
  status instance_status_enum default 'scheduled',
  locked boolean default false,
  skipped_by skipped_by_enum,
  created_at timestamptz default now(),
  unique (subscription_id, date)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  subscription_id uuid not null references subscriptions(id),
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric(10,2) not null,
  status payment_status_enum default 'pending',
  created_at timestamptz default now()
);

-- =====================================================
-- INDEXES
-- =====================================================

create index idx_subscriptions_user on subscriptions(user_id);
create index idx_subscriptions_building on subscriptions(building_id);
create index idx_instances_date_building on subscription_instances(date, building_id);
create index idx_instances_subscription_date on subscription_instances(subscription_id, date);
create index idx_payments_subscription on payments(subscription_id);


-- =====================================================
-- HELPER FUNCTION
-- =====================================================

create or replace function get_my_role()
returns user_role
language sql
stable
as $$
  select role from users where id = auth.uid();
$$;


-- =====================================================
-- ENABLE RLS
-- =====================================================

alter table buildings enable row level security;
alter table building_settings enable row level security;
alter table vendors enable row level security;
alter table vendor_buildings enable row level security;
alter table users enable row level security;
alter table subscription_plans enable row level security;
alter table weekly_menu_templates enable row level security;
alter table menu_overrides enable row level security;
alter table menu_availability enable row level security;
alter table subscriptions enable row level security;
alter table subscription_instances enable row level security;
alter table payments enable row level security;


-- =====================================================
-- USERS POLICIES
-- =====================================================

create policy "Users can view themselves"
on users for select
using (id = auth.uid());

create policy "Users can update themselves"
on users for update
using (id = auth.uid());

create policy "Admin full access users"
on users for all
using (get_my_role() = 'admin');


-- =====================================================
-- BUILDINGS
-- =====================================================

create policy "Customer sees own building"
on buildings for select
using (id = (select building_id from users where id = auth.uid()));

create policy "Admin full access buildings"
on buildings for all
using (get_my_role() = 'admin');


-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

create policy "Customer sees own subscriptions"
on subscriptions for select
using (user_id = auth.uid());

create policy "Customer inserts own subscriptions"
on subscriptions for insert
with check (user_id = auth.uid());

create policy "Customer updates own subscriptions"
on subscriptions for update
using (user_id = auth.uid());

create policy "Admin full access subscriptions"
on subscriptions for all
using (get_my_role() = 'admin');


-- =====================================================
-- SUBSCRIPTION INSTANCES
-- =====================================================

create policy "Customer sees own instances"
on subscription_instances for select
using (
  subscription_id in (
    select id from subscriptions where user_id = auth.uid()
  )
);

create policy "Customer updates own instances"
on subscription_instances for update
using (
  subscription_id in (
    select id from subscriptions where user_id = auth.uid()
  )
);

create policy "Admin full access instances"
on subscription_instances for all
using (get_my_role() = 'admin');


-- =====================================================
-- PAYMENTS
-- =====================================================

create policy "Customer sees own payments"
on payments for select
using (user_id = auth.uid());

create policy "Admin full access payments"
on payments for all
using (get_my_role() = 'admin');
