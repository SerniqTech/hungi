create or replace function get_my_role()
returns user_role
language sql
stable
as $$
  select role from users where id = auth.uid();
$$;