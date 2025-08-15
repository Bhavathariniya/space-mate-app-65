-- Test script for gender-based PG migration
-- Run this after applying the migration to verify everything works

-- 1. Check if new columns exist
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('gender')
ORDER BY column_name;

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'pg_properties' 
  AND column_name IN ('gender', 'pg_type')
ORDER BY column_name;

-- 2. Check if indexes exist
SELECT 
  indexname, 
  tablename, 
  indexdef
FROM pg_indexes 
WHERE tablename IN ('profiles', 'pg_properties')
  AND indexname LIKE '%gender%';

-- 3. Check sample data
SELECT 
  id, 
  name, 
  gender, 
  pg_type, 
  city, 
  is_active
FROM pg_properties 
ORDER BY created_at;

-- 4. Test the gender-appropriate PGs function
SELECT * FROM get_gender_appropriate_pgs('male');
SELECT * FROM get_gender_appropriate_pgs('female');

-- 5. Test specific gender combinations
-- Men with co-living preference
SELECT 
  id, 
  name, 
  gender, 
  pg_type, 
  city
FROM pg_properties 
WHERE is_active = true 
  AND gender = 'unisex'
ORDER BY rating DESC;

-- Men with men-only preference
SELECT 
  id, 
  name, 
  gender, 
  pg_type, 
  city
FROM pg_properties 
WHERE is_active = true 
  AND gender IN ('male', 'unisex')
ORDER BY rating DESC;

-- Women with women-only preference
SELECT 
  id, 
  name, 
  gender, 
  pg_type, 
  city
FROM pg_properties 
WHERE is_active = true 
  AND gender IN ('female', 'unisex')
ORDER BY rating DESC;

-- 6. Check constraint violations (should return empty)
SELECT 
  id, 
  name, 
  gender, 
  pg_type
FROM pg_properties 
WHERE gender NOT IN ('male', 'female', 'unisex')
   OR pg_type NOT IN ('co-living', 'men-only', 'women-only')
   OR gender IS NULL
   OR pg_type IS NULL;

-- 7. Count PGs by type
SELECT 
  pg_type,
  gender,
  COUNT(*) as count
FROM pg_properties 
WHERE is_active = true
GROUP BY pg_type, gender
ORDER BY pg_type, gender;

-- 8. Check room availability for new PGs
SELECT 
  p.name as pg_name,
  p.gender,
  p.pg_type,
  COUNT(r.id) as total_rooms,
  COUNT(CASE WHEN r.is_available THEN 1 END) as available_rooms
FROM pg_properties p
LEFT JOIN rooms r ON p.id = r.pg_property_id
WHERE p.gender IN ('male', 'female')
GROUP BY p.id, p.name, p.gender, p.pg_type
ORDER BY p.gender, p.pg_type;

