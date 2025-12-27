import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for trying out AIblty",
    features: [
      "Access to 3 modules",
      "5 mini games",
      "Basic progress tracking",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "£9.99",
    period: "per month",
    description: "Everything you need to master coding",
    features: [
      "All 7+ modules unlocked",
      "All 15+ mini games",
      "Spaced repetition system",
      "Advanced analytics",
      "Priority support",
      "Offline mode",
      "Certificate of completion",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "family",
    name: "Family",
    price: "£19.99",
    period: "per month",
    description: "Learn together with up to 5 members",
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Parental controls",
      "Kids mode",
      "Family leaderboard",
      "Shared progress dashboard",
    ],
    cta: "Start Family Trial",
    popular: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCheckout, subscribed, loading } = useSubscription();
  const { toast } = useToast();

  const handlePlanSelect = async (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (planId === "free") {
      navigate("/dashboard");
      return;
    }

    try {
      await startCheckout();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1" />
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Learning Plan
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include a 7-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    {plan.id === "free" && <Zap className="w-6 h-6 text-primary" />}
                    {plan.id === "pro" && <Crown className="w-6 h-6 text-primary" />}
                    {plan.id === "family" && <Users className="w-6 h-6 text-primary" />}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loading || (subscribed && plan.id !== "free")}
                  >
                    {subscribed && plan.id !== "free" ? "Already Subscribed" : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "What's included in the free trial?",
                a: "The 7-day free trial gives you full access to all Pro features. No credit card required to start.",
              },
              {
                q: "Is there a student discount?",
                a: "Yes! Students get 50% off Pro plans. Contact us with your student email to get your discount code.",
              },
              {
                q: "Can I switch between plans?",
                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
              },
            ].map((faq) => (
              <Card key={faq.q} className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
