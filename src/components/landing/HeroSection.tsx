import { motion } from "framer-motion";
import { Code2, Zap, Trophy, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Interactive Java Learning Platform
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Master Java</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Through Play
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Learn Java, Systems Design, and Computational Thinking through 
              interactive games and challenges. From fundamentals to advanced concepts.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="min-w-[180px] gap-2"
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="w-4 h-4" />
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="min-w-[180px]"
              >
                Sign In
              </Button>
            )}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { 
                icon: <Code2 className="w-6 h-6 text-primary" />, 
                label: "Java Mastery", 
                desc: "OOP to Advanced Patterns" 
              },
              { 
                icon: <BookOpen className="w-6 h-6 text-accent" />, 
                label: "Systems Design", 
                desc: "Architecture & Modelling" 
              },
              { 
                icon: <Zap className="w-6 h-6 text-warning" />, 
                label: "Algorithm Skills", 
                desc: "Big-O & Problem Solving" 
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                className="bg-card rounded-xl p-5 border border-border"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              <span>Earn XP & Badges</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Track Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-success" />
              <span>6 Game Modes</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
