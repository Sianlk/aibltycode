import { motion } from "framer-motion";
import { Rocket, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

export function HeroSection() {
  const navigate = useNavigate();
  const { setGameMode, playSound } = useGame();

  const handleModeSelect = (mode: "kid" | "pro") => {
    playSound("click");
    setGameMode(mode);
    navigate("/dashboard");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden stars-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/5 blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Learn to Code Through Adventure
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-foreground">Code Your Way</span>
              <br />
              <span className="text-gradient-primary">Through the Galaxy</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master Java, Systems Design, and Math through addictive games. 
              So simple a 5-year-old can start, so deep experts will be challenged.
            </p>
          </motion.div>

          {/* Mode selection */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="hero"
                size="xl"
                onClick={() => handleModeSelect("kid")}
                className="min-w-[200px] group"
              >
                <span className="text-2xl mr-2">🎮</span>
                Kid Mode
                <motion.span
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="accent"
                size="xl"
                onClick={() => handleModeSelect("pro")}
                className="min-w-[200px] group"
              >
                <Zap className="w-5 h-5 mr-2" />
                Pro Mode
                <motion.span
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { icon: "🚀", label: "Java Mastery", desc: "From basics to advanced" },
              { icon: "🌌", label: "Systems Design", desc: "Think like an architect" },
              { icon: "✨", label: "Math Magic", desc: "Visual problem solving" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                className="glass rounded-xl p-4 border border-border/50"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -5, borderColor: "hsl(var(--primary) / 0.5)" }}
              >
                <span className="text-3xl mb-2 block">{feature.icon}</span>
                <h3 className="font-bold text-foreground mb-1">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating rocket animation */}
          <motion.div
            className="absolute bottom-10 right-10 hidden lg:block"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="w-16 h-16 text-primary/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
