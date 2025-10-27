-- SQL Queries for Testing and Debugging Vendors

-- ============================================
-- 1. CREATE A DUMMY VENDOR
-- ============================================
INSERT INTO vendors (
  name,
  logo_url,
  description,
  image_url,
  link,
  content,
  type,
  diagram_url,
  created_at,
  updated_at
)
VALUES (
  'Dummy Test Vendor',
  'https://dummy-image.com/logo.png',
  'This is a dummy vendor created for testing purposes',
  'https://dummy-image.com/image.png',
  'https://dummy-vendor.com',
  'Dummy content for testing',
  'Test',
  'https://dummy-diagram.com/diagram.png',
  NOW(),
  NOW()
);

-- ============================================
-- 2. DELETE ALL ENTRIES WITH SPECIFIC NAME
-- ============================================
-- Delete all vendors with the name 'Dummy Test Vendor'
DELETE FROM vendors 
WHERE name = 'Dummy Test Vendor';

-- Alternative: Delete vendors by ID (more specific)
-- Replace 999 with the actual ID you want to delete
-- DELETE FROM vendors WHERE id = 999;

-- ============================================
-- 3. VIEW RECENT DUMMY ENTRIES (for verification)
-- ============================================
-- Check if the dummy vendor was created
SELECT * FROM vendors 
WHERE name = 'Dummy Test Vendor'
ORDER BY created_at DESC;

-- ============================================
-- 4. CLEANUP ALL TEST VENDORS (catch-all)
-- ============================================
-- Delete all vendors with 'Test' or 'Dummy' in the name
DELETE FROM vendors 
WHERE name LIKE '%Test%' OR name LIKE '%Dummy%';

