
-- This SQL function should be run in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids uuid[])
RETURNS TABLE(user_id uuid, email text)
LANGUAGE plpgsql  -- Changed from sql to plpgsql for better error handling
SECURITY DEFINER  -- This ensures it runs with the permissions of the creator
SET search_path = public
AS $$
BEGIN
  -- Handle empty array case safely
  IF user_ids IS NULL OR array_length(user_ids, 1) IS NULL THEN
    RETURN QUERY SELECT NULL::uuid as user_id, NULL::text as email WHERE false;
    RETURN;
  END IF;

  -- Return the email for each user ID
  RETURN QUERY
    SELECT id as user_id, email
    FROM auth.users
    WHERE id = ANY(user_ids);
END;
$$;
