import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        console.log("[useAdmin] No user, skipping admin check");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log("[useAdmin] Checking admin for user:", user.id);
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        console.log("[useAdmin] Query result:", { data, error });
        if (!error && data?.role === "admin") {
          setIsAdmin(true);
          console.log("[useAdmin] User IS admin");
        } else {
          setIsAdmin(false);
          console.log("[useAdmin] User is NOT admin");
        }
      } catch (e) {
        console.error("[useAdmin] Error:", e);
        setIsAdmin(false);
      }
      setLoading(false);
    }

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}
