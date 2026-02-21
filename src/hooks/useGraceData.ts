import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCells = () =>
  useQuery({
    queryKey: ["cells"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cells")
        .select("*, regions(name), cell_memberships(count), emergency_funds(balance)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useMetrics = () =>
  useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics")
        .select("*, cells(name, cell_code)")
        .order("year", { ascending: false })
        .order("month", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useGovernanceProposals = () =>
  useQuery({
    queryKey: ["governance_proposals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("governance_proposals")
        .select("*, governance_votes(vote)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data?.map((p) => {
        const votes = p.governance_votes || [];
        const yes = votes.filter((v) => v.vote).length;
        const no = votes.filter((v) => !v.vote).length;
        const total = yes + no;
        return {
          ...p,
          votes_yes: total > 0 ? Math.round((yes / total) * 100) : 0,
          votes_no: total > 0 ? Math.round((no / total) * 100) : 0,
          total_votes: total,
        };
      });
    },
  });

export const useKnowledgeArticles = () =>
  useQuery({
    queryKey: ["knowledge_articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useLoopEntries = () =>
  useQuery({
    queryKey: ["loop_entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loop_entries")
        .select("*, cells(name, cell_code)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useRegions = () =>
  useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("*, cells(count)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

export const useMyProfile = () =>
  useQuery({
    queryKey: ["my_profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

export const useMyCellMemberships = () =>
  useQuery({
    queryKey: ["my_memberships"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("cell_memberships")
        .select("*, cells(name, cell_code, location, status)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });
