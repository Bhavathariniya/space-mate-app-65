-- Initial Database Schema for SpaceMate PG Management System
-- This migration creates all base tables with proper constraints and relationships

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('super_admin', 'pg_admin', 'warden', 'guest');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.payment_type AS ENUM ('monthly', 'deposit', 'fine', 'other');
CREATE TYPE public.maintenance_status AS ENUM ('pending', 'in-progress', 'completed', 'cancelled');
CREATE TYPE public.maintenance_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.asset_status AS ENUM ('active', 'inactive', 'maintenance', 'retired');
CREATE TYPE public.asset_condition AS ENUM ('excellent', 'good', 'fair', 'poor');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'guest',
    admin_sub_role TEXT,
    pg_property_id UUID,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create pg_properties table
CREATE TABLE public.pg_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    total_rooms INTEGER,
    occupied_rooms INTEGER DEFAULT 0,
    monthly_rent NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2) NOT NULL,
    description TEXT,
    amenities TEXT[],
    rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
    pg_type TEXT CHECK (pg_type IN ('co-living', 'men-only', 'women-only')),
    logo TEXT,
    images TEXT[],
    rules TEXT[],
    established DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE NOT NULL,
    room_number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('single', 'double', 'triple', 'quad')),
    capacity INTEGER NOT NULL,
    occupied INTEGER DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    floor_number INTEGER,
    is_available BOOLEAN DEFAULT true,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (pg_property_id, room_number)
);

-- Create room_assignments table
CREATE TABLE public.room_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, room_id, start_date)
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE,
    type payment_type NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    description TEXT,
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meals table
CREATE TABLE public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    menu TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meal_responses table
CREATE TABLE public.meal_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
    response TEXT NOT NULL CHECK (response IN ('yes', 'no', 'maybe')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, meal_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('payment', 'maintenance', 'general', 'meal', 'security')),
    is_read BOOLEAN DEFAULT false,
    requires_action BOOLEAN DEFAULT false,
    action_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create maintenance_issues table
CREATE TABLE public.maintenance_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status maintenance_status DEFAULT 'pending',
    priority maintenance_priority DEFAULT 'medium',
    category TEXT CHECK (category IN ('electrical', 'plumbing', 'structural', 'facility', 'cleaning', 'other')),
    location TEXT,
    reported_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assets table
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_property_id UUID REFERENCES public.pg_properties(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    condition asset_condition DEFAULT 'good',
    status asset_status DEFAULT 'active',
    location TEXT,
    purchase_price NUMERIC(10,2),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create asset_history table
CREATE TABLE public.asset_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'maintained', 'replaced', 'damaged')),
    quantity_change INTEGER,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_pg_property_id ON public.profiles(pg_property_id);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

CREATE INDEX idx_pg_properties_city ON public.pg_properties(city);
CREATE INDEX idx_pg_properties_is_active ON public.pg_properties(is_active);
CREATE INDEX idx_pg_properties_gender_type ON public.pg_properties(gender, pg_type);
CREATE INDEX idx_pg_properties_created_by ON public.pg_properties(created_by);

CREATE INDEX idx_rooms_pg_property_id ON public.rooms(pg_property_id);
CREATE INDEX idx_rooms_is_available ON public.rooms(is_available);
CREATE INDEX idx_rooms_type ON public.rooms(type);

CREATE INDEX idx_room_assignments_user_id ON public.room_assignments(user_id);
CREATE INDEX idx_room_assignments_pg_property_id ON public.room_assignments(pg_property_id);
CREATE INDEX idx_room_assignments_room_id ON public.room_assignments(room_id);
CREATE INDEX idx_room_assignments_is_active ON public.room_assignments(is_active);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_pg_property_id ON public.payments(pg_property_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_due_date ON public.payments(due_date);

CREATE INDEX idx_meals_pg_property_id ON public.meals(pg_property_id);
CREATE INDEX idx_meals_date ON public.meals(date);
CREATE INDEX idx_meals_meal_type ON public.meals(meal_type);

CREATE INDEX idx_meal_responses_user_id ON public.meal_responses(user_id);
CREATE INDEX idx_meal_responses_meal_id ON public.meal_responses(meal_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_pg_property_id ON public.notifications(pg_property_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);

CREATE INDEX idx_maintenance_issues_pg_property_id ON public.maintenance_issues(pg_property_id);
CREATE INDEX idx_maintenance_issues_status ON public.maintenance_issues(status);
CREATE INDEX idx_maintenance_issues_priority ON public.maintenance_issues(priority);
CREATE INDEX idx_maintenance_issues_reported_by ON public.maintenance_issues(reported_by);
CREATE INDEX idx_maintenance_issues_assigned_to ON public.maintenance_issues(assigned_to);

CREATE INDEX idx_assets_pg_property_id ON public.assets(pg_property_id);
CREATE INDEX idx_assets_type ON public.assets(type);
CREATE INDEX idx_assets_status ON public.assets(status);

CREATE INDEX idx_asset_history_asset_id ON public.asset_history(asset_id);
CREATE INDEX idx_asset_history_performed_by ON public.asset_history(performed_by);
CREATE INDEX idx_asset_history_timestamp ON public.asset_history(timestamp);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pg_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_history ENABLE ROW LEVEL SECURITY;

-- Create utility functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pg_properties_updated_at BEFORE UPDATE ON public.pg_properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_assignments_updated_at BEFORE UPDATE ON public.room_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meal_responses_updated_at BEFORE UPDATE ON public.meal_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_issues_updated_at BEFORE UPDATE ON public.maintenance_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_last_updated BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with role and property assignments';
COMMENT ON TABLE public.user_roles IS 'User role management with multiple roles support';
COMMENT ON TABLE public.pg_properties IS 'PG accommodation properties with gender and type classification';
COMMENT ON TABLE public.rooms IS 'Individual rooms within PG properties';
COMMENT ON TABLE public.room_assignments IS 'User-room assignments with rental terms';
COMMENT ON TABLE public.payments IS 'Payment records for rent, deposits, and other charges';
COMMENT ON TABLE public.meals IS 'Meal management for PG properties';
COMMENT ON TABLE public.meal_responses IS 'User meal preferences and responses';
COMMENT ON TABLE public.notifications IS 'System notifications for users and properties';
COMMENT ON TABLE public.maintenance_issues IS 'Maintenance requests and tracking';
COMMENT ON TABLE public.assets IS 'Property assets and inventory management';
COMMENT ON TABLE public.asset_history IS 'Asset change history and tracking';
