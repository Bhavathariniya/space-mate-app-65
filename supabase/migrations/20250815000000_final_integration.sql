-- Final Integration Migration
-- This migration ensures all improvements work together properly

-- Update the handle_new_user function to work with new schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles with all required fields
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    admin_sub_role, 
    gender,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'guest'),
    NEW.raw_user_meta_data->>'admin_sub_role',
    NEW.raw_user_meta_data->>'gender',
    now(),
    now()
  );
  
  -- Insert into user_roles based on the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'guest')::app_role
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add function to update room occupancy automatically
CREATE OR REPLACE FUNCTION public.update_room_occupancy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update room occupancy when room assignment changes
  IF TG_OP = 'INSERT' THEN
    -- Increment occupancy when assignment is created
    UPDATE public.rooms 
    SET occupied = occupied + 1,
        is_available = CASE WHEN occupied + 1 >= capacity THEN false ELSE true END
    WHERE id = NEW.room_id;
    
    -- Update property occupied rooms count
    UPDATE public.pg_properties 
    SET occupied_rooms = (
      SELECT COUNT(*) 
      FROM public.room_assignments ra 
      WHERE ra.pg_property_id = NEW.pg_property_id 
        AND ra.is_active = true
    )
    WHERE id = NEW.pg_property_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.is_active = false AND NEW.is_active = true THEN
      -- Reactivating assignment
      UPDATE public.rooms 
      SET occupied = occupied + 1,
          is_available = CASE WHEN occupied + 1 >= capacity THEN false ELSE true END
      WHERE id = NEW.room_id;
      
    ELSIF OLD.is_active = true AND NEW.is_active = false THEN
      -- Deactivating assignment
      UPDATE public.rooms 
      SET occupied = occupied - 1,
          is_available = CASE WHEN occupied - 1 < capacity THEN true ELSE false END
      WHERE id = NEW.room_id;
    END IF;
    
    -- Update property occupied rooms count
    UPDATE public.pg_properties 
    SET occupied_rooms = (
      SELECT COUNT(*) 
      FROM public.room_assignments ra 
      WHERE ra.pg_property_id = NEW.pg_property_id 
        AND ra.is_active = true
    )
    WHERE id = NEW.pg_property_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement occupancy when assignment is deleted
    UPDATE public.rooms 
    SET occupied = occupied - 1,
        is_available = CASE WHEN occupied - 1 < capacity THEN true ELSE false END
    WHERE id = OLD.room_id;
    
    -- Update property occupied rooms count
    UPDATE public.pg_properties 
    SET occupied_rooms = (
      SELECT COUNT(*) 
      FROM public.room_assignments ra 
      WHERE ra.pg_property_id = OLD.pg_property_id 
        AND ra.is_active = true
    )
    WHERE id = OLD.pg_property_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for room assignment changes
DROP TRIGGER IF EXISTS update_room_occupancy_trigger ON public.room_assignments;
CREATE TRIGGER update_room_occupancy_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.room_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_room_occupancy();

-- Add function to create default notifications for new users
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create welcome notification for new users
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    is_read,
    requires_action,
    created_at
  )
  VALUES (
    NEW.id,
    'Welcome to SpaceMate!',
    'Thank you for joining SpaceMate. We''re here to help you find the perfect PG accommodation.',
    'general',
    false,
    false,
    now()
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for welcome notifications
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON public.profiles;
CREATE TRIGGER create_welcome_notification_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_welcome_notification();

-- Add function to validate meal responses
CREATE OR REPLACE FUNCTION public.validate_meal_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Check if user is assigned to the property where the meal is served
  IF NOT EXISTS (
    SELECT 1 FROM public.room_assignments ra
    JOIN public.meals m ON ra.pg_property_id = m.pg_property_id
    WHERE ra.user_id = NEW.user_id 
      AND m.id = NEW.meal_id
      AND ra.is_active = true
  ) THEN
    RAISE EXCEPTION 'User is not assigned to the property where this meal is served';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for meal response validation
DROP TRIGGER IF EXISTS validate_meal_response_trigger ON public.meal_responses;
CREATE TRIGGER validate_meal_response_trigger
  BEFORE INSERT OR UPDATE ON public.meal_responses
  FOR EACH ROW EXECUTE FUNCTION public.validate_meal_response();

-- Add function to update payment status automatically
CREATE OR REPLACE FUNCTION public.update_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update payment status based on paid_at field
  IF NEW.paid_at IS NOT NULL AND OLD.paid_at IS NULL THEN
    NEW.status = 'completed';
  ELSIF NEW.paid_at IS NULL AND OLD.paid_at IS NOT NULL THEN
    NEW.status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payment status updates
DROP TRIGGER IF EXISTS update_payment_status_trigger ON public.payments;
CREATE TRIGGER update_payment_status_trigger
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_payment_status();

-- Add function to create payment reminders
CREATE OR REPLACE FUNCTION public.create_payment_reminder()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create payment reminder notification
  IF NEW.due_date IS NOT NULL AND NEW.status = 'pending' THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      is_read,
      requires_action,
      action_data,
      created_at
    )
    VALUES (
      NEW.user_id,
      'Payment Due Reminder',
      'Your payment of ₹' || NEW.amount || ' is due on ' || NEW.due_date,
      'payment',
      false,
      true,
      jsonb_build_object('payment_id', NEW.id, 'amount', NEW.amount, 'due_date', NEW.due_date),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payment reminders
DROP TRIGGER IF EXISTS create_payment_reminder_trigger ON public.payments;
CREATE TRIGGER create_payment_reminder_trigger
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.create_payment_reminder();

-- Add function to track maintenance issue updates
CREATE OR REPLACE FUNCTION public.track_maintenance_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create notification for maintenance status changes
  IF OLD.status != NEW.status THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      is_read,
      requires_action,
      created_at
    )
    VALUES (
      NEW.reported_by,
      'Maintenance Update: ' || NEW.title,
      'Your maintenance request has been updated to: ' || NEW.status,
      'maintenance',
      false,
      false,
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for maintenance updates
DROP TRIGGER IF EXISTS track_maintenance_updates_trigger ON public.maintenance_issues;
CREATE TRIGGER track_maintenance_updates_trigger
  AFTER UPDATE ON public.maintenance_issues
  FOR EACH ROW EXECUTE FUNCTION public.track_maintenance_updates();

-- Add function to validate asset quantity changes
CREATE OR REPLACE FUNCTION public.validate_asset_quantity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Ensure quantity doesn't go negative
  IF NEW.quantity < 0 THEN
    RAISE EXCEPTION 'Asset quantity cannot be negative';
  END IF;
  
  -- Update asset history automatically
  IF OLD.quantity != NEW.quantity THEN
    INSERT INTO public.asset_history (
      asset_id,
      action,
      quantity_change,
      performed_by,
      notes,
      timestamp
    )
    VALUES (
      NEW.id,
      CASE 
        WHEN NEW.quantity > OLD.quantity THEN 'added'
        ELSE 'removed'
      END,
      NEW.quantity - OLD.quantity,
      auth.uid(),
      'Quantity updated from ' || OLD.quantity || ' to ' || NEW.quantity,
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for asset quantity validation
DROP TRIGGER IF EXISTS validate_asset_quantity_trigger ON public.assets;
CREATE TRIGGER validate_asset_quantity_trigger
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.validate_asset_quantity();

-- Add comprehensive comments for all functions
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile and role when new user signs up';
COMMENT ON FUNCTION public.update_room_occupancy() IS 'Automatically updates room and property occupancy when assignments change';
COMMENT ON FUNCTION public.create_welcome_notification() IS 'Creates welcome notification for new users';
COMMENT ON FUNCTION public.validate_meal_response() IS 'Validates that users can only respond to meals at their assigned property';
COMMENT ON FUNCTION public.update_payment_status() IS 'Automatically updates payment status based on paid_at field';
COMMENT ON FUNCTION public.create_payment_reminder() IS 'Creates payment reminder notifications';
COMMENT ON FUNCTION public.track_maintenance_updates() IS 'Tracks maintenance issue status changes and notifies users';
COMMENT ON FUNCTION public.validate_asset_quantity() IS 'Validates asset quantity changes and tracks history';

-- Final verification queries
-- These can be run to verify the database is working correctly

-- Check that all tables have RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'user_roles', 'pg_properties', 'rooms', 
    'room_assignments', 'payments', 'meals', 'meal_responses',
    'notifications', 'maintenance_issues', 'assets', 'asset_history'
  );

-- Check that all triggers are created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check that all functions are created
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name LIKE '%update%' 
     OR routine_name LIKE '%validate%'
     OR routine_name LIKE '%create%'
     OR routine_name LIKE '%track%'
ORDER BY routine_name;
