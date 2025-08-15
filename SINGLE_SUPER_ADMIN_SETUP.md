# 🚀 Single Super Admin Setup Guide

## 📋 Overview

This guide will help you set up exactly **one super admin user** for your Space Mate application. The system is designed to have only one super administrator to maintain security and control.

## 🔑 Super Admin Credentials

**Email:** `superadmin@spacemate.com`  
**Password:** `SuperAdmin2024!`

## 🛠️ Setup Methods

### Method 1: Using the Web Interface (Recommended)

1. **Navigate to the setup page:**
   ```
   http://localhost:5173/single-super-admin-setup
   ```

2. **Click "Setup Super Admin" button**
   - This will automatically create the super admin user
   - Remove any existing super admin users
   - Set up the proper database structure

3. **Verify the setup**
   - Check the status badge shows "✅ Single Super Admin"
   - View the credentials section
   - Copy credentials to clipboard if needed

### Method 2: Using Supabase SQL Editor

1. **Open Supabase Dashboard**
   - Go to your project's SQL Editor

2. **Run the setup script:**
   - Copy the contents of `setup_single_super_admin.sql`
   - Paste and execute in the SQL Editor

3. **Verify the results:**
   - You should see "✅ Perfect! Single super admin configured."

### Method 3: Using Browser Console

1. **Open browser console** on any page
2. **Run the setup function:**
   ```javascript
   setupSingleSuperAdmin()
   ```
3. **Check the status:**
   ```javascript
   checkSuperAdminStatus()
   ```

## 🔍 Verification Steps

### 1. Check Database Tables

Run these queries in Supabase SQL Editor:

```sql
-- Check profiles table
SELECT id, email, full_name, role, admin_sub_role 
FROM profiles 
WHERE role = 'super_admin';

-- Check user_roles table
SELECT ur.user_id, ur.role, p.email 
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.id
WHERE ur.role = 'super_admin';

-- Check auth.users table
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'super_admin';
```

### 2. Expected Results

- **profiles table:** 1 row with `role = 'super_admin'`
- **user_roles table:** 1 row with `role = 'super_admin'`
- **auth.users table:** 1 row with `role = 'super_admin'`
- **Total count:** Exactly 1 super admin

## 🚪 Login Instructions

### 1. Access the Login Page
```
http://localhost:5173/login
```

### 2. Enter Credentials
- **Email:** `superadmin@spacemate.com`
- **Password:** `SuperAdmin2024!`

### 3. Expected Behavior
- ✅ Successful authentication
- ✅ Redirect to `/super-admin` dashboard
- ✅ Access to all super admin features

## 🔧 Troubleshooting

### Issue 1: "User not found" error
**Solution:**
1. Go to `/single-super-admin-setup`
2. Click "Setup Super Admin"
3. Try logging in again

### Issue 2: Multiple super admins exist
**Solution:**
1. Run the cleanup script in Supabase SQL Editor
2. Re-run the setup process
3. Verify only one super admin exists

### Issue 3: Login succeeds but no redirect
**Solution:**
1. Check browser console for errors
2. Verify the user profile has correct role
3. Check if navigation hook is working

### Issue 4: Database constraint errors
**Solution:**
1. Check if the unique constraint exists
2. Remove any conflicting data
3. Re-run the setup process

## 📁 Files Created

- `supabase/migrations/20250810000000_create_single_super_admin.sql` - Database migration
- `src/utils/setupSingleSuperAdmin.ts` - Utility functions
- `src/pages/SingleSuperAdminSetup.tsx` - Setup page
- `setup_single_super_admin.sql` - Direct SQL script
- `SINGLE_SUPER_ADMIN_SETUP.md` - This guide

## 🔒 Security Features

- **Single Super Admin Constraint:** Database-level constraint ensures only one super admin
- **Strong Password:** Complex password with special characters
- **Role-based Access:** Proper role assignment in multiple tables
- **Audit Trail:** Creation timestamps for tracking

## 🧪 Testing

### Test 1: Setup Verification
```javascript
// Check current status
checkSuperAdminStatus()
```

### Test 2: Login Test
1. Use credentials to log in
2. Verify redirect to super admin dashboard
3. Check all features are accessible

### Test 3: Uniqueness Test
```javascript
// Try to create another super admin (should fail)
setupSingleSuperAdmin()
```

## 📞 Support

If you encounter issues:

1. **Check the setup page** at `/single-super-admin-setup`
2. **Verify database connectivity** - ensure Supabase is accessible
3. **Check browser console** for any error messages
4. **Run verification queries** in Supabase SQL Editor

## ✅ Success Criteria

- [ ] Only one super admin user exists
- [ ] Super admin can log in successfully
- [ ] Login redirects to `/super-admin` dashboard
- [ ] All super admin features are accessible
- [ ] Database constraints are properly enforced
- [ ] No duplicate super admin users exist

## 🎯 Next Steps

After setting up the super admin:

1. **Test the login flow** with the provided credentials
2. **Access the super admin dashboard** at `/super-admin`
3. **Configure system settings** as needed
4. **Create additional users** (PG Admins, Wardens, Guests)
5. **Set up PG properties** and other system components

---

**Remember:** Keep the super admin credentials secure and don't share them publicly. This account has full access to the entire system.
