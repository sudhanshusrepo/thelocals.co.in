-- 20240726000000_secure_rls.sql

-- Drop the insecure policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Worker profiles are viewable by everyone." ON public.workers;
DROP POLICY IF EXISTS "Reviews are public and viewable by everyone." ON public.reviews;

-- Recreate the policies with more secure rules
CREATE POLICY "Profiles are viewable by authenticated users." ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Worker profiles are viewable by authenticated users." ON public.workers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Reviews are viewable by authenticated users." ON public.reviews
  FOR SELECT USING (auth.role() = 'authenticated');
