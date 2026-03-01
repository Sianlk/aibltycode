
-- Create admin emails config table
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage admin emails
CREATE POLICY "Admins can view admin emails"
  ON public.admin_emails FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage admin emails"
  ON public.admin_emails FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed existing admin email
INSERT INTO public.admin_emails (email) VALUES ('hosturserver@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Update handle_admin_role to use config table
CREATE OR REPLACE FUNCTION public.handle_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = NEW.email) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Update is_admin_email to use config table
CREATE OR REPLACE FUNCTION public.is_admin_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_emails WHERE admin_emails.email = is_admin_email.email);
END;
$$;
