-- Run once in the Supabase SQL editor. Each account owns one private vault.
create table public.notes_vaults (
    user_id uuid primary key references auth.users(id) on delete cascade,
    data jsonb not null,
    revision integer not null default 1 check (revision > 0)
);

alter table public.notes_vaults enable row level security;
revoke all on public.notes_vaults from anon;
revoke all on public.notes_vaults from authenticated;
grant select, insert, update on public.notes_vaults to authenticated;

create policy "Read own vault" on public.notes_vaults
    for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own vault" on public.notes_vaults
    for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own vault" on public.notes_vaults
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
