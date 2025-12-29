import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Shield, Star, Lightbulb, AlertTriangle } from "lucide-react";

interface SecurityChallenge {
  id: number;
  scenario: string;
  attackType?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "identify" | "defend" | "respond" | "encrypt";
}

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: SecurityChallenge[] = [
  {
    id: 1,
    scenario: "You receive an email from 'IT Support' asking you to click a link and enter your password to 'verify your account'. The sender email is support@company-secure.xyz.",
    correctAnswer: "Phishing attack - don't click, report it",
    options: ["Phishing attack - don't click, report it", "Legitimate request - enter password", "Forward to colleagues", "Reply asking for more info"],
    hint: "Check the domain carefully - is it your real company domain?",
    explanation: "This is phishing! Real IT never asks for passwords via email. The domain 'company-secure.xyz' is fake.",
    category: "identify"
  },
  {
    id: 2,
    scenario: "Your computer suddenly shows a message: 'Your files have been encrypted. Pay 2 Bitcoin to decrypt.' What type of attack is this?",
    correctAnswer: "Ransomware",
    options: ["Ransomware", "Phishing", "DDoS Attack", "SQL Injection"],
    hint: "The attacker is demanding payment to restore your files",
    explanation: "Ransomware encrypts your files and demands payment. Never pay - restore from backups instead!",
    category: "identify"
  },
  {
    id: 3,
    scenario: "A website is suddenly very slow and eventually becomes unavailable. The server logs show millions of requests from different IP addresses.",
    correctAnswer: "DDoS (Distributed Denial of Service)",
    options: ["DDoS (Distributed Denial of Service)", "SQL Injection", "Cross-Site Scripting", "Man-in-the-Middle"],
    hint: "Many sources overwhelming one target",
    explanation: "DDoS floods servers with traffic from multiple sources (botnet) to make services unavailable.",
    category: "identify"
  },
  {
    id: 4,
    scenario: "Best defense against password attacks?",
    correctAnswer: "Strong unique passwords + MFA",
    options: ["Strong unique passwords + MFA", "Same password everywhere for easy memory", "Write passwords on sticky notes", "Short passwords changed daily"],
    hint: "Two factors are better than one",
    explanation: "Multi-Factor Authentication (MFA) adds a second layer. Even if password is stolen, attacker needs the second factor!",
    category: "defend"
  },
  {
    id: 5,
    scenario: "A user's login form is vulnerable because it doesn't sanitize input. Entering ' OR '1'='1 allows login without a password. What attack is this?",
    correctAnswer: "SQL Injection",
    options: ["SQL Injection", "XSS Attack", "Buffer Overflow", "Phishing"],
    hint: "The attacker is manipulating database queries",
    explanation: "SQL Injection inserts malicious SQL into inputs. Always use parameterized queries to prevent this!",
    category: "identify"
  },
  {
    id: 6,
    scenario: "How should passwords be stored in a database?",
    correctAnswer: "Hashed with salt (e.g., bcrypt)",
    options: ["Hashed with salt (e.g., bcrypt)", "Plain text for easy recovery", "Encrypted with shared key", "Base64 encoded"],
    hint: "Even if database is stolen, passwords should be unusable",
    explanation: "Hash + salt is one-way. Even if stolen, attackers can't reverse hashes. Salt prevents rainbow table attacks!",
    category: "defend"
  },
  {
    id: 7,
    scenario: "An attacker intercepts communication between you and your bank by positioning themselves in between. What attack is this?",
    correctAnswer: "Man-in-the-Middle (MITM)",
    options: ["Man-in-the-Middle (MITM)", "Phishing", "Ransomware", "Social Engineering"],
    hint: "The attacker is literally 'in the middle' of the conversation",
    explanation: "MITM intercepts traffic between two parties. Use HTTPS and verify certificates to prevent this!",
    category: "identify"
  },
  {
    id: 8,
    scenario: "Best practice for public Wi-Fi security?",
    correctAnswer: "Use VPN to encrypt all traffic",
    options: ["Use VPN to encrypt all traffic", "Connect freely - it's convenient", "Only visit HTTP sites", "Share your hotspot instead"],
    hint: "Your traffic on public WiFi can be intercepted",
    explanation: "VPN creates an encrypted tunnel. Even if someone sniffs the WiFi, they only see encrypted data!",
    category: "defend"
  },
  {
    id: 9,
    scenario: "Your company discovers a data breach. What's the FIRST step?",
    correctAnswer: "Contain the breach - isolate affected systems",
    options: ["Contain the breach - isolate affected systems", "Delete all evidence", "Announce publicly immediately", "Continue normal operations"],
    hint: "Stop the bleeding before anything else",
    explanation: "Incident Response: 1) Contain, 2) Investigate, 3) Eradicate, 4) Recover, 5) Learn. Containment stops ongoing damage!",
    category: "respond"
  },
  {
    id: 10,
    scenario: "A script on a website steals cookies by injecting <script>sendCookies()</script> into a comment field. What attack?",
    correctAnswer: "Cross-Site Scripting (XSS)",
    options: ["Cross-Site Scripting (XSS)", "SQL Injection", "CSRF", "Clickjacking"],
    hint: "Malicious script runs in victims' browsers",
    explanation: "XSS injects scripts into web pages. Always sanitize user input and use Content Security Policy!",
    category: "identify"
  },
  {
    id: 11,
    scenario: "Alice wants to send Bob an encrypted message. Using asymmetric encryption, which key should she use?",
    correctAnswer: "Bob's public key",
    options: ["Bob's public key", "Alice's private key", "Bob's private key", "Shared secret key"],
    hint: "Public key encrypts, private key decrypts",
    explanation: "Encrypt with recipient's PUBLIC key. Only they have the PRIVATE key to decrypt. Never share private keys!",
    category: "encrypt"
  },
  {
    id: 12,
    scenario: "What does 'Zero Trust' security model mean?",
    correctAnswer: "Never trust, always verify - even internal users",
    options: ["Never trust, always verify - even internal users", "Trust everyone inside the firewall", "Zero security measures needed", "Trust only administrators"],
    hint: "The perimeter is no longer the boundary",
    explanation: "Zero Trust assumes breach. Verify every request regardless of source. 'Trust but verify' is outdated!",
    category: "defend"
  },
];

export const CybersecurityGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

  // Shuffle options for current challenge
  const shuffledOptions = useMemo(() => {
    return shuffleArray(challenge.options);
  }, [currentChallenge]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(prev => prev + (showHint ? 15 : 25));
    } else {
      playSound("error");
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const categoryColors: Record<string, string> = {
    identify: "bg-red-500/10 text-red-600",
    defend: "bg-blue-500/10 text-blue-600",
    respond: "bg-orange-500/10 text-orange-600",
    encrypt: "bg-green-500/10 text-green-600",
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Expert!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points out of {challenges.length * 25}!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key Security Principles:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• CIA Triad: Confidentiality, Integrity, Availability</li>
            <li>• Defense in Depth: Multiple layers of security</li>
            <li>• Zero Trust: Never trust, always verify</li>
            <li>• Least Privilege: Minimal access needed</li>
          </ul>
        </div>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Security Challenge - {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Score: {score}
          </div>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${categoryColors[challenge.category]}`}>
            {challenge.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-foreground">{challenge.scenario}</p>
          </div>
        </div>

        {/* Hint Button */}
        {!showHint && !showResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(true)}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Need a hint? (-10 points)
          </Button>
        )}

        {showHint && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
          >
            💡 {challenge.hint}
          </motion.div>
        )}

        {/* Options */}
        <div className="grid gap-3">
          {shuffledOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === challenge.correctAnswer;
            
            return (
              <motion.button
                key={option}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? isCorrectOption
                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                      : isSelected
                      ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                      : "bg-muted/50 border-muted"
                    : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Result & Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              <p className="font-bold mb-2">
                {isCorrect ? "🎯 Correct!" : "❌ Not quite!"}
              </p>
              <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && (
          <Button onClick={handleNext} className="w-full">
            {currentChallenge < challenges.length - 1 ? "Next Challenge" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CybersecurityGame;