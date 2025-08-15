-- First, let's create some test users with actual auth accounts
-- Note: In production, users would sign up through the frontend

-- Insert sample data with proper user relationships
-- We'll use the auth trigger to create profiles automatically

-- Sample PG Properties
INSERT INTO public.pg_properties (id, name, address, city, state, pincode, contact_number, manager_name, total_rooms, occupied_rooms, monthly_rent, security_deposit, description, amenities, rating, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sunrise PG', '123 Main Street, Sector 1', 'Mumbai', 'Maharashtra', '400001', '+91-9876543210', 'Rajesh Kumar', 20, 15, 15000.00, 30000.00, 'Modern PG with all amenities', ARRAY['WiFi', 'AC', 'Meals', 'Laundry', 'Security'], 4.5, true),
('550e8400-e29b-41d4-a716-446655440002', 'Green Valley PG', '456 Park Avenue, Block B', 'Delhi', 'Delhi', '110001', '+91-9876543211', 'Priya Sharma', 15, 12, 18000.00, 36000.00, 'Peaceful environment with garden', ARRAY['WiFi', 'Gym', 'Meals', 'Parking', 'CCTV'], 4.2, true),
('550e8400-e29b-41d4-a716-446655440003', 'Tech Hub PG', '789 IT Park Road', 'Bangalore', 'Karnataka', '560001', '+91-9876543212', 'Amit Patel', 25, 20, 20000.00, 40000.00, 'Perfect for IT professionals', ARRAY['WiFi', 'AC', 'Cafeteria', 'Study Room'], 4.7, true);

-- Sample Rooms
INSERT INTO public.rooms (id, pg_property_id, room_number, type, capacity, occupied, price, floor_number, is_available, amenities) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '101', 'Single', 1, 1, 15000.00, 1, false, ARRAY['AC', 'Attached Bathroom']),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '102', 'Double', 2, 2, 12000.00, 1, false, ARRAY['Fan', 'Common Bathroom']),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '201', 'Single', 1, 0, 18000.00, 2, true, ARRAY['AC', 'Balcony']),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '301', 'Triple', 3, 2, 16000.00, 3, true, ARRAY['AC', 'Study Table']);

-- Sample Assets
INSERT INTO public.assets (id, pg_property_id, name, type, quantity, condition, status, location, purchase_price, purchase_date, notes) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Split AC Units', 'Electronics', 20, 'good', 'active', 'Various Rooms', 35000.00, '2023-01-15', 'Regular maintenance required'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Study Tables', 'Furniture', 15, 'excellent', 'active', 'Study Room', 45000.00, '2023-02-20', 'Ergonomic design'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'WiFi Router', 'Electronics', 5, 'good', 'active', 'Common Areas', 25000.00, '2023-03-10', 'High-speed internet');

-- Sample Meals (using the existing pg_property_ids)
INSERT INTO public.meals (id, pg_property_id, date, meal_type, menu, is_active) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 'breakfast', 'Poha, Tea, Fruits', true),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 'lunch', 'Rice, Dal, Sabzi, Roti', true),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, 'dinner', 'Biryani, Raita, Pickle', true);

-- Sample Notifications (without user_id for now, will be property-wide notifications)
INSERT INTO public.notifications (id, pg_property_id, title, message, type, requires_action) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Maintenance Alert', 'Water supply will be interrupted tomorrow from 10 AM to 2 PM', 'maintenance', false),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Rent Reminder', 'Monthly rent is due in 3 days', 'payment', true),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'New Rules', 'Updated PG rules have been posted on the notice board', 'general', false);

-- Note: For actual users, room_assignments, payments, and maintenance_issues
-- we need real user IDs from auth.users table
-- These will be created when users sign up through the frontend