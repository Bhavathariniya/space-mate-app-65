-- Add utility functions for better application functionality

-- Function to check if user has a specific role (simplified version)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
      AND role::text = _role
  );
$$;

-- Function to get user's current property
CREATE OR REPLACE FUNCTION public.get_user_current_property()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT pg_property_id 
  FROM public.room_assignments 
  WHERE user_id = auth.uid() 
    AND is_active = true 
  ORDER BY start_date DESC
  LIMIT 1;
$$;

-- Function to get user's current room
CREATE OR REPLACE FUNCTION public.get_user_current_room()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT room_id 
  FROM public.room_assignments 
  WHERE user_id = auth.uid() 
    AND is_active = true 
  ORDER BY start_date DESC
  LIMIT 1;
$$;

-- Function to check if user is property owner
CREATE OR REPLACE FUNCTION public.is_property_owner(property_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pg_properties 
    WHERE id = property_id 
      AND created_by = auth.uid()
  );
$$;

-- Function to get property statistics
CREATE OR REPLACE FUNCTION public.get_property_stats(property_id UUID)
RETURNS TABLE (
  total_rooms INTEGER,
  occupied_rooms INTEGER,
  available_rooms INTEGER,
  occupancy_rate NUMERIC,
  total_revenue NUMERIC,
  pending_payments INTEGER,
  active_maintenance INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    p.total_rooms,
    p.occupied_rooms,
    COALESCE(p.total_rooms - p.occupied_rooms, 0) as available_rooms,
    CASE 
      WHEN p.total_rooms > 0 THEN 
        ROUND((p.occupied_rooms::NUMERIC / p.total_rooms::NUMERIC) * 100, 2)
      ELSE 0 
    END as occupancy_rate,
    COALESCE(SUM(pay.amount), 0) as total_revenue,
    COUNT(CASE WHEN pay.status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN maint.status IN ('pending', 'in-progress') THEN 1 END) as active_maintenance
  FROM public.pg_properties p
  LEFT JOIN public.payments pay ON p.id = pay.pg_property_id
  LEFT JOIN public.maintenance_issues maint ON p.id = maint.pg_property_id
  WHERE p.id = property_id
  GROUP BY p.id, p.total_rooms, p.occupied_rooms;
$$;

-- Function to get user dashboard data
CREATE OR REPLACE FUNCTION public.get_user_dashboard_data()
RETURNS TABLE (
  current_property_name TEXT,
  current_room_number TEXT,
  monthly_rent NUMERIC,
  next_payment_due DATE,
  pending_payments_count INTEGER,
  unread_notifications_count INTEGER,
  active_maintenance_count INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    p.name as current_property_name,
    r.room_number as current_room_number,
    ra.monthly_rent,
    pay.due_date as next_payment_due,
    COUNT(CASE WHEN pay.status = 'pending' THEN 1 END) as pending_payments_count,
    COUNT(CASE WHEN n.is_read = false THEN 1 END) as unread_notifications_count,
    COUNT(CASE WHEN maint.status IN ('pending', 'in-progress') THEN 1 END) as active_maintenance_count
  FROM public.room_assignments ra
  JOIN public.pg_properties p ON ra.pg_property_id = p.id
  JOIN public.rooms r ON ra.room_id = r.id
  LEFT JOIN public.payments pay ON ra.user_id = pay.user_id AND pay.status = 'pending'
  LEFT JOIN public.notifications n ON (n.user_id = ra.user_id OR n.pg_property_id = ra.pg_property_id) AND n.is_read = false
  LEFT JOIN public.maintenance_issues maint ON ra.user_id = maint.reported_by AND maint.status IN ('pending', 'in-progress')
  WHERE ra.user_id = auth.uid() AND ra.is_active = true
  GROUP BY p.name, r.room_number, ra.monthly_rent, pay.due_date;
$$;

-- Function to get meal statistics for a property
CREATE OR REPLACE FUNCTION public.get_meal_stats(property_id UUID, meal_date DATE)
RETURNS TABLE (
  meal_type TEXT,
  total_responses INTEGER,
  yes_responses INTEGER,
  no_responses INTEGER,
  maybe_responses INTEGER,
  response_rate NUMERIC
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    m.meal_type,
    COUNT(mr.id) as total_responses,
    COUNT(CASE WHEN mr.response = 'yes' THEN 1 END) as yes_responses,
    COUNT(CASE WHEN mr.response = 'no' THEN 1 END) as no_responses,
    COUNT(CASE WHEN mr.response = 'maybe' THEN 1 END) as maybe_responses,
    CASE 
      WHEN COUNT(ra.user_id) > 0 THEN 
        ROUND((COUNT(mr.id)::NUMERIC / COUNT(ra.user_id)::NUMERIC) * 100, 2)
      ELSE 0 
    END as response_rate
  FROM public.meals m
  LEFT JOIN public.meal_responses mr ON m.id = mr.meal_id
  LEFT JOIN public.room_assignments ra ON m.pg_property_id = ra.pg_property_id AND ra.is_active = true
  WHERE m.pg_property_id = property_id AND m.date = meal_date
  GROUP BY m.meal_type;
$$;

-- Function to get payment summary for a user
CREATE OR REPLACE FUNCTION public.get_user_payment_summary()
RETURNS TABLE (
  total_paid NUMERIC,
  total_pending NUMERIC,
  total_overdue NUMERIC,
  next_due_date DATE,
  next_due_amount NUMERIC
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN status = 'pending' AND due_date >= CURRENT_DATE THEN amount ELSE 0 END), 0) as total_pending,
    COALESCE(SUM(CASE WHEN status = 'pending' AND due_date < CURRENT_DATE THEN amount ELSE 0 END), 0) as total_overdue,
    MIN(CASE WHEN status = 'pending' THEN due_date END) as next_due_date,
    MIN(CASE WHEN status = 'pending' THEN amount END) as next_due_amount
  FROM public.payments
  WHERE user_id = auth.uid();
$$;

-- Function to get maintenance summary for a property
CREATE OR REPLACE FUNCTION public.get_maintenance_summary(property_id UUID)
RETURNS TABLE (
  total_issues INTEGER,
  pending_issues INTEGER,
  in_progress_issues INTEGER,
  completed_issues INTEGER,
  urgent_issues INTEGER,
  avg_resolution_time_hours NUMERIC
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    COUNT(*) as total_issues,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_issues,
    COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_issues,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_issues,
    COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_issues,
    AVG(
      CASE 
        WHEN status = 'completed' AND resolved_at IS NOT NULL THEN
          EXTRACT(EPOCH FROM (resolved_at - reported_at)) / 3600
        ELSE NULL
      END
    ) as avg_resolution_time_hours
  FROM public.maintenance_issues
  WHERE pg_property_id = property_id;
$$;

-- Function to get asset summary for a property
CREATE OR REPLACE FUNCTION public.get_asset_summary(property_id UUID)
RETURNS TABLE (
  total_assets INTEGER,
  active_assets INTEGER,
  maintenance_assets INTEGER,
  retired_assets INTEGER,
  total_value NUMERIC,
  assets_by_condition JSON
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    COUNT(*) as total_assets,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_assets,
    COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_assets,
    COUNT(CASE WHEN status = 'retired' THEN 1 END) as retired_assets,
    COALESCE(SUM(purchase_price * quantity), 0) as total_value,
    '{}'::json as assets_by_condition
  FROM public.assets
  WHERE pg_property_id = property_id
  GROUP BY pg_property_id;
$$;

-- Function to check if user has permission for property
CREATE OR REPLACE FUNCTION public.has_property_permission(property_id UUID, permission_type TEXT DEFAULT 'read')
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    CASE permission_type
      WHEN 'read' THEN
        EXISTS (
          SELECT 1 FROM public.room_assignments ra
          WHERE ra.pg_property_id = property_id 
            AND ra.user_id = auth.uid()
            AND ra.is_active = true
        )
        OR
        EXISTS (
          SELECT 1 FROM public.pg_properties p
          WHERE p.id = property_id 
            AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
        )
      WHEN 'write' THEN
        EXISTS (
          SELECT 1 FROM public.pg_properties p
          WHERE p.id = property_id 
            AND (p.created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'))
        )
      ELSE false
    END;
$$;

-- Function to get notification count for user
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COUNT(*)
  FROM public.notifications
  WHERE (user_id = auth.uid() OR 
         (pg_property_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM public.room_assignments ra
           WHERE ra.pg_property_id = notifications.pg_property_id 
             AND ra.user_id = auth.uid()
             AND ra.is_active = true
         )))
    AND is_read = false;
$$;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(notification_ids UUID[])
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result INTEGER;
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE id = ANY(notification_ids)
    AND (user_id = auth.uid() OR 
         (pg_property_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM public.room_assignments ra
           WHERE ra.pg_property_id = notifications.pg_property_id 
             AND ra.user_id = auth.uid()
             AND ra.is_active = true
         )));
  
  GET DIAGNOSTICS result = ROW_COUNT;
  RETURN result;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_user_current_property() IS 'Get the current property ID for the authenticated user';
COMMENT ON FUNCTION public.get_user_current_room() IS 'Get the current room ID for the authenticated user';
COMMENT ON FUNCTION public.is_property_owner(UUID) IS 'Check if the authenticated user is the owner of the specified property';
COMMENT ON FUNCTION public.get_property_stats(UUID) IS 'Get comprehensive statistics for a property';
COMMENT ON FUNCTION public.get_user_dashboard_data() IS 'Get dashboard data for the authenticated user';
COMMENT ON FUNCTION public.get_meal_stats(UUID, DATE) IS 'Get meal response statistics for a property on a specific date';
COMMENT ON FUNCTION public.get_user_payment_summary() IS 'Get payment summary for the authenticated user';
COMMENT ON FUNCTION public.get_maintenance_summary(UUID) IS 'Get maintenance summary for a property';
COMMENT ON FUNCTION public.get_asset_summary(UUID) IS 'Get asset summary for a property';
COMMENT ON FUNCTION public.has_property_permission(UUID, TEXT) IS 'Check if user has permission for property operations';
COMMENT ON FUNCTION public.get_unread_notification_count() IS 'Get count of unread notifications for the authenticated user';
COMMENT ON FUNCTION public.mark_notifications_read(UUID[]) IS 'Mark specified notifications as read for the authenticated user';
