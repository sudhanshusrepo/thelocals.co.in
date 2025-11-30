-- Function to find nearby providers using PostGIS
CREATE OR REPLACE FUNCTION find_nearby_providers(
  lat double precision,
  long double precision,
  radius_km double precision DEFAULT 10,
  service_category text DEFAULT NULL,
  limit_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  full_name text,
  category text,
  rating_average numeric,
  lat double precision,
  lng double precision,
  distance double precision,
  profile_image_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.category,
    p.rating_average,
    ST_Y(p.operating_location::geometry) as lat,
    ST_X(p.operating_location::geometry) as lng,
    (ST_Distance(
      p.operating_location,
      ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography
    ) / 1000) as distance,
    p.profile_image_url
  FROM
    public.providers p
  WHERE
    p.is_active = true
    AND p.is_verified = true
    AND (service_category IS NULL OR p.category = service_category)
    AND ST_DWithin(
      p.operating_location,
      ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY
    distance ASC
  LIMIT limit_count;
END;
$$;
