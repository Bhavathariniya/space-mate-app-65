-- Fix RLS policies to allow guest signup and room assignment creation
-- This migration addresses the "new row violates row-level security policy" errors

-- Allow users to create room assignments during signup (needed for guest signup)
DROP POLICY IF EXISTS "room_assignments_create" ON public.room_assignments;
CREATE POLICY "room_assignments_create"
ON public.room_assignments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow users to read their own room assignments
DROP POLICY IF EXISTS "room_assignments_read_own" ON public.room_assignments;
CREATE POLICY "room_assignments_read_own"
ON public.room_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow property owners and admins to manage room assignments
DROP POLICY IF EXISTS "room_assignments_admin_manage" ON public.room_assignments;
CREATE POLICY "room_assignments_admin_manage"
ON public.room_assignments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = room_assignments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = room_assignments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Allow users to read rooms during signup (needed for room selection)
DROP POLICY IF EXISTS "rooms_read_all" ON public.rooms;
CREATE POLICY "rooms_read_all"
ON public.rooms
FOR SELECT
TO authenticated
USING (true);

-- Allow property owners to manage their rooms
DROP POLICY IF EXISTS "rooms_owner_manage" ON public.rooms;
CREATE POLICY "rooms_owner_manage"
ON public.rooms
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = rooms.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = rooms.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Allow users to read pg_properties during signup (needed for property selection)
DROP POLICY IF EXISTS "pg_props_read_all" ON public.pg_properties;
CREATE POLICY "pg_props_read_all"
ON public.pg_properties
FOR SELECT
TO authenticated
USING (true);

-- Allow property owners to manage their properties
DROP POLICY IF EXISTS "pg_props_owner_manage" ON public.pg_properties;
CREATE POLICY "pg_props_owner_manage"
ON public.pg_properties
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- Allow users to create payments during signup
DROP POLICY IF EXISTS "payments_create" ON public.payments;
CREATE POLICY "payments_create"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow users to read their own payments
DROP POLICY IF EXISTS "payments_read_own" ON public.payments;
CREATE POLICY "payments_read_own"
ON public.payments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow property owners and admins to manage payments
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;
CREATE POLICY "payments_admin_manage"
ON public.payments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = payments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = payments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);
