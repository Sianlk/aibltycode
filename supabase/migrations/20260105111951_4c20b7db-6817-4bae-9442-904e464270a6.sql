-- Fix function search path for is_admin_email
CREATE OR REPLACE FUNCTION public.is_admin_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email = 'hosturserver@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;