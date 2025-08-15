# Super Admin Login Implementation Guide

## 🚀 Overview
This guide explains how to implement and test super admin login functionality in the Space Mate application.

## ✅ Current Implementation Status

### 1. Authentication System
- ✅ Supabase authentication is properly configured
- ✅ Login form uses `useSupabaseAuth().signIn()`
- ✅ Navigation is handled by `useAuthNavigation` hook
- ✅ Role-based routing is implemented

### 2. Super Admin Setup
- ✅ Super admin setup component created (`/super-admin-setup`)
- ✅ Test user creation utilities available
- ✅ Database schema supports super admin roles

## 🔧 How to Implement Super Admin Login

### Step 1: Create Super Admin User

1. **Navigate to the setup page:**
   ```
   http://localhost:5173/super-admin-setup
   ```

2. **Click "Create Super Admin" button**
   - This creates a super admin user in Supabase Auth
   - Creates corresponding profile in the database
   - Default credentials: `admin@spacemate.com` / `admin123456`

3. **Click "Create Test Users" button**
   - Creates additional test users for all roles
   - Includes PG Admin, Warden, and Guest users

### Step 2: Test Super Admin Login

1. **Go to the login page:**
   ```
   http://localhost:5173/login
   ```

2. **Use super admin credentials:**
   - Email: `admin@spacemate.com`
   - Password: `admin123456`

3. **Verify successful login:**
   - Should redirect to `/super-admin` dashboard
   - User should be authenticated with super admin role

## 📋 Test Credentials

### Super Admin
- **Email:** `admin@spacemate.com`
- **Password:** `admin123456`

### PG Admin
- **Email:** `pgadmin@test.com`
- **Password:** `password123`

### Warden
- **Email:** `warden@test.com`
- **Password:** `password123`

### Guest
- **Email:** `guest@test.com`
- **Password:** `password123`

## 🔍 Troubleshooting

### Issue 1: "User not found" error
**Solution:**
1. Go to `/super-admin-setup`
2. Click "Create Super Admin" button
3. Try logging in again

### Issue 2: "Invalid credentials" error
**Solution:**
1. Check if the user exists in Supabase Auth
2. Verify the password is correct
3. Try creating a new super admin user

### Issue 3: Login succeeds but no redirect
**Solution:**
1. Check browser console for errors
2. Verify the user profile has correct role
3. Check if the navigation hook is working

### Issue 4: Role not recognized
**Solution:**
1. Check the profiles table in Supabase
2. Verify the `role` field is set to `super_admin`
3. Check the `admin_sub_role` field is set to `super_admin`

## 🛠️ Manual Database Setup

If the automatic setup doesn't work, you can manually create a super admin user:

### 1. Create Supabase Auth User
```sql
-- This is handled by the createSuperAdmin utility
-- The utility creates the auth user and profile automatically
```

### 2. Create Profile Record
```sql
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  admin_sub_role,
  phone,
  avatar_url
) VALUES (
  'your-user-id-from-auth',
  'admin@spacemate.com',
  'Super Admin',
  'super_admin',
  'super_admin',
  '+91-9876543210',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
);
```

## 🔧 Code Structure

### Authentication Flow
```
Login Form → useSupabaseAuth().signIn() → Supabase Auth → Profile Fetch → useAuthNavigation → Role-based Redirect
```

### Key Components
- **Login Form:** `src/pages/Login.tsx`
- **Auth Context:** `src/contexts/SupabaseAuthContext.tsx`
- **Navigation Hook:** `src/hooks/useAuthNavigation.ts`
- **Setup Utility:** `src/utils/createSuperAdmin.ts`
- **Setup Component:** `src/components/SuperAdminSetup.tsx`

### Role Mapping
```typescript
// Supabase role → Navigation route
'super_admin' → '/super-admin'
'pg_admin' → '/pg-admin'
'warden' → '/warden'
'guest' → '/guest'
```

## 🧪 Testing Steps

### 1. Setup Testing
1. Visit `/super-admin-setup`
2. Create super admin user
3. Verify user appears in "Existing Admin Users" list

### 2. Login Testing
1. Visit `/login`
2. Enter super admin credentials
3. Verify successful login and redirect

### 3. Role Testing
1. Test with different user roles
2. Verify correct navigation for each role
3. Check that role-specific features are available

### 4. Error Testing
1. Test with invalid credentials
2. Test with non-existent users
3. Verify proper error messages

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Create super admin user:**
   - Visit `http://localhost:5173/super-admin-setup`
   - Click "Create Super Admin"

3. **Test login:**
   - Visit `http://localhost:5173/login`
   - Use credentials: `admin@spacemate.com` / `admin123456`

4. **Verify access:**
   - Should redirect to super admin dashboard
   - Check that super admin features are available

## 📝 Notes

- The super admin setup is only needed once
- Test users can be recreated if needed
- All authentication is handled by Supabase
- Role-based access control is implemented
- Real-time updates work for all user types

## 🔒 Security Considerations

- Passwords are hashed by Supabase Auth
- Row Level Security (RLS) should be configured
- Email verification can be enabled
- Two-factor authentication can be added
- Session management is handled by Supabase

## ✅ Success Criteria

- [ ] Super admin user can be created
- [ ] Super admin can log in successfully
- [ ] Login redirects to correct dashboard
- [ ] Role-based features are accessible
- [ ] Error handling works properly
- [ ] Real-time features function correctly 