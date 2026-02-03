-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================
create policy "Customer sees own subscriptions" on subscriptions for
select
  using (user_id = auth.uid ());

create policy "Customer inserts own subscriptions" on subscriptions for insert
with
  check (user_id = auth.uid ());

create policy "Customer updates own subscriptions" on subscriptions for
update using (user_id = auth.uid ());

create policy "Admin full access subscriptions" on subscriptions for all using (get_my_role () = 'admin');

-- =====================================================
-- SUBSCRIPTION INSTANCES
-- =====================================================
create policy "Customer sees own instances" on subscription_instances for
select
  using (
    subscription_id in (
      select
        id
      from
        subscriptions
      where
        user_id = auth.uid ()
    )
  );

create policy "Customer updates own instances" on subscription_instances for
update using (
  subscription_id in (
    select
      id
    from
      subscriptions
    where
      user_id = auth.uid ()
  )
);

create policy "Admin full access instances" on subscription_instances for all using (get_my_role () = 'admin');