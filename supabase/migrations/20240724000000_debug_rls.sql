-- supabase/migrations/20240724000000_debug_rls.sql

-- This migration is for debugging purposes.
-- It temporarily makes all profiles public to rule out RLS as the cause of workers not appearing.

-- Drop the existing SELECT policy on profiles if it exists, to avoid conflicts.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create a new, fully permissive SELECT policy on the profiles table.
CREATE POLICY "public_profiles_selectable" ON public.profiles
FOR SELECT USING (true);
