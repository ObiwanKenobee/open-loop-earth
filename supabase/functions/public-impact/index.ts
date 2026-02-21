import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const endpoint = url.pathname.split("/").pop();

    let data: any;

    switch (endpoint) {
      case "cells": {
        const { data: cells, error } = await supabase
          .from("cells")
          .select("id, cell_code, name, location, status, created_at, regions(name)")
          .eq("status", "active");
        if (error) throw error;
        data = { cells, count: cells?.length ?? 0 };
        break;
      }

      case "impact": {
        const { data: metrics, error } = await supabase
          .from("metrics")
          .select("waste_kg, food_kg, revenue, co2_offset_kg, income_delta");
        if (error) throw error;
        const totals = (metrics || []).reduce(
          (acc, m) => ({
            total_waste_kg: acc.total_waste_kg + Number(m.waste_kg),
            total_food_kg: acc.total_food_kg + Number(m.food_kg),
            total_revenue: acc.total_revenue + Number(m.revenue),
            total_co2_offset_kg: acc.total_co2_offset_kg + Number(m.co2_offset_kg),
            avg_income_delta: acc.avg_income_delta + Number(m.income_delta),
          }),
          { total_waste_kg: 0, total_food_kg: 0, total_revenue: 0, total_co2_offset_kg: 0, avg_income_delta: 0 }
        );
        if (metrics && metrics.length > 0) {
          totals.avg_income_delta = totals.avg_income_delta / metrics.length;
        }
        data = { ...totals, data_points: metrics?.length ?? 0 };
        break;
      }

      case "waste": {
        const { data: metrics, error } = await supabase
          .from("metrics")
          .select("cell_id, month, year, waste_kg, cells(name)")
          .order("year", { ascending: false })
          .order("month", { ascending: false })
          .limit(100);
        if (error) throw error;
        data = { records: metrics, count: metrics?.length ?? 0 };
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            protocol: "GRACE",
            version: "0.1",
            endpoints: ["/public-impact/cells", "/public-impact/impact", "/public-impact/waste"],
            docs: "https://grace-protocol.org/api",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
