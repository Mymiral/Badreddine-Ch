- open supabase, go to sql editor
- paste this

```sql
-- 1. Enable UUID Extension (required for uuid_generate_v4)
create extension if not exists "uuid-ossp";

-- 2. Create Users Profile Table
create table public.users (
id uuid primary key references auth.users(id) on delete cascade,
email text,
display_name text,
phone_number text,
photo_url text,
role text default 'user' check (role in ('user', 'agent', 'admin')),
created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) for users
alter table public.users enable row level security;

create policy "Allow public read access to profiles" on public.users
for select using (true);

create policy "Allow users to update their own profiles" on public.users
for update using (auth.uid() = id);

-- Trigger to automatically create a user profile when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.users (id, email, display_name, photo_url, role)
values (
new.id,
new.email,
new.raw_user_meta_data->>'name',
new.raw_user_meta_data->>'avatar_url',
coalesce(new.raw_user_meta_data->>'role', 'user')
);
return new;
end;

$$
language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create Properties Table
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  type text check (type in ('sale', 'rent')),
  property_type text,
  price numeric not null,
  location text not null,
  address text,
  city text,
  bedrooms integer not null,
  bathrooms integer not null,
  area numeric not null,
  images text[] default '{}',
  video text,
  audio text,
  description text,
  featured boolean default false,
  lat numeric,
  lng numeric,
  agent_id uuid references public.users(id) on delete cascade,
  status text default 'available' check (status in ('available', 'sold')),
  created_at timestamp with time zone default now()
);

-- Enable RLS for properties
alter table public.properties enable row level security;

create policy "Properties are viewable by everyone" on public.properties
  for select using (true);

create policy "Users can insert their own properties" on public.properties
  for insert with check (auth.uid() = agent_id);

create policy "Users can update their own properties" on public.properties
  for update using (auth.uid() = agent_id or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Users can delete their own properties" on public.properties
  for delete using (auth.uid() = agent_id or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- 4. Create Favorites Table
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  uid uuid not null references public.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (uid, property_id)
);

-- Enable RLS for favorites
alter table public.favorites enable row level security;

create policy "Users can view their own favorites" on public.favorites
  for select using (auth.uid() = uid);

create policy "Users can add their own favorites" on public.favorites
  for insert with check (auth.uid() = uid);

create policy "Users can delete their own favorites" on public.favorites
  for delete using (auth.uid() = uid);

create index favorites_uid_idx on public.favorites(uid);
create index favorites_property_id_idx on public.favorites(property_id);

-- 5. Create Alerts Table
create table public.alerts (
  id uuid default uuid_generate_v4() primary key,
  uid uuid references public.users(id) on delete cascade,
  type text,
  location text,
  budget text,
  email text,
  phone text,
  channels text[] default '{}',
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS for alerts
alter table public.alerts enable row level security;

create policy "Users can view their own alerts" on public.alerts
  for select using (auth.uid() = uid or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Anyone can insert alerts" on public.alerts
  for insert with check (true);

create policy "Users can update their own alerts" on public.alerts
  for update using (auth.uid() = uid);

create policy "Users can delete their own alerts" on public.alerts
  for delete using (auth.uid() = uid or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- 6. Create Comments Table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  author_name text,
  text text not null,
  uid uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS for comments
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone" on public.comments
  for select using (true);

create policy "Authenticated users can post comments" on public.comments
  for insert with check (auth.uid() = uid);

create policy "Users can update their comments" on public.comments
  for update using (auth.uid() = uid);

create policy "Users can delete their comments" on public.comments
  for delete using (auth.uid() = uid or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- 7. Create Ratings Table
create table public.ratings (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  author_name text,
  score integer check (score >= 1 and score <= 5),
  uid uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS for ratings
alter table public.ratings enable row level security;

create policy "Ratings are viewable by everyone" on public.ratings
  for select using (true);

create policy "Authenticated users can submit ratings" on public.ratings
  for insert with check (auth.uid() = uid);

create policy "Users can delete their ratings" on public.ratings
  for delete using (auth.uid() = uid or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- 8. Create Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  property_title text,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for messages
alter table public.messages enable row level security;

create policy "Only admin can view messages" on public.messages
  for select using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Anyone can insert messages" on public.messages
  for insert with check (true);

-- 9. Create Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  uid uuid references public.users(id) on delete cascade,
  title text not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS for notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications" on public.notifications
  for select using (auth.uid() = uid);

create policy "System can insert notifications" on public.notifications
  for insert with check (true);

create policy "Users can update their notifications" on public.notifications
  for update using (auth.uid() = uid);

```
