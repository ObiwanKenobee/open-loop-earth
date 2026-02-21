
-- ============================================
-- GRACE Protocol — Full Database Schema
-- ============================================

-- 1. Role Enum
CREATE TYPE public.app_role AS ENUM ('member', 'coordinator', 'steward', 'admin');

-- 2. Regions
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. User Roles (separate table per security requirement)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'member',
  UNIQUE(user_id, role)
);

-- 5. Cells
CREATE TABLE public.cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  region_id UUID REFERENCES public.regions(id),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'growing', 'active', 'dormant')),
  replication_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 6. Cell Memberships
CREATE TABLE public.cell_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cell_id UUID NOT NULL REFERENCES public.cells(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cell_id)
);

-- 7. Metrics
CREATE TABLE public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID NOT NULL REFERENCES public.cells(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  waste_kg NUMERIC NOT NULL DEFAULT 0,
  food_kg NUMERIC NOT NULL DEFAULT 0,
  revenue NUMERIC NOT NULL DEFAULT 0,
  income_delta NUMERIC NOT NULL DEFAULT 0,
  co2_offset_kg NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(cell_id, month, year)
);

-- 8. Governance Proposals
CREATE TABLE public.governance_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES public.cells(id) ON DELETE CASCADE,
  proposal_number SERIAL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected')),
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 9. Governance Votes
CREATE TABLE public.governance_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- 10. Emergency Funds
CREATE TABLE public.emergency_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID NOT NULL UNIQUE REFERENCES public.cells(id) ON DELETE CASCADE,
  balance NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Emergency Fund Transactions
CREATE TABLE public.emergency_fund_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id UUID NOT NULL REFERENCES public.emergency_funds(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 12. Knowledge Articles
CREATE TABLE public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 13. Loop Tracking (Regenerative Loop stages)
CREATE TABLE public.loop_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID NOT NULL REFERENCES public.cells(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('waste', 'compost', 'crop', 'sale', 'reinvest')),
  quantity_kg NUMERIC,
  revenue NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.has_cell_membership(_cell_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cell_memberships
    WHERE user_id = auth.uid() AND cell_id = _cell_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_cell_coordinator(_cell_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cell_memberships
    WHERE user_id = auth.uid() AND cell_id = _cell_id AND role IN ('coordinator', 'admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_steward_of_region(_region_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cell_memberships cm
    JOIN public.cells c ON c.id = cm.cell_id
    WHERE cm.user_id = auth.uid() AND cm.role = 'steward' AND c.region_id = _region_id
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON public.knowledge_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_emergency_funds_updated_at BEFORE UPDATE ON public.emergency_funds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cell_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_fund_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Regions: public read
CREATE POLICY "Regions are publicly readable" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Only admins manage regions" ON public.regions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "System inserts profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- User Roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "System inserts roles" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins manage roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Only admins delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());

-- Cells: members, coordinators, stewards, admins can read
CREATE POLICY "Cell members can view cells" ON public.cells FOR SELECT TO authenticated USING (
  public.is_admin() OR public.has_cell_membership(id) OR public.is_steward_of_region(region_id)
);
CREATE POLICY "Admins can create cells" ON public.cells FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Coordinators can update cells" ON public.cells FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(id)
);
CREATE POLICY "Admins can delete cells" ON public.cells FOR DELETE TO authenticated USING (public.is_admin());

-- Cell Memberships
CREATE POLICY "Members can view cell memberships" ON public.cell_memberships FOR SELECT TO authenticated USING (
  public.is_admin() OR user_id = auth.uid() OR public.has_cell_membership(cell_id)
);
CREATE POLICY "Coordinators can add members" ON public.cell_memberships FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators can update memberships" ON public.cell_memberships FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators can remove members" ON public.cell_memberships FOR DELETE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);

-- Metrics
CREATE POLICY "Cell members can view metrics" ON public.metrics FOR SELECT TO authenticated USING (
  public.is_admin() OR public.has_cell_membership(cell_id)
);
CREATE POLICY "Coordinators can insert metrics" ON public.metrics FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators can update metrics" ON public.metrics FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);

-- Governance Proposals
CREATE POLICY "Cell members can view proposals" ON public.governance_proposals FOR SELECT TO authenticated USING (
  public.is_admin() OR public.has_cell_membership(cell_id)
);
CREATE POLICY "Coordinators can create proposals" ON public.governance_proposals FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators can update proposals" ON public.governance_proposals FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);

-- Governance Votes
CREATE POLICY "Cell members can view votes" ON public.governance_votes FOR SELECT TO authenticated USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.governance_proposals gp
    WHERE gp.id = proposal_id AND public.has_cell_membership(gp.cell_id)
  )
);
CREATE POLICY "Cell members can vote" ON public.governance_votes FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.governance_proposals gp
    WHERE gp.id = proposal_id AND public.has_cell_membership(gp.cell_id)
  )
);

-- Emergency Funds
CREATE POLICY "Cell members can view funds" ON public.emergency_funds FOR SELECT TO authenticated USING (
  public.is_admin() OR public.has_cell_membership(cell_id)
);
CREATE POLICY "Coordinators manage funds" ON public.emergency_funds FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators update funds" ON public.emergency_funds FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);

-- Emergency Fund Transactions
CREATE POLICY "Cell members can view transactions" ON public.emergency_fund_transactions FOR SELECT TO authenticated USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.emergency_funds ef
    WHERE ef.id = fund_id AND public.has_cell_membership(ef.cell_id)
  )
);
CREATE POLICY "Coordinators can create transactions" ON public.emergency_fund_transactions FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.emergency_funds ef
    WHERE ef.id = fund_id AND public.is_cell_coordinator(ef.cell_id)
  )
);

-- Knowledge Articles: public read for published, admin write
CREATE POLICY "Published articles are public" ON public.knowledge_articles FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all articles" ON public.knowledge_articles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins manage articles" ON public.knowledge_articles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update articles" ON public.knowledge_articles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins delete articles" ON public.knowledge_articles FOR DELETE TO authenticated USING (public.is_admin());

-- Loop Entries
CREATE POLICY "Cell members can view loops" ON public.loop_entries FOR SELECT TO authenticated USING (
  public.is_admin() OR public.has_cell_membership(cell_id)
);
CREATE POLICY "Coordinators can create loop entries" ON public.loop_entries FOR INSERT TO authenticated WITH CHECK (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);
CREATE POLICY "Coordinators can update loop entries" ON public.loop_entries FOR UPDATE TO authenticated USING (
  public.is_admin() OR public.is_cell_coordinator(cell_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_cell_memberships_user ON public.cell_memberships(user_id);
CREATE INDEX idx_cell_memberships_cell ON public.cell_memberships(cell_id);
CREATE INDEX idx_metrics_cell ON public.metrics(cell_id);
CREATE INDEX idx_metrics_period ON public.metrics(year, month);
CREATE INDEX idx_governance_proposals_cell ON public.governance_proposals(cell_id);
CREATE INDEX idx_governance_votes_proposal ON public.governance_votes(proposal_id);
CREATE INDEX idx_loop_entries_cell ON public.loop_entries(cell_id);
CREATE INDEX idx_cells_region ON public.cells(region_id);
CREATE INDEX idx_cells_status ON public.cells(status);
