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

create policy "Public read buildings"
on buildings
for select
using (true)