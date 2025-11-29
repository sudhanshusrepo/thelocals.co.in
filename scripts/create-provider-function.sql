-- Helper function to create provider with PostGIS location
-- Run this in Supabase SQL Editor BEFORE running the TypeScript script

CREATE OR REPLACE FUNCTION create_provider_with_location(
  p_id uuid,
  p_full_name text,
  p_phone text,
  p_email text,
  p_category text,
  p_experience_years integer,
  p_longitude numeric,
  p_latitude numeric,
  p_service_radius_km numeric,
  p_is_verified boolean,
  p_is_active boolean,
  p_rating_average numeric,
  p_total_jobs integer,
  p_total_earnings numeric,
  p_bio text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
    p_id,
    p_full_name,
    p_phone,
    p_email,
    p_category,
    p_experience_years,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    p_service_radius_km,
    p_is_verified,
    p_is_active,
    p_rating_average,
    p_total_jobs,
    p_total_earnings,
    p_bio,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    category = EXCLUDED.category,
    experience_years = EXCLUDED.experience_years,
    operating_location = EXCLUDED.operating_location,
    service_radius_km = EXCLUDED.service_radius_km,
    is_verified = EXCLUDED.is_verified,
    is_active = EXCLUDED.is_active,
    rating_average = EXCLUDED.rating_average,
    total_jobs = EXCLUDED.total_jobs,
    total_earnings = EXCLUDED.total_earnings,
    bio = EXCLUDED.bio,
    updated_at = now();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_provider_with_location TO service_role;

-- Verify the function was created
SELECT proname, proargnames 
FROM pg_proc 
WHERE proname = 'create_provider_with_location';
