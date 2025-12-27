import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, RotateCcw, Users, Box, ArrowRight, Lightbulb } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface UseCaseScenario {
  id: string;
  title: string;
  description: string;
  actors: string[];
  useCases: string[];
  correctConnections: { actor: string; useCase: string }[];
  hint: string;
  explanation: string;
}

const scenarios: UseCaseScenario[] = [
  {
    id: "library",
    title: "Library System",
    description: "Create connections between actors and their use cases for a library management system.",
    actors: ["Librarian", "Member", "System"],
    useCases: ["Borrow Book", "Return Book", "Add Book", "Search Catalog", "Send Reminder"],
    correctConnections: [
      { actor: "Member", useCase: "Borrow Book" },
      { actor: "Member", useCase: "Return Book" },
      { actor: "Member", useCase: "Search Catalog" },
      { actor: "Librarian", useCase: "Add Book" },
      { actor: "Librarian", useCase: "Search Catalog" },
      { actor: "System", useCase: "Send Reminder" },
    ],
    hint: "Think about WHO performs each action. Members interact with books, Librarians manage inventory.",
    explanation: "Members borrow/return/search. Librarians add books and search. System automatically sends reminders.",
  },
  {
    id: "atm",
    title: "ATM System",
    description: "Connect actors to their use cases in a bank ATM system.",
    actors: ["Customer", "Bank", "Technician"],
    useCases: ["Withdraw Cash", "Check Balance", "Transfer Funds", "Maintain Machine", "Verify PIN"],
    correctConnections: [
      { actor: "Customer", useCase: "Withdraw Cash" },
      { actor: "Customer", useCase: "Check Balance" },
      { actor: "Customer", useCase: "Transfer Funds" },
      { actor: "Technician", useCase: "Maintain Machine" },
      { actor: "Bank", useCase: "Verify PIN" },
    ],
    hint: "Customers use the ATM for transactions. The bank verifies security. Technicians fix problems.",
    explanation: "Customers perform transactions. Bank handles verification. Technicians maintain hardware.",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Platform",
    description: "Map actors to use cases for an online shopping system.",
    actors: ["Shopper", "Admin", "Payment Gateway"],
    useCases: ["Browse Products", "Add to Cart", "Checkout", "Manage Inventory", "Process Payment"],
    correctConnections: [
      { actor: "Shopper", useCase: "Browse Products" },
      { actor: "Shopper", useCase: "Add to Cart" },
      { actor: "Shopper", useCase: "Checkout" },
      { actor: "Admin", useCase: "Manage Inventory" },
      { actor: "Payment Gateway", useCase: "Process Payment" },
    ],
    hint: "Shoppers interact with products. Admins manage the store. Payment systems handle money.",
    explanation: "Shoppers browse and buy. Admins control inventory. Payment gateway processes transactions.",
  },
  {
    id: "hospital",
    title: "Hospital Management",
    description: "Connect healthcare actors to their system interactions.",
    actors: ["Doctor", "Patient", "Receptionist"],
    useCases: ["Book Appointment", "View Medical Records", "Prescribe Medicine", "Register Patient", "Check-in"],
    correctConnections: [
      { actor: "Patient", useCase: "Book Appointment" },
      { actor: "Patient", useCase: "Check-in" },
      { actor: "Doctor", useCase: "View Medical Records" },
      { actor: "Doctor", useCase: "Prescribe Medicine" },
      { actor: "Receptionist", useCase: "Register Patient" },
    ],
    hint: "Patients book and check-in. Doctors treat and prescribe. Receptionists handle admin.",
    explanation: "Patients manage appointments. Doctors access records and prescribe. Receptionists register patients.",
  },
];

export default function UseCaseDiagramGame() {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [connections, setConnections] = useState<{ actor: string; useCase: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const scenario = scenarios[currentIndex];

  const handleActorClick = (actor: string) => {
    setSelectedActor(selectedActor === actor ? null : actor);
    playSound?.("click");
  };

  const handleUseCaseClick = (useCase: string) => {
    if (!selectedActor) return;

    const existingConnection = connections.find(
      (c) => c.actor === selectedActor && c.useCase === useCase
    );

    if (existingConnection) {
      setConnections(connections.filter((c) => c !== existingConnection));
      playSound?.("click");
    } else {
      setConnections([...connections, { actor: selectedActor, useCase }]);
      playSound?.("click");
    }
  };

  const checkAnswer = () => {
    const correct = scenario.correctConnections;
    let correctCount = 0;

    connections.forEach((conn) => {
      if (correct.some((c) => c.actor === conn.actor && c.useCase === conn.useCase)) {
        correctCount++;
      }
    });

    // Penalize wrong connections
    const wrongConnections = connections.filter(
      (conn) => !correct.some((c) => c.actor === conn.actor && c.useCase === conn.useCase)
    ).length;

    const finalScore = Math.max(0, correctCount - wrongConnections);
    const maxScore = correct.length;
    const percentage = Math.round((finalScore / maxScore) * 100);

    setTotalCorrect((prev) => prev + correctCount);
    setScore(percentage);
    setShowResult(true);

    if (percentage >= 80) {
      playSound?.("success");
    } else {
      playSound?.("error");
    }
  };

  const nextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setConnections([]);
      setSelectedActor(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setConnections([]);
    setSelectedActor(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setTotalCorrect(0);
  };

  const getActorColor = (actor: string) => {
    const colors: Record<string, string> = {
      Librarian: "bg-blue-500",
      Member: "bg-green-500",
      System: "bg-purple-500",
      Customer: "bg-orange-500",
      Bank: "bg-indigo-500",
      Technician: "bg-red-500",
      Shopper: "bg-pink-500",
      Admin: "bg-cyan-500",
      "Payment Gateway": "bg-yellow-500",
      Doctor: "bg-teal-500",
      Patient: "bg-lime-500",
      Receptionist: "bg-amber-500",
    };
    return colors[actor] || "bg-gray-500";
  };

  const isConnected = (actor: string, useCase: string) =>
    connections.some((c) => c.actor === actor && c.useCase === useCase);

  const getConnectionsForUseCase = (useCase: string) =>
    connections.filter((c) => c.useCase === useCase);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Scenario {currentIndex + 1} of {scenarios.length}
        </Badge>
        <Badge className="text-lg px-4 py-2 bg-primary">
          {totalCorrect} Correct Connections
        </Badge>
      </div>

      {/* Scenario Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            {scenario.title}
          </CardTitle>
          <p className="text-muted-foreground">{scenario.description}</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Actors Column */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Actors (Click to select)
              </h3>
              <div className="space-y-3">
                {scenario.actors.map((actor) => (
                  <motion.button
                    key={actor}
                    onClick={() => handleActorClick(actor)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      selectedActor === actor
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${getActorColor(actor)} flex items-center justify-center`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">{actor}</span>
                    {selectedActor === actor && (
                      <ArrowRight className="w-5 h-5 ml-auto text-primary animate-pulse" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Use Cases Column */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Box className="w-5 h-5" /> Use Cases (Click to connect)
              </h3>
              <div className="space-y-3">
                {scenario.useCases.map((useCase) => {
                  const useCaseConnections = getConnectionsForUseCase(useCase);
                  return (
                    <motion.button
                      key={useCase}
                      onClick={() => handleUseCaseClick(useCase)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedActor && isConnected(selectedActor, useCase)
                          ? "border-success bg-success/10"
                          : useCaseConnections.length > 0
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Box className="w-8 h-8 text-muted-foreground" />
                          <span className="font-medium">{useCase}</span>
                        </div>
                        {useCaseConnections.length > 0 && (
                          <div className="flex gap-1">
                            {useCaseConnections.map((conn) => (
                              <div
                                key={conn.actor}
                                className={`w-6 h-6 rounded-full ${getActorColor(conn.actor)} flex items-center justify-center`}
                                title={conn.actor}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Connections Summary */}
          {connections.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
              <h4 className="font-semibold mb-2">Your Connections:</h4>
              <div className="flex flex-wrap gap-2">
                {connections.map((conn, i) => (
                  <Badge key={i} variant="secondary" className="text-sm">
                    {conn.actor} → {conn.useCase}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-xl"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm">{scenario.hint}</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button onClick={() => setShowHint(!showHint)} variant="outline" size="sm">
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? "Hide" : "Show"} Hint
            </Button>
            <Button onClick={() => setConnections([])} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={checkAnswer}
              className="ml-auto"
              disabled={connections.length === 0}
            >
              Check Diagram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                {score >= 80 ? (
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-success" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                    <X className="w-10 h-10 text-warning" />
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">
                  {score >= 80 ? "Excellent!" : "Keep Practicing!"}
                </h3>
                <p className="text-4xl font-bold text-primary mb-4">{score}%</p>
                <div className="bg-muted/50 p-4 rounded-xl mb-4 text-left">
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  {currentIndex < scenarios.length - 1 ? (
                    <Button onClick={nextScenario}>Next Scenario</Button>
                  ) : (
                    <Button onClick={resetGame}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
