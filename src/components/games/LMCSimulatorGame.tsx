import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { 
  Play, Pause, RotateCcw, Cpu, ArrowRight, CheckCircle, 
  Lightbulb, Zap, HardDrive, Binary, Calculator
} from "lucide-react";

interface LMCInstruction {
  mnemonic: string;
  opcode: string;
  description: string;
  example: string;
}

const LMC_INSTRUCTIONS: LMCInstruction[] = [
  { mnemonic: "INP", opcode: "901", description: "Input - Read value into accumulator", example: "INP" },
  { mnemonic: "OUT", opcode: "902", description: "Output - Display accumulator value", example: "OUT" },
  { mnemonic: "LDA", opcode: "5XX", description: "Load - Copy memory to accumulator", example: "LDA 50" },
  { mnemonic: "STA", opcode: "3XX", description: "Store - Copy accumulator to memory", example: "STA 50" },
  { mnemonic: "ADD", opcode: "1XX", description: "Add - Add memory to accumulator", example: "ADD 51" },
  { mnemonic: "SUB", opcode: "2XX", description: "Subtract - Subtract memory from accumulator", example: "SUB 51" },
  { mnemonic: "BRP", opcode: "8XX", description: "Branch if Positive - Jump if acc >= 0", example: "BRP 10" },
  { mnemonic: "BRZ", opcode: "7XX", description: "Branch if Zero - Jump if acc = 0", example: "BRZ 10" },
  { mnemonic: "BRA", opcode: "6XX", description: "Branch Always - Unconditional jump", example: "BRA 0" },
  { mnemonic: "HLT", opcode: "000", description: "Halt - Stop execution", example: "HLT" },
  { mnemonic: "DAT", opcode: "XXX", description: "Data - Reserve memory location", example: "DAT 5" },
];

interface LMCChallenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  inputs: number[];
  expectedOutput: number[];
  starterCode: string[];
  hint: string;
  solution: string[];
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const challenges: LMCChallenge[] = [
  {
    id: "1",
    title: "Hello Output",
    description: "Your first LMC program!",
    goal: "Output the number 42",
    inputs: [],
    expectedOutput: [42],
    starterCode: ["LDA answer", "???", "HLT", "answer DAT 42"],
    hint: "Use OUT to display the accumulator value",
    solution: ["LDA answer", "OUT", "HLT", "answer DAT 42"],
    explanation: "LDA loads 42 into accumulator, OUT displays it. Simple but fundamental!",
    difficulty: "beginner"
  },
  {
    id: "2",
    title: "Input Echo",
    description: "Read a number and output it",
    goal: "Read input, display it back",
    inputs: [25],
    expectedOutput: [25],
    starterCode: ["???", "OUT", "HLT"],
    hint: "INP reads user input into the accumulator",
    solution: ["INP", "OUT", "HLT"],
    explanation: "INP reads input to accumulator, OUT displays it. The fetch-execute cycle in action!",
    difficulty: "beginner"
  },
  {
    id: "3",
    title: "Add Two Numbers",
    description: "Read two numbers and output their sum",
    goal: "Input two numbers, output their sum",
    inputs: [15, 27],
    expectedOutput: [42],
    starterCode: ["INP", "STA first", "INP", "??? first", "OUT", "HLT", "first DAT 0"],
    hint: "After storing first number, input second, then ADD the stored value",
    solution: ["INP", "STA first", "INP", "ADD first", "OUT", "HLT", "first DAT 0"],
    explanation: "Store first input, get second (now in acc), ADD retrieves and adds stored value!",
    difficulty: "beginner"
  },
  {
    id: "4",
    title: "Subtract Numbers",
    description: "Calculate the difference between two numbers",
    goal: "Output first input minus second input",
    inputs: [50, 17],
    expectedOutput: [33],
    starterCode: ["INP", "STA first", "INP", "STA second", "LDA first", "??? second", "OUT", "HLT", "first DAT 0", "second DAT 0"],
    hint: "Load first, then SUB second",
    solution: ["INP", "STA first", "INP", "STA second", "LDA first", "SUB second", "OUT", "HLT", "first DAT 0", "second DAT 0"],
    explanation: "Store both inputs, load first, subtract second. Order matters in subtraction!",
    difficulty: "intermediate"
  },
  {
    id: "5",
    title: "Countdown Loop",
    description: "Count down from input to zero",
    goal: "Output numbers from N down to 0",
    inputs: [3],
    expectedOutput: [3, 2, 1, 0],
    starterCode: ["INP", "loop OUT", "STA count", "SUB one", "BRP loop", "HLT", "count DAT 0", "one DAT 1"],
    hint: "BRP branches while accumulator is positive or zero",
    solution: ["INP", "loop OUT", "SUB one", "BRP loop", "HLT", "one DAT 1"],
    explanation: "Output, subtract 1, loop while non-negative. BRP is your loop condition!",
    difficulty: "intermediate"
  },
  {
    id: "6",
    title: "Max of Two",
    description: "Find the larger of two numbers",
    goal: "Output the larger input",
    inputs: [45, 72],
    expectedOutput: [72],
    starterCode: ["INP", "STA a", "INP", "STA b", "SUB a", "BRP bwin", "LDA a", "BRA done", "bwin LDA b", "done OUT", "HLT", "a DAT 0", "b DAT 0"],
    hint: "If b-a >= 0, then b >= a",
    solution: ["INP", "STA a", "INP", "STA b", "SUB a", "BRP bwin", "LDA a", "BRA done", "bwin LDA b", "done OUT", "HLT", "a DAT 0", "b DAT 0"],
    explanation: "Subtract a from b: if result >= 0, b is larger. Branching implements if-else logic!",
    difficulty: "advanced"
  },
];

interface CPUState {
  accumulator: number;
  programCounter: number;
  memoryAddressRegister: number;
  memoryDataRegister: number;
  currentInstructionRegister: string;
  memory: number[];
  output: number[];
  halted: boolean;
  inputQueue: number[];
}

const LMCSimulatorGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentChallengeIndex, setChallengeIndex] = useState(0);
  const [userCode, setUserCode] = useState<string[]>([]);
  const [cpuState, setCpuState] = useState<CPUState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);

  const challenge = challenges[currentChallengeIndex];

  const initializeCPU = useCallback(() => {
    const memory = new Array(100).fill(0);
    // Parse and load program
    setUserCode([...challenge.starterCode]);
    setCpuState({
      accumulator: 0,
      programCounter: 0,
      memoryAddressRegister: 0,
      memoryDataRegister: 0,
      currentInstructionRegister: "",
      memory,
      output: [],
      halted: false,
      inputQueue: [...challenge.inputs]
    });
    setStep(0);
    setChallengeComplete(false);
    setShowHint(false);
  }, [challenge]);

  const startChallenge = () => {
    setShowInstructions(false);
    initializeCPU();
  };

  const runSolution = () => {
    // Simulate running the solution
    const outputs: number[] = [];
    let acc = 0;
    const inputs = [...challenge.inputs];
    const memory: Record<string, number> = {};
    
    // Parse solution
    const solution = challenge.solution;
    let pc = 0;
    const labels: Record<string, number> = {};
    
    // First pass: find labels
    solution.forEach((line, idx) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 1 && !LMC_INSTRUCTIONS.some(i => i.mnemonic === parts[0])) {
        labels[parts[0]] = idx;
      }
    });
    
    // Simple execution (limited steps for safety)
    for (let i = 0; i < 100 && pc < solution.length; i++) {
      const line = solution[pc].trim();
      const parts = line.split(/\s+/);
      let cmd = parts[0];
      let operand = parts[1];
      
      // Handle labels
      if (parts.length > 1 && !LMC_INSTRUCTIONS.some(i => i.mnemonic === parts[0])) {
        cmd = parts[1];
        operand = parts[2];
        if (cmd === "DAT") {
          memory[parts[0]] = parseInt(operand) || 0;
          pc++;
          continue;
        }
      }
      
      switch (cmd) {
        case "INP":
          acc = inputs.shift() || 0;
          break;
        case "OUT":
          outputs.push(acc);
          break;
        case "LDA":
          acc = memory[operand] || 0;
          break;
        case "STA":
          memory[operand] = acc;
          break;
        case "ADD":
          acc += memory[operand] || 0;
          break;
        case "SUB":
          acc -= memory[operand] || 0;
          break;
        case "BRP":
          if (acc >= 0) {
            pc = labels[operand] || 0;
            continue;
          }
          break;
        case "BRZ":
          if (acc === 0) {
            pc = labels[operand] || 0;
            continue;
          }
          break;
        case "BRA":
          pc = labels[operand] || 0;
          continue;
        case "HLT":
          pc = solution.length;
          continue;
        case "DAT":
          // Data definition
          break;
      }
      pc++;
    }
    
    // Check if outputs match
    const success = JSON.stringify(outputs) === JSON.stringify(challenge.expectedOutput);
    
    if (success) {
      playSound("success");
      setScore(s => s + (showHint ? 15 : 25));
      setChallengeComplete(true);
      addXp(20);
    } else {
      playSound("error");
    }
    
    setCpuState(prev => prev ? { ...prev, output: outputs, halted: true } : null);
    setIsRunning(false);
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setChallengeIndex(i => i + 1);
      initializeCPU();
    }
  };

  const resetChallenge = () => {
    initializeCPU();
    setIsRunning(false);
  };

  if (showInstructions) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              Little Man Computer (LMC)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              The LMC is a simplified model of a computer that teaches how CPUs work. 
              Imagine a little man in a room with 100 mailboxes (memory), a calculator (accumulator), 
              and input/output trays!
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <HardDrive className="w-4 h-4 text-primary" />
                  CPU Components
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">ACC</Badge>
                    <span>Accumulator - holds current value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">PC</Badge>
                    <span>Program Counter - next instruction address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">MAR</Badge>
                    <span>Memory Address Register</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">MDR</Badge>
                    <span>Memory Data Register</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-bold flex items-center gap-2 mb-3">
                  <Binary className="w-4 h-4 text-accent" />
                  Key Instructions
                </h4>
                <div className="space-y-1 text-sm font-mono">
                  {LMC_INSTRUCTIONS.slice(0, 6).map(inst => (
                    <div key={inst.mnemonic} className="flex gap-2">
                      <span className="text-primary font-bold w-10">{inst.mnemonic}</span>
                      <span className="text-muted-foreground">{inst.description.split(" - ")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-accent" />
                Fetch-Decode-Execute Cycle
              </h4>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge>1. Fetch</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge variant="secondary">2. Decode</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge variant="outline">3. Execute</Badge>
                <ArrowRight className="w-4 h-4" />
                <span className="text-muted-foreground">Repeat!</span>
              </div>
            </div>
            
            <Button onClick={startChallenge} size="lg" className="w-full gap-2">
              <Play className="w-5 h-5" />
              Start LMC Challenges
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const difficultyColors = {
    beginner: "bg-success/20 text-success",
    intermediate: "bg-warning/20 text-warning",
    advanced: "bg-destructive/20 text-destructive"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Challenge {currentChallengeIndex + 1}/{challenges.length}
          </Badge>
          <Badge className={difficultyColors[challenge.difficulty]}>
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <span className="font-bold">{score} pts</span>
        </div>
      </div>
      
      <Progress value={((currentChallengeIndex + 1) / challenges.length) * 100} className="h-2" />

      {/* Challenge Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            {challenge.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{challenge.description}</p>
          
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <p className="font-bold text-primary">Goal: {challenge.goal}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Inputs: [{challenge.inputs.join(", ")}] → Expected Output: [{challenge.expectedOutput.join(", ")}]
            </p>
          </div>

          {/* Code Display */}
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
              <span className="font-mono text-sm font-bold">LMC Assembly</span>
              <span className="text-xs text-muted-foreground">Fill in the ???</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              {challenge.starterCode.map((line, i) => (
                <div key={i} className={`flex ${line.includes("???") ? "text-warning" : "text-foreground"}`}>
                  <span className="text-muted-foreground w-8">{i}:</span>
                  <span className={line.includes("???") ? "bg-warning/20 px-1 rounded" : ""}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CPU State Visualization */}
          {cpuState && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Accumulator</p>
                <p className="text-2xl font-mono font-bold text-primary">{cpuState.accumulator}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Program Counter</p>
                <p className="text-2xl font-mono font-bold text-accent">{cpuState.programCounter}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Output</p>
                <p className="text-lg font-mono font-bold text-success truncate">
                  [{cpuState.output.join(", ")}]
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className={`text-lg font-bold ${cpuState.halted ? "text-success" : "text-warning"}`}>
                  {cpuState.halted ? "HALTED" : "READY"}
                </p>
              </div>
            </div>
          )}

          {/* Hint */}
          {!showHint && !challengeComplete && (
            <Button variant="outline" onClick={() => setShowHint(true)} className="w-full gap-2">
              <Lightbulb className="w-4 h-4" />
              Show Hint (-10 points)
            </Button>
          )}
          
          <AnimatePresence>
            {showHint && !challengeComplete && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warning/10 border border-warning/30 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  <span className="font-bold text-warning">Hint</span>
                </div>
                <p className="text-sm">{challenge.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {challengeComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-success/10 border border-success/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-bold text-success">Correct!</p>
                    <p className="text-sm text-muted-foreground mt-1">{challenge.explanation}</p>
                    <div className="mt-3 bg-muted/30 rounded p-2">
                      <p className="text-xs text-muted-foreground mb-1">Solution:</p>
                      <code className="text-xs font-mono text-success">
                        {challenge.solution.join(" → ")}
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetChallenge} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            {!challengeComplete ? (
              <Button onClick={runSolution} disabled={isRunning} className="flex-1 gap-2">
                <Play className="w-4 h-4" />
                Run Solution
              </Button>
            ) : (
              <Button onClick={nextChallenge} className="flex-1 gap-2">
                {currentChallengeIndex < challenges.length - 1 ? "Next Challenge" : "Complete!"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMCSimulatorGame;
