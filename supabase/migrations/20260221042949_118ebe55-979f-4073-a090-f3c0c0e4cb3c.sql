
-- Fix overly permissive INSERT policies
DROP POLICY "System inserts profiles" ON public.profiles;
CREATE POLICY "Profile auto-creation" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY "System inserts roles" ON public.user_roles;
CREATE POLICY "Role auto-creation" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND role = 'member');
