-- Initial schema. See docs/03-data-model.md for the full model rationale.

create table if not exists region_profiles (
  id                     text primary key,
  label                  text not null,
  fields                 jsonb not null,
  length_guidance        jsonb not null,
  default_section_order  jsonb not null
);

alter table region_profiles enable row level security;

create policy "region_profiles_public_read" on region_profiles
  for select using (true);

create table if not exists cv_master (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  name            text not null,
  region_profile  text not null references region_profiles(id),
  sections        jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

alter table cv_master enable row level security;

create policy "cv_master_owner_access" on cv_master
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists cv_versions (
  id            uuid primary key default gen_random_uuid(),
  cv_master_id  uuid not null references cv_master(id) on delete cascade,
  label         text not null,
  target_role   text,
  jd_text       text,
  sections      jsonb not null default '{}'::jsonb,
  ai_diff       jsonb,
  created_at    timestamptz not null default now()
);

alter table cv_versions enable row level security;

create policy "cv_versions_owner_access" on cv_versions
  for all using (
    auth.uid() = (select user_id from cv_master where cv_master.id = cv_versions.cv_master_id)
  ) with check (
    auth.uid() = (select user_id from cv_master where cv_master.id = cv_versions.cv_master_id)
  );

create table if not exists user_settings (
  user_id           uuid primary key references auth.users on delete cascade,
  ai_key_encrypted  text,
  ai_key_provider   text
);

alter table user_settings enable row level security;

create policy "user_settings_owner_access" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists ai_usage (
  user_id  uuid not null references auth.users on delete cascade,
  date     date not null,
  count    int not null default 0,
  primary key (user_id, date)
);

alter table ai_usage enable row level security;

create policy "ai_usage_owner_access" on ai_usage
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists job_cache (
  query_hash  text primary key,
  source      text not null,
  results     jsonb not null,
  fetched_at  timestamptz not null default now()
);

-- job_cache has no RLS: it's shared, non-personal, read-only data for all users.
-- Writes happen only via the service role from the scheduled cron job.
alter table job_cache enable row level security;

create policy "job_cache_public_read" on job_cache
  for select using (true);

insert into region_profiles (id, label, fields, length_guidance, default_section_order)
values
  (
    'international',
    'International / US-style',
    '{"photo":"hidden","dateOfBirth":"hidden","fatherName":"hidden","citizenshipNumber":"hidden","nationality":"hidden","declaration":false}'::jsonb,
    '{"minPages":1,"maxPages":1}'::jsonb,
    '["summary","experience","education","skills","projects"]'::jsonb
  ),
  (
    'nepal',
    'Nepal',
    '{"photo":"optional","dateOfBirth":"optional","fatherName":"optional","citizenshipNumber":"optional","nationality":"optional","declaration":true}'::jsonb,
    '{"minPages":1,"maxPages":2}'::jsonb,
    '["summary","experience","education","skills","projects"]'::jsonb
  )
on conflict (id) do nothing;
