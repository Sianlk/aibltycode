import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Zap, Gamepad2, Moon, Sun, Shield } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { gameMode, setGameMode, soundEnabled, setSoundEnabled, playSound } = useGame();

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
        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
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
          {/* Game Mode */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  Learning Mode
                </CardTitle>
                <CardDescription>
                  Choose how you want to learn
                </CardDescription>
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
                    <span className="text-xs opacity-70">
                      Icons, sounds, gentle pace
                    </span>
                  </Button>
                  <Button
                    variant={gameMode === "pro" ? "accent" : "outline"}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleModeChange("pro")}
                  >
                    <Zap className="w-6 h-6" />
                    <span className="font-bold">Pro Mode</span>
                    <span className="text-xs opacity-70">
                      Deep explanations, edge cases
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sound Settings */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-success" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                  Sound Effects
                </CardTitle>
                <CardDescription>
                  Toggle game sounds on or off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable Sounds</p>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for correct/wrong answers
                    </p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Privacy
                </CardTitle>
                <CardDescription>
                  Your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  AibltyCode respects your privacy. We only store your progress locally
                  on your device. When you create an account, your data is encrypted and
                  securely stored.
                </p>
                <Button variant="outline" size="sm">
                  View Privacy Policy
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-4 block">🚀</span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  AibltyCode
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn to code through space adventures
                </p>
                <p className="text-xs text-muted-foreground">
                  Version 1.0.0
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
