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