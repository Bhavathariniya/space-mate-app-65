-- Enable RLS and add conservative policies for core tables

-- Profiles: users can read and update only their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_profile" ON public.profiles;
CREATE POLICY "read_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to update their profile during signup
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- PG Properties: readable to admins; owner (created_by) can manage
ALTER TABLE public.pg_properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pg_props_admin_read" ON public.pg_properties;
CREATE POLICY "pg_props_admin_read"
ON public.pg_properties
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'pg_admin') OR
  public.has_role(auth.uid(), 'warden')
);

DROP POLICY IF EXISTS "pg_props_owner_manage" ON public.pg_properties;
CREATE POLICY "pg_props_owner_manage"
ON public.pg_properties
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- Allow users to create properties (needed for signup flow)
DROP POLICY IF EXISTS "pg_props_create" ON public.pg_properties;
CREATE POLICY "pg_props_create"
ON public.pg_properties
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Rooms: belong to a property; readable to admins of that property; writable by property owner/super_admin
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rooms_admin_read" ON public.rooms;
CREATE POLICY "rooms_admin_read"
ON public.rooms
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'pg_admin') OR
  public.has_role(auth.uid(), 'warden')
);

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

-- Room assignments: user can read own; property owner and super_admin can manage
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "room_assignments_read_self_or_admin" ON public.room_assignments;
CREATE POLICY "room_assignments_read_self_or_admin"
ON public.room_assignments
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = room_assignments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

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

-- Payments: user can read own; property owner and super_admin can read/manage records for their property
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_read_self_or_admin" ON public.payments;
CREATE POLICY "payments_read_self_or_admin"
ON public.payments
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = payments.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  )
);

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

-- Meals: readable to property admins; managed by property owner/super_admin
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

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

-- Notifications: readable to target user or property owner; managed by property owner/super_admin
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_read" ON public.notifications;
CREATE POLICY "notifications_read"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid()) OR
  (pg_property_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = notifications.pg_property_id 
      AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
  ))
);

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

-- Maintenance issues: readable to admins of the property; managed by property owner/warden/super_admin
ALTER TABLE public.maintenance_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "maintenance_read_admins" ON public.maintenance_issues;
CREATE POLICY "maintenance_read_admins"
ON public.maintenance_issues
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pg_properties p 
    WHERE p.id = maintenance_issues.pg_property_id 
      AND (
        p.created_by = auth.uid() OR
        public.has_role(auth.uid(), 'super_admin') OR
        public.has_role(auth.uid(), 'warden')
      )
  )
);

DROP POLICY IF EXISTS "maintenance_manage_owner_or_super" ON public.maintenance_issues;
CREATE POLICY "maintenance_manage_owner_or_super"
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


