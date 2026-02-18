-- Supabase Migration Script: Create Bookmarks Table with RLS and Realtime

-- 1. Create the bookmarks table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 3. Policy: users can SELECT only their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- 4. Policy: users can INSERT their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: users can DELETE their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- 6. Create an index on user_id for faster queries
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);

-- 7. Enable Realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;

-- 8. Grant necessary permissions to enable Realtime change filtering
-- (Supabase Realtime needs SELECT access to filter by user_id)
alter table public.bookmarks replica identity full;
