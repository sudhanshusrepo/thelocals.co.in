-- supabase/migrations/20240723000000_populate_workers.sql

-- This script populates the database with ~72 sample worker profiles
-- centered around Mumbai, India.

-- Helper function to generate random locations
CREATE OR REPLACE FUNCTION random_location(in_lat double precision, in_lng double precision, radius_km double precision)
RETURNS TABLE(lat double precision, lng double precision) AS $$
DECLARE
    r double precision := radius_km / 111.32; -- Approx conversion from km to degrees
BEGIN
    RETURN QUERY
    SELECT
        in_lat + (random() - 0.5) * r * 2,
        in_lng + (random() - 0.5) * r * 2;
END;
$$ LANGUAGE plpgsql;


DO $$
DECLARE
  -- Base location (Mumbai)
  base_lat CONSTANT double precision := 19.0971904;
  base_lng CONSTANT double precision := 72.8891392;

  -- Worker data arrays
  first_names TEXT[] := ARRAY['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Anika', 'Gauri', 'Pari', 'Diya', 'Avni', 'Myra'];
  last_names TEXT[] := ARRAY['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta', 'Joshi', 'Reddy', 'Khan', 'Ali', 'Das', 'Chopra', 'Malhotra'];
  
  categories TEXT[] := ARRAY['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Handyman', 'Painting', 'Tutoring', 'Photography', 'Catering', 'Fitness', 'Moving', 'Assembly'];
  
  -- Service specific data
  plumbing_expertise TEXT[] := ARRAY['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Water Heater', 'Faucet Repair'];
  electrical_expertise TEXT[] := ARRAY['Wiring', 'Fixture Installation', 'Panel Upgrades', 'Surge Protection', 'Appliance Repair'];
  cleaning_expertise TEXT[] := ARRAY['Deep Cleaning', 'Home Cleaning', 'Office Cleaning', 'Window Cleaning', 'Carpet Cleaning'];
  gardening_expertise TEXT[] := ARRAY['Lawn Mowing', 'Pruning', 'Planting', 'Weed Control', 'Landscaping'];
  handyman_expertise TEXT[] := ARRAY['Furniture Assembly', 'TV Mounting', 'Drywall Repair', 'Odd Jobs', 'Picture Hanging'];
  painting_expertise TEXT[] := ARRAY['Interior Painting', 'Exterior Painting', 'Wallpapering', 'Deck Staining', 'Cabinet Painting'];
  tutoring_expertise TEXT[] := ARRAY['Mathematics', 'Physics', 'Chemistry', 'English', 'History'];
  photography_expertise TEXT[] := ARRAY['Wedding Photography', 'Portrait Photography', 'Event Photography', 'Product Photography', 'Real Estate'];
  catering_expertise TEXT[] := ARRAY['Event Catering', 'Meal Prep', 'Private Chef', 'Baking', 'Dietary Needs'];
  fitness_expertise TEXT[] := ARRAY['Personal Training', 'Yoga Instruction', 'Strength Training', 'Cardio', 'Group Classes'];
  moving_expertise TEXT[] := ARRAY['Local Moving', 'Packing & Unpacking', 'Heavy Lifting', 'Furniture Disassembly'];
  assembly_expertise TEXT[] := ARRAY['IKEA Assembly', 'Furniture Assembly', 'TV Mounting', 'Grill Assembly'];


  -- Generic data
  statuses TEXT[] := ARRAY['AVAILABLE', 'BUSY', 'OFFLINE'];
  
  -- Loop variables
  new_user_id UUID;
  worker_name TEXT;
  worker_category TEXT;
  worker_expertise TEXT[];
  loc RECORD;

BEGIN
  -- Loop through categories and create workers for each
  FOREACH worker_category IN ARRAY categories
  LOOP
    FOR i IN 1..6 LOOP
      -- Create a new user in auth.users
      INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new)
      VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'worker' || i || '_' || lower(worker_category) || '@thelokals.dev', crypt('password123', gen_salt('bf')), now(), '', now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '')
      RETURNING id INTO new_user_id;

      -- Update the automatically created profile in public.profiles
      worker_name := first_names[1 + floor(random() * array_length(first_names, 1))] || ' ' || last_names[1 + floor(random() * array_length(last_names, 1))];
      UPDATE public.profiles
      SET
        full_name = worker_name,
        avatar_url = 'https://i.pravatar.cc/150?u=' || new_user_id::text,
        role = 'WORKER'
      WHERE id = new_user_id;
      
      -- Assign expertise based on category
      CASE worker_category
        WHEN 'Plumbing' THEN worker_expertise := plumbing_expertise;
        WHEN 'Electrical' THEN worker_expertise := electrical_expertise;
        WHEN 'Cleaning' THEN worker_expertise := cleaning_expertise;
        WHEN 'Gardening' THEN worker_expertise := gardening_expertise;
        WHEN 'Handyman' THEN worker_expertise := handyman_expertise;
        WHEN 'Painting' THEN worker_expertise := painting_expertise;
        WHEN 'Tutoring' THEN worker_expertise := tutoring_expertise;
        WHEN 'Photography' THEN worker_expertise := photography_expertise;
        WHEN 'Catering' THEN worker_expertise := catering_expertise;
        WHEN 'Fitness' THEN worker_expertise := fitness_expertise;
        WHEN 'Moving' THEN worker_expertise := moving_expertise;
        WHEN 'Assembly' THEN worker_expertise := assembly_expertise;
      END CASE;
      
      -- Get random location
      SELECT * INTO loc FROM random_location(base_lat, base_lng, 15);

      -- Create a worker profile in public.workers
      INSERT INTO public.workers (profile_id, name, category, description, price_per_hour, rating, status, location_lat, location_lng, expertise)
      VALUES (
        new_user_id,
        worker_name,
        worker_category::worker_category,
        'Experienced and reliable ' || worker_category || '. Customer satisfaction is my top priority.',
        floor(random() * 500 + 100), -- Price between 100 and 600
        round((random() * 1.5 + 3.5)::numeric, 1), -- Rating between 3.5 and 5.0
        statuses[1 + floor(random() * array_length(statuses, 1))]::worker_status,
        loc.lat,
        loc.lng,
        worker_expertise
      );
    END LOOP;
  END LOOP;
END $$;
