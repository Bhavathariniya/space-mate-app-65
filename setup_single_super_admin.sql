-- Setup Single Super Admin
-- Run this script in Supabase SQL Editor to create exactly one super admin

-- Step 1: Clean up existing super admin users
DELETE FROM public.user_roles WHERE role = 'super_admin';
DELETE FROM public.profiles WHERE role = 'super_admin';
DELETE FROM auth.users WHERE raw_user_meta_data->>'role' = 'super_admin';

-- Step 2: Create the single super admin user
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

-- Step 3: Create the super admin profile
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

-- Step 4: Create the super admin role entry
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

-- Step 5: Verify the setup
SELECT 
  'Super Admin Setup Complete!' as status,
  p.email,
  p.full_name,
  p.role,
  ur.role as user_role
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.role = 'super_admin';

-- Step 6: Check total count (should be 1)
SELECT 
  COUNT(*) as total_super_admins,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ Perfect! Single super admin configured.'
    WHEN COUNT(*) = 0 THEN '❌ No super admin found.'
    ELSE '⚠️ Multiple super admins found - this should not happen.'
  END as status
FROM public.profiles 
WHERE role = 'super_admin';
