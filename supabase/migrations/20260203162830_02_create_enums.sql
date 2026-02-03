create type user_role as enum ('customer', 'vendor', 'admin');

create type plan_type_enum as enum ('veg', 'non_veg');

create type meal_type_enum as enum ('lunch');

create type subscription_status_enum as enum (
    'pending',
    'active',
    'paused',
    'cancelled',
    'completed'
);

create type instance_status_enum as enum ('scheduled', 'skipped', 'delivered', 'cancelled');

create type skipped_by_enum as enum ('user', 'admin');

create type refund_status_enum as enum (
    'none',
    'pending',
    'approved',
    'rejected',
    'refunded'
);

create type payment_status_enum as enum ('pending', 'paid', 'failed');