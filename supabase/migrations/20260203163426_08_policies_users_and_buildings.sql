-- =====================================================
-- USERS POLICIES
-- =====================================================
create policy "Users can view themselves" on users for
select
    using (id = auth.uid ());

create policy "Users can update themselves" on users for
update using (id = auth.uid ());

create policy "Admin full access users" on users for all using (get_my_role () = 'admin');

-- =====================================================
-- BUILDINGS
-- =====================================================
create policy "Customer sees own building" on buildings for
select
    using (
        id = (
            select
                building_id
            from
                users
            where
                id = auth.uid ()
        )
    );

create policy "Admin full access buildings" on buildings for all using (get_my_role () = 'admin');