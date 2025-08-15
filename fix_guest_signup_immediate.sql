-- Immediate fix for guest signup RLS issues
-- Run this in Supabase SQL Editor

-- Allow users to create room assignments during signup
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

-- Allow users to read rooms during signup (needed for room selection)
DROP POLICY IF EXISTS "rooms_read_all" ON public.rooms;
CREATE POLICY "rooms_read_all"
ON public.rooms
FOR SELECT
TO authenticated
USING (true);

-- Allow users to read pg_properties during signup (needed for property selection)
DROP POLICY IF EXISTS "pg_props_read_all" ON public.pg_properties;
CREATE POLICY "pg_props_read_all"
ON public.pg_properties
FOR SELECT
TO authenticated
USING (true);

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
