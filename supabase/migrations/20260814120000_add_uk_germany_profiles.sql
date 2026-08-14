-- Add UK and Germany/DACH region profiles.
-- See docs/04-cv-standards.md for research and docs/decisions/0003-region-profile-schema.md for the data-not-templates approach.

insert into region_profiles (id, label, fields, length_guidance, default_section_order)
values
  (
    'uk',
    'UK',
    '{"photo":"hidden","dateOfBirth":"hidden","fatherName":"hidden","citizenshipNumber":"hidden","nationality":"hidden","declaration":false}'::jsonb,
    '{"minPages":1,"maxPages":2}'::jsonb,
    '["summary","experience","education","skills","projects"]'::jsonb
  ),
  (
    'de',
    'Germany / DACH',
    '{"photo":"expected","dateOfBirth":"expected","fatherName":"hidden","citizenshipNumber":"hidden","nationality":"expected","declaration":false}'::jsonb,
    '{"minPages":2,"maxPages":3}'::jsonb,
    '["summary","experience","education","skills","projects"]'::jsonb
  )
on conflict (id) do nothing;
