-- Fix RLS policies to allow PG admin signup flow
-- This migration addresses the "new row violates row-level security policy" error

-- Allow users to create properties during signup (needed for PG admin signup)
-- This policy bypasses role checks and only requires authentication and ownership
DROP POLICY IF EXISTS "pg_props_create" ON public.pg_properties;
CREATE POLICY "pg_props_create"
ON public.pg_properties
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Also allow authenticated users to create properties (fallback for signup)
DROP POLICY IF EXISTS "pg_props_create_auth" ON public.pg_properties;
CREATE POLICY "pg_props_create_auth"
ON public.pg_properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to insert profiles during signup
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Allow property owners to create rooms during signup
DROP POLICY IF EXISTS "rooms_create" ON public.rooms;
CREATE POLICY "rooms_create"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = rooms.pg_property_id 
      AND p.created_by = auth.uid()
  )
);

-- Allow property owners to create meals during signup
DROP POLICY IF EXISTS "meals_create" ON public.meals;
CREATE POLICY "meals_create"
ON public.meals
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = meals.pg_property_id 
      AND p.created_by = auth.uid()
  )
);

-- Allow property owners to create notifications during signup
DROP POLICY IF EXISTS "notifications_create" ON public.notifications;
CREATE POLICY "notifications_create"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = notifications.pg_property_id 
      AND p.created_by = auth.uid()
  )
);

-- Add meals table RLS if not already enabled
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Add basic meals policies if they don't exist
DROP POLICY IF EXISTS "meals_read" ON public.meals;
CREATE POLICY "meals_read"
ON public.meals
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = meals.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

DROP POLICY IF EXISTS "meals_manage" ON public.meals;
CREATE POLICY "meals_manage"
ON public.meals
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = meals.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = meals.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);
