-- Clean up existing super admin users and create a single super admin
-- This migration ensures only one super admin exists in the system

-- First, remove existing super admin users from all tables
DELETE FROM public.user_roles WHERE role = 'super_admin';
DELETE FROM public.profiles WHERE role = 'super_admin';
DELETE FROM auth.users WHERE raw_user_meta_data->>'role' = 'super_admin';

-- Create a single super admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'superadmin@spacemate.com',
  crypt('SuperAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Super Administrator", "role": "super_admin"}',
  'authenticated',
  'authenticated'
);

-- Create the super admin profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  admin_sub_role,
  phone,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'superadmin@spacemate.com',
  'Super Administrator',
  'super_admin',
  'super_admin',
  '+91-9876543210',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  now(),
  now()
);

-- Create the super admin role entry
INSERT INTO public.user_roles (
  user_id,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'super_admin',
  now(),
  now()
);

-- Create a unique constraint to ensure only one super admin can exist
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_super_admin 
CHECK (role != 'super_admin' OR (role = 'super_admin' AND id = '00000000-0000-0000-0000-000000000000'));

-- Add a comment to document the super admin
COMMENT ON TABLE public.profiles IS 'Profiles table with single super admin constraint';
COMMENT ON COLUMN public.profiles.role IS 'User role - only one super_admin allowed';
