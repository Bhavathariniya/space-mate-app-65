# Sample Data Insertion Summary

## Overview
This document provides a comprehensive summary of the sample data insertion for the SpaceMate PG Management System database.

## 📊 **Data Reset & Insertion Complete**

### **Migration Files Created:**
1. **`20250816000000_reset_and_insert_sample_data.sql`** - Main data insertion (profiles, user_roles, pg_properties)
2. **`20250816000001_insert_remaining_data.sql`** - Remaining data insertion (rooms, assignments, payments, etc.)

### **Total Records Inserted:**
- ✅ **10 Profiles** - Complete user data with different roles
- ✅ **10 User Roles** - Role assignments for all users
- ✅ **10 PG Properties** - Diverse properties across Bangalore
- ✅ **10 Rooms** - Sample rooms from different properties
- ✅ **5 Room Assignments** - Active tenant assignments
- ✅ **5 Payments** - Various payment types and statuses
- ✅ **5 Meals** - Different meal types and menus
- ✅ **5 Meal Responses** - User meal preferences
- ✅ **5 Notifications** - Various notification types
- ✅ **5 Maintenance Issues** - Different issue types and statuses
- ✅ **5 Assets** - Property assets and equipment
- ✅ **5 Asset History** - Asset tracking records

---

## **👥 Sample Users Created**

### **User Roles Distribution:**
- **1 Super Admin**: `superadmin@spacemate.com`
- **2 PG Admins**: `pgadmin1@spacemate.com`, `pgadmin2@spacemate.com`
- **2 Wardens**: `warden1@spacemate.com`, `warden2@spacemate.com`
- **5 Guests**: `guest1@spacemate.com` to `guest5@spacemate.com`

### **User Details:**
- **Realistic Names**: Indian names with proper diversity
- **Phone Numbers**: Valid Indian mobile numbers
- **Avatar URLs**: Placeholder image URLs
- **Gender Distribution**: Balanced male/female representation

---

## **🏠 Sample PG Properties**

### **Property Types:**
1. **Sunshine PG for Girls** - Women-only premium accommodation
2. **Royal Boys PG** - Men-only comfortable accommodation
3. **Cozy Co-living Space** - Unisex modern co-living
4. **Green Valley PG** - Eco-friendly unisex accommodation
5. **Tech Hub PG** - Men-only tech-focused accommodation
6. **Ladies Paradise PG** - Women-only premium facilities
7. **Student Friendly PG** - Budget-friendly unisex accommodation
8. **Executive PG** - Luxury unisex accommodation
9. **Family Style PG** - Home-like unisex environment
10. **Budget PG Plus** - Affordable unisex accommodation

### **Property Features:**
- **Locations**: Various areas in Bangalore (Indiranagar, Koramangala, Whitefield, etc.)
- **Amenities**: WiFi, AC, Food, Laundry, Gym, Gaming Room, etc.
- **Pricing**: ₹7,000 to ₹18,000 monthly rent
- **Ratings**: 3.9 to 4.9 stars
- **Occupancy**: Realistic occupancy rates

---

## **🏠 Sample Rooms**

### **Room Types:**
- **Single Rooms**: 1 person capacity
- **Double Rooms**: 2 people capacity
- **Triple Rooms**: 3 people capacity
- **Quad Rooms**: 4 people capacity

### **Room Features:**
- **Amenities**: AC, WiFi, Attached/Shared Bathrooms
- **Pricing**: ₹8,000 to ₹12,000 per person
- **Availability**: Mix of occupied and available rooms
- **Floor Numbers**: 1st and 2nd floors

---

## **💰 Sample Financial Data**

### **Payment Types:**
- **Monthly Rent**: Regular rent payments
- **Security Deposits**: One-time deposits
- **Payment Methods**: UPI, Card, Cash
- **Status**: Completed, Pending, Failed

### **Payment Details:**
- **Amounts**: ₹8,000 to ₹18,000
- **Due Dates**: Realistic payment schedules
- **Transaction IDs**: Sample transaction references

---

## **🍽️ Sample Meal Data**

### **Meal Types:**
- **Breakfast**: Idli, Bread, etc.
- **Lunch**: Rice, Dal, Vegetables
- **Dinner**: Roti, Dal, Vegetables

### **Menu Variety:**
- **Traditional**: Idli, Sambar, Chutney
- **Western**: Bread, Butter, Jam
- **Organic**: Organic Rice, Fresh Vegetables

---

## **🔧 Sample Maintenance Data**

### **Issue Types:**
- **Electrical**: AC, Light bulb issues
- **Plumbing**: Water leaks
- **Facility**: WiFi, Furniture issues

### **Priority Levels:**
- **Urgent**: Water leaks
- **High**: AC issues
- **Medium**: WiFi problems
- **Low**: Light bulb replacement

---

## **📦 Sample Asset Data**

### **Asset Types:**
- **Electrical**: AC Units
- **Furniture**: Beds, Study Tables
- **Electronics**: Gaming Setup
- **Fitness**: Yoga Mats

### **Asset Management:**
- **Conditions**: Excellent, Good, Fair
- **Status**: Active, Inactive, Maintenance
- **History**: Addition, Removal, Maintenance records

---

## **📱 Sample Notification Data**

### **Notification Types:**
- **General**: Welcome messages
- **Payment**: Payment reminders
- **Maintenance**: Issue updates
- **Meal**: Meal announcements
- **Security**: Security alerts

---

## **🎯 How to Apply the Data**

### **Step 1: Apply Schema Migrations**
First, ensure all schema migrations are applied:
```bash
# Apply in chronological order
supabase db reset
# or apply individual migrations
supabase migration up
```

### **Step 2: Apply Data Migrations**
Apply the sample data migrations:
```bash
# Apply the data reset and insertion
supabase migration up
```

### **Step 3: Verify Data**
Check that all data is properly inserted:
```sql
-- Check record counts
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'pg_properties', COUNT(*) FROM public.pg_properties
UNION ALL
SELECT 'rooms', COUNT(*) FROM public.rooms
UNION ALL
SELECT 'room_assignments', COUNT(*) FROM public.room_assignments
UNION ALL
SELECT 'payments', COUNT(*) FROM public.payments
UNION ALL
SELECT 'meals', COUNT(*) FROM public.meals
UNION ALL
SELECT 'maintenance_issues', COUNT(*) FROM public.maintenance_issues
UNION ALL
SELECT 'assets', COUNT(*) FROM public.assets;
```

---

## **🔍 Data Relationships**

### **User-Property Relationships:**
- **Super Admin**: Can access all properties
- **PG Admins**: Manage their own properties
- **Wardens**: Manage assigned properties
- **Guests**: Assigned to specific properties

### **Property-Room Relationships:**
- Each property has multiple rooms
- Rooms have different types and capacities
- Occupancy is tracked accurately

### **Payment Relationships:**
- Payments linked to users and properties
- Different payment types and statuses
- Realistic payment schedules

---

## **✅ Data Quality Features**

### **Realistic Data:**
- **Indian Context**: Bangalore locations, Indian names, INR currency
- **Realistic Pricing**: Market-appropriate rent and deposit amounts
- **Proper Relationships**: All foreign keys properly linked
- **Diverse Scenarios**: Different user roles, property types, issue types

### **Data Integrity:**
- **Constraints**: All check constraints satisfied
- **Relationships**: Proper foreign key relationships
- **Consistency**: Occupancy counts match assignments
- **Timestamps**: Proper creation and update timestamps

---

## **🚀 Ready for Testing**

The sample data provides a comprehensive foundation for:
- **User Authentication**: Test all user roles
- **Property Management**: Test property operations
- **Room Management**: Test room assignments and availability
- **Payment Processing**: Test payment workflows
- **Maintenance Tracking**: Test issue reporting and resolution
- **Asset Management**: Test asset tracking
- **Notification System**: Test various notification types

---

## **📋 Next Steps**

1. **Apply Migrations**: Run the data insertion migrations
2. **Test Functionality**: Verify all features work with sample data
3. **User Testing**: Test with different user roles
4. **Performance Testing**: Verify database performance with sample data
5. **Customization**: Modify data as needed for specific testing scenarios

The sample data is now ready for comprehensive testing and development of the SpaceMate PG Management System!
