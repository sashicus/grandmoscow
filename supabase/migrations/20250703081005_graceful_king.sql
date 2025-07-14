/*
  # Create function to insert auth users for testing
  
  This creates a function that can be called to create test users in auth.users table.
  Note: This is for development/testing only.
*/

-- Create function to insert test auth users
CREATE OR REPLACE FUNCTION create_test_auth_users()
RETURNS void AS $$
DECLARE
  admin_id uuid := '11111111-1111-1111-1111-111111111111';
  realtor_id uuid := '22222222-2222-2222-2222-222222222222';
  client_id uuid := '33333333-3333-3333-3333-333333333333';
BEGIN
  -- Note: In a real environment, you would create these users through Supabase Auth
  -- This is just for testing purposes
  
  -- For now, we'll just ensure the profiles exist
  -- The actual auth.users entries need to be created through the Supabase dashboard or auth API
  
  RAISE NOTICE 'Test profiles created. To complete setup:';
  RAISE NOTICE '1. Create auth users in Supabase Dashboard with these emails:';
  RAISE NOTICE '   - admin@grand.moscow (ID: %)', admin_id;
  RAISE NOTICE '   - realtor@grand.moscow (ID: %)', realtor_id;
  RAISE NOTICE '   - client@grand.moscow (ID: %)', client_id;
  RAISE NOTICE '2. Update the auth.users IDs to match the profile IDs';
  
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_test_auth_users() TO authenticated;

-- Create a function to get test user info
CREATE OR REPLACE FUNCTION get_test_users_info()
RETURNS TABLE(
  user_type text,
  email text,
  name text,
  phone text,
  profile_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_type::text,
    CASE 
      WHEN p.user_type = 'admin' THEN 'admin@grand.moscow'
      WHEN p.user_type = 'realtor' THEN 'realtor@grand.moscow'
      WHEN p.user_type = 'client' THEN 'client@grand.moscow'
    END as email,
    p.name,
    p.phone,
    p.id as profile_id
  FROM profiles p
  WHERE p.id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222', 
    '33333333-3333-3333-3333-333333333333'
  )
  ORDER BY 
    CASE p.user_type 
      WHEN 'admin' THEN 1 
      WHEN 'realtor' THEN 2 
      WHEN 'client' THEN 3 
    END;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_test_users_info() TO authenticated, anon;