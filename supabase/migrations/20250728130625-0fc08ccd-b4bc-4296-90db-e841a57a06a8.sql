-- Insert sample profiles (users)
INSERT INTO profiles (id, email, full_name, role, phone, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@spacemate.com', 'John Admin', 'super_admin', '+91-9876543210', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('22222222-2222-2222-2222-222222222222', 'manager@spacemate.com', 'Sarah Manager', 'pg_admin', '+91-9876543211', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'),
('33333333-3333-3333-3333-333333333333', 'warden@spacemate.com', 'Mike Warden', 'warden', '+91-9876543212', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('44444444-4444-4444-4444-444444444444', 'guest1@spacemate.com', 'Alex Smith', 'guest', '+91-9876543213', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('55555555-5555-5555-5555-555555555555', 'guest2@spacemate.com', 'Emma Wilson', 'guest', '+91-9876543214', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');

-- Insert more sample room assignments
INSERT INTO room_assignments (id, user_id, pg_property_id, room_id, start_date, end_date, monthly_rent, security_deposit, is_active) VALUES
('aa111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '12345678-1234-5678-9012-123456789012', '11111111-1111-1111-1111-111111111111', '2024-01-01', '2024-12-31', 8000, 15000, true),
('bb222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '12345678-1234-5678-9012-123456789012', '22222222-2222-2222-2222-222222222222', '2024-02-01', '2024-12-31', 9000, 18000, true);

-- Insert sample assets
INSERT INTO assets (id, pg_property_id, name, type, quantity, status, condition, location, notes, purchase_price, purchase_date) VALUES
('asset001-1111-1111-1111-111111111111', '12345678-1234-5678-9012-123456789012', 'Single Beds', 'bed', 50, 'active', 'good', 'All Rooms', 'Standard single beds', 5000, '2023-01-15'),
('asset002-2222-2222-2222-222222222222', '12345678-1234-5678-9012-123456789012', 'Study Tables', 'furniture', 30, 'active', 'excellent', 'Rooms & Common Area', 'Wooden study tables', 3000, '2023-02-10'),
('asset003-3333-3333-3333-333333333333', '12345678-1234-5678-9012-123456789012', 'WiFi Routers', 'facility', 5, 'active', 'good', 'Each Floor', 'High-speed internet routers', 8000, '2023-03-05');

-- Insert sample asset history
INSERT INTO asset_history (id, asset_id, action, quantity_change, timestamp, performed_by, notes) VALUES
('hist001-1111-1111-1111-111111111111', 'asset001-1111-1111-1111-111111111111', 'added', 50, '2023-01-15 10:00:00+00', '22222222-2222-2222-2222-222222222222', 'Initial purchase of beds'),
('hist002-2222-2222-2222-222222222222', 'asset002-2222-2222-2222-222222222222', 'added', 30, '2023-02-10 14:30:00+00', '22222222-2222-2222-2222-222222222222', 'Study tables installed'),
('hist003-3333-3333-3333-333333333333', 'asset001-1111-1111-1111-111111111111', 'maintained', 0, '2024-01-20 09:00:00+00', '33333333-3333-3333-3333-333333333333', 'Routine maintenance check');

-- Insert sample maintenance issues
INSERT INTO maintenance_issues (id, pg_property_id, title, description, status, priority, category, location, reported_by, assigned_to, reported_at) VALUES
('maint001-1111-1111-1111-111111111111', '12345678-1234-5678-9012-123456789012', 'Leaky Faucet in Room 101', 'The bathroom faucet is dripping continuously', 'pending', 'medium', 'plumbing', 'Room 101', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '2024-01-25 10:30:00+00'),
('maint002-2222-2222-2222-222222222222', '12345678-1234-5678-9012-123456789012', 'WiFi Not Working Floor 2', 'Internet connection issues on second floor', 'in-progress', 'high', 'electrical', 'Floor 2', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '2024-01-26 14:15:00+00'),
('maint003-3333-3333-3333-333333333333', '12345678-1234-5678-9012-123456789012', 'Broken Window', 'Window pane cracked in common area', 'completed', 'low', 'structural', 'Common Area', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '2024-01-20 16:45:00+00');

-- Insert sample payments
INSERT INTO payments (id, user_id, pg_property_id, type, amount, status, description, due_date, paid_at, payment_method, transaction_id) VALUES
('pay001-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '12345678-1234-5678-9012-123456789012', 'monthly', 8000, 'completed', 'January 2024 rent', '2024-01-05', '2024-01-03 10:00:00+00', 'upi', 'TXN123456789'),
('pay002-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '12345678-1234-5678-9012-123456789012', 'monthly', 9000, 'completed', 'January 2024 rent', '2024-01-05', '2024-01-04 15:30:00+00', 'bank_transfer', 'TXN987654321'),
('pay003-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '12345678-1234-5678-9012-123456789012', 'monthly', 8000, 'pending', 'February 2024 rent', '2024-02-05', NULL, NULL, NULL),
('pay004-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '12345678-1234-5678-9012-123456789012', 'deposit', 15000, 'completed', 'Security deposit', '2024-01-01', '2023-12-28 12:00:00+00', 'bank_transfer', 'TXN456789123');

-- Insert sample meal responses
INSERT INTO meal_responses (id, user_id, meal_id, response, created_at) VALUES
('resp001-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'yes', '2024-01-28 08:00:00+00'),
('resp002-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'yes', '2024-01-28 08:15:00+00'),
('resp003-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'no', '2024-01-28 12:30:00+00'),
('resp004-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 'yes', '2024-01-28 18:45:00+00');