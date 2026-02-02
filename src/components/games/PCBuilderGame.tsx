import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Monitor, Cpu, HardDrive, Fan, Power, Zap, CheckCircle, Lightbulb, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface PCComponent {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  specs: string;
  slot: string;
  correctOrder: number;
}

interface BuildSlot {
  id: string;
  name: string;
  icon: React.ReactNode;
  accepts: string;
  component: PCComponent | null;
  hint: string;
}

const allComponents: PCComponent[] = [
  // Correct components
  { id: "cpu-intel", name: "Intel Core i7-12700K", category: "CPU", icon: "🔲", description: "12-core processor with high clock speeds", specs: "3.6GHz base, 5.0GHz boost", slot: "cpu", correctOrder: 1 },
  { id: "mobo-asus", name: "ASUS ROG Z690", category: "Motherboard", icon: "🔌", description: "High-end gaming motherboard with DDR5 support", specs: "LGA1700, DDR5, PCIe 5.0", slot: "motherboard", correctOrder: 0 },
  { id: "ram-corsair", name: "Corsair Vengeance 32GB DDR5", category: "RAM", icon: "📊", description: "High-speed memory for multitasking", specs: "5600MHz, CL36, Dual Channel", slot: "ram", correctOrder: 2 },
  { id: "gpu-nvidia", name: "NVIDIA RTX 4080", category: "GPU", icon: "🎮", description: "High-performance graphics card for gaming", specs: "16GB GDDR6X, DLSS 3.0", slot: "gpu", correctOrder: 4 },
  { id: "ssd-samsung", name: "Samsung 990 Pro 2TB", category: "Storage", icon: "💾", description: "Ultra-fast NVMe SSD", specs: "7450MB/s read, PCIe 4.0", slot: "storage", correctOrder: 5 },
  { id: "psu-evga", name: "EVGA SuperNOVA 850W", category: "PSU", icon: "⚡", description: "80+ Gold certified power supply", specs: "850W, Fully Modular", slot: "psu", correctOrder: 6 },
  { id: "cooler-noctua", name: "Noctua NH-D15", category: "Cooler", icon: "❄️", description: "Premium dual-tower CPU cooler", specs: "165mm height, 1500 RPM", slot: "cooler", correctOrder: 3 },
  { id: "case-nzxt", name: "NZXT H510", category: "Case", icon: "🖥️", description: "Mid-tower ATX case with glass panel", specs: "ATX, 2x 120mm fans", slot: "case", correctOrder: 7 },
  
  // Incompatible/wrong components (distractors)
  { id: "cpu-old", name: "Intel Pentium 4", category: "CPU", icon: "🔲", description: "Legacy processor - INCOMPATIBLE", specs: "3.0GHz, LGA775 socket", slot: "cpu", correctOrder: -1 },
  { id: "ram-ddr3", name: "Kingston DDR3 8GB", category: "RAM", icon: "📊", description: "Old generation RAM - INCOMPATIBLE", specs: "1600MHz DDR3", slot: "ram", correctOrder: -1 },
  { id: "gpu-old", name: "ATI Radeon 9800", category: "GPU", icon: "🎮", description: "AGP graphics card - INCOMPATIBLE", specs: "256MB, AGP slot", slot: "gpu", correctOrder: -1 },
  { id: "psu-weak", name: "Generic 300W PSU", category: "PSU", icon: "⚡", description: "Insufficient power - UNDERPOWERED", specs: "300W, No certification", slot: "psu", correctOrder: -1 },
];

const buildSlots: BuildSlot[] = [
  { id: "motherboard", name: "Motherboard", icon: <Cpu className="w-5 h-5" />, accepts: "Motherboard", component: null, hint: "Foundation of the PC - install first" },
  { id: "cpu", name: "CPU Socket", icon: <Cpu className="w-5 h-5" />, accepts: "CPU", component: null, hint: "The brain of the computer" },
  { id: "ram", name: "RAM Slots", icon: <HardDrive className="w-5 h-5" />, accepts: "RAM", component: null, hint: "Memory for running applications" },
  { id: "cooler", name: "CPU Cooler", icon: <Fan className="w-5 h-5" />, accepts: "Cooler", component: null, hint: "Keeps the CPU from overheating" },
  { id: "gpu", name: "PCIe Slot", icon: <Monitor className="w-5 h-5" />, accepts: "GPU", component: null, hint: "Graphics processing for display" },
  { id: "storage", name: "M.2 Slot", icon: <HardDrive className="w-5 h-5" />, accepts: "Storage", component: null, hint: "Fast storage for OS and files" },
  { id: "psu", name: "Power Supply", icon: <Power className="w-5 h-5" />, accepts: "PSU", component: null, hint: "Provides power to all components" },
  { id: "case", name: "PC Case", icon: <Monitor className="w-5 h-5" />, accepts: "Case", component: null, hint: "Houses all components" },
];

const challenges = [
  {
    id: 1,
    title: "Build a Gaming PC",
    description: "Select compatible components to build a high-performance gaming system",
    requirements: ["DDR5 RAM", "RTX GPU", "850W+ PSU", "NVMe SSD"],
    difficulty: "Beginner",
    xp: 100,
  },
  {
    id: 2,
    title: "Identify Compatibility Issues",
    description: "Find and avoid incompatible components",
    requirements: ["Match socket types", "Correct RAM generation", "Adequate PSU wattage"],
    difficulty: "Intermediate",
    xp: 150,
  },
  {
    id: 3,
    title: "Optimal Build Order",
    description: "Install components in the correct sequence",
    requirements: ["Motherboard first", "CPU before cooler", "PSU last"],
    difficulty: "Advanced",
    xp: 200,
  },
];

export default function PCBuilderGame() {
  const { playSound } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [slots, setSlots] = useState<BuildSlot[]>(buildSlots);
  const [availableComponents, setAvailableComponents] = useState<PCComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PCComponent | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [buildOrder, setBuildOrder] = useState<string[]>([]);
  const [phase, setPhase] = useState<"intro" | "building" | "feedback">("intro");
  const [streak, setStreak] = useState(0);

  const shuffleComponents = useCallback(() => {
    const shuffled = [...allComponents].sort(() => Math.random() - 0.5);
    setAvailableComponents(shuffled);
  }, []);

  useEffect(() => {
    shuffleComponents();
  }, [shuffleComponents, currentChallenge]);

  const handleComponentClick = (component: PCComponent) => {
    if (isComplete) return;
    setSelectedComponent(component);
    playSound?.("click");
  };

  const handleSlotClick = (slot: BuildSlot) => {
    if (isComplete || !selectedComponent) return;

    // Check if component category matches slot
    if (selectedComponent.category !== slot.accepts) {
      setShowExplanation(`❌ ${selectedComponent.name} cannot be installed in ${slot.name}. It requires a ${selectedComponent.category} slot.`);
      setErrors(prev => [...prev, `Wrong slot for ${selectedComponent.name}`]);
      playSound?.("error");
      setStreak(0);
      return;
    }

    // Check if it's an incompatible component
    if (selectedComponent.correctOrder === -1) {
      setShowExplanation(`❌ ${selectedComponent.name} is incompatible! ${selectedComponent.description}`);
      setErrors(prev => [...prev, `Incompatible: ${selectedComponent.name}`]);
      playSound?.("error");
      setStreak(0);
      return;
    }

    // Check build order for advanced challenge
    if (currentChallenge === 2) {
      const expectedOrder = ["motherboard", "cpu", "ram", "cooler", "gpu", "storage", "psu", "case"];
      const currentStep = buildOrder.length;
      if (slot.id !== expectedOrder[currentStep]) {
        setShowExplanation(`⚠️ Build order matters! You should install the ${expectedOrder[currentStep].toUpperCase()} before the ${slot.name}.`);
        setErrors(prev => [...prev, `Wrong order: ${slot.name}`]);
        playSound?.("error");
        setStreak(0);
        return;
      }
    }

    // Install component
    setSlots(prev => prev.map(s => 
      s.id === slot.id ? { ...s, component: selectedComponent } : s
    ));
    setAvailableComponents(prev => prev.filter(c => c.id !== selectedComponent.id));
    setBuildOrder(prev => [...prev, slot.id]);
    setSelectedComponent(null);
    setStreak(prev => prev + 1);
    
    const points = 10 + (streak * 5);
    setScore(prev => prev + points);
    playSound?.("success");
    
    setShowExplanation(`✅ ${selectedComponent.name} installed! ${selectedComponent.description}`);

    // Check if build is complete
    const updatedSlots = slots.map(s => 
      s.id === slot.id ? { ...s, component: selectedComponent } : s
    );
    const allFilled = updatedSlots.every(s => s.component !== null);
    const allCorrect = updatedSlots.every(s => s.component?.correctOrder !== -1);
    
    if (allFilled && allCorrect) {
      setIsComplete(true);
      setPhase("feedback");
      const bonus = Math.max(0, 50 - errors.length * 10);
      setScore(prev => prev + challenges[currentChallenge].xp + bonus);
      playSound?.("levelUp");
    }
  };

  const resetGame = () => {
    setSlots(buildSlots.map(s => ({ ...s, component: null })));
    setSelectedComponent(null);
    setShowExplanation(null);
    setIsComplete(false);
    setErrors([]);
    setBuildOrder([]);
    setStreak(0);
    shuffleComponents();
    setPhase("building");
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      resetGame();
      setPhase("intro");
    }
  };

  const filledSlots = slots.filter(s => s.component !== null).length;
  const progress = (filledSlots / slots.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            🖥️ PC Builder Lab
          </h2>
          <p className="text-muted-foreground">
            Challenge {currentChallenge + 1}: {challenges[currentChallenge].title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{score} XP</span>
          </div>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-full bg-warning/20 text-warning font-bold"
            >
              🔥 {streak}x Streak!
            </motion.div>
          )}
        </div>
      </div>

      {/* Intro Phase */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-primary" />
                  {challenges[currentChallenge].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{challenges[currentChallenge].description}</p>
                
                <div className="bg-card/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    Requirements:
                  </h4>
                  <ul className="space-y-1">
                    {challenges[currentChallenge].requirements.map((req, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm bg-accent/20 text-accent px-2 py-1 rounded">
                    {challenges[currentChallenge].difficulty}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    +{challenges[currentChallenge].xp} XP
                  </span>
                </div>

                <Button onClick={() => setPhase("building")} className="w-full" size="lg">
                  Start Building
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Building Phase */}
        {phase === "building" && (
          <motion.div
            key="building"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Build Progress</span>
                <span className="font-bold text-primary">{filledSlots}/{slots.length} Components</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Build Area - Visual PC Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PC Case Visualization */}
              <Card className="bg-gradient-to-b from-muted/50 to-muted/30 border-2 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    PC Build Station
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        whileHover={{ scale: selectedComponent ? 1.02 : 1 }}
                        onClick={() => handleSlotClick(slot)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          slot.component 
                            ? 'bg-success/10 border-success/50' 
                            : selectedComponent?.category === slot.accepts
                              ? 'bg-primary/10 border-primary/50 animate-pulse'
                              : 'bg-card border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {slot.icon}
                          <span className="text-xs font-medium">{slot.name}</span>
                        </div>
                        {slot.component ? (
                          <div className="text-xs">
                            <span className="text-lg">{slot.component.icon}</span>
                            <p className="text-success font-medium truncate">{slot.component.name}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">{slot.hint}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Components */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Components ({availableComponents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {availableComponents.map((component) => (
                      <motion.div
                        key={component.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleComponentClick(component)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedComponent?.id === component.id
                            ? 'bg-primary/20 border-primary'
                            : component.correctOrder === -1
                              ? 'bg-destructive/5 border-border hover:border-destructive/50'
                              : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{component.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{component.name}</p>
                            <p className="text-xs text-muted-foreground">{component.category}</p>
                          </div>
                          {selectedComponent?.id === component.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Explanation Panel */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg ${
                    showExplanation.startsWith('✅')
                      ? 'bg-success/10 border border-success/30'
                      : 'bg-destructive/10 border border-destructive/30'
                  }`}
                >
                  <p className="text-sm">{showExplanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Log */}
            {errors.length > 0 && (
              <div className="bg-destructive/5 rounded-lg p-3">
                <p className="text-xs text-destructive font-medium mb-1">Errors: {errors.length}</p>
                <div className="flex flex-wrap gap-1">
                  {errors.slice(-3).map((err, i) => (
                    <span key={i} className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                      {err}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Feedback Phase */}
        {phase === "feedback" && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/30">
              <CardContent className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Trophy className="w-16 h-16 mx-auto text-warning mb-4" />
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2">Build Complete! 🎉</h2>
                <p className="text-muted-foreground mb-4">
                  You successfully built a {challenges[currentChallenge].title.toLowerCase()}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{score}</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-success">{slots.length}/{slots.length}</p>
                    <p className="text-xs text-muted-foreground">Components</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-warning">{Math.max(0, 3 - errors.length)}/3</p>
                    <p className="text-xs text-muted-foreground">Stars</p>
                  </div>
                </div>

                {/* Learning Summary */}
                <div className="bg-card/50 rounded-lg p-4 text-left mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    What You Learned:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PC components and their functions</li>
                    <li>• Component compatibility (DDR5 vs DDR3, socket types)</li>
                    <li>• Proper build order for assembly</li>
                    <li>• Power requirements and PSU sizing</li>
                  </ul>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetGame}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Rebuild
                  </Button>
                  {currentChallenge < challenges.length - 1 && (
                    <Button onClick={nextChallenge}>
                      Next Challenge
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
