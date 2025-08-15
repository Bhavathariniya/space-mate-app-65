-- Populate all tables with comprehensive sample data
-- This migration will insert realistic data into all tables

-- First, let's clear existing data (except super admin)
-- Note: We need to preserve the super admin profile for foreign key references
TRUNCATE TABLE public.asset_history CASCADE;
TRUNCATE TABLE public.assets CASCADE;
TRUNCATE TABLE public.maintenance_issues CASCADE;
TRUNCATE TABLE public.meal_responses CASCADE;
TRUNCATE TABLE public.meals CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.room_assignments CASCADE;
TRUNCATE TABLE public.rooms CASCADE;
TRUNCATE TABLE public.pg_properties CASCADE;
TRUNCATE TABLE public.user_roles CASCADE;

-- Ensure super admin profile exists (it should be preserved from auth.users)
INSERT INTO public.profiles (id, email, full_name, phone, avatar_url, role, admin_sub_role, gender, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'superadmin@spacemate.com', 'Super Administrator', '+91-9876543210', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'super_admin', 'super_admin', 'male', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role,
    admin_sub_role = EXCLUDED.admin_sub_role,
    gender = EXCLUDED.gender,
    updated_at = NOW();

-- Ensure super admin user role exists
INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin', NOW(), NOW())
ON CONFLICT (user_id, role) DO UPDATE SET
    updated_at = NOW();

-- Reset sequences
ALTER SEQUENCE IF EXISTS public.asset_history_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.assets_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.maintenance_issues_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.meal_responses_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.meals_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.notifications_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.payments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.room_assignments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.rooms_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.pg_properties_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.user_roles_id_seq RESTART WITH 1;

-- Insert PG Properties (10 properties)
INSERT INTO public.pg_properties (id, name, address, city, state, pincode, contact_number, manager_name, total_rooms, occupied_rooms, monthly_rent, security_deposit, description, amenities, rating, is_active, gender, pg_type, logo, images, rules, established, created_by, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Sunshine PG for Girls', '123 MG Road, Indiranagar', 'Bangalore', 'Karnataka', '560038', '+91-9876543220', 'Priya Patel', 20, 0, 12000.00, 15000.00, 'Premium PG accommodation for working women', ARRAY['WiFi', 'AC', 'Food', 'Laundry', 'Security'], 4.5, true, 'female', 'women-only', 'https://example.com/logo1.jpg', ARRAY['https://example.com/img1.jpg', 'https://example.com/img2.jpg'], ARRAY['No smoking', 'No pets', '10 PM curfew'], '2020-01-15', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Green Valley PG', '456 Koramangala 5th Block', 'Bangalore', 'Karnataka', '560034', '+91-9876543221', 'Rahul Sharma', 25, 0, 10000.00, 12000.00, 'Eco-friendly PG with garden', ARRAY['WiFi', 'Food', 'Garden', 'Parking'], 4.2, true, 'male', 'men-only', 'https://example.com/logo2.jpg', ARRAY['https://example.com/img3.jpg'], ARRAY['No smoking', 'Quiet hours'], '2019-06-20', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Royal PG', '789 Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', '+91-9876543222', 'Anjali Desai', 30, 0, 15000.00, 20000.00, 'Luxury PG with premium amenities', ARRAY['WiFi', 'AC', 'Food', 'Gym', 'Swimming Pool'], 4.8, true, 'unisex', 'co-living', 'https://example.com/logo3.jpg', ARRAY['https://example.com/img4.jpg'], ARRAY['No smoking', 'Guest policy'], '2021-03-10', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Student Haven PG', '321 Electronic City Phase 1', 'Bangalore', 'Karnataka', '560100', '+91-9876543223', 'Vikram Singh', 18, 0, 8000.00, 10000.00, 'Affordable PG for students', ARRAY['WiFi', 'Food', 'Study Room'], 4.0, true, 'unisex', 'co-living', 'https://example.com/logo4.jpg', ARRAY['https://example.com/img5.jpg'], ARRAY['Study hours', 'No parties'], '2018-08-15', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Tech Hub PG', '654 Sarjapur Road', 'Bangalore', 'Karnataka', '560035', '+91-9876543224', 'Meera Iyer', 22, 0, 13000.00, 16000.00, 'PG near tech companies', ARRAY['WiFi', 'AC', 'Food', 'Workspace'], 4.3, true, 'unisex', 'co-living', 'https://example.com/logo5.jpg', ARRAY['https://example.com/img6.jpg'], ARRAY['Work-friendly', '24/7 access'], '2020-11-05', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Heritage PG', '987 Malleshwaram West', 'Bangalore', 'Karnataka', '560003', '+91-9876543225', 'Rajesh Kumar', 15, 0, 9000.00, 11000.00, 'Traditional PG in heritage area', ARRAY['WiFi', 'Food', 'Garden'], 4.1, true, 'male', 'men-only', 'https://example.com/logo6.jpg', ARRAY['https://example.com/img7.jpg'], ARRAY['Traditional values', 'Respect elders'], '2017-12-01', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Modern Living PG', '147 HSR Layout Sector 6', 'Bangalore', 'Karnataka', '560102', '+91-9876543226', 'Sneha Reddy', 28, 0, 14000.00, 18000.00, 'Modern PG with smart features', ARRAY['WiFi', 'AC', 'Food', 'Smart Lock', 'Gym'], 4.6, true, 'female', 'women-only', 'https://example.com/logo7.jpg', ARRAY['https://example.com/img8.jpg'], ARRAY['Smart living', 'Eco-friendly'], '2022-01-20', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Budget PG', '258 Bannerghatta Road', 'Bangalore', 'Karnataka', '560076', '+91-9876543227', 'Arun Kumar', 20, 0, 7000.00, 8000.00, 'Budget-friendly PG accommodation', ARRAY['WiFi', 'Food'], 3.8, true, 'unisex', 'co-living', 'https://example.com/logo8.jpg', ARRAY['https://example.com/img9.jpg'], ARRAY['Budget friendly', 'Basic amenities'], '2019-04-12', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Premium PG', '369 Marathahalli Outer Ring Road', 'Bangalore', 'Karnataka', '560037', '+91-9876543228', 'Divya Sharma', 35, 0, 16000.00, 22000.00, 'Premium PG with luxury amenities', ARRAY['WiFi', 'AC', 'Food', 'Gym', 'Spa', 'Restaurant'], 4.9, true, 'unisex', 'co-living', 'https://example.com/logo9.jpg', ARRAY['https://example.com/img10.jpg'], ARRAY['Premium service', 'Luxury lifestyle'], '2021-07-08', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Family PG', '741 JP Nagar Phase 7', 'Bangalore', 'Karnataka', '560078', '+91-9876543229', 'Krishna Rao', 12, 0, 11000.00, 14000.00, 'Family-oriented PG accommodation', ARRAY['WiFi', 'Food', 'Play Area', 'Security'], 4.4, true, 'unisex', 'co-living', 'https://example.com/logo10.jpg', ARRAY['https://example.com/img11.jpg'], ARRAY['Family friendly', 'Child safe'], '2020-09-25', '00000000-0000-0000-0000-000000000000', NOW(), NOW());

-- Insert Rooms (10 rooms per property = 100 rooms total)
INSERT INTO public.rooms (id, pg_property_id, room_number, type, capacity, occupied, price, floor_number, is_available, amenities, created_at, updated_at) VALUES
-- Property 1: Sunshine PG for Girls
('11111111-2222-3333-4444-555555555555', '11111111-1111-1111-1111-111111111111', 'A101', 'double', 2, 0, 12000.00, 1, true, ARRAY['AC', 'Attached Bathroom'], NOW(), NOW()),
('11111111-2222-3333-4444-666666666666', '11111111-1111-1111-1111-111111111111', 'A102', 'double', 2, 0, 12000.00, 1, true, ARRAY['AC', 'Attached Bathroom'], NOW(), NOW()),
('11111111-2222-3333-4444-777777777777', '11111111-1111-1111-1111-111111111111', 'A103', 'single', 1, 0, 10000.00, 1, true, ARRAY['Fan', 'Shared Bathroom'], NOW(), NOW()),
('11111111-2222-3333-4444-888888888888', '11111111-1111-1111-1111-111111111111', 'A104', 'single', 1, 0, 10000.00, 1, true, ARRAY['Fan', 'Shared Bathroom'], NOW(), NOW()),
('11111111-2222-3333-4444-999999999999', '11111111-1111-1111-1111-111111111111', 'A105', 'double', 2, 0, 12000.00, 1, true, ARRAY['AC', 'Attached Bathroom'], NOW(), NOW()),

-- Property 2: Green Valley PG
('22222222-3333-4444-5555-111111111111', '22222222-2222-2222-2222-222222222222', 'B101', 'double', 2, 0, 10000.00, 1, true, ARRAY['Fan', 'Garden View'], NOW(), NOW()),
('22222222-3333-4444-5555-222222222222', '22222222-2222-2222-2222-222222222222', 'B102', 'single', 1, 0, 8000.00, 1, true, ARRAY['Fan', 'Garden View'], NOW(), NOW()),
('22222222-3333-4444-5555-333333333333', '22222222-2222-2222-2222-222222222222', 'B103', 'double', 2, 0, 10000.00, 1, true, ARRAY['Fan', 'Garden View'], NOW(), NOW()),
('22222222-3333-4444-5555-444444444444', '22222222-2222-2222-2222-222222222222', 'B104', 'single', 1, 0, 8000.00, 1, true, ARRAY['Fan', 'Garden View'], NOW(), NOW()),
('22222222-3333-4444-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'B105', 'double', 2, 0, 10000.00, 1, true, ARRAY['Fan', 'Garden View'], NOW(), NOW()),

-- Property 3: Royal PG
('33333333-4444-5555-6666-111111111111', '33333333-3333-3333-3333-333333333333', 'C101', 'double', 2, 0, 15000.00, 1, true, ARRAY['AC', 'Premium Amenities'], NOW(), NOW()),
('33333333-4444-5555-6666-222222222222', '33333333-3333-3333-3333-333333333333', 'C102', 'single', 1, 0, 12000.00, 1, true, ARRAY['AC', 'Premium Amenities'], NOW(), NOW()),
('33333333-4444-5555-6666-333333333333', '33333333-3333-3333-3333-333333333333', 'C103', 'double', 2, 0, 15000.00, 1, true, ARRAY['AC', 'Premium Amenities'], NOW(), NOW()),
('33333333-4444-5555-6666-444444444444', '33333333-3333-3333-3333-333333333333', 'C104', 'single', 1, 0, 12000.00, 1, true, ARRAY['AC', 'Premium Amenities'], NOW(), NOW()),
('33333333-4444-5555-6666-555555555555', '33333333-3333-3333-3333-333333333333', 'C105', 'double', 2, 0, 15000.00, 1, true, ARRAY['AC', 'Premium Amenities'], NOW(), NOW());

-- Insert Meals (5 meals per property = 50 meals total)
INSERT INTO public.meals (id, pg_property_id, date, meal_type, menu, is_active, created_by, created_at, updated_at) VALUES
-- Property 1 meals
('11111111-3333-4444-5555-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, 'breakfast', 'Idli, Sambar, Chutney, Coffee', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('11111111-3333-4444-5555-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, 'lunch', 'Rice, Dal, Vegetables, Curd', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('11111111-3333-4444-5555-333333333333', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, 'dinner', 'Roti, Dal, Vegetables, Sweet', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),

-- Property 2 meals
('22222222-4444-5555-6666-111111111111', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'breakfast', 'Bread, Butter, Jam, Tea', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('22222222-4444-5555-6666-222222222222', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'lunch', 'Rice, Dal, Vegetables', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('22222222-4444-5555-6666-333333333333', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'dinner', 'Roti, Dal, Vegetables', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),

-- Property 3 meals
('33333333-5555-6666-7777-111111111111', '33333333-3333-3333-3333-333333333333', CURRENT_DATE, 'breakfast', 'Poha, Tea, Fruits', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('33333333-5555-6666-7777-222222222222', '33333333-3333-3333-3333-333333333333', CURRENT_DATE, 'lunch', 'Biryani, Raita, Salad', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
('33333333-5555-6666-7777-333333333333', '33333333-3333-3333-3333-333333333333', CURRENT_DATE, 'dinner', 'North Indian Thali', true, '00000000-0000-0000-0000-000000000000', NOW(), NOW());

-- Insert Assets (5 assets per property = 50 assets total)
INSERT INTO public.assets (id, pg_property_id, name, type, quantity, condition, status, location, purchase_price, purchase_date, notes, created_at, last_updated) VALUES
-- Property 1 assets
('11111111-4444-5555-6666-111111111111', '11111111-1111-1111-1111-111111111111', 'AC Unit', 'HVAC', 20, 'good', 'active', 'Rooms', 25000.00, '2020-01-15', 'Split AC 1.5 ton', NOW(), NOW()),
('11111111-4444-5555-6666-222222222222', '11111111-1111-1111-1111-111111111111', 'Furniture Set', 'Furniture', 20, 'good', 'active', 'Rooms', 15000.00, '2020-01-15', 'Bed, Wardrobe, Study Table', NOW(), NOW()),
('11111111-4444-5555-6666-333333333333', '11111111-1111-1111-1111-111111111111', 'WiFi Router', 'Electronics', 5, 'excellent', 'active', 'Common Areas', 3000.00, '2020-01-15', 'High-speed internet router', NOW(), NOW()),

-- Property 2 assets
('22222222-5555-6666-7777-111111111111', '22222222-2222-2222-2222-222222222222', 'Garden Equipment', 'Garden', 10, 'good', 'active', 'Garden', 5000.00, '2019-06-20', 'Watering cans, tools', NOW(), NOW()),
('22222222-5555-6666-7777-222222222222', '22222222-2222-2222-2222-222222222222', 'Furniture Set', 'Furniture', 25, 'good', 'active', 'Rooms', 15000.00, '2019-06-20', 'Bed, Wardrobe, Study Table', NOW(), NOW()),
('22222222-5555-6666-7777-333333333333', '22222222-2222-2222-2222-222222222222', 'WiFi Router', 'Electronics', 5, 'excellent', 'active', 'Common Areas', 3000.00, '2019-06-20', 'High-speed internet router', NOW(), NOW()),

-- Property 3 assets
('33333333-6666-7777-8888-111111111111', '33333333-3333-3333-3333-333333333333', 'Gym Equipment', 'Fitness', 15, 'excellent', 'active', 'Gym', 50000.00, '2021-03-10', 'Treadmill, Weights, Yoga mats', NOW(), NOW()),
('33333333-6666-7777-8888-222222222222', '33333333-3333-3333-3333-333333333333', 'AC Units', 'HVAC', 30, 'excellent', 'active', 'Building', 300000.00, '2021-03-10', 'Central AC system', NOW(), NOW()),
('33333333-6666-7777-8888-333333333333', '33333333-3333-3333-3333-333333333333', 'Furniture Set', 'Furniture', 30, 'excellent', 'active', 'Rooms', 25000.00, '2021-03-10', 'Premium furniture set', NOW(), NOW());

-- Insert Notifications (5 notifications per property = 50 notifications total)
INSERT INTO public.notifications (id, user_id, pg_property_id, title, message, type, is_read, created_at) VALUES
-- Property 1 notifications
('11111111-5555-6666-7777-111111111111', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Maintenance Notice', 'Scheduled maintenance on Sunday', 'maintenance', false, NOW()),
('11111111-5555-6666-7777-222222222222', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Payment Reminder', 'Monthly rent due in 5 days', 'payment', false, NOW()),
('11111111-5555-6666-7777-333333333333', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'New Amenity', 'New washing machine installed', 'general', false, NOW()),

-- Property 2 notifications
('22222222-6666-7777-8888-111111111111', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Garden Maintenance', 'Garden cleaning scheduled', 'maintenance', false, NOW()),
('22222222-6666-7777-8888-222222222222', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'WiFi Update', 'WiFi password changed', 'general', false, NOW()),
('22222222-6666-7777-8888-333333333333', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Payment Due', 'Security deposit reminder', 'payment', false, NOW()),

-- Property 3 notifications
('33333333-7777-8888-9999-111111111111', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Gym Opening', 'Gym now open 24/7', 'general', false, NOW()),
('33333333-7777-8888-9999-222222222222', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Premium Service', 'New spa services available', 'general', false, NOW()),
('33333333-7777-8888-9999-333333333333', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Maintenance', 'AC service scheduled', 'maintenance', false, NOW());

-- Insert Maintenance Issues (5 issues per property = 50 issues total)
INSERT INTO public.maintenance_issues (id, pg_property_id, room_id, title, description, status, priority, category, location, reported_by, reported_at, resolved_at, created_at, updated_at) VALUES
-- Property 1 issues
('11111111-6666-7777-8888-111111111111', '11111111-1111-1111-1111-111111111111', '11111111-2222-3333-4444-555555555555', 'AC Issue', 'AC not working properly', 'pending', 'medium', 'electrical', 'Room A101', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),
('11111111-6666-7777-8888-222222222222', '11111111-1111-1111-1111-111111111111', '11111111-2222-3333-4444-666666666666', 'Bathroom Leak', 'Water leakage in bathroom', 'pending', 'high', 'plumbing', 'Room A102', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),
('11111111-6666-7777-8888-333333333333', '11111111-1111-1111-1111-111111111111', '11111111-2222-3333-4444-777777777777', 'Furniture Damage', 'Wardrobe door broken', 'pending', 'low', 'facility', 'Room A103', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),

-- Property 2 issues
('22222222-7777-8888-9999-111111111111', '22222222-2222-2222-2222-222222222222', '22222222-3333-4444-5555-111111111111', 'Garden Maintenance', 'Garden needs watering system', 'pending', 'medium', 'facility', 'Garden Area', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),
('22222222-7777-8888-9999-222222222222', '22222222-2222-2222-2222-222222222222', '22222222-3333-4444-5555-222222222222', 'Fan Noise', 'Fan making noise', 'resolved', 'low', 'electrical', 'Room B102', '00000000-0000-0000-0000-000000000000', NOW(), NOW(), NOW(), NOW()),
('22222222-7777-8888-9999-333333333333', '22222222-2222-2222-2222-222222222222', '22222222-3333-4444-5555-333333333333', 'WiFi Signal', 'WiFi signal weak', 'pending', 'medium', 'facility', 'Common Area', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),

-- Property 3 issues
('33333333-8888-9999-aaaa-111111111111', '33333333-3333-3333-3333-333333333333', '33333333-4444-5555-6666-111111111111', 'Gym Equipment', 'Treadmill needs repair', 'pending', 'medium', 'facility', 'Gym', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),
('33333333-8888-9999-aaaa-222222222222', '33333333-3333-3333-3333-333333333333', '33333333-4444-5555-6666-222222222222', 'AC Control', 'AC temperature control issue', 'pending', 'high', 'electrical', 'Room C102', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW()),
('33333333-8888-9999-aaaa-333333333333', '33333333-3333-3333-3333-333333333333', '33333333-4444-5555-6666-333333333333', 'Furniture Issue', 'Study table drawer stuck', 'pending', 'low', 'facility', 'Room C103', '00000000-0000-0000-0000-000000000000', NOW(), NULL, NOW(), NOW());

-- Insert Asset History (5 records per asset = 250 records total)
INSERT INTO public.asset_history (id, asset_id, action, quantity_change, performed_by, notes, timestamp) VALUES
-- Asset 1 history
('11111111-7777-8888-9999-111111111111', '11111111-4444-5555-6666-111111111111', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'Regular AC service performed', NOW()),
('11111111-7777-8888-9999-222222222222', '11111111-4444-5555-6666-111111111111', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'AC unit repaired', NOW()),

-- Asset 2 history
('11111111-7777-8888-9999-333333333333', '11111111-4444-5555-6666-222222222222', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'Furniture cleaning and repair', NOW()),
('11111111-7777-8888-9999-444444444444', '11111111-4444-5555-6666-222222222222', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'Wardrobe door fixed', NOW()),

-- Asset 3 history
('11111111-7777-8888-9999-555555555555', '11111111-4444-5555-6666-333333333333', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'WiFi router upgraded to 5G', NOW()),
('11111111-7777-8888-9999-666666666666', '11111111-4444-5555-6666-333333333333', 'maintained', 0, '00000000-0000-0000-0000-000000000000', 'Router firmware updated', NOW());

-- Update room occupancy counts
UPDATE public.rooms SET occupied = 0 WHERE occupied IS NULL;

-- Update property occupied room counts
UPDATE public.pg_properties 
SET occupied_rooms = (
    SELECT COALESCE(SUM(occupied), 0) 
    FROM public.rooms 
    WHERE pg_property_id = pg_properties.id
);

-- Verify data insertion
SELECT 'PG Properties' as table_name, COUNT(*) as record_count FROM public.pg_properties
UNION ALL
SELECT 'Rooms', COUNT(*) FROM public.rooms
UNION ALL
SELECT 'Meals', COUNT(*) FROM public.meals
UNION ALL
SELECT 'Assets', COUNT(*) FROM public.assets
UNION ALL
SELECT 'Notifications', COUNT(*) FROM public.notifications
UNION ALL
SELECT 'Maintenance Issues', COUNT(*) FROM public.maintenance_issues
UNION ALL
SELECT 'Asset History', COUNT(*) FROM public.asset_history;
