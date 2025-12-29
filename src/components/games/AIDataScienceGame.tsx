import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CheckCircle, XCircle, Brain, Star, Lightbulb } from "lucide-react";

interface AIChallenge {
  id: number;
  scenario: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "ml-basics" | "algorithms" | "data" | "ethics";
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: AIChallenge[] = [
  {
    id: 1,
    scenario: "You want to predict house prices based on size, location, and age. What type of machine learning is this?",
    correctAnswer: "Supervised Learning - Regression",
    options: ["Supervised Learning - Regression", "Unsupervised Learning", "Reinforcement Learning", "Deep Learning only"],
    hint: "You have labeled data (past prices) and want to predict a continuous value",
    explanation: "Regression predicts continuous values. You have labeled training data (features + prices), making it supervised learning!",
    category: "ml-basics"
  },
  {
    id: 2,
    scenario: "You want to group customers into segments without predefined labels. What type of learning?",
    correctAnswer: "Unsupervised Learning - Clustering",
    options: ["Unsupervised Learning - Clustering", "Supervised Learning", "Reinforcement Learning", "Classification"],
    hint: "No labels provided, finding patterns in data",
    explanation: "Clustering finds natural groupings without labels. K-means and hierarchical clustering are common algorithms!",
    category: "ml-basics"
  },
  {
    id: 3,
    scenario: "A model performs great on training data but poorly on new data. What problem is this?",
    correctAnswer: "Overfitting",
    options: ["Overfitting", "Underfitting", "Data leakage", "Feature engineering"],
    hint: "The model memorized the training data instead of learning patterns",
    explanation: "Overfitting = model too complex, memorizes noise. Use regularization, more data, or simpler model!",
    category: "ml-basics"
  },
  {
    id: 4,
    scenario: "Which algorithm is best for email spam detection (spam/not spam)?",
    correctAnswer: "Classification (e.g., Naive Bayes, Logistic Regression)",
    options: ["Classification (e.g., Naive Bayes, Logistic Regression)", "Regression", "Clustering", "Dimensionality Reduction"],
    hint: "You're predicting a category, not a number",
    explanation: "Binary classification! Naive Bayes is popular for text classification due to its simplicity and effectiveness.",
    category: "algorithms"
  },
  {
    id: 5,
    scenario: "Neural networks with multiple hidden layers are called?",
    correctAnswer: "Deep Learning",
    options: ["Deep Learning", "Shallow Learning", "Wide Learning", "Narrow Learning"],
    hint: "The 'depth' refers to the number of layers",
    explanation: "Deep Learning uses deep neural networks (many layers). Powers image recognition, NLP, and more!",
    category: "algorithms"
  },
  {
    id: 6,
    scenario: "What technique helps prevent overfitting by randomly dropping neurons during training?",
    correctAnswer: "Dropout",
    options: ["Dropout", "Batch Normalization", "Gradient Descent", "Backpropagation"],
    hint: "It 'drops out' connections to prevent co-adaptation",
    explanation: "Dropout randomly ignores neurons during training, forcing the network to learn robust features!",
    category: "algorithms"
  },
  {
    id: 7,
    scenario: "Before training, you should split your data into which sets?",
    correctAnswer: "Training, Validation, and Test sets",
    options: ["Training, Validation, and Test sets", "Only Training and Test", "Just one large dataset", "Random subsets each time"],
    hint: "You need to tune hyperparameters AND evaluate final performance",
    explanation: "Train on training set, tune on validation, final evaluation on test. Never touch test data until the end!",
    category: "data"
  },
  {
    id: 8,
    scenario: "What should you do with missing values in your dataset?",
    correctAnswer: "Impute (fill) or remove, depending on context",
    options: ["Impute (fill) or remove, depending on context", "Always delete rows with missing values", "Ignore them completely", "Replace all with zero"],
    hint: "The best approach depends on why data is missing",
    explanation: "Options: mean/median imputation, forward-fill, model-based imputation, or removal if appropriate.",
    category: "data"
  },
  {
    id: 9,
    scenario: "Feature scaling (normalization/standardization) is important because?",
    correctAnswer: "Algorithms sensitive to scale perform better",
    options: ["Algorithms sensitive to scale perform better", "It makes data look nicer", "It's required by law", "It reduces data size"],
    hint: "Think about gradient descent and distance-based algorithms",
    explanation: "Algorithms like SVM, KNN, neural networks need scaled features. Otherwise, large-scale features dominate!",
    category: "data"
  },
  {
    id: 10,
    scenario: "An AI hiring tool consistently rejects candidates from certain demographics. This is an example of?",
    correctAnswer: "Algorithmic Bias",
    options: ["Algorithmic Bias", "Efficient filtering", "Good AI design", "Random chance"],
    hint: "The AI learned patterns from biased historical data",
    explanation: "AI can inherit and amplify biases from training data. Fairness and bias auditing are crucial!",
    category: "ethics"
  },
  {
    id: 11,
    scenario: "A self-driving car must choose between two harmful outcomes. This ethical dilemma relates to?",
    correctAnswer: "The Trolley Problem in AI",
    options: ["The Trolley Problem in AI", "Gradient descent", "Hyperparameter tuning", "Data augmentation"],
    hint: "Classic philosophy meets modern AI",
    explanation: "AI ethics grapples with moral decisions machines might face. No easy answers - requires human oversight!",
    category: "ethics"
  },
  {
    id: 12,
    scenario: "GPT, BERT, and similar models that understand context in text are called?",
    correctAnswer: "Transformers / Large Language Models",
    options: ["Transformers / Large Language Models", "Convolutional Networks", "Recurrent Networks", "Decision Trees"],
    hint: "They use 'attention' mechanisms",
    explanation: "Transformers use self-attention to understand relationships in sequences. Revolution in NLP since 2017!",
    category: "algorithms"
  },
];

export const AIDataScienceGame: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { playSound } = useGame();

  const challenge = challenges[currentChallenge];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;

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
    "ml-basics": "bg-blue-500/10 text-blue-600",
    "algorithms": "bg-purple-500/10 text-purple-600",
    "data": "bg-green-500/10 text-green-600",
    "ethics": "bg-orange-500/10 text-orange-600",
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Expert!</h2>
        <p className="text-muted-foreground mb-4">
          You scored {score} points out of {challenges.length * 25}!
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="font-bold text-primary">Key AI/ML Concepts:</p>
          <ul className="text-sm text-left text-muted-foreground mt-2 space-y-1">
            <li>• Supervised: labeled data (classification/regression)</li>
            <li>• Unsupervised: find patterns without labels</li>
            <li>• Train/Val/Test split prevents overfitting</li>
            <li>• AI ethics: bias, fairness, accountability</li>
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
          <Brain className="w-6 h-6 text-primary" />
          AI & Data Science - {currentChallenge + 1}/{challenges.length}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Score: {score}
          </div>
          <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[challenge.category]}`}>
            {challenge.category.replace("-", " ")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground">{challenge.scenario}</p>
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
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
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
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
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
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
            >
              <p className="font-bold mb-2">{isCorrect ? "🎯 Correct!" : "❌ Not quite!"}</p>
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

export default AIDataScienceGame;