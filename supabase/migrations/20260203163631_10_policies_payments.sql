create policy "Customer sees own payments"
on payments for select
using (user_id = auth.uid());

create policy "Admin full access payments"
on payments for all
using (get_my_role() = 'admin');