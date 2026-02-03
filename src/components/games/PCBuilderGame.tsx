import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, Cpu, HardDrive, Fan, Power, Zap, CheckCircle, Lightbulb, 
  Trophy, RotateCcw, ChevronRight, AlertTriangle, Info, ArrowRight
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";

// Component types with detailed specifications
interface PCComponent {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  specs: string;
  slot: string;
  isCompatible: boolean;
  installOrder: number;
  image: string;
}

// Slot definitions with visual positioning
interface BuildSlot {
  id: string;
  name: string;
  category: string;
  position: { top: string; left: string; width: string; height: string };
  color: string;
  description: string;
  installed: PCComponent | null;
}

// All available components - mix of compatible and incompatible
const allComponents: PCComponent[] = [
  // ===== COMPATIBLE COMPONENTS =====
  {
    id: "mobo-z690",
    name: "ASUS ROG Z690 Motherboard",
    category: "Motherboard",
    icon: "🔌",
    description: "High-end ATX motherboard with DDR5 support, PCIe 5.0, and LGA1700 socket",
    specs: "LGA1700 • DDR5 • PCIe 5.0 • ATX",
    slot: "motherboard",
    isCompatible: true,
    installOrder: 1,
    image: "motherboard"
  },
  {
    id: "cpu-i7",
    name: "Intel Core i7-12700K",
    category: "CPU",
    icon: "🧠",
    description: "12-core processor with Performance and Efficiency cores. Requires LGA1700 socket.",
    specs: "12 Cores • 3.6GHz Base • 5.0GHz Boost • 125W TDP",
    slot: "cpu",
    isCompatible: true,
    installOrder: 2,
    image: "cpu"
  },
  {
    id: "ram-ddr5",
    name: "Corsair Vengeance DDR5 32GB",
    category: "RAM",
    icon: "📊",
    description: "High-speed DDR5 memory kit. Install in DIMM slots with correct orientation.",
    specs: "32GB (2x16GB) • DDR5-5600 • CL36 • 1.25V",
    slot: "ram",
    isCompatible: true,
    installOrder: 3,
    image: "ram"
  },
  {
    id: "cooler-noctua",
    name: "Noctua NH-D15 Cooler",
    category: "Cooler",
    icon: "❄️",
    description: "Premium dual-tower CPU cooler. Must be installed after CPU.",
    specs: "165mm Height • Dual 140mm Fans • 6 Heatpipes",
    slot: "cooler",
    isCompatible: true,
    installOrder: 4,
    image: "cooler"
  },
  {
    id: "gpu-rtx4080",
    name: "NVIDIA RTX 4080 16GB",
    category: "GPU",
    icon: "🎮",
    description: "High-performance graphics card. Install in the primary PCIe x16 slot.",
    specs: "16GB GDDR6X • DLSS 3.0 • 320W TDP",
    slot: "gpu",
    isCompatible: true,
    installOrder: 5,
    image: "gpu"
  },
  {
    id: "ssd-990pro",
    name: "Samsung 990 Pro 2TB NVMe",
    category: "Storage",
    icon: "💾",
    description: "Ultra-fast PCIe 4.0 NVMe SSD. Install in M.2 slot on motherboard.",
    specs: "2TB • 7450MB/s Read • PCIe 4.0 • M.2 2280",
    slot: "storage",
    isCompatible: true,
    installOrder: 6,
    image: "ssd"
  },
  {
    id: "psu-850w",
    name: "EVGA SuperNOVA 850W Gold",
    category: "PSU",
    icon: "⚡",
    description: "80+ Gold certified modular PSU. Provides power to all components.",
    specs: "850W • 80+ Gold • Fully Modular • 140mm Fan",
    slot: "psu",
    isCompatible: true,
    installOrder: 7,
    image: "psu"
  },
  {
    id: "case-h510",
    name: "NZXT H510 Mid-Tower",
    category: "Case",
    icon: "🖥️",
    description: "ATX mid-tower case with tempered glass panel and cable management.",
    specs: "ATX • Tempered Glass • 2x 120mm Fans • USB-C",
    slot: "case",
    isCompatible: true,
    installOrder: 8,
    image: "case"
  },

  // ===== INCOMPATIBLE COMPONENTS (Distractors) =====
  {
    id: "cpu-pentium4",
    name: "Intel Pentium 4 3.0GHz",
    category: "CPU",
    icon: "🧠",
    description: "⚠️ INCOMPATIBLE: Legacy LGA775 socket - won't fit modern motherboards!",
    specs: "1 Core • 3.0GHz • LGA775 • 84W TDP",
    slot: "cpu",
    isCompatible: false,
    installOrder: -1,
    image: "cpu-old"
  },
  {
    id: "ram-ddr3",
    name: "Kingston DDR3 8GB",
    category: "RAM",
    icon: "📊",
    description: "⚠️ INCOMPATIBLE: DDR3 memory won't fit DDR5 motherboard slots!",
    specs: "8GB • DDR3-1600 • 1.5V",
    slot: "ram",
    isCompatible: false,
    installOrder: -1,
    image: "ram-old"
  },
  {
    id: "gpu-agp",
    name: "ATI Radeon 9800 Pro AGP",
    category: "GPU",
    icon: "🎮",
    description: "⚠️ INCOMPATIBLE: AGP slot - modern systems use PCIe!",
    specs: "256MB • AGP 8x • 2002 Era",
    slot: "gpu",
    isCompatible: false,
    installOrder: -1,
    image: "gpu-old"
  },
  {
    id: "psu-300w",
    name: "Generic 300W PSU",
    category: "PSU",
    icon: "⚡",
    description: "⚠️ UNDERPOWERED: Not enough wattage for RTX 4080 system!",
    specs: "300W • No Certification • Non-Modular",
    slot: "psu",
    isCompatible: false,
    installOrder: -1,
    image: "psu-weak"
  },
];

// Initial slot definitions for the visual PC case
const initialSlots: BuildSlot[] = [
  {
    id: "motherboard",
    name: "Motherboard Tray",
    category: "Motherboard",
    position: { top: "15%", left: "10%", width: "55%", height: "70%" },
    color: "from-emerald-500/20 to-emerald-600/10",
    description: "The foundation - install this first!",
    installed: null
  },
  {
    id: "cpu",
    name: "CPU Socket (LGA1700)",
    category: "CPU",
    position: { top: "25%", left: "25%", width: "15%", height: "12%" },
    color: "from-blue-500/20 to-blue-600/10",
    description: "The brain - install after motherboard",
    installed: null
  },
  {
    id: "ram",
    name: "DIMM Slots (DDR5)",
    category: "RAM",
    position: { top: "20%", left: "45%", width: "8%", height: "25%" },
    color: "from-purple-500/20 to-purple-600/10",
    description: "Memory slots - align notch correctly!",
    installed: null
  },
  {
    id: "cooler",
    name: "CPU Cooler Mount",
    category: "Cooler",
    position: { top: "22%", left: "22%", width: "20%", height: "18%" },
    color: "from-cyan-500/20 to-cyan-600/10",
    description: "Cooling - install after CPU",
    installed: null
  },
  {
    id: "gpu",
    name: "PCIe x16 Slot",
    category: "GPU",
    position: { top: "55%", left: "15%", width: "45%", height: "12%" },
    color: "from-red-500/20 to-red-600/10",
    description: "Graphics card slot",
    installed: null
  },
  {
    id: "storage",
    name: "M.2 NVMe Slot",
    category: "Storage",
    position: { top: "45%", left: "35%", width: "20%", height: "6%" },
    color: "from-amber-500/20 to-amber-600/10",
    description: "Fast storage - screw down after insertion",
    installed: null
  },
  {
    id: "psu",
    name: "PSU Bay",
    category: "PSU",
    position: { top: "75%", left: "10%", width: "35%", height: "18%" },
    color: "from-yellow-500/20 to-yellow-600/10",
    description: "Power supply - bottom mount",
    installed: null
  },
  {
    id: "case",
    name: "Case Frame",
    category: "Case",
    position: { top: "5%", left: "70%", width: "25%", height: "90%" },
    color: "from-gray-500/20 to-gray-600/10",
    description: "Houses all components",
    installed: null
  },
];

// Challenge definitions
const challenges = [
  {
    id: 1,
    title: "Build Your First Gaming PC",
    description: "Select and install all compatible components to build a high-performance gaming system.",
    objectives: [
      "Install motherboard first as the foundation",
      "Add CPU to the LGA1700 socket",
      "Insert DDR5 RAM into DIMM slots",
      "Mount the CPU cooler",
      "Install GPU in PCIe x16 slot",
      "Add NVMe SSD storage",
      "Connect 850W power supply",
      "Complete the case assembly"
    ],
    xpReward: 200,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Spot the Incompatible Parts",
    description: "Learn to identify components that won't work together. Avoid legacy or underpowered parts!",
    objectives: [
      "Identify DDR3 vs DDR5 RAM",
      "Recognize legacy CPU sockets",
      "Check PSU wattage requirements",
      "Verify PCIe vs AGP compatibility"
    ],
    xpReward: 250,
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "Master Build Order",
    description: "Install components in the optimal sequence for a professional build.",
    objectives: [
      "Motherboard → CPU → RAM → Cooler",
      "GPU → Storage → PSU → Case",
      "Follow proper installation sequence"
    ],
    xpReward: 300,
    difficulty: "Advanced"
  }
];

export default function PCBuilderGame() {
  const { playSound } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [phase, setPhase] = useState<"intro" | "building" | "complete">("intro");
  const [slots, setSlots] = useState<BuildSlot[]>(initialSlots);
  const [components, setComponents] = useState<PCComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PCComponent | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [installOrder, setInstallOrder] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);

  // Shuffle and set components
  const initializeGame = useCallback(() => {
    const shuffled = [...allComponents].sort(() => Math.random() - 0.5);
    setComponents(shuffled);
    setSlots(initialSlots.map(s => ({ ...s, installed: null })));
    setSelectedComponent(null);
    setFeedback(null);
    setErrors([]);
    setInstallOrder([]);
    setStreak(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame, currentChallenge]);

  // Handle component selection
  const selectComponent = (component: PCComponent) => {
    if (phase !== "building") return;
    setSelectedComponent(component);
    playSound?.("click");
    
    // Show guidance about this component
    setFeedback({
      type: "info",
      message: `${component.name} - Click on the matching slot to install.`
    });
  };

  // Handle slot click to install component
  const installInSlot = (slot: BuildSlot) => {
    if (phase !== "building" || !selectedComponent) return;

    // Check if slot is already filled
    if (slot.installed) {
      setFeedback({ type: "error", message: `${slot.name} already has a component installed!` });
      playSound?.("error");
      return;
    }

    // Check category match
    if (selectedComponent.category !== slot.category) {
      setFeedback({ 
        type: "error", 
        message: `❌ ${selectedComponent.name} doesn't fit in ${slot.name}! It needs a ${selectedComponent.category} slot.` 
      });
      setErrors(prev => [...prev, `Wrong slot: ${selectedComponent.name}`]);
      setStreak(0);
      playSound?.("error");
      return;
    }

    // Check compatibility
    if (!selectedComponent.isCompatible) {
      setFeedback({ 
        type: "error", 
        message: `❌ INCOMPATIBLE: ${selectedComponent.description}` 
      });
      setErrors(prev => [...prev, `Incompatible: ${selectedComponent.name}`]);
      setStreak(0);
      playSound?.("error");
      return;
    }

    // Check install order for advanced challenge
    if (currentChallenge === 2) {
      const expectedOrder = ["motherboard", "cpu", "ram", "cooler", "gpu", "storage", "psu", "case"];
      const nextExpected = expectedOrder[installOrder.length];
      if (slot.id !== nextExpected) {
        const expectedSlot = initialSlots.find(s => s.id === nextExpected);
        setFeedback({ 
          type: "error", 
          message: `⚠️ Build order matters! Install ${expectedSlot?.category} first.` 
        });
        setErrors(prev => [...prev, `Wrong order`]);
        setStreak(0);
        playSound?.("error");
        return;
      }
    }

    // Success! Install the component
    setSlots(prev => prev.map(s => 
      s.id === slot.id ? { ...s, installed: selectedComponent } : s
    ));
    setComponents(prev => prev.filter(c => c.id !== selectedComponent.id));
    setInstallOrder(prev => [...prev, slot.id]);
    
    const bonusPoints = streak > 0 ? streak * 5 : 0;
    const points = 15 + bonusPoints;
    setScore(prev => prev + points);
    setStreak(prev => prev + 1);
    
    setFeedback({ 
      type: "success", 
      message: `✅ ${selectedComponent.name} installed! ${selectedComponent.specs}` 
    });
    playSound?.("success");
    setSelectedComponent(null);

    // Check for game completion
    const updatedSlots = slots.map(s => 
      s.id === slot.id ? { ...s, installed: selectedComponent } : s
    );
    const allInstalled = updatedSlots.every(s => s.installed !== null);
    const allCompatible = updatedSlots.every(s => s.installed?.isCompatible);

    if (allInstalled && allCompatible) {
      setTimeout(() => {
        setPhase("complete");
        const bonus = Math.max(0, 100 - errors.length * 20);
        setScore(prev => prev + challenges[currentChallenge].xpReward + bonus);
        playSound?.("levelUp");
      }, 500);
    }
  };

  const resetGame = () => {
    initializeGame();
    setPhase("building");
    setShowTutorial(false);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      initializeGame();
      setPhase("intro");
    }
  };

  const installedCount = slots.filter(s => s.installed !== null).length;
  const progress = (installedCount / slots.length) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            🖥️ PC Builder Lab
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            Challenge {currentChallenge + 1}: {challenges[currentChallenge].title}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Zap className="w-3 h-3 mr-1" />
            {score} XP
          </Badge>
          {streak > 1 && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 animate-pulse">
              🔥 {streak}x
            </Badge>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="w-5 h-5 text-primary" />
                  {challenges[currentChallenge].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {challenges[currentChallenge].description}
                </p>

                <div className="bg-card/50 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    Objectives:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {challenges[currentChallenge].objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {challenges[currentChallenge].difficulty}
                  </Badge>
                  <span className="text-sm font-bold text-primary">
                    +{challenges[currentChallenge].xpReward} XP
                  </span>
                </div>

                <Button onClick={() => setPhase("building")} className="w-full" size="lg">
                  Start Building <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* BUILDING PHASE */}
        {phase === "building" && (
          <motion.div
            key="building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Tutorial Tip */}
            {showTutorial && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-info/10 border border-info/30 rounded-lg p-3 flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <strong>How to build:</strong> Click a component below to select it, then click the matching slot in the PC case to install. Match colors and watch for compatibility!
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setShowTutorial(false)}>
                  Got it
                </Button>
              </motion.div>
            )}

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Build Progress</span>
                <span className="font-semibold text-primary">{installedCount}/{slots.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Main Build Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* PC Case Visualization */}
              <Card className="lg:col-span-3 bg-gradient-to-b from-muted/30 to-muted/10 border-2">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    PC Case - Click slots to install
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border-4 border-gray-700 overflow-hidden">
                    {/* Slot positions */}
                    {slots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        className={`absolute rounded-md border-2 cursor-pointer transition-all overflow-hidden ${
                          slot.installed
                            ? 'border-success bg-success/20'
                            : selectedComponent?.category === slot.category
                              ? 'border-primary bg-primary/30 animate-pulse'
                              : hoveredSlot === slot.id
                                ? 'border-accent bg-accent/20'
                                : 'border-dashed border-gray-500 bg-gradient-to-br ' + slot.color
                        }`}
                        style={{
                          top: slot.position.top,
                          left: slot.position.left,
                          width: slot.position.width,
                          height: slot.position.height,
                        }}
                        onClick={() => installInSlot(slot)}
                        onMouseEnter={() => setHoveredSlot(slot.id)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        whileHover={{ scale: selectedComponent ? 1.02 : 1 }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                          {slot.installed ? (
                            <>
                              <span className="text-lg sm:text-2xl">{slot.installed.icon}</span>
                              <span className="text-[8px] sm:text-[10px] font-medium text-success line-clamp-1 px-1">
                                {slot.installed.name.split(' ').slice(0, 2).join(' ')}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] sm:text-xs font-medium text-gray-300 line-clamp-1">{slot.name}</span>
                              <span className="text-[8px] text-gray-400 hidden sm:block line-clamp-1">{slot.description}</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Case decoration */}
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-red-500/50" />
                  </div>
                </CardContent>
              </Card>

              {/* Component Inventory */}
              <Card className="lg:col-span-2">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Components ({components.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-1">
                    {components.map((component) => (
                      <motion.div
                        key={component.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectComponent(component)}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          selectedComponent?.id === component.id
                            ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
                            : !component.isCompatible
                              ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50'
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl flex-shrink-0">{component.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-medium text-xs line-clamp-1">{component.name}</p>
                              {!component.isCompatible && (
                                <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{component.specs}</p>
                          </div>
                          {selectedComponent?.id === component.id && (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {components.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        All components installed! 🎉
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Panel */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    feedback.type === 'success' ? 'bg-success/10 border border-success/30 text-success' :
                    feedback.type === 'error' ? 'bg-destructive/10 border border-destructive/30 text-destructive' :
                    'bg-info/10 border border-info/30 text-info'
                  }`}
                >
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Count */}
            {errors.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="w-3 h-3" />
                {errors.length} mistake{errors.length > 1 ? 's' : ''} made
              </div>
            )}

            {/* Reset Button */}
            <Button variant="outline" size="sm" onClick={resetGame} className="w-full">
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset Build
            </Button>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/30">
              <CardContent className="py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Trophy className="w-12 h-12 mx-auto text-warning mb-3" />
                </motion.div>

                <h2 className="text-xl font-bold mb-2">🎉 PC Build Complete!</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  You successfully assembled a gaming PC!
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-card/50 rounded-lg p-2">
                    <p className="text-xl font-bold text-primary">{score}</p>
                    <p className="text-[10px] text-muted-foreground">Total XP</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-2">
                    <p className="text-xl font-bold text-success">8/8</p>
                    <p className="text-[10px] text-muted-foreground">Parts</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-2">
                    <p className="text-xl font-bold text-warning">{Math.max(0, 3 - errors.length)}/3</p>
                    <p className="text-[10px] text-muted-foreground">Stars</p>
                  </div>
                </div>

                <div className="bg-card/50 rounded-lg p-3 text-left mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    What You Learned:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• PC components: CPU, RAM, GPU, Storage, PSU</li>
                    <li>• DDR5 vs DDR3 memory compatibility</li>
                    <li>• LGA1700 socket for modern Intel CPUs</li>
                    <li>• PSU wattage requirements (850W for RTX 4080)</li>
                    <li>• Proper build order for assembly</li>
                  </ul>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={resetGame}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Rebuild
                  </Button>
                  {currentChallenge < challenges.length - 1 && (
                    <Button size="sm" onClick={nextChallenge}>
                      Next Challenge
                      <ArrowRight className="w-3 h-3 ml-1" />
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
