# Gender-Based PG Selection Feature

## Overview
This feature implements gender-based filtering for PG (Paying Guest) properties, allowing users to select PGs based on their gender and accommodation preferences.

## Features

### 1. Gender Field in User Profiles
- Added `gender` field to the `profiles` table
- Supports: `male`, `female`, `other`
- Collected during user signup

### 2. PG Property Gender Classification
- Added `gender` field to `pg_properties` table
- Supports: `male`, `female`, `unisex`
- Added `pg_type` field to `pg_properties` table
- Supports: `co-living`, `men-only`, `women-only`

### 3. Smart PG Filtering
- **Co-living preference**: Shows all unisex PGs
- **Men-only preference**: Shows male-specific PGs + co-living PGs
- **Women-only preference**: Shows female-specific PGs + co-living PGs

## Database Changes

### New Migration: `20250103000000_add_gender_and_pg_type.sql`
- Adds gender fields to profiles and pg_properties tables
- Creates indexes for better performance
- Updates existing PGs with sample gender data
- Adds sample gender-specific PGs
- Creates helper function `get_gender_appropriate_pgs()`

### Updated Tables
```sql
-- Profiles table
ALTER TABLE public.profiles ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other'));

-- PG Properties table
ALTER TABLE public.pg_properties 
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
ADD COLUMN pg_type TEXT CHECK (pg_type IN ('co-living', 'men-only', 'women-only'));
```

## Frontend Changes

### 1. Updated Guest Signup Form
- Added gender selection step
- Added PG preference selection step
- Enhanced form validation
- Updated step flow from 5 to 6 steps

### 2. New Hook: `useGenderBasedPGs`
- Fetches PGs based on user gender and preference
- Handles loading states and errors
- Provides refetch functionality

### 3. Enhanced Types
- Updated Supabase types to include gender fields
- Updated application types for User and PGProperty interfaces

## User Experience Flow

### Signup Process
1. **Personal Information** - Name, email, password, gender
2. **PG Preference** - Choose co-living, men-only, or women-only
3. **PG Selection** - View filtered PGs based on preferences
4. **Room Selection** - Choose from available rooms
5. **Guest Details** - Join dates, emergency contact, ID proof
6. **Terms & Submit** - Accept terms and complete registration

### PG Filtering Logic
- **Co-living users**: Can see all unisex PGs
- **Men**: Can see men-only PGs + co-living PGs
- **Women**: Can see women-only PGs + co-living PGs

## Sample Data

### New Gender-Specific PGs
- **Ladies First PG**: Women-only accommodation in Mumbai
- **Gentlemen PG**: Men-only accommodation in Delhi

### Updated Existing PGs
- All existing PGs set to `unisex` gender and `co-living` type

## Testing

### Demo Page
- Created `GenderPGDemo.tsx` for testing the feature
- Allows testing different gender/preference combinations
- Shows real-time filtering results

### Test Scenarios
1. Male user with co-living preference
2. Female user with women-only preference
3. Male user with men-only preference
4. Female user with co-living preference

## Security & Validation

### Database Constraints
- Check constraints ensure valid gender values
- Check constraints ensure valid PG type values

### Frontend Validation
- Required field validation for gender and preference
- Step-by-step validation flow
- Error handling for API failures

## Performance

### Database Indexes
```sql
CREATE INDEX idx_pg_properties_gender_type ON public.pg_properties(gender, pg_type);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
```

### Query Optimization
- Efficient filtering using database indexes
- Minimal data transfer with targeted queries
- Caching through React hooks

## Future Enhancements

### Potential Improvements
1. **Advanced Filtering**: Add more criteria (budget, location, amenities)
2. **Preference Learning**: Remember user preferences for future searches
3. **Recommendation Engine**: Suggest PGs based on user profile
4. **Admin Tools**: Easy gender/type management for PG admins

### Additional Features
1. **Gender Verification**: Optional ID verification for gender-specific PGs
2. **Roommate Matching**: Find compatible roommates within gender constraints
3. **Safety Features**: Enhanced security for women-only PGs

## Deployment Notes

### Migration Order
1. Run the new migration: `20250103000000_add_gender_and_pg_type.sql`
2. Update existing PGs with appropriate gender/type values
3. Test the feature with sample users

### Rollback Plan
- Migration can be reversed by dropping the new columns
- Frontend changes are backward compatible
- Existing users without gender will see all PGs

## Support & Maintenance

### Monitoring
- Track gender distribution in user registrations
- Monitor PG type preferences
- Analyze user satisfaction with filtered results

### Troubleshooting
- Check database constraints for invalid data
- Verify index performance for large datasets
- Monitor API response times for filtered queries

---

**Note**: This feature enhances user experience by providing appropriate accommodation options while maintaining security and privacy for gender-specific accommodations.

