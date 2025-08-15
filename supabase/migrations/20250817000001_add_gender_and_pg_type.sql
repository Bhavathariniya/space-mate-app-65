-- Migration: Add gender and PG type fields for gender-based PG selection
-- Date: 2025-01-03

-- Add gender field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other'));

-- Add gender and pg_type fields to pg_properties table
ALTER TABLE public.pg_properties 
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
ADD COLUMN pg_type TEXT CHECK (pg_type IN ('co-living', 'men-only', 'women-only'));

-- Create index for better query performance
CREATE INDEX idx_pg_properties_gender_type ON public.pg_properties(gender, pg_type);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);

-- Update existing pg_properties with sample gender and type data
-- This will be updated by PG admins through the application
UPDATE public.pg_properties 
SET 
  gender = 'unisex',
  pg_type = 'co-living'
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003'
);

-- Add some sample gender-specific PGs
INSERT INTO public.pg_properties (
  id, name, address, city, state, pincode, contact_number, manager_name, 
  total_rooms, occupied_rooms, monthly_rent, security_deposit, description, 
  amenities, rating, is_active, gender, pg_type, created_at, updated_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440004', 
  'Ladies First PG', 
  '321 Women Street, Sector 2', 
  'Mumbai', 'Maharashtra', '400002', 
  '+91-9876543213', 'Priya Devi', 
  15, 8, 16000.00, 32000.00, 
  'Exclusive women-only PG with enhanced security', 
  ARRAY['WiFi', 'AC', 'Meals', 'Laundry', 'Security', 'CCTV', 'Gym'], 
  4.6, true, 'female', 'women-only', now(), now()
),
(
  '550e8400-e29b-41d4-a716-446655440005', 
  'Gentlemen PG', 
  '654 Men Avenue, Block C', 
  'Delhi', 'Delhi', '110002', 
  '+91-9876543214', 'Rajesh Singh', 
  20, 14, 17000.00, 34000.00, 
  'Men-only PG with sports facilities', 
  ARRAY['WiFi', 'AC', 'Meals', 'Sports', 'Parking', 'CCTV'], 
  4.4, true, 'male', 'men-only', now(), now()
);

-- Add sample rooms for the new PGs
INSERT INTO public.rooms (
  id, pg_property_id, room_number, type, capacity, occupied, price, 
  floor_number, is_available, amenities
) VALUES
(
  '660e8400-e29b-41d4-a716-446655440005', 
  '550e8400-e29b-41d4-a716-446655440004', 
  '101', 'single', 1, 0, 16000.00, 1, true, 
  ARRAY['AC', 'Attached Bathroom', 'Study Table']
),
(
  '660e8400-e29b-41d4-a716-446655440006', 
  '550e8400-e29b-41d4-a716-446655440004', 
  '102', 'double', 2, 1, 13000.00, 1, true, 
  ARRAY['AC', 'Common Bathroom', 'Balcony']
),
(
  '660e8400-e29b-41d4-a716-446655440007', 
  '550e8400-e29b-41d4-a716-446655440005', 
  '201', 'single', 1, 0, 17000.00, 2, true, 
  ARRAY['AC', 'Attached Bathroom', 'Sports Equipment']
),
(
  '660e8400-e29b-41d4-a716-446655440008', 
  '550e8400-e29b-41d4-a716-446655440005', 
  '202', 'triple', 3, 2, 14000.00, 2, true, 
  ARRAY['AC', 'Common Bathroom', 'Study Area']
);

-- Update the handle_new_user function to include gender
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, role, admin_sub_role, gender)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'guest'),
    NEW.raw_user_meta_data->>'admin_sub_role',
    NEW.raw_user_meta_data->>'gender'
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

-- Create function to get gender-appropriate PGs
CREATE OR REPLACE FUNCTION public.get_gender_appropriate_pgs(user_gender TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  monthly_rent NUMERIC,
  security_deposit NUMERIC,
  total_rooms INTEGER,
  occupied_rooms INTEGER,
  rating NUMERIC,
  gender TEXT,
  pg_type TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.name,
    p.address,
    p.city,
    p.state,
    p.monthly_rent,
    p.security_deposit,
    p.total_rooms,
    p.occupied_rooms,
    p.rating,
    p.gender,
    p.pg_type
  FROM public.pg_properties p
  WHERE p.is_active = true
    AND (
      -- User can see co-living PGs
      p.pg_type = 'co-living'
      OR
      -- User can see gender-specific PGs matching their gender
      (p.pg_type IN ('men-only', 'women-only') AND p.gender = user_gender)
    )
  ORDER BY p.rating DESC, p.name;
$$;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.gender IS 'User gender: male, female, or other';
COMMENT ON COLUMN public.pg_properties.gender IS 'PG gender restriction: male, female, or unisex';
COMMENT ON COLUMN public.pg_properties.pg_type IS 'PG type: co-living, men-only, or women-only';
COMMENT ON FUNCTION public.get_gender_appropriate_pgs(TEXT) IS 'Returns PGs appropriate for the given user gender';

