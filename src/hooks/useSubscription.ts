import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionState {
  subscribed: boolean;
  inTrial: boolean;
  subscriptionEnd: string | null;
  trialEnd: string | null;
  loading: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    inTrial: false,
    subscriptionEnd: null,
    trialEnd: null,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Check if user is admin — admins get full access automatically
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData?.role === "admin") {
        setState({
          subscribed: true,
          inTrial: false,
          subscriptionEnd: null,
          trialEnd: null,
          loading: false,
        });
        return;
      }

      // Check if user has been granted free access (grandfathered)
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("is_grandfathered, status")
        .eq("user_id", user.id)
        .single();

      if (subData?.is_grandfathered) {
        setState({
          subscribed: true,
          inTrial: false,
          subscriptionEnd: null,
          trialEnd: null,
          loading: false,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      
      setState({
        subscribed: data.subscribed || false,
        inTrial: data.inTrial || false,
        subscriptionEnd: data.subscriptionEnd || null,
        trialEnd: data.trialEnd || null,
        loading: false,
      });
    } catch (err) {
      console.error("Subscription check error:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const startCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      throw err;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Portal error:", err);
      throw err;
    }
  };

  return {
    ...state,
    checkSubscription,
    startCheckout,
    openCustomerPortal,
  };
}
