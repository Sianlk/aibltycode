import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { CheckCircle, XCircle, Users, Database, Workflow, Shield, AlertTriangle, Lightbulb, ArrowRight, HelpCircle } from 'lucide-react';

interface SystemComponent {
  id: string;
  name: string;
  type: 'stakeholder' | 'process' | 'data' | 'control';
  icon: React.ReactNode;
  description: string;
  whyNeeded: string;
}

interface BuildStep {
  question: string;
  hint: string;
  correctComponent: string;
  explanation: string;
}

interface Challenge {
  id: string;
  scenario: string;
  goal: string;
  availableComponents: SystemComponent[];
  buildSteps: BuildStep[];
  finalExplanation: string;
}

const challenges: Challenge[] = [
  {
    id: '1',
    scenario: 'A library needs a system to track book loans. Members borrow books, and librarians need to know who has what.',
    goal: 'Build a loan tracking system step by step.',
    availableComponents: [
      { id: 'librarian', name: 'Librarian', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Manages books and loans', whyNeeded: 'Librarians are the main users who operate the system daily.' },
      { id: 'member', name: 'Library Member', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Borrows books', whyNeeded: 'Members are why the system exists - they borrow the books!' },
      { id: 'checkout', name: 'Checkout Process', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Records when books are borrowed', whyNeeded: 'Without a checkout process, loans cannot be recorded.' },
      { id: 'book_db', name: 'Book Database', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores all book information', whyNeeded: 'You need to know what books exist before lending them.' },
      { id: 'loan_db', name: 'Loan Records', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Tracks who borrowed what and when', whyNeeded: 'Without loan records, you cannot track overdue books.' },
      { id: 'validation', name: 'Member Validation', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Checks if person is a valid member', whyNeeded: 'Only registered members should be allowed to borrow books.' },
    ],
    buildSteps: [
      { question: 'Who are the main USERS who will borrow books?', hint: 'Think about who actually takes books home...', correctComponent: 'member', explanation: 'Library Members are the primary users. They are the stakeholders who borrow books.' },
      { question: 'Who will OPERATE the system and manage loans?', hint: 'Who works at the library desk?', correctComponent: 'librarian', explanation: 'Librarians operate the system. They check books in/out and help members.' },
      { question: 'Before lending, we need to CHECK if someone can borrow. What control is needed?', hint: 'How do we know someone is allowed to borrow?', correctComponent: 'validation', explanation: 'Member Validation ensures only registered members can borrow. This is a CONTROL that protects the system.' },
      { question: 'What DATA do we need to know what books are available?', hint: 'Where is information about all books stored?', correctComponent: 'book_db', explanation: 'The Book Database stores all book information - titles, authors, availability status.' },
      { question: 'What PROCESS actually records when someone borrows a book?', hint: 'What happens at the desk when you borrow?', correctComponent: 'checkout', explanation: 'The Checkout Process is the workflow that records the loan transaction.' },
      { question: 'Finally, where do we store WHO borrowed WHAT and WHEN?', hint: 'How do we track overdue books?', correctComponent: 'loan_db', explanation: 'Loan Records store all borrowing history. Essential for tracking due dates and overdue items!' },
    ],
    finalExplanation: 'You built a complete library system! Notice the pattern: 1) Identify STAKEHOLDERS (who uses it), 2) Add CONTROLS (validation), 3) Define DATA stores, 4) Create PROCESSES that connect everything.',
  },
  {
    id: '2',
    scenario: 'An online store needs a secure payment system. Customers enter card details, payments are processed, and orders are confirmed.',
    goal: 'Design a secure payment flow step by step.',
    availableComponents: [
      { id: 'customer', name: 'Customer', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Makes purchases', whyNeeded: 'Customers are why the store exists - they buy products!' },
      { id: 'payment_proc', name: 'Payment Processing', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Handles card transactions', whyNeeded: 'This is the core process that actually moves money.' },
      { id: 'order_db', name: 'Order Database', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores order details', whyNeeded: 'Orders must be stored for fulfillment and history.' },
      { id: 'encryption', name: 'Data Encryption', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Secures sensitive card data', whyNeeded: 'Card numbers must be encrypted to prevent theft!' },
      { id: 'fraud_check', name: 'Fraud Detection', type: 'control', icon: <AlertTriangle className="h-4 w-4" />, description: 'Flags suspicious transactions', whyNeeded: 'Stops thieves from using stolen cards.' },
      { id: 'receipt', name: 'Receipt Generation', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Creates purchase confirmation', whyNeeded: 'Customers need proof of their purchase.' },
    ],
    buildSteps: [
      { question: 'Who is the main USER making purchases?', hint: 'Who enters their card details?', correctComponent: 'customer', explanation: 'The Customer is the stakeholder who initiates the payment by making a purchase.' },
      { question: 'Card details are sensitive. What CONTROL protects this data?', hint: 'How do we scramble the data so thieves cannot read it?', correctComponent: 'encryption', explanation: 'Encryption scrambles data so only authorized systems can read it. Essential for card security!' },
      { question: 'Before processing payment, what CONTROL detects stolen cards?', hint: 'What flags unusual purchasing patterns?', correctComponent: 'fraud_check', explanation: 'Fraud Detection analyzes patterns to catch stolen cards before processing. Controls come BEFORE processing!' },
      { question: 'Now we can safely run the payment. What PROCESS handles the transaction?', hint: 'What actually charges the card?', correctComponent: 'payment_proc', explanation: 'Payment Processing is the core workflow that communicates with banks to charge the card.' },
      { question: 'Where do we store the order for fulfillment?', hint: 'What DATA store holds order information?', correctComponent: 'order_db', explanation: 'The Order Database stores all order details - items, amounts, shipping info.' },
      { question: 'Finally, what confirms the purchase to the customer?', hint: 'What PROCESS creates the confirmation email?', correctComponent: 'receipt', explanation: 'Receipt Generation sends confirmation. Always end with user feedback!' },
    ],
    finalExplanation: 'Great payment system! KEY INSIGHT: Security controls (encryption, fraud check) must come BEFORE processing sensitive data. This is a fundamental security principle!',
  },
  {
    id: '3',
    scenario: 'A hospital needs an appointment booking system. Patients book appointments, doctors see their schedules, and patient privacy must be protected.',
    goal: 'Build a healthcare appointment system with privacy protection.',
    availableComponents: [
      { id: 'patient', name: 'Patient', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Books medical appointments', whyNeeded: 'Patients are the primary users who need healthcare.' },
      { id: 'doctor', name: 'Doctor', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Provides medical care', whyNeeded: 'Doctors need to see their schedules and patient info.' },
      { id: 'receptionist', name: 'Receptionist', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Manages the schedule', whyNeeded: 'Receptionists coordinate between patients and doctors.' },
      { id: 'booking', name: 'Booking Process', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Schedules appointments', whyNeeded: 'The core workflow that creates appointments.' },
      { id: 'patient_db', name: 'Patient Records', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores medical information', whyNeeded: 'Doctors need patient history for proper care.' },
      { id: 'access_ctrl', name: 'Access Control', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Limits who can see what data', whyNeeded: 'Medical data is private - only authorized staff should see it!' },
      { id: 'reminder', name: 'Reminder System', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Sends appointment reminders', whyNeeded: 'Reduces missed appointments by reminding patients.' },
    ],
    buildSteps: [
      { question: 'Who is the primary user seeking medical care?', hint: 'Who needs to see a doctor?', correctComponent: 'patient', explanation: 'Patients are the main stakeholders. The system exists to help them get care.' },
      { question: 'Who provides the medical care?', hint: 'Who do patients come to see?', correctComponent: 'doctor', explanation: 'Doctors are key stakeholders. They need to see schedules and patient histories.' },
      { question: 'Who coordinates between patients and doctors?', hint: 'Who answers the phone and manages schedules?', correctComponent: 'receptionist', explanation: 'Receptionists manage the day-to-day scheduling operations.' },
      { question: 'Medical records are VERY private. What CONTROL protects them?', hint: 'How do we ensure only the right people see patient data?', correctComponent: 'access_ctrl', explanation: 'Access Control is CRITICAL in healthcare. Laws like HIPAA require strict data protection!' },
      { question: 'What PROCESS actually creates the appointment?', hint: 'What workflow schedules the visit?', correctComponent: 'booking', explanation: 'The Booking Process handles scheduling logic - checking availability, assigning times.' },
      { question: 'Where is patient medical history stored?', hint: 'What DATA store holds health records?', correctComponent: 'patient_db', explanation: 'Patient Records store medical history. Protected by Access Control!' },
      { question: 'How do we reduce no-shows?', hint: 'What PROCESS notifies patients before appointments?', correctComponent: 'reminder', explanation: 'Reminder System reduces missed appointments by 30-50%. Always consider user experience!' },
    ],
    finalExplanation: 'Excellent healthcare system! KEY TAKEAWAY: In healthcare (and any sensitive system), Access Control is not optional - it is legally required. Always ask: "Who should see this data?"',
  }
];

const SystemBuilderGame: React.FC = () => {
  const { playSound } = useGame();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [builtComponents, setBuiltComponents] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentChallengeIndex];
  const currentStep = challenge.buildSteps[currentStepIndex];
  const overallProgress = ((currentChallengeIndex * 100) + ((currentStepIndex + 1) / challenge.buildSteps.length * 100)) / challenges.length;

  const handleComponentSelect = (id: string) => {
    if (showFeedback || builtComponents.includes(id)) return;
    setSelectedComponent(id);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!selectedComponent) return;
    
    const correct = selectedComponent === currentStep.correctComponent;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(s => s + 10);
      setBuiltComponents([...builtComponents, selectedComponent]);
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const nextStep = () => {
    if (currentStepIndex < challenge.buildSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setSelectedComponent(null);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      setChallengeComplete(true);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setCurrentStepIndex(0);
      setSelectedComponent(null);
      setBuiltComponents([]);
      setShowFeedback(false);
      setShowHint(false);
      setChallengeComplete(false);
    } else {
      setGameComplete(true);
      playSound('success');
    }
  };

  const resetGame = () => {
    setCurrentChallengeIndex(0);
    setCurrentStepIndex(0);
    setSelectedComponent(null);
    setBuiltComponents([]);
    setShowFeedback(false);
    setShowHint(false);
    setScore(0);
    setChallengeComplete(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-4">Systems Architect!</h2>
        <p className="text-xl text-muted-foreground mb-4">
          You scored {score} points
        </p>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You've learned how to build systems step-by-step: identify stakeholders, add controls, define data stores, and create processes!
        </p>
        <Button onClick={resetGame} size="lg">Build Again</Button>
      </motion.div>
    );
  }

  if (challengeComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">System Complete!</h3>
              <p className="text-muted-foreground">{challenge.scenario}</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 mb-6">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Key Learning
              </h4>
              <p className="text-muted-foreground">{challenge.finalExplanation}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Your System Components:</h4>
              <div className="flex flex-wrap gap-2">
                {builtComponents.map((compId, index) => {
                  const comp = challenge.availableComponents.find(c => c.id === compId);
                  return (
                    <motion.div
                      key={compId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Badge variant="outline" className="gap-1">
                        {comp?.icon}
                        {comp?.name}
                      </Badge>
                      {index < builtComponents.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={nextChallenge} size="lg">
                {currentChallengeIndex < challenges.length - 1 ? 'Next Challenge' : 'Complete Game'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stakeholder': return 'bg-primary/20 border-primary text-primary';
      case 'process': return 'bg-accent/20 border-accent text-accent';
      case 'data': return 'bg-success/20 border-success text-success';
      case 'control': return 'bg-warning/20 border-warning text-warning';
      default: return 'bg-muted';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'stakeholder': return 'bg-primary/10 text-primary';
      case 'process': return 'bg-accent/10 text-accent';
      case 'data': return 'bg-success/10 text-success';
      case 'control': return 'bg-warning/10 text-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Challenge {currentChallengeIndex + 1}/{challenges.length} • Step {currentStepIndex + 1}/{challenge.buildSteps.length}
          </p>
          <Progress value={overallProgress} className="w-40 h-2" />
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1">
          Score: {score}
        </Badge>
      </div>

      {/* Scenario Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-warning" />
            Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{challenge.scenario}</p>
        </CardContent>
      </Card>

      {/* Built So Far */}
      {builtComponents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Built:</span>
          {builtComponents.map((compId, index) => {
            const comp = challenge.availableComponents.find(c => c.id === compId);
            return (
              <React.Fragment key={compId}>
                <Badge variant="secondary" className="gap-1">
                  {comp?.icon}
                  {comp?.name}
                </Badge>
                {index < builtComponents.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Current Question */}
      <Card className="border-primary/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-medium">{currentStep.question}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="shrink-0"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Hint
              </Button>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground"
                >
                  💡 {currentStep.hint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Component Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {challenge.availableComponents.map(comp => {
                const isBuilt = builtComponents.includes(comp.id);
                const isSelected = selectedComponent === comp.id;
                
                return (
                  <motion.button
                    key={comp.id}
                    whileHover={!isBuilt ? { scale: 1.02 } : {}}
                    whileTap={!isBuilt ? { scale: 0.98 } : {}}
                    onClick={() => handleComponentSelect(comp.id)}
                    disabled={isBuilt || showFeedback}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isBuilt
                        ? 'bg-muted/50 border-muted opacity-50 cursor-not-allowed'
                        : isSelected
                        ? getTypeColor(comp.type)
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {comp.icon}
                      <span className="font-medium text-sm">{comp.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.description}</p>
                    <Badge variant="outline" className={`mt-2 text-xs ${getTypeBadgeColor(comp.type)}`}>
                      {comp.type}
                    </Badge>
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline" className="bg-primary/10">👥 Stakeholder</Badge>
              <Badge variant="outline" className="bg-accent/10">⚙️ Process</Badge>
              <Badge variant="outline" className="bg-success/10">💾 Data</Badge>
              <Badge variant="outline" className="bg-warning/10">🛡️ Control</Badge>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-lg p-4 ${isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium mb-1">
                        {isCorrect ? 'Correct!' : 'Not quite...'}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentStep.explanation}</p>
                      {!isCorrect && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">The right answer was: </span>
                          {challenge.availableComponents.find(c => c.id === currentStep.correctComponent)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {!showFeedback ? (
                <Button 
                  onClick={checkAnswer} 
                  disabled={!selectedComponent}
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  {currentStepIndex < challenge.buildSteps.length - 1 ? 'Next Step' : 'Complete System'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemBuilderGame;