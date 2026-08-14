-- User profiles for job matching and smart defaults.
-- See docs/evolution-plan.md Phase 1.

create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  nationality text not null default '',
  location text not null default '',
  desired_roles text[] not null default '{}',
  desired_locations text[] not null default '{}',
  experience_level text not null default 'entry'
    check (experience_level in ('entry', 'mid', 'senior')),
  industries text[] not null default '{}',
  languages text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: users can only read/write their own profile.
alter table user_profiles enable row level security;

create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);
