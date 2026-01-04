import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseParentalPinReturn {
  isLoading: boolean;
  error: string | null;
  setPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  hasPin: () => Promise<boolean>;
  clearPin: () => Promise<boolean>;
}

export function useParentalPin(): UseParentalPinReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const setPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) {
      setError('Not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('set_parental_pin', {
        pin_value: pin
      });

      if (rpcError) {
        setError(rpcError.message);
        return false;
      }

      return data === true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) {
      setError('Not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('verify_parental_pin', {
        pin_attempt: pin
      });

      if (rpcError) {
        // Handle rate limiting error specifically
        if (rpcError.message.includes('Too many failed attempts')) {
          setError('Too many failed attempts. Please wait 15 minutes.');
        } else {
          setError(rpcError.message);
        }
        return false;
      }

      return data === true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const hasPin = useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc('has_parental_pin');

      if (rpcError) {
        console.error('Error checking PIN status:', rpcError);
        return false;
      }

      return data === true;
    } catch (err) {
      console.error('Error checking PIN status:', err);
      return false;
    }
  }, [user]);

  const clearPin = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('Not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('clear_parental_pin');

      if (rpcError) {
        setError(rpcError.message);
        return false;
      }

      return data === true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    setPin,
    verifyPin,
    hasPin,
    clearPin
  };
}
