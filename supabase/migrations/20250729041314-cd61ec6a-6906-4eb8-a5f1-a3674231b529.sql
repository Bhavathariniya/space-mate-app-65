-- Fix function search path issues for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix search path for get_user_primary_role
CREATE OR REPLACE FUNCTION public.get_user_primary_role()
RETURNS TEXT
LANGUAGE SQL
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'pg_admin' THEN 2
      WHEN 'warden' THEN 3
      WHEN 'guest' THEN 4
    END
  LIMIT 1;
$$;

-- Fix search path for get_current_user_role  
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Fix search path for get_user_pg_property
CREATE OR REPLACE FUNCTION public.get_user_pg_property()
RETURNS uuid
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT ra.pg_property_id 
  FROM public.room_assignments ra 
  WHERE ra.user_id = auth.uid() 
    AND ra.is_active = true 
  LIMIT 1;
$$;

-- Fix search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;