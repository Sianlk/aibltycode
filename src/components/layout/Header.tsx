import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, VolumeX, User, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = forwardRef<HTMLDivElement>((_, ref) => {
  const { soundEnabled, setSoundEnabled, xp, streak, gameMode, playSound } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      setTimeout(() => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }, 50);
    }
  };

  const isLanding = location.pathname === "/";

  return (
    <motion.header
      ref={ref}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">🚀</span>
          <span className="text-xl font-extrabold text-gradient-primary">
            AibltyCode
          </span>
          {!isLanding && (
            <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-accent/20 text-accent">
              {gameMode === "kid" ? "🎮 Kid Mode" : "⚡ Pro Mode"}
            </span>
          )}
        </motion.div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-3">
          {!isLanding && (
            <>
              {/* XP Display */}
              <motion.div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">{xp} XP</span>
              </motion.div>

              {/* Streak Display */}
              <motion.div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-4 h-4 text-secondary" />
                <span className="text-sm font-bold text-secondary">{streak} day</span>
              </motion.div>
            </>
          )}

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSoundToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Profile */}
          {!isLanding && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/profile")}
              className="rounded-full"
            >
              <User className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = "Header";
