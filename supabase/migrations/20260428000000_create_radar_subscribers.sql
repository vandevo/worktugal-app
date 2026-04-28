create table radar_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text default 'radar_landing',
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

-- Allow anyone to insert (email capture is public)
alter table radar_subscribers enable row level security;

create policy "Anyone can subscribe to radar"
  on radar_subscribers
  for insert
  with check (true);

-- Only authenticated users can read (for admin)
create policy "Authenticated users can read radar subscribers"
  on radar_subscribers
  for select
  using (auth.role() = 'authenticated');
