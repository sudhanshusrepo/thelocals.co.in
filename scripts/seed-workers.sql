-- Seed Workers Script
-- This script creates 5 test worker profiles ready to accept bookings
-- Run this in Supabase SQL Editor with proper authentication

-- Note: You'll need to create the auth users first via Supabase Auth UI or API
-- Then use their UUIDs in the INSERT statements below

-- Worker 1: Plumber - Rajesh Kumar
-- Email: rajesh.plumber@thelokals.com
-- Password: Worker@123
-- Location: Near default center (37.7749, -122.4194)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'rajesh.plumber@thelokals.com',
  crypt('Worker@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Rajesh Kumar", "role": "provider"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone, email, created_at, updated_at) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Rajesh Kumar',
  '+919876543210',
  'rajesh.plumber@thelokals.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.providers (
  id,
  full_name,
  phone,
  email,
  category,
  experience_years,
  operating_location,
  service_radius_km,
  is_verified,
  is_active,
  rating_average,
  total_jobs,
  total_earnings,
  bio,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Rajesh Kumar',
  '+919876543210',
  'rajesh.plumber@thelokals.com',
  'Plumber',
  8,
  ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography,
  15,
  true,
  true,
  4.5,
  156,
  125000,
  'Experienced plumber with 8+ years in residential and commercial plumbing. Expert in leak repairs, installations, and emergency services.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Worker 2: Electrician - Amit Sharma
-- Email: amit.electrician@thelokals.com
-- Password: Worker@123
-- Location: Slightly north of default center
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'amit.electrician@thelokals.com',
  crypt('Worker@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Amit Sharma", "role": "provider"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone, email, created_at, updated_at) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Amit Sharma',
  '+919876543211',
  'amit.electrician@thelokals.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.providers (
  id,
  full_name,
  phone,
  email,
  category,
  experience_years,
  operating_location,
  service_radius_km,
  is_verified,
  is_active,
  rating_average,
  total_jobs,
  total_earnings,
  bio,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Amit Sharma',
  '+919876543211',
  'amit.electrician@thelokals.com',
  'Electrician',
  6,
  ST_SetSRID(ST_MakePoint(-122.4194, 37.7799), 4326)::geography,
  12,
  true,
  true,
  4.7,
  203,
  180000,
  'Certified electrician specializing in home wiring, appliance installation, and electrical repairs. Available for emergency calls.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Worker 3: Carpenter - Suresh Patel
-- Email: suresh.carpenter@thelokals.com
-- Password: Worker@123
-- Location: Slightly east of default center
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'suresh.carpenter@thelokals.com',
  crypt('Worker@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Suresh Patel", "role": "provider"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone, email, created_at, updated_at) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Suresh Patel',
  '+919876543212',
  'suresh.carpenter@thelokals.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.providers (
  id,
  full_name,
  phone,
  email,
  category,
  experience_years,
  operating_location,
  service_radius_km,
  is_verified,
  is_active,
  rating_average,
  total_jobs,
  total_earnings,
  bio,
  created_at,
  updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Suresh Patel',
  '+919876543212',
  'suresh.carpenter@thelokals.com',
  'Carpenter',
  10,
  ST_SetSRID(ST_MakePoint(-122.4144, 37.7749), 4326)::geography,
  10,
  true,
  true,
  4.8,
  289,
  250000,
  'Master carpenter with expertise in custom furniture, door/window installation, and furniture repair. Quality workmanship guaranteed.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Worker 4: Maid Service - Priya Singh
-- Email: priya.maid@thelokals.com
-- Password: Worker@123
-- Location: Slightly south of default center
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'priya.maid@thelokals.com',
  crypt('Worker@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Priya Singh", "role": "provider"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone, email, created_at, updated_at) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Priya Singh',
  '+919876543213',
  'priya.maid@thelokals.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.providers (
  id,
  full_name,
  phone,
  email,
  category,
  experience_years,
  operating_location,
  service_radius_km,
  is_verified,
  is_active,
  rating_average,
  total_jobs,
  total_earnings,
  bio,
  created_at,
  updated_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Priya Singh',
  '+919876543213',
  'priya.maid@thelokals.com',
  'Maid Service',
  5,
  ST_SetSRID(ST_MakePoint(-122.4194, 37.7699), 4326)::geography,
  8,
  true,
  true,
  4.6,
  412,
  195000,
  'Professional house cleaning service with 5 years experience. Reliable, trustworthy, and detail-oriented. Available for daily or part-time work.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Worker 5: Mechanic - Vikram Reddy
-- Email: vikram.mechanic@thelokals.com
-- Password: Worker@123
-- Location: Slightly west of default center
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'vikram.mechanic@thelokals.com',
  crypt('Worker@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Vikram Reddy", "role": "provider"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, phone, email, created_at, updated_at) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Vikram Reddy',
  '+919876543214',
  'vikram.mechanic@thelokals.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.providers (
  id,
  full_name,
  phone,
  email,
  category,
  experience_years,
  operating_location,
  service_radius_km,
  is_verified,
  is_active,
  rating_average,
  total_jobs,
  total_earnings,
  bio,
  created_at,
  updated_at
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Vikram Reddy',
  '+919876543214',
  'vikram.mechanic@thelokals.com',
  'Mechanic',
  12,
  ST_SetSRID(ST_MakePoint(-122.4244, 37.7749), 4326)::geography,
  20,
  true,
  true,
  4.9,
  567,
  450000,
  'Expert auto mechanic with 12+ years experience. Specializing in all car brands, general service, repairs, and diagnostics. Mobile service available.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Verify the workers were created
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.category,
  p.experience_years,
  p.is_verified,
  p.is_active,
  p.rating_average,
  p.total_jobs,
  ST_AsText(p.operating_location::geometry) as location
FROM public.providers p
WHERE p.id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
)
ORDER BY p.full_name;
