-- Create test users via auth.users insert and trigger the profile creation
-- Insert test users directly into auth.users table

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
) VALUES 
-- Super Admin
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'superadmin@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Super Admin", "role": "super_admin"}',
  'authenticated',
  'authenticated'
),
-- PG Admin
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'pgadmin@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "PG Admin", "role": "pg_admin"}',
  'authenticated',
  'authenticated'
),
-- Warden
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'warden@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Warden", "role": "warden"}',
  'authenticated',
  'authenticated'
),
-- Guest
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'guest@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Guest User", "role": "guest"}',
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Manually trigger profile creation for these users since the trigger might not fire for direct inserts
INSERT INTO public.profiles (id, email, full_name, role, admin_sub_role) VALUES
('11111111-1111-1111-1111-111111111111', 'superadmin@test.com', 'Super Admin', 'super_admin', 'super_admin'),
('22222222-2222-2222-2222-222222222222', 'pgadmin@test.com', 'PG Admin', 'pg_admin', 'pg_admin'),
('33333333-3333-3333-3333-333333333333', 'warden@test.com', 'Warden', 'warden', 'warden'),
('44444444-4444-4444-4444-444444444444', 'guest@test.com', 'Guest User', 'guest', null)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  admin_sub_role = EXCLUDED.admin_sub_role;

-- Manually insert user roles
INSERT INTO public.user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'super_admin'),
('22222222-2222-2222-2222-222222222222', 'pg_admin'),
('33333333-3333-3333-3333-333333333333', 'warden'),
('44444444-4444-4444-4444-444444444444', 'guest')
ON CONFLICT (user_id, role) DO NOTHING;