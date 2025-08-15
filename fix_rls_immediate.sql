-- Immediate fix for RLS policies blocking PG admin signup
-- Run this in Supabase SQL Editor

-- Temporarily disable RLS on pg_properties to allow signup
ALTER TABLE public.pg_properties DISABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert properties (temporary fix)
CREATE POLICY IF NOT EXISTS "temp_pg_props_insert" 
ON public.pg_properties 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow property owners to manage their properties
CREATE POLICY IF NOT EXISTS "temp_pg_props_manage" 
ON public.pg_properties 
FOR ALL 
TO authenticated 
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Re-enable RLS
ALTER TABLE public.pg_properties ENABLE ROW LEVEL SECURITY;

-- Also fix profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "temp_profiles_insert" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Fix rooms table
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "temp_rooms_insert" 
ON public.rooms 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Fix meals table
ALTER TABLE public.meals DISABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "temp_meals_insert" 
ON public.meals 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Fix notifications table
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "temp_notifications_insert" 
ON public.notifications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
