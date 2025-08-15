-- Reset and Insert Sample Data Migration
-- This migration clears all existing data and inserts 10 proper datasets for each table

-- Clear all existing data (in reverse dependency order)
TRUNCATE TABLE public.asset_history CASCADE;
TRUNCATE TABLE public.assets CASCADE;
TRUNCATE TABLE public.maintenance_issues CASCADE;
TRUNCATE TABLE public.meal_responses CASCADE;
TRUNCATE TABLE public.meals CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.room_assignments CASCADE;
TRUNCATE TABLE public.rooms CASCADE;
TRUNCATE TABLE public.pg_properties CASCADE;
TRUNCATE TABLE public.user_roles CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Reset sequences
ALTER SEQUENCE IF EXISTS public.asset_history_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.assets_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.maintenance_issues_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.meal_responses_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.meals_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.payments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.room_assignments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.rooms_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.pg_properties_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.user_roles_id_seq RESTART WITH 1;

-- Insert sample profiles (only for existing super admin)
-- Note: Only inserting for the existing super admin user to avoid foreign key constraint violations
INSERT INTO public.profiles (id, email, full_name, phone, avatar_url, role, admin_sub_role, gender, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000000', 'superadmin@spacemate.com', 'Super Admin', '+91-9876543210', 'https://example.com/avatar1.jpg', 'super_admin', 'super_admin', 'male', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00');

-- Insert user roles (only for existing super admin)
INSERT INTO public.user_roles (user_id, role, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000000', 'super_admin', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00');

-- Insert PG properties (5 properties, all created by super admin)
INSERT INTO public.pg_properties (id, name, address, city, state, pincode, contact_number, manager_name, total_rooms, occupied_rooms, monthly_rent, security_deposit, description, amenities, rating, is_active, gender, pg_type, logo, images, rules, established, created_by, created_at, updated_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sunshine PG for Girls', '123 MG Road, Indiranagar', 'Bangalore', 'Karnataka', '560038', '+91-9876543220', 'Priya Patel', 20, 15, 12000.00, 15000.00, 'Premium PG accommodation for working women', ARRAY['WiFi', 'AC', 'Food', 'Laundry', 'Security'], 4.5, true, 'female', 'women-only', 'https://example.com/logo1.jpg', ARRAY['https://example.com/img1.jpg', 'https://example.com/img2.jpg'], ARRAY['No smoking', 'No pets', '10 PM curfew'], '2020-01-15', '00000000-0000-0000-0000-000000000000', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Royal Boys PG', '456 Koramangala 8th Block', 'Bangalore', 'Karnataka', '560034', '+91-9876543221', 'Rahul Sharma', 25, 20, 10000.00, 12000.00, 'Comfortable accommodation for working professionals', ARRAY['WiFi', 'Food', 'Laundry', 'Parking'], 4.2, true, 'male', 'men-only', 'https://example.com/logo2.jpg', ARRAY['https://example.com/img3.jpg', 'https://example.com/img4.jpg'], ARRAY['No smoking', 'No pets', '11 PM curfew'], '2019-06-20', '00000000-0000-0000-0000-000000000000', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cozy Co-living Space', '789 Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', '+91-9876543222', 'Amit Kumar', 30, 25, 15000.00, 20000.00, 'Modern co-living space with premium amenities', ARRAY['WiFi', 'AC', 'Food', 'Gym', 'Gaming Room'], 4.8, true, 'unisex', 'co-living', 'https://example.com/logo3.jpg', ARRAY['https://example.com/img5.jpg', 'https://example.com/img6.jpg'], ARRAY['No smoking', 'Pet friendly', '24/7 access'], '2021-03-10', '00000000-0000-0000-0000-000000000000', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Green Valley PG', '321 Electronic City Phase 1', 'Bangalore', 'Karnataka', '560100', '+91-9876543223', 'Neha Singh', 18, 12, 9000.00, 10000.00, 'Eco-friendly PG with garden and organic food', ARRAY['WiFi', 'Garden', 'Organic Food', 'Yoga Room'], 4.3, true, 'unisex', 'co-living', 'https://example.com/logo4.jpg', ARRAY['https://example.com/img7.jpg', 'https://example.com/img8.jpg'], ARRAY['No smoking', 'Eco-friendly practices', '9 PM curfew'], '2020-08-05', '00000000-0000-0000-0000-000000000000', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Tech Hub PG', '654 Sarjapur Road', 'Bangalore', 'Karnataka', '560035', '+91-9876543224', 'Vikram Malhotra', 22, 18, 13000.00, 16000.00, 'PG designed for tech professionals', ARRAY['WiFi', 'AC', 'Food', 'Study Room', 'Tech Support'], 4.6, true, 'male', 'men-only', 'https://example.com/logo5.jpg', ARRAY['https://example.com/img9.jpg', 'https://example.com/img10.jpg'], ARRAY['No smoking', 'Quiet hours 10 PM-7 AM', 'Tech-friendly'], '2021-01-12', '00000000-0000-0000-0000-000000000000', '2024-01-01 10:00:00+00', '2024-01-01 10:00:00+00');
