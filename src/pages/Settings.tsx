import { useState } from "react";
import { motion } from "framer-motion";
import {
  getAnalyticsSummary,
  setConsent,
  hasConsent,
  clearAnalyticsData,
} from "@/lib/privacyAnalytics";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Zap, Gamepad2, Shield, Eye, Brain, Accessibility, Crown, User, CreditCard } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { gameMode, setGameMode, soundEnabled, setSoundEnabled, playSound, accessibility, setAccessibility } = useGame();
  const { user } = useAuth();
  const { subscribed, inTrial, trialEnd, subscriptionEnd, openCustomerPortal, startCheckout, loading } = useSubscription();

  const handleModeChange = (mode: "kid" | "pro") => {
    playSound("click");
    setGameMode(mode);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) {
      setTimeout(() => playSound("click"), 50);
    }
  };

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black text-foreground mb-8"
        >
          ⚙️ Settings
        </motion.h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <Card variant="glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{user?.email || "Not logged in"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Section */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-warning" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your AibilityCode Pro subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-sm ${
                    subscribed ? "bg-success/20 text-success" : 
                    inTrial ? "bg-warning/20 text-warning" : 
                    "bg-muted text-muted-foreground"
                  }`}>
                    {subscribed ? "Active" : inTrial ? "Free Trial" : "Not Subscribed"}
                  </span>
                </div>
                {(subscribed && subscriptionEnd) && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Renews</span>
                    <span className="font-medium text-foreground">{new Date(subscriptionEnd).toLocaleDateString()}</span>
                  </div>
                )}
                {(inTrial && trialEnd) && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trial Ends</span>
                    <span className="font-medium text-warning">{new Date(trialEnd).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">£5.99/month</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {subscribed ? (
                    <Button variant="outline" onClick={openCustomerPortal} disabled={loading}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button variant="hero" onClick={startCheckout} disabled={loading}>
                      <Crown className="w-4 h-4 mr-2" />
                      {inTrial ? "Subscribe Now" : "Start Free Trial"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Mode */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card variant="glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  Learning Mode
                </CardTitle>
                <CardDescription>Choose how you want to learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={gameMode === "kid" ? "hero" : "outline"}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleModeChange("kid")}
                  >
                    <span className="text-2xl">🎮</span>
                    <span className="font-bold">Kid Mode</span>
                    <span className="text-xs opacity-70">Icons, sounds, gentle pace</span>
                  </Button>
                  <Button
                    variant={gameMode === "pro" ? "accent" : "outline"}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleModeChange("pro")}
                  >
                    <Zap className="w-6 h-6" />
                    <span className="font-bold">Pro Mode</span>
                    <span className="text-xs opacity-70">Deep explanations, edge cases</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sound Settings */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-5 h-5 text-success" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                  Sound Effects
                </CardTitle>
                <CardDescription>Toggle game sounds on or off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable Sounds</p>
                    <p className="text-sm text-muted-foreground">Play sounds for correct/wrong answers</p>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-accent" />
                  Accessibility
                </CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Calm Mode
                    </p>
                    <p className="text-sm text-muted-foreground">Slower games, reduced stimulation</p>
                  </div>
                  <Switch
                    checked={accessibility.calmMode}
                    onCheckedChange={(checked) => setAccessibility({ calmMode: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Dyslexia-Friendly Font</p>
                    <p className="text-sm text-muted-foreground">Use OpenDyslexic font</p>
                  </div>
                  <Switch
                    checked={accessibility.dyslexiaFont}
                    onCheckedChange={(checked) => setAccessibility({ dyslexiaFont: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4" /> High Contrast
                    </p>
                    <p className="text-sm text-muted-foreground">Enhanced visual contrast</p>
                  </div>
                  <Switch
                    checked={accessibility.highContrast}
                    onCheckedChange={(checked) => setAccessibility({ highContrast: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Reduced Motion</p>
                    <p className="text-sm text-muted-foreground">Minimize animations</p>
                  </div>
                  <Switch
                    checked={accessibility.reducedMotion}
                    onCheckedChange={(checked) => setAccessibility({ reducedMotion: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Step-by-Step Mode</p>
                    <p className="text-sm text-muted-foreground">Break lessons into smaller chunks</p>
                  </div>
                  <Switch
                    checked={accessibility.stepByStep}
                    onCheckedChange={(checked) => setAccessibility({ stepByStep: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Privacy
                </CardTitle>
                <CardDescription>Your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your progress is securely stored and encrypted. We only collect data necessary for your learning experience.
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">Anonymous learning analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Off by default. If you turn it on, we record only lesson completions and daily
                      return visits with an anonymous id that changes every day — no name, email or answers.
                    </p>
                  </div>
                  <Switch
                    aria-label="Anonymous learning analytics"
                    checked={analyticsOn}
                    onCheckedChange={handleAnalyticsToggle}
                  />
                </div>

                {analyticsOn && (
                  <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
                    <p>
                      Stored on this device: {summary.total} events ({summary.lessonsCompleted} lesson completions,{" "}
                      {summary.activeDays} active days).
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={handleClearAnalytics}>
                      Delete analytics data
                    </Button>
                  </div>
                )}

                <Button variant="outline" size="sm">View Privacy Policy</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-4 block">🚀</span>
                <h3 className="text-lg font-bold text-foreground mb-2">AIblty</h3>
                <p className="text-sm text-muted-foreground mb-4">Master coding through interactive learning</p>
                <p className="text-xs text-muted-foreground">Version 2.0.0</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}