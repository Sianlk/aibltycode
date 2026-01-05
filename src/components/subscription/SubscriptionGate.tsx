import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
}

export function SubscriptionGate({ children, feature, fallback }: SubscriptionGateProps) {
  const { subscribed, inTrial, loading, startCheckout } = useSubscription();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (subscribed || inTrial) {
    return <>{children}</>;
  }

  if (!user) {
    return fallback || null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-4"
    >
      <Card className="max-w-md border-2 border-primary/30 bg-gradient-to-br from-card to-card/80 overflow-hidden relative">
        <div className="absolute top-4 right-4">
          <Badge className="gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            {feature ? `Unlock ${feature}` : 'Unlock Premium Access'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Get full access to all courses, games, and learning content.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <span>Full access to all courses and games</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <span>AI-powered personal tutor</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <span>Multiplayer battle arena</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <span>Live code sandbox</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-3xl font-bold">£5.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
            <p className="text-sm text-primary font-medium mt-1">Start with 7-day free trial</p>
          </div>

          <Button className="w-full gap-2" size="lg" onClick={startCheckout}>
            <Sparkles className="h-4 w-4" />
            Start Free Trial
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No charge for 7 days. Cancel anytime.
          </p>
        </CardContent>

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </Card>
    </motion.div>
  );
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn("gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 border-0", className)}>
      <Crown className="h-3 w-3" />
      Premium
    </Badge>
  );
}
