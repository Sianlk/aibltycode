import { motion } from "framer-motion";
import { Code2, Zap, Trophy, BookOpen, ArrowRight, Shield, Brain, Gamepad2, Briefcase, Download, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const courses = [
  { icon: <Code2 className="w-6 h-6 text-primary" />, label: "Java Programming", desc: "OOP, Streams, Spring Boot, Testing", id: "java-foundations" },
  { icon: <BookOpen className="w-6 h-6 text-accent" />, label: "Systems Analysis", desc: "SDLC, Agile, UML, Microservices", id: "systems-analysis" },
  { icon: <Zap className="w-6 h-6 text-warning" />, label: "Maths", desc: "Logic, Statistics, Algorithms", id: "math-computing" },
  { icon: <Shield className="w-6 h-6 text-success" />, label: "Cybersecurity", desc: "CompTIA, Pen Testing, SOC, SIEM", id: "cybersecurity" },
  { icon: <Brain className="w-6 h-6 text-secondary" />, label: "AI & Data Science", desc: "ML, Robotics, NLP, MLOps, CV", id: "ai-data-science" },
  { icon: <Briefcase className="w-6 h-6 text-primary" />, label: "Business Systems", desc: "ERP, SaaS, AWS, Digital Marketing", id: "business-systems" },
  { icon: <Gamepad2 className="w-6 h-6 text-accent" />, label: "Game Dev", desc: "Unity, 3D, Physics, AI, Multiplayer", id: "game-development" },
  { icon: <Monitor className="w-6 h-6 text-success" />, label: "Computer Systems", desc: "Hardware, LMC, OS, Networking", id: "computer-systems" },
  { icon: <Globe className="w-6 h-6 text-warning" />, label: "Web Technologies", desc: "React, TypeScript, SEO, APIs, PWA", id: "web-technologies" },
];

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
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
                Complete Tech Learning Platform
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Master Tech Skills</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Through Play
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master Java, Systems Design, Cybersecurity, AI, Robotics, Data Science, 
              Web Dev, and more through interactive games and challenges. 9 mastery courses 
              with 800+ lessons from fundamentals to professional expertise.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Includes CompTIA Security+, AWS, Docker, Kubernetes, Spring Boot, React, TypeScript, 
              SEO, Digital Marketing, ERP, SaaS, MLOps, NLP, Robotics & more
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
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pricing")}
              className="min-w-[180px]"
            >
              View Pricing
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/install")}
              className="min-w-[180px] gap-2"
            >
              <Download className="w-4 h-4" /> Get the App
            </Button>
          </motion.div>

          {/* All Courses Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
          {courses.map((course, i) => (
              <motion.div
                key={course.label}
                className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                onClick={() => navigate(user ? `/module/${course.id}` : "/auth")}
              >
                <div className="mb-2 text-2xl">{typeof course.icon === 'string' ? course.icon : course.icon}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{course.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{course.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
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
              <Gamepad2 className="w-4 h-4 text-success" />
              <span>25+ Game Modes</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>9 Courses</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
