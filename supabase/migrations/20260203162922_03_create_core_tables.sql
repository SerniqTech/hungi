create table
  buildings (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    address text,
    active boolean default true,
    created_at timestamptz default now ()
  );

create table
  building_settings (
    building_id uuid primary key references buildings (id) on delete cascade,
    delivery_start_time time not null,
    delivery_end_time time not null,
    skip_cutoff_time time not null,
    admin_skip_cutoff_time time not null
  );

create table
  vendors (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    active boolean default true,
    created_at timestamptz default now ()
  );

create table
  vendor_buildings (
    id uuid primary key default gen_random_uuid (),
    vendor_id uuid not null references vendors (id) on delete cascade,
    building_id uuid not null references buildings (id) on delete cascade,
    active boolean default true,
    unique (vendor_id, building_id)
  );

create table
  users (
    id uuid primary key references auth.users (id) on delete cascade,
    role user_role not null default 'customer',
    building_id uuid references buildings (id),
    full_name text check (
      full_name is null
      or char_length(trim(full_name)) >= 3
    ),
    phone text,
    created_at timestamptz default now ()
  );