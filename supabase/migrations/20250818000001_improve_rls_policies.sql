-- Improve RLS policies for better security and functionality

-- Profiles policies - users can manage their own profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;
CREATE POLICY "profiles_admin_select"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'pg_admin')
);

-- User roles policies
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to manage user roles
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- PG Properties policies - improved for better access control
DROP POLICY IF EXISTS "pg_properties_select_all" ON public.pg_properties;
CREATE POLICY "pg_properties_select_all"
ON public.pg_properties
FOR SELECT
TO authenticated
USING (is_active = true);

-- Allow property owners and admins to manage properties
DROP POLICY IF EXISTS "pg_properties_owner_manage" ON public.pg_properties;
CREATE POLICY "pg_properties_owner_manage"
ON public.pg_properties
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- Allow property creation during signup
DROP POLICY IF EXISTS "pg_properties_create" ON public.pg_properties;
CREATE POLICY "pg_properties_create"
ON public.pg_properties
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Rooms policies - allow viewing available rooms
DROP POLICY IF EXISTS "rooms_select_available" ON public.rooms;
CREATE POLICY "rooms_select_available"
ON public.rooms
FOR SELECT
TO authenticated
USING (is_available = true);

-- Allow property owners and admins to manage rooms
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

-- Room assignments policies
DROP POLICY IF EXISTS "room_assignments_select_own" ON public.room_assignments;
CREATE POLICY "room_assignments_select_own"
ON public.room_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow property owners and admins to manage assignments
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

-- Allow users to create their own assignments
DROP POLICY IF EXISTS "room_assignments_create_own" ON public.room_assignments;
CREATE POLICY "room_assignments_create_own"
ON public.room_assignments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Payments policies
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own"
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

-- Allow users to create their own payments
DROP POLICY IF EXISTS "payments_create_own" ON public.payments;
CREATE POLICY "payments_create_own"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Meals policies - allow viewing meals for user's property
DROP POLICY IF EXISTS "meals_select_property" ON public.meals;
CREATE POLICY "meals_select_property"
ON public.meals
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.room_assignments ra
    WHERE ra.pg_property_id = meals.pg_property_id 
      AND ra.user_id = auth.uid()
      AND ra.is_active = true
  )
  OR
  EXISTS (
    SELECT 1 FROM public.pg_properties p
    WHERE p.id = meals.pg_property_id
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Allow property owners and admins to manage meals
DROP POLICY IF EXISTS "meals_owner_manage" ON public.meals;
CREATE POLICY "meals_owner_manage"
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

-- Meal responses policies
DROP POLICY IF EXISTS "meal_responses_select_own" ON public.meal_responses;
CREATE POLICY "meal_responses_select_own"
ON public.meal_responses
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to manage their own meal responses
DROP POLICY IF EXISTS "meal_responses_manage_own" ON public.meal_responses;
CREATE POLICY "meal_responses_manage_own"
ON public.meal_responses
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow property owners to view meal responses for their properties
DROP POLICY IF EXISTS "meal_responses_owner_view" ON public.meal_responses;
CREATE POLICY "meal_responses_owner_view"
ON public.meal_responses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.meals m
    JOIN public.pg_properties p ON m.pg_property_id = p.id
    WHERE m.id = meal_responses.meal_id
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Notifications policies
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  (pg_property_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.room_assignments ra
    WHERE ra.pg_property_id = notifications.pg_property_id 
      AND ra.user_id = auth.uid()
      AND ra.is_active = true
  ))
);

-- Allow property owners and admins to manage notifications
DROP POLICY IF EXISTS "notifications_admin_manage" ON public.notifications;
CREATE POLICY "notifications_admin_manage"
ON public.notifications
FOR ALL
TO authenticated
USING (
  pg_property_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = notifications.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  pg_property_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = notifications.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Maintenance issues policies
DROP POLICY IF EXISTS "maintenance_issues_select_own" ON public.maintenance_issues;
CREATE POLICY "maintenance_issues_select_own"
ON public.maintenance_issues
FOR SELECT
TO authenticated
USING (
  reported_by = auth.uid() OR
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.pg_properties p
    WHERE p.id = maintenance_issues.pg_property_id
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Allow users to create maintenance issues
DROP POLICY IF EXISTS "maintenance_issues_create" ON public.maintenance_issues;
CREATE POLICY "maintenance_issues_create"
ON public.maintenance_issues
FOR INSERT
TO authenticated
WITH CHECK (reported_by = auth.uid());

-- Allow property owners and admins to manage maintenance issues
DROP POLICY IF EXISTS "maintenance_issues_admin_manage" ON public.maintenance_issues;
CREATE POLICY "maintenance_issues_admin_manage"
ON public.maintenance_issues
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = maintenance_issues.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = maintenance_issues.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Assets policies - allow property owners and admins to manage
DROP POLICY IF EXISTS "assets_owner_manage" ON public.assets;
CREATE POLICY "assets_owner_manage"
ON public.assets
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = assets.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = assets.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Asset history policies - allow property owners and admins to view
DROP POLICY IF EXISTS "asset_history_owner_view" ON public.asset_history;
CREATE POLICY "asset_history_owner_view"
ON public.asset_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.assets a
    JOIN public.pg_properties p ON a.pg_property_id = p.id
    WHERE a.id = asset_history.asset_id
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

-- Allow property owners and admins to create asset history
DROP POLICY IF EXISTS "asset_history_owner_create" ON public.asset_history;
CREATE POLICY "asset_history_owner_create"
ON public.asset_history
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assets a
    JOIN public.pg_properties p ON a.pg_property_id = p.id
    WHERE a.id = asset_history.asset_id
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
  AND performed_by = auth.uid()
);
