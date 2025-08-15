-- Fix PG Property Assignments and Add Comprehensive Sample Data
-- This migration ensures proper linking between users and PG properties

-- First, let's update existing profiles to have proper pg_property_id assignments
UPDATE profiles 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE email = 'manager@spacemate.com';

UPDATE profiles 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE email = 'warden@spacemate.com';

UPDATE profiles 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE email = 'guest1@spacemate.com';

UPDATE profiles 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE email = 'guest2@spacemate.com';

-- Add more comprehensive PG properties
INSERT INTO public.pg_properties (id, name, address, city, state, pincode, contact_number, manager_name, total_rooms, occupied_rooms, monthly_rent, security_deposit, description, amenities, rating, is_active, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Student Haven PG', '321 College Road, University Area', 'Pune', 'Maharashtra', '411005', '+91-9876543213', 'Vikram Singh', 30, 25, 12000.00, 25000.00, 'Student-friendly PG near universities', ARRAY['WiFi', 'Food', 'Study Room', 'Library', 'Security'], 4.3, true, '22222222-2222-2222-2222-222222222222'),
('550e8400-e29b-41d4-a716-446655440005', 'Corporate Comfort PG', '654 Business Park, IT Hub', 'Hyderabad', 'Telangana', '500081', '+91-9876543214', 'Anjali Reddy', 40, 35, 22000.00, 45000.00, 'Premium PG for corporate professionals', ARRAY['WiFi', 'AC', 'Gym', 'Cafeteria', 'Transport', 'Security'], 4.8, true, '22222222-2222-2222-2222-222222222222'),
('550e8400-e29b-41d4-a716-446655440006', 'Family PG', '987 Residential Area, Suburb', 'Chennai', 'Tamil Nadu', '600028', '+91-9876543215', 'Rajesh Iyer', 15, 12, 16000.00, 32000.00, 'Family-oriented PG with homely environment', ARRAY['WiFi', 'Food', 'Garden', 'Parking', 'Security'], 4.1, true, '22222222-2222-2222-2222-222222222222');

-- Add more rooms for the new properties
INSERT INTO public.rooms (id, pg_property_id, room_number, type, capacity, occupied, price, floor_number, is_available, amenities) VALUES
-- Student Haven PG Rooms
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', '101', 'single', 1, 1, 12000.00, 1, false, ARRAY['Fan', 'Study Table']),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '102', 'double', 2, 2, 10000.00, 1, false, ARRAY['Fan', 'Study Table']),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '201', 'single', 1, 0, 12000.00, 2, true, ARRAY['AC', 'Study Table']),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', '202', 'triple', 3, 1, 8000.00, 2, true, ARRAY['Fan', 'Study Table']),

-- Corporate Comfort PG Rooms
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', '101', 'single', 1, 1, 22000.00, 1, false, ARRAY['AC', 'Attached Bathroom', 'Balcony']),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', '102', 'double', 2, 2, 18000.00, 1, false, ARRAY['AC', 'Attached Bathroom']),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', '201', 'single', 1, 0, 22000.00, 2, true, ARRAY['AC', 'Attached Bathroom', 'Balcony']),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', '202', 'double', 2, 1, 18000.00, 2, true, ARRAY['AC', 'Attached Bathroom']),

-- Family PG Rooms
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440006', '101', 'single', 1, 1, 16000.00, 1, false, ARRAY['AC', 'Attached Bathroom']),
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440006', '102', 'double', 2, 2, 14000.00, 1, false, ARRAY['AC', 'Attached Bathroom']),
('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440006', '201', 'single', 1, 0, 16000.00, 2, true, ARRAY['AC', 'Attached Bathroom']);

-- Add more sample users with proper PG property assignments
INSERT INTO profiles (id, email, full_name, role, admin_sub_role, phone, avatar_url, pg_property_id) VALUES
-- PG Admin for Student Haven
('66666666-6666-6666-6666-666666666666', 'studenthaven@spacemate.com', 'Vikram Singh', 'admin', 'pg_admin', '+91-9876543216', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '550e8400-e29b-41d4-a716-446655440004'),

-- PG Admin for Corporate Comfort
('77777777-7777-7777-7777-777777777777', 'corporatecomfort@spacemate.com', 'Anjali Reddy', 'admin', 'pg_admin', '+91-9876543217', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '550e8400-e29b-41d4-a716-446655440005'),

-- PG Admin for Family PG
('88888888-8888-8888-8888-888888888888', 'familypg@spacemate.com', 'Rajesh Iyer', 'admin', 'pg_admin', '+91-9876543218', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '550e8400-e29b-41d4-a716-446655440006'),

-- More guests
('99999999-9999-9999-9999-999999999999', 'guest3@spacemate.com', 'Priya Patel', 'guest', NULL, '+91-9876543219', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '550e8400-e29b-41d4-a716-446655440004'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'guest4@spacemate.com', 'Rahul Sharma', 'guest', NULL, '+91-9876543220', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '550e8400-e29b-41d4-a716-446655440005'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'guest5@spacemate.com', 'Sneha Kumar', 'guest', NULL, '+91-9876543221', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '550e8400-e29b-41d4-a716-446655440006');

-- Add room assignments for new guests
INSERT INTO room_assignments (id, user_id, pg_property_id, room_id, start_date, end_date, monthly_rent, security_deposit, is_active) VALUES
('cc111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', '2024-01-01', '2024-12-31', 12000, 25000, true),
('dd222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440009', '2024-01-01', '2024-12-31', 22000, 45000, true),
('ee333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440013', '2024-01-01', '2024-12-31', 16000, 32000, true);

-- Add more meals for different properties
INSERT INTO public.meals (id, pg_property_id, date, meal_type, menu, is_active) VALUES
-- Student Haven meals
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', CURRENT_DATE, 'breakfast', 'Bread, Butter, Jam, Tea, Fruits', true),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', CURRENT_DATE, 'lunch', 'Rice, Dal, Mixed Vegetables, Roti, Curd', true),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', CURRENT_DATE, 'dinner', 'Chapati, Dal, Sabzi, Pickle', true),

-- Corporate Comfort meals
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', CURRENT_DATE, 'breakfast', 'Omelette, Toast, Coffee, Fruits', true),
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', CURRENT_DATE, 'lunch', 'Biryani, Raita, Salad, Dessert', true),
('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', CURRENT_DATE, 'dinner', 'Pasta, Soup, Bread, Dessert', true),

-- Family PG meals
('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, 'breakfast', 'Idli, Sambar, Chutney, Coffee', true),
('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, 'lunch', 'Rice, Sambar, Vegetables, Papad', true),
('880e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, 'dinner', 'Dosa, Chutney, Sambar, Tea', true);

-- Add more payments
INSERT INTO payments (id, user_id, pg_property_id, type, amount, status, description, due_date, paid_at, payment_method, transaction_id) VALUES
('pay005-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440004', 'monthly', 12000, 'completed', 'January 2024 rent', '2024-01-05', '2024-01-03 10:00:00+00', 'upi', 'TXN111111111'),
('pay006-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440005', 'monthly', 22000, 'completed', 'January 2024 rent', '2024-01-05', '2024-01-04 15:30:00+00', 'bank_transfer', 'TXN222222222'),
('pay007-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440006', 'monthly', 16000, 'pending', 'February 2024 rent', '2024-02-05', NULL, NULL, NULL),
('pay008-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440004', 'deposit', 25000, 'completed', 'Security deposit', '2024-01-01', '2023-12-28 12:00:00+00', 'bank_transfer', 'TXN333333333');

-- Add more notifications
INSERT INTO notifications (id, pg_property_id, title, message, type, requires_action, user_id) VALUES
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Study Room Maintenance', 'Study room will be closed for maintenance tomorrow', 'maintenance', false, NULL),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Gym Schedule Update', 'Gym timings changed to 6 AM - 10 PM', 'general', false, NULL),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'Garden Maintenance', 'Garden maintenance scheduled for this weekend', 'maintenance', false, NULL),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'Rent Due Reminder', 'Monthly rent is due in 2 days', 'payment', true, '99999999-9999-9999-9999-999999999999'),
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 'Payment Confirmation', 'Your rent payment has been received', 'payment', false, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Add more maintenance issues
INSERT INTO maintenance_issues (id, pg_property_id, title, description, status, priority, category, location, reported_by, assigned_to, reported_at) VALUES
('maint004-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440004', 'Study Room Light Issue', 'Lights not working in study room', 'pending', 'medium', 'electrical', 'Study Room', '99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '2024-01-27 09:00:00+00'),
('maint005-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440005', 'Gym Equipment Repair', 'Treadmill needs repair', 'in-progress', 'high', 'facility', 'Gym', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', '2024-01-26 16:00:00+00'),
('maint006-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440006', 'Garden Watering System', 'Automatic watering system malfunction', 'completed', 'low', 'facility', 'Garden', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', '2024-01-25 11:30:00+00');

-- Update existing room assignments to use correct room IDs
UPDATE room_assignments 
SET room_id = '660e8400-e29b-41d4-a716-446655440001'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE room_assignments 
SET room_id = '660e8400-e29b-41d4-a716-446655440003'
WHERE user_id = '55555555-5555-5555-5555-555555555555';

-- Update existing payments to use correct property IDs
UPDATE payments 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE payments 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE user_id = '55555555-5555-5555-5555-555555555555';

-- Update existing room assignments to use correct property IDs
UPDATE room_assignments 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE room_assignments 
SET pg_property_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE user_id = '55555555-5555-5555-5555-555555555555'; 