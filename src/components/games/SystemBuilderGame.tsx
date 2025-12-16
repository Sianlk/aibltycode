import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { CheckCircle, XCircle, Users, Database, Workflow, Shield, AlertTriangle, Lightbulb } from 'lucide-react';

interface SystemComponent {
  id: string;
  name: string;
  type: 'stakeholder' | 'process' | 'data' | 'control';
  icon: React.ReactNode;
  description: string;
}

interface Challenge {
  id: string;
  scenario: string;
  goal: string;
  availableComponents: SystemComponent[];
  correctSolution: string[];
  explanation: string;
  consequences: { good: string; bad: string };
}

const challenges: Challenge[] = [
  {
    id: '1',
    scenario: 'A library needs a system to track book loans.',
    goal: 'Build a loan tracking system with proper stakeholders and data.',
    availableComponents: [
      { id: 'librarian', name: 'Librarian', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Manages books' },
      { id: 'member', name: 'Member', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Borrows books' },
      { id: 'checkout', name: 'Checkout Process', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Records loans' },
      { id: 'book_db', name: 'Book Database', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores book info' },
      { id: 'loan_db', name: 'Loan Records', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Tracks who borrowed what' },
      { id: 'validation', name: 'Member Validation', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Verifies membership' },
    ],
    correctSolution: ['member', 'librarian', 'validation', 'checkout', 'book_db', 'loan_db'],
    explanation: 'A complete loan system needs: stakeholders (librarian, member), validation control, checkout process, and both book and loan data storage.',
    consequences: {
      good: 'Books are tracked properly, overdue items are identified, and member history is maintained.',
      bad: 'Without proper data or validation, books get lost and members borrow without accountability.'
    }
  },
  {
    id: '2',
    scenario: 'An online store needs a secure payment system.',
    goal: 'Design a payment flow with security controls.',
    availableComponents: [
      { id: 'customer', name: 'Customer', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Makes purchases' },
      { id: 'payment_proc', name: 'Payment Processing', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Handles transactions' },
      { id: 'order_db', name: 'Order Database', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores orders' },
      { id: 'encryption', name: 'Data Encryption', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Secures sensitive data' },
      { id: 'fraud_check', name: 'Fraud Detection', type: 'control', icon: <AlertTriangle className="h-4 w-4" />, description: 'Flags suspicious activity' },
      { id: 'receipt', name: 'Receipt Generation', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Creates confirmation' },
    ],
    correctSolution: ['customer', 'encryption', 'fraud_check', 'payment_proc', 'order_db', 'receipt'],
    explanation: 'Secure payments require: customer stakeholder, encryption and fraud controls BEFORE processing, then database storage and receipt generation.',
    consequences: {
      good: 'Transactions are secure, fraud is minimized, and customers have proof of purchase.',
      bad: 'Without security controls, payment data can be stolen and fraudulent orders slip through.'
    }
  },
  {
    id: '3',
    scenario: 'A hospital needs a patient appointment system.',
    goal: 'Build an appointment system that protects patient privacy.',
    availableComponents: [
      { id: 'patient', name: 'Patient', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Books appointments' },
      { id: 'doctor', name: 'Doctor', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Sees patients' },
      { id: 'receptionist', name: 'Receptionist', type: 'stakeholder', icon: <Users className="h-4 w-4" />, description: 'Manages schedule' },
      { id: 'booking', name: 'Booking Process', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Schedules appointments' },
      { id: 'patient_db', name: 'Patient Records', type: 'data', icon: <Database className="h-4 w-4" />, description: 'Stores medical info' },
      { id: 'access_ctrl', name: 'Access Control', type: 'control', icon: <Shield className="h-4 w-4" />, description: 'Limits who sees what' },
      { id: 'reminder', name: 'Reminder System', type: 'process', icon: <Workflow className="h-4 w-4" />, description: 'Sends notifications' },
    ],
    correctSolution: ['patient', 'doctor', 'receptionist', 'access_ctrl', 'booking', 'patient_db', 'reminder'],
    explanation: 'Healthcare systems need all stakeholders, strict access control for privacy, booking process, secure patient data, and reminders for efficiency.',
    consequences: {
      good: 'Appointments run smoothly, patient privacy is protected, and no-shows are reduced.',
      bad: 'Without access control, sensitive medical data could be exposed. Missing reminders increase no-shows.'
    }
  }
];

const SystemBuilderGame: React.FC = () => {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const toggleComponent = (id: string) => {
    if (showResult) return;
    setSelectedComponents(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const checkSolution = () => {
    const correct = challenge.correctSolution.every(c => selectedComponents.includes(c)) &&
                    selectedComponents.length === challenge.correctSolution.length;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(s => s + 1);
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedComponents([]);
      setShowResult(false);
    } else {
      setGameComplete(true);
      playSound('success');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setSelectedComponents([]);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-3xl font-bold mb-4">Systems Architect!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          You scored {score}/{challenges.length}
        </p>
        <Button onClick={resetGame} size="lg">Design Again</Button>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Challenge {currentIndex + 1}/{challenges.length}</p>
          <Progress value={progress} className="w-32 h-2" />
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1">
          Score: {score}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            System Design Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-medium mb-2">{challenge.scenario}</p>
            <p className="text-sm text-muted-foreground">Goal: {challenge.goal}</p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Select components to build your system:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {challenge.availableComponents.map(comp => (
                <motion.button
                  key={comp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleComponent(comp.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedComponents.includes(comp.id)
                      ? getTypeColor(comp.type)
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {comp.icon}
                    <span className="font-medium text-sm">{comp.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{comp.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10">Stakeholders</Badge>
            <Badge variant="outline" className="bg-accent/10">Processes</Badge>
            <Badge variant="outline" className="bg-success/10">Data</Badge>
            <Badge variant="outline" className="bg-warning/10">Controls</Badge>
          </div>

          <AnimatePresence>
            {showResult && (
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
                    <p className="font-medium mb-2">
                      {isCorrect ? 'Excellent design!' : 'Not quite right'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">{challenge.explanation}</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-success/10 rounded p-2">
                        <span className="font-medium text-success">Good outcome:</span>
                        <p className="text-muted-foreground">{challenge.consequences.good}</p>
                      </div>
                      <div className="bg-destructive/10 rounded p-2">
                        <span className="font-medium text-destructive">Bad outcome:</span>
                        <p className="text-muted-foreground">{challenge.consequences.bad}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3">
            {!showResult ? (
              <Button 
                onClick={checkSolution} 
                disabled={selectedComponents.length === 0}
              >
                Submit Design
              </Button>
            ) : (
              <Button onClick={nextChallenge}>
                {currentIndex < challenges.length - 1 ? 'Next Challenge' : 'Finish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemBuilderGame;
