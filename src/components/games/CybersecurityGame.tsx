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

// Mnemonic: C.I.A.A.N = Confidentiality, Integrity, Availability, Authentication, Non-repudiation
// Mnemonic: P.A.I.N = Phishing, Attacks, Injection, Network threats

const challenges: SecurityChallenge[] = [
  // === IDENTIFY (Threat Recognition) ===
  { id: 1, scenario: "You receive an email from 'IT Support' asking you to click a link and enter your password to 'verify your account'. The sender email is support@company-secure.xyz.", correctAnswer: "Phishing attack - don't click, report it", options: ["Phishing attack - don't click, report it", "Legitimate request - enter password", "Forward to colleagues", "Reply asking for more info"], hint: "Check the domain carefully - is it your real company domain?", explanation: "This is phishing! Real IT never asks for passwords via email. The domain 'company-secure.xyz' is fake. Mnemonic: P.H.I.S.H = Pretends, Hides identity, Invites clicks, Steals data, Hurts victims.", category: "identify" },
  { id: 2, scenario: "Your computer suddenly shows a message: 'Your files have been encrypted. Pay 2 Bitcoin to decrypt.' What type of attack is this?", correctAnswer: "Ransomware", options: ["Ransomware", "Phishing", "DDoS Attack", "SQL Injection"], hint: "The attacker is demanding payment to restore your files", explanation: "Ransomware encrypts your files and demands payment. Never pay - restore from backups instead! Response: Isolate → Report → Restore.", category: "identify" },
  { id: 3, scenario: "A website is suddenly very slow and eventually becomes unavailable. The server logs show millions of requests from different IP addresses.", correctAnswer: "DDoS (Distributed Denial of Service)", options: ["DDoS (Distributed Denial of Service)", "SQL Injection", "Cross-Site Scripting", "Man-in-the-Middle"], hint: "Many sources overwhelming one target", explanation: "DDoS floods servers with traffic from multiple sources (botnet) to make services unavailable. Defense: CDN, rate limiting, traffic scrubbing.", category: "identify" },
  { id: 4, scenario: "A user's login form is vulnerable because it doesn't sanitize input. Entering ' OR '1'='1 allows login without a password. What attack is this?", correctAnswer: "SQL Injection", options: ["SQL Injection", "XSS Attack", "Buffer Overflow", "Phishing"], hint: "The attacker is manipulating database queries", explanation: "SQL Injection inserts malicious SQL into inputs. Always use parameterized queries! Mnemonic: S.Q.L.I = Sanitize Queries, Limit Input.", category: "identify" },
  { id: 5, scenario: "An attacker intercepts communication between you and your bank by positioning themselves in between. What attack is this?", correctAnswer: "Man-in-the-Middle (MITM)", options: ["Man-in-the-Middle (MITM)", "Phishing", "Ransomware", "Social Engineering"], hint: "The attacker is literally 'in the middle' of the conversation", explanation: "MITM intercepts traffic between two parties. Use HTTPS and verify certificates to prevent this!", category: "identify" },
  { id: 6, scenario: "A script on a website steals cookies by injecting <script>sendCookies()</script> into a comment field. What attack?", correctAnswer: "Cross-Site Scripting (XSS)", options: ["Cross-Site Scripting (XSS)", "SQL Injection", "CSRF", "Clickjacking"], hint: "Malicious script runs in victims' browsers", explanation: "XSS injects scripts into web pages. Always sanitize user input and use Content Security Policy! Types: Stored, Reflected, DOM-based.", category: "identify" },
  { id: 7, scenario: "An attacker makes a forged request to a banking site using an authenticated user's session cookie. What attack?", correctAnswer: "Cross-Site Request Forgery (CSRF)", options: ["Cross-Site Request Forgery (CSRF)", "XSS", "SQL Injection", "Clickjacking"], hint: "The request appears to come from the legitimate user", explanation: "CSRF tricks the user's browser into making unwanted requests. Prevent with anti-CSRF tokens and SameSite cookies.", category: "identify" },
  { id: 8, scenario: "An attacker sends more data than a program's buffer can hold, overwriting adjacent memory. What attack?", correctAnswer: "Buffer Overflow", options: ["Buffer Overflow", "SQL Injection", "XSS", "DDoS"], hint: "The 'buffer' in memory can't hold all the data", explanation: "Buffer overflow overwrites memory to execute malicious code. Prevent with bounds checking, ASLR, and DEP.", category: "identify" },
  { id: 9, scenario: "An attacker impersonates the CEO and calls an employee demanding an urgent wire transfer. What attack?", correctAnswer: "Social Engineering (Vishing)", options: ["Social Engineering (Vishing)", "Phishing", "Brute Force", "Ransomware"], hint: "Voice + Phishing = Vishing", explanation: "Vishing uses phone calls to manipulate victims. Always verify identity through official channels. S.T.O.P = Stop, Think, Observe, Protect.", category: "identify" },
  { id: 10, scenario: "A USB drive labeled 'Employee Salaries' is found in a parking lot. An employee plugs it in. What happened?", correctAnswer: "Baiting Attack", options: ["Baiting Attack", "Phishing", "DDoS", "SQL Injection"], hint: "Curiosity is being exploited", explanation: "Baiting uses enticing physical media. Never plug in unknown USB drives — they can contain malware or keyloggers!", category: "identify" },

  // === DEFEND (Protection Techniques) ===
  { id: 11, scenario: "Best defense against password attacks?", correctAnswer: "Strong unique passwords + MFA", options: ["Strong unique passwords + MFA", "Same password everywhere for easy memory", "Write passwords on sticky notes", "Short passwords changed daily"], hint: "Two factors are better than one", explanation: "MFA adds a second layer: something you KNOW (password) + HAVE (phone) + ARE (biometric). Mnemonic: K.H.A = Know, Have, Are.", category: "defend" },
  { id: 12, scenario: "How should passwords be stored in a database?", correctAnswer: "Hashed with salt (e.g., bcrypt)", options: ["Hashed with salt (e.g., bcrypt)", "Plain text for easy recovery", "Encrypted with shared key", "Base64 encoded"], hint: "Even if database is stolen, passwords should be unusable", explanation: "Hash + salt is one-way. Salt prevents rainbow table attacks. Use bcrypt, scrypt, or Argon2.", category: "defend" },
  { id: 13, scenario: "Best practice for public Wi-Fi security?", correctAnswer: "Use VPN to encrypt all traffic", options: ["Use VPN to encrypt all traffic", "Connect freely - it's convenient", "Only visit HTTP sites", "Share your hotspot instead"], hint: "Your traffic on public WiFi can be intercepted", explanation: "VPN creates an encrypted tunnel. Even if someone sniffs the WiFi, they only see encrypted data!", category: "defend" },
  { id: 14, scenario: "What does 'Zero Trust' security model mean?", correctAnswer: "Never trust, always verify - even internal users", options: ["Never trust, always verify - even internal users", "Trust everyone inside the firewall", "Zero security measures needed", "Trust only administrators"], hint: "The perimeter is no longer the boundary", explanation: "Zero Trust assumes breach. Verify every request regardless of source. Principle of least privilege applies everywhere.", category: "defend" },
  { id: 15, scenario: "What firewall rule should be the DEFAULT for inbound traffic?", correctAnswer: "Deny all, then allow specific ports", options: ["Deny all, then allow specific ports", "Allow all traffic", "Only block port 80", "No rules needed"], hint: "Start with everything blocked", explanation: "Default-deny means only explicitly allowed traffic passes. Whitelist approach is safer than blacklist.", category: "defend" },
  { id: 16, scenario: "What is the principle of least privilege?", correctAnswer: "Users get only the minimum access needed for their role", options: ["Users get only the minimum access needed for their role", "Everyone gets admin access", "Only one user per system", "No access controls needed"], hint: "Minimum permissions for the job", explanation: "Least privilege limits damage if an account is compromised. A receptionist doesn't need database admin access!", category: "defend" },
  { id: 17, scenario: "What does a WAF (Web Application Firewall) protect against?", correctAnswer: "Application-layer attacks like SQL injection, XSS, and CSRF", options: ["Application-layer attacks like SQL injection, XSS, and CSRF", "Physical theft", "Power outages", "Hardware failures"], hint: "It sits between the web app and the internet", explanation: "WAF inspects HTTP traffic and blocks malicious requests. It works at Layer 7 of the OSI model.", category: "defend" },
  { id: 18, scenario: "What is Defense in Depth?", correctAnswer: "Multiple overlapping security layers so no single failure is catastrophic", options: ["Multiple overlapping security layers so no single failure is catastrophic", "One very strong firewall", "Relying only on antivirus", "Physical locks only"], hint: "Like a castle: moat, wall, guards, keep", explanation: "Defense in Depth: Physical → Network → Host → Application → Data. If one fails, others still protect. Mnemonic: P.N.H.A.D layers.", category: "defend" },

  // === RESPOND (Incident Response) ===
  { id: 19, scenario: "Your company discovers a data breach. What's the FIRST step?", correctAnswer: "Contain the breach - isolate affected systems", options: ["Contain the breach - isolate affected systems", "Delete all evidence", "Announce publicly immediately", "Continue normal operations"], hint: "Stop the bleeding before anything else", explanation: "Incident Response: P.I.C.E.R.L = Preparation, Identification, Containment, Eradication, Recovery, Lessons learned.", category: "respond" },
  { id: 20, scenario: "What tool captures and analyzes network traffic for forensic investigation?", correctAnswer: "Wireshark", options: ["Wireshark", "Photoshop", "Excel", "PowerPoint"], hint: "It's the most popular network protocol analyzer", explanation: "Wireshark captures packets for analysis. Used for troubleshooting, security analysis, and protocol development.", category: "respond" },
  { id: 21, scenario: "What tool is used for network scanning and host discovery in penetration testing?", correctAnswer: "Nmap", options: ["Nmap", "Word", "Chrome", "Slack"], hint: "Network Mapper — scans ports and services", explanation: "Nmap discovers hosts, open ports, and running services. Command: nmap -sV target_ip. Essential for security audits.", category: "respond" },
  { id: 22, scenario: "What is a SIEM system used for?", correctAnswer: "Centralized security event monitoring, correlation, and alerting", options: ["Centralized security event monitoring, correlation, and alerting", "Email management", "Code compilation", "Video streaming"], hint: "Security Information and Event Management", explanation: "SIEM aggregates logs from all systems, correlates events, and alerts on suspicious patterns. Examples: Splunk, QRadar, ELK.", category: "respond" },
  { id: 23, scenario: "What is a SOC (Security Operations Center)?", correctAnswer: "A team that monitors, detects, and responds to security threats 24/7", options: ["A team that monitors, detects, and responds to security threats 24/7", "A server room", "A type of firewall", "A programming language"], hint: "The people who watch the security screens", explanation: "SOC analysts monitor alerts, investigate incidents, and coordinate response. SOC operates in tiers: L1 triage, L2 investigate, L3 threat hunt.", category: "respond" },

  // === ENCRYPT (Cryptography) ===
  { id: 24, scenario: "Alice wants to send Bob an encrypted message. Using asymmetric encryption, which key should she use?", correctAnswer: "Bob's public key", options: ["Bob's public key", "Alice's private key", "Bob's private key", "Shared secret key"], hint: "Public key encrypts, private key decrypts", explanation: "Asymmetric: encrypt with recipient's PUBLIC key, decrypt with PRIVATE key. Mnemonic: PuB-liC encryPts, PRIvate decRyPts.", category: "encrypt" },
  { id: 25, scenario: "What is the difference between symmetric and asymmetric encryption?", correctAnswer: "Symmetric uses one shared key; asymmetric uses a public/private key pair", options: ["Symmetric uses one shared key; asymmetric uses a public/private key pair", "They are identical", "Symmetric is always faster", "Asymmetric uses no keys"], hint: "How many keys are involved?", explanation: "Symmetric (AES): fast, one key. Asymmetric (RSA): slower, key pair. TLS uses both: asymmetric for key exchange, symmetric for data.", category: "encrypt" },
  { id: 26, scenario: "What does a digital signature prove?", correctAnswer: "Authentication (who sent it) and integrity (it wasn't altered)", options: ["Authentication (who sent it) and integrity (it wasn't altered)", "Only that the message is encrypted", "The sender's address", "Nothing useful"], hint: "It's like a wax seal on a letter", explanation: "Digital signatures use the sender's PRIVATE key. Anyone with the PUBLIC key can verify. Provides non-repudiation!", category: "encrypt" },
  { id: 27, scenario: "What hashing algorithm should you NOT use for passwords?", correctAnswer: "MD5 — it's broken and too fast for password hashing", options: ["MD5 — it's broken and too fast for password hashing", "bcrypt", "Argon2", "scrypt"], hint: "This old algorithm has known collision vulnerabilities", explanation: "MD5 is cryptographically broken. Use bcrypt (cost factor), scrypt (memory-hard), or Argon2 (winner of PHC) for passwords.", category: "encrypt" },
  { id: 28, scenario: "What protocol secures web traffic between browser and server?", correctAnswer: "TLS (Transport Layer Security)", options: ["TLS (Transport Layer Security)", "FTP", "HTTP", "Telnet"], hint: "The 'S' in HTTPS stands for Secure", explanation: "TLS encrypts data in transit. Uses certificates for authentication and symmetric encryption for speed. Replaces deprecated SSL.", category: "encrypt" },
  { id: 29, scenario: "What is a certificate authority (CA)?", correctAnswer: "A trusted organization that issues and verifies digital certificates", options: ["A trusted organization that issues and verifies digital certificates", "A type of firewall", "A coding standard", "A government agency only"], hint: "They vouch that a website is who it claims to be", explanation: "CAs like Let's Encrypt, DigiCert verify identity and issue SSL/TLS certificates. The chain of trust validates web security.", category: "encrypt" },
  { id: 30, scenario: "What is the CIA Triad in cybersecurity?", correctAnswer: "Confidentiality, Integrity, Availability", options: ["Confidentiality, Integrity, Availability", "Code, Implement, Analyze", "Create, Inspect, Approve", "Control, Isolate, Authenticate"], hint: "The three pillars of information security", explanation: "C.I.A: Confidentiality (only authorized access), Integrity (data is accurate), Availability (systems are accessible). The foundation of all security!", category: "defend" },
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