-- Remove forbidden fields (photo, dateOfBirth, fatherName, citizenshipNumber, declaration)
-- from region_profiles. Professional CVs should never include these.

update region_profiles set fields = '{"nationality":"hidden"}'::jsonb where id = 'international';
update region_profiles set fields = '{"nationality":"optional"}'::jsonb where id = 'nepal';
update region_profiles set fields = '{"nationality":"hidden"}'::jsonb where id = 'uk';
update region_profiles set fields = '{"nationality":"expected"}'::jsonb where id = 'de';
