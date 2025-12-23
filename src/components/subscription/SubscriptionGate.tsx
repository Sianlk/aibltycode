import { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Loader2 } from "lucide-react";

interface SubscriptionGateProps {
  children: ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { subscribed, inTrial, loading, startCheckout, trialEnd } = useSubscription();

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

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Unlock Premium Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Get full access to all courses, games, and learning content.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-3xl font-bold">$5.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
            <p className="text-sm text-primary font-medium mt-1">Start with 7-day free trial</p>
          </div>
          <ul className="text-left space-y-2 text-sm">
            <li className="flex items-center gap-2">✓ All learning modules</li>
            <li className="flex items-center gap-2">✓ Interactive games</li>
            <li className="flex items-center gap-2">✓ Progress tracking</li>
            <li className="flex items-center gap-2">✓ Cancel anytime</li>
          </ul>
          <Button className="w-full" size="lg" onClick={startCheckout}>
            Start Free Trial
          </Button>
          <p className="text-xs text-muted-foreground">
            No charge for 7 days. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
