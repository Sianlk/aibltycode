import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { 
  Code, CheckCircle, XCircle, Lightbulb, Palette,
  Layout, Type, Box, Accessibility, Shield
} from "lucide-react";

interface WebChallenge {
  id: number;
  question: string;
  codeSnippet?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "html" | "css" | "accessibility" | "security" | "layout";
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: WebChallenge[] = [
  // HTML Basics
  {
    id: 1,
    question: "Which HTML5 tag is used for navigation links?",
    correctAnswer: "<nav>",
    options: ["<nav>", "<menu>", "<links>", "<navigation>"],
    hint: "It's a semantic element specifically for navigation",
    explanation: "<nav> is the semantic HTML5 element for navigation. Screen readers use it to identify navigation areas!",
    category: "html"
  },
  {
    id: 2,
    question: "Which tag should contain the main content of a page?",
    correctAnswer: "<main>",
    options: ["<main>", "<content>", "<body>", "<article>"],
    hint: "There should only be one of these per page",
    explanation: "<main> contains the primary content. Only one per page, should be unique content not repeated across pages!",
    category: "html"
  },
  {
    id: 3,
    question: "What does the 'alt' attribute do in an <img> tag?",
    correctAnswer: "Provides alternative text for screen readers and when image fails to load",
    options: [
      "Provides alternative text for screen readers and when image fails to load",
      "Sets the image alignment",
      "Defines the image quality",
      "Changes the image size"
    ],
    hint: "Essential for accessibility",
    explanation: "Alt text is crucial for accessibility! Screen readers read it aloud, and it displays when images don't load.",
    category: "html"
  },
  // CSS Fundamentals
  {
    id: 4,
    question: "Which CSS property makes an element invisible but still takes up space?",
    correctAnswer: "visibility: hidden",
    options: ["visibility: hidden", "display: none", "opacity: 0", "position: absolute"],
    hint: "It hides content but maintains layout space",
    explanation: "visibility: hidden hides but keeps space. display: none removes from layout. opacity: 0 makes transparent but clickable!",
    category: "css"
  },
  {
    id: 5,
    question: "What's the correct order of specificity (lowest to highest)?",
    correctAnswer: "Element < Class < ID < Inline style",
    options: [
      "Element < Class < ID < Inline style",
      "ID < Class < Element < Inline style",
      "Class < Element < ID < Inline style",
      "Inline style < ID < Class < Element"
    ],
    hint: "Remember: more specific selectors win",
    explanation: "Specificity: element(1) < class(10) < ID(100) < inline(1000). !important overrides all but avoid using it!",
    category: "css"
  },
  {
    id: 6,
    question: "Which CSS display value creates a flex container?",
    correctAnswer: "display: flex",
    options: ["display: flex", "display: flexbox", "display: inline-flex", "display: block"],
    hint: "It's the foundation of Flexbox layout",
    explanation: "display: flex creates a flex container. inline-flex makes it inline. Children become flex items automatically!",
    category: "css"
  },
  // Flexbox & Grid
  {
    id: 7,
    question: "How do you center items both horizontally and vertically in Flexbox?",
    correctAnswer: "justify-content: center; align-items: center;",
    options: [
      "justify-content: center; align-items: center;",
      "text-align: center; vertical-align: middle;",
      "margin: auto; padding: auto;",
      "center: both;"
    ],
    hint: "One property for main axis, one for cross axis",
    explanation: "justify-content handles main axis, align-items handles cross axis. Add display: flex to parent first!",
    category: "layout"
  },
  {
    id: 8,
    question: "Which CSS Grid property defines column sizes?",
    correctAnswer: "grid-template-columns",
    options: ["grid-template-columns", "grid-columns", "column-template", "grid-col"],
    hint: "It's a template that defines the columns",
    explanation: "grid-template-columns defines column sizes. Example: grid-template-columns: 1fr 2fr 1fr; creates 3 columns!",
    category: "layout"
  },
  // Accessibility
  {
    id: 9,
    question: "What WCAG level is generally required for compliance?",
    correctAnswer: "AA",
    options: ["AA", "A", "AAA", "WCAG"],
    hint: "It's the middle level - achievable but comprehensive",
    explanation: "Level AA is the standard for most regulations. A is minimum, AAA is highest. AA includes color contrast 4.5:1!",
    category: "accessibility"
  },
  {
    id: 10,
    question: "Which attribute makes a custom div behave like a button for screen readers?",
    correctAnswer: "role=\"button\"",
    options: ["role=\"button\"", "type=\"button\"", "aria-button", "button=\"true\""],
    hint: "ARIA roles tell assistive technologies the element's purpose",
    explanation: "role='button' tells screen readers it's a button. But prefer using actual <button> elements when possible!",
    category: "accessibility"
  },
  {
    id: 11,
    question: "What is the minimum color contrast ratio for normal text (WCAG AA)?",
    correctAnswer: "4.5:1",
    options: ["4.5:1", "3:1", "7:1", "2:1"],
    hint: "Large text only needs 3:1, but normal text needs more",
    explanation: "4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold). Use contrast checkers to verify!",
    category: "accessibility"
  },
  // Web Security
  {
    id: 12,
    question: "What is XSS (Cross-Site Scripting)?",
    correctAnswer: "Injecting malicious scripts into web pages viewed by others",
    options: [
      "Injecting malicious scripts into web pages viewed by others",
      "Stealing user cookies directly from servers",
      "Breaking encryption on HTTPS connections",
      "Overloading servers with requests"
    ],
    hint: "The attacker's script runs in victim's browser",
    explanation: "XSS injects scripts into pages. Prevent with: escaping output, Content Security Policy, input validation!",
    category: "security"
  },
  {
    id: 13,
    question: "How does 'Content-Security-Policy' header help security?",
    correctAnswer: "Restricts which sources can load scripts, styles, and other resources",
    options: [
      "Restricts which sources can load scripts, styles, and other resources",
      "Encrypts all page content",
      "Hides the page source code",
      "Blocks all external resources"
    ],
    hint: "It's a whitelist of trusted sources",
    explanation: "CSP prevents XSS by only allowing scripts from trusted sources. Example: script-src 'self' trusted.com",
    category: "security"
  },
  // Advanced
  {
    id: 14,
    question: "What does 'position: sticky' do?",
    correctAnswer: "Element scrolls normally until reaching a threshold, then sticks",
    options: [
      "Element scrolls normally until reaching a threshold, then sticks",
      "Element is always fixed to the viewport",
      "Element sticks to its parent",
      "Element becomes glued to the cursor"
    ],
    hint: "It's like fixed, but only after scrolling past a point",
    explanation: "position: sticky is a hybrid. It's relative until you scroll past a threshold (e.g., top: 0), then becomes fixed!",
    category: "css"
  },
  {
    id: 15,
    question: "Which meta tag makes a page mobile-responsive?",
    correctAnswer: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    options: [
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
      "<meta name=\"responsive\" content=\"true\">",
      "<meta name=\"mobile\" content=\"yes\">",
      "<meta http-equiv=\"responsive\">"
    ],
    hint: "It controls the viewport width on mobile devices",
    explanation: "The viewport meta tag is essential for responsive design. Without it, mobile browsers zoom out to fit desktop widths!",
    category: "html"
  },
];

const HTMLCSSPlayground: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const shuffledOptions = useMemo(() => {
    return shuffleArray(challenge.options);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(s => s + (showHint ? 15 : 25));
      addXp(10);
    } else {
      playSound("error");
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const categoryIcons = {
    "html": <Code className="w-4 h-4" />,
    "css": <Palette className="w-4 h-4" />,
    "layout": <Layout className="w-4 h-4" />,
    "accessibility": <Accessibility className="w-4 h-4" />,
    "security": <Shield className="w-4 h-4" />
  };

  const categoryColors = {
    "html": "bg-orange-500/10 text-orange-500",
    "css": "bg-blue-500/10 text-blue-500",
    "layout": "bg-purple-500/10 text-purple-500",
    "accessibility": "bg-green-500/10 text-green-500",
    "security": "bg-red-500/10 text-red-500"
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🌐</div>
        <h2 className="text-3xl font-bold mb-4">Web Technologies Expert!</h2>
        <p className="text-xl text-muted-foreground mb-6">Score: {score} points</p>

        <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="font-bold mb-4">Key Concepts:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-left">
            <div className="bg-orange-500/10 p-2 rounded">
              <strong className="text-orange-500">HTML5</strong>
              <p className="text-muted-foreground">Semantic elements, accessibility</p>
            </div>
            <div className="bg-blue-500/10 p-2 rounded">
              <strong className="text-blue-500">CSS3</strong>
              <p className="text-muted-foreground">Flexbox, Grid, specificity</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded">
              <strong className="text-green-500">WCAG</strong>
              <p className="text-muted-foreground">Contrast, ARIA, keyboard</p>
            </div>
            <div className="bg-red-500/10 p-2 rounded">
              <strong className="text-red-500">Security</strong>
              <p className="text-muted-foreground">XSS, CSP, HTTPS</p>
            </div>
          </div>
        </div>

        <Button size="lg" onClick={() => window.location.reload()} className="gap-2">
          <Code className="w-5 h-5" />
          Practice Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {currentIndex + 1}/{challenges.length}
          </Badge>
          <Badge className={categoryColors[challenge.category]}>
            <span className="flex items-center gap-1">
              {categoryIcons[challenge.category]}
              {challenge.category.toUpperCase()}
            </span>
          </Badge>
        </div>
        <Badge variant="secondary" className="text-lg px-4">
          {score} pts
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            HTML, CSS & Web Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground font-medium">{challenge.question}</p>
            {challenge.codeSnippet && (
              <pre className="mt-2 p-2 bg-muted rounded font-mono text-sm overflow-x-auto">
                {challenge.codeSnippet}
              </pre>
            )}
          </div>

          {!showHint && !showResult && (
            <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Need a hint? (-10 points)
            </Button>
          )}

          {showHint && !showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm"
            >
              💡 {challenge.hint}
            </motion.div>
          )}

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
                  className={`p-4 rounded-lg border-2 text-left transition-all text-sm ${
                    showResult
                      ? isCorrectOption
                        ? "bg-success/20 border-success"
                        : isSelected
                        ? "bg-destructive/20 border-destructive"
                        : "bg-muted/50 border-muted"
                      : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="break-words">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? "bg-success/10 border border-success/30"
                    : "bg-destructive/10 border border-destructive/30"
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
            <Button onClick={nextChallenge} className="w-full">
              {currentIndex < challenges.length - 1 ? "Next Challenge" : "See Results"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HTMLCSSPlayground;
