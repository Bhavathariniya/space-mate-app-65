-- Add missing constraints and improve data integrity

-- Add foreign key constraints that might be missing
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_pg_property_id 
FOREIGN KEY (pg_property_id) REFERENCES public.pg_properties(id) ON DELETE SET NULL;

-- Add check constraints for data validation
ALTER TABLE public.rooms 
ADD CONSTRAINT check_room_capacity 
CHECK (capacity > 0 AND capacity <= 10);

ALTER TABLE public.rooms 
ADD CONSTRAINT check_room_occupied 
CHECK (occupied >= 0 AND occupied <= capacity);

ALTER TABLE public.room_assignments 
ADD CONSTRAINT check_rental_dates 
CHECK (start_date <= end_date OR end_date IS NULL);

ALTER TABLE public.room_assignments 
ADD CONSTRAINT check_rental_amounts 
CHECK (monthly_rent > 0 AND (security_deposit IS NULL OR security_deposit >= 0));

ALTER TABLE public.payments 
ADD CONSTRAINT check_payment_amount 
CHECK (amount > 0);

ALTER TABLE public.payments 
ADD CONSTRAINT check_payment_dates 
CHECK (due_date IS NULL OR paid_at IS NULL OR paid_at <= due_date);

ALTER TABLE public.assets 
ADD CONSTRAINT check_asset_quantity 
CHECK (quantity > 0);

ALTER TABLE public.assets 
ADD CONSTRAINT check_asset_purchase_price 
CHECK (purchase_price IS NULL OR purchase_price >= 0);

-- Add unique constraints for business logic
ALTER TABLE public.rooms 
ADD CONSTRAINT unique_room_per_property 
UNIQUE (pg_property_id, room_number);

ALTER TABLE public.meal_responses 
ADD CONSTRAINT unique_user_meal_response 
UNIQUE (user_id, meal_id);

-- Add not null constraints where appropriate
ALTER TABLE public.pg_properties 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN city SET NOT NULL,
ALTER COLUMN state SET NOT NULL,
ALTER COLUMN pincode SET NOT NULL,
ALTER COLUMN contact_number SET NOT NULL,
ALTER COLUMN manager_name SET NOT NULL,
ALTER COLUMN monthly_rent SET NOT NULL,
ALTER COLUMN security_deposit SET NOT NULL;

ALTER TABLE public.rooms 
ALTER COLUMN room_number SET NOT NULL,
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN capacity SET NOT NULL,
ALTER COLUMN price SET NOT NULL;

ALTER TABLE public.room_assignments 
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN monthly_rent SET NOT NULL;

ALTER TABLE public.payments 
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN amount SET NOT NULL;

ALTER TABLE public.meals 
ALTER COLUMN date SET NOT NULL,
ALTER COLUMN meal_type SET NOT NULL,
ALTER COLUMN menu SET NOT NULL;

ALTER TABLE public.maintenance_issues 
ALTER COLUMN title SET NOT NULL,
ALTER COLUMN description SET NOT NULL,
ALTER COLUMN reported_by SET NOT NULL;

ALTER TABLE public.assets 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN type SET NOT NULL;

-- Add default values for better data consistency
ALTER TABLE public.rooms 
ALTER COLUMN occupied SET DEFAULT 0,
ALTER COLUMN is_available SET DEFAULT true;

ALTER TABLE public.room_assignments 
ALTER COLUMN is_active SET DEFAULT true;

ALTER TABLE public.payments 
ALTER COLUMN currency SET DEFAULT 'INR',
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.meals 
ALTER COLUMN is_active SET DEFAULT true;

ALTER TABLE public.notifications 
ALTER COLUMN is_read SET DEFAULT false,
ALTER COLUMN requires_action SET DEFAULT false;

ALTER TABLE public.maintenance_issues 
ALTER COLUMN status SET DEFAULT 'pending',
ALTER COLUMN priority SET DEFAULT 'medium';

ALTER TABLE public.assets 
ALTER COLUMN quantity SET DEFAULT 1,
ALTER COLUMN condition SET DEFAULT 'good',
ALTER COLUMN status SET DEFAULT 'active';

-- Add indexes for better query performance on commonly used fields
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_pg_properties_rating ON public.pg_properties(rating);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON public.rooms(price);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_meals_date_type ON public.meals(date, meal_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_reported_at ON public.maintenance_issues(reported_at);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON public.assets(created_at);

-- Add partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_assignments_active_users 
ON public.room_assignments(user_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_payments_pending 
ON public.payments(user_id, due_date) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON public.notifications(user_id, created_at) 
WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_maintenance_issues_open 
ON public.maintenance_issues(pg_property_id, priority) 
WHERE status IN ('pending', 'in-progress');

-- Add comments for better documentation
COMMENT ON COLUMN public.profiles.role IS 'User role: super_admin, pg_admin, warden, or guest';
COMMENT ON COLUMN public.profiles.gender IS 'User gender: male, female, or other';
COMMENT ON COLUMN public.profiles.admin_sub_role IS 'Sub-role for admin users (e.g., super_admin, pg_admin)';

COMMENT ON COLUMN public.pg_properties.gender IS 'PG gender restriction: male, female, or unisex';
COMMENT ON COLUMN public.pg_properties.pg_type IS 'PG type: co-living, men-only, or women-only';
COMMENT ON COLUMN public.pg_properties.rating IS 'Property rating from 0.0 to 5.0';

COMMENT ON COLUMN public.rooms.type IS 'Room type: single, double, triple, or quad';
COMMENT ON COLUMN public.rooms.capacity IS 'Maximum number of occupants';
COMMENT ON COLUMN public.rooms.occupied IS 'Current number of occupants';

COMMENT ON COLUMN public.room_assignments.is_active IS 'Whether the room assignment is currently active';
COMMENT ON COLUMN public.room_assignments.end_date IS 'End date of assignment (NULL for indefinite)';

COMMENT ON COLUMN public.payments.type IS 'Payment type: monthly, deposit, fine, or other';
COMMENT ON COLUMN public.payments.status IS 'Payment status: pending, completed, failed, or cancelled';
COMMENT ON COLUMN public.payments.currency IS 'Payment currency (default: INR)';

COMMENT ON COLUMN public.meals.meal_type IS 'Meal type: breakfast, lunch, dinner, or snack';
COMMENT ON COLUMN public.meals.is_active IS 'Whether the meal is currently active';

COMMENT ON COLUMN public.meal_responses.response IS 'User response: yes, no, or maybe';

COMMENT ON COLUMN public.notifications.type IS 'Notification type: payment, maintenance, general, meal, or security';
COMMENT ON COLUMN public.notifications.is_read IS 'Whether the notification has been read';
COMMENT ON COLUMN public.notifications.requires_action IS 'Whether the notification requires user action';

COMMENT ON COLUMN public.maintenance_issues.status IS 'Issue status: pending, in-progress, completed, or cancelled';
COMMENT ON COLUMN public.maintenance_issues.priority IS 'Issue priority: low, medium, high, or urgent';
COMMENT ON COLUMN public.maintenance_issues.category IS 'Issue category: electrical, plumbing, structural, facility, cleaning, or other';

COMMENT ON COLUMN public.assets.condition IS 'Asset condition: excellent, good, fair, or poor';
COMMENT ON COLUMN public.assets.status IS 'Asset status: active, inactive, maintenance, or retired';

COMMENT ON COLUMN public.asset_history.action IS 'Action performed: added, removed, maintained, replaced, or damaged';
COMMENT ON COLUMN public.asset_history.quantity_change IS 'Change in quantity (positive for additions, negative for removals)';
