create index idx_subscriptions_user on subscriptions (user_id);

create index idx_subscriptions_building on subscriptions (building_id);

create index idx_instances_date_building on subscription_instances (date, building_id);

create index idx_instances_subscription_date on subscription_instances (subscription_id, date);

create index idx_payments_subscription on payments (subscription_id);