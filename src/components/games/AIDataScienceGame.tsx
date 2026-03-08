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

// Mnemonic: S.U.R.F = Supervised, Unsupervised, Reinforcement, Fine-tuning
// Mnemonic: T.R.A.P = Train, Regularize, Augment, Prune

const challenges: AIChallenge[] = [
  // === ML BASICS ===
  { id: 1, scenario: "You want to predict house prices based on size, location, and age. What type of machine learning is this?", correctAnswer: "Supervised Learning - Regression", options: ["Supervised Learning - Regression", "Unsupervised Learning", "Reinforcement Learning", "Deep Learning only"], hint: "You have labeled data (past prices) and want to predict a continuous value", explanation: "Regression predicts continuous values. Labeled data = supervised. Mnemonic: S.U.R.F — Supervised uses labels, Unsupervised finds patterns, Reinforcement learns rewards, Fine-tuning adapts models!", category: "ml-basics" },
  { id: 2, scenario: "You want to group customers into segments without predefined labels. What type of learning?", correctAnswer: "Unsupervised Learning - Clustering", options: ["Unsupervised Learning - Clustering", "Supervised Learning", "Reinforcement Learning", "Classification"], hint: "No labels provided, finding patterns in data", explanation: "Clustering finds natural groupings without labels. K-means, DBSCAN, and hierarchical clustering are common algorithms!", category: "ml-basics" },
  { id: 3, scenario: "A model performs great on training data but poorly on new data. What problem is this?", correctAnswer: "Overfitting", options: ["Overfitting", "Underfitting", "Data leakage", "Feature engineering"], hint: "The model memorized the training data instead of learning patterns", explanation: "Overfitting = model too complex, memorizes noise. Fix with T.R.A.P: Train/test split, Regularize, Augment data, Prune model!", category: "ml-basics" },
  { id: 4, scenario: "Which algorithm is best for email spam detection (spam/not spam)?", correctAnswer: "Classification (e.g., Naive Bayes, Logistic Regression)", options: ["Classification (e.g., Naive Bayes, Logistic Regression)", "Regression", "Clustering", "Dimensionality Reduction"], hint: "You're predicting a category, not a number", explanation: "Binary classification! Naive Bayes is popular for text due to simplicity. Mnemonic: Classification = Categories, Regression = Real numbers.", category: "ml-basics" },
  { id: 5, scenario: "What is the bias-variance tradeoff?", correctAnswer: "Balancing model simplicity (bias) vs sensitivity to training data (variance)", options: ["Balancing model simplicity (bias) vs sensitivity to training data (variance)", "Choosing between CPU and GPU", "Selecting training data size", "Picking hyperparameters randomly"], hint: "Too simple = high bias, too complex = high variance", explanation: "High bias = underfitting (too simple). High variance = overfitting (too complex). The sweet spot minimizes total error!", category: "ml-basics" },
  { id: 6, scenario: "What metric measures classification performance beyond accuracy?", correctAnswer: "F1-Score (harmonic mean of precision and recall)", options: ["F1-Score (harmonic mean of precision and recall)", "Only accuracy", "File size", "Training time"], hint: "Accuracy can be misleading with imbalanced classes", explanation: "F1 = 2 × (Precision × Recall) / (Precision + Recall). Precision = correct positives / predicted positives. Recall = correct positives / actual positives.", category: "ml-basics" },
  { id: 7, scenario: "Before training, you should split your data into which sets?", correctAnswer: "Training, Validation, and Test sets", options: ["Training, Validation, and Test sets", "Only Training and Test", "Just one large dataset", "Random subsets each time"], hint: "You need to tune hyperparameters AND evaluate final performance", explanation: "Train (learn), Validate (tune), Test (final eval). Typical split: 70/15/15 or 80/10/10. Never touch test data until the end!", category: "data" },

  // === ALGORITHMS ===
  { id: 8, scenario: "Neural networks with multiple hidden layers are called?", correctAnswer: "Deep Learning", options: ["Deep Learning", "Shallow Learning", "Wide Learning", "Narrow Learning"], hint: "The 'depth' refers to the number of layers", explanation: "Deep Learning uses deep neural networks (many layers). Powers image recognition, NLP, and more! Each layer learns increasingly abstract features.", category: "algorithms" },
  { id: 9, scenario: "What technique helps prevent overfitting by randomly dropping neurons during training?", correctAnswer: "Dropout", options: ["Dropout", "Batch Normalization", "Gradient Descent", "Backpropagation"], hint: "It 'drops out' connections to prevent co-adaptation", explanation: "Dropout randomly ignores neurons during training, forcing the network to learn robust features! Typical rate: 0.2-0.5.", category: "algorithms" },
  { id: 10, scenario: "What is the key innovation in Transformer architecture?", correctAnswer: "Self-attention mechanism", options: ["Self-attention mechanism", "More layers", "Bigger datasets", "Faster GPUs"], hint: "It lets the model weigh importance of each input token", explanation: "Self-attention computes relationships between ALL tokens in a sequence simultaneously. 'Attention is All You Need' (2017) revolutionized NLP!", category: "algorithms" },
  { id: 11, scenario: "What type of neural network is best for image recognition?", correctAnswer: "CNN (Convolutional Neural Network)", options: ["CNN (Convolutional Neural Network)", "RNN", "Transformer", "Decision Tree"], hint: "It uses filters that slide across images", explanation: "CNNs use convolution filters to detect features (edges, textures, objects). Layers: Conv → Pool → Conv → Pool → Fully Connected.", category: "algorithms" },
  { id: 12, scenario: "What type of network handles sequential data like text or time series?", correctAnswer: "RNN / LSTM (Recurrent Neural Network)", options: ["RNN / LSTM (Recurrent Neural Network)", "CNN", "GAN", "Autoencoder"], hint: "It has 'memory' of previous inputs", explanation: "RNNs process sequences by passing hidden state forward. LSTM solves vanishing gradient with gates: Forget, Input, Output.", category: "algorithms" },
  { id: 13, scenario: "GPT, BERT, and similar models that understand context in text are called?", correctAnswer: "Transformers / Large Language Models", options: ["Transformers / Large Language Models", "Convolutional Networks", "Recurrent Networks", "Decision Trees"], hint: "They use 'attention' mechanisms", explanation: "BERT = Bidirectional (understands context). GPT = Generative (creates text). Both use self-attention. LLMs scale to billions of parameters.", category: "algorithms" },
  { id: 14, scenario: "What generates realistic fake images by having two networks compete?", correctAnswer: "GANs (Generative Adversarial Networks)", options: ["GANs (Generative Adversarial Networks)", "CNNs", "RNNs", "Random Forests"], hint: "Generator creates, Discriminator evaluates", explanation: "GANs: Generator creates fake data, Discriminator tries to detect fakes. They improve each other through competition! Used for deepfakes, art, data augmentation.", category: "algorithms" },

  // === DATA ===
  { id: 15, scenario: "What should you do with missing values in your dataset?", correctAnswer: "Impute (fill) or remove, depending on context", options: ["Impute (fill) or remove, depending on context", "Always delete rows with missing values", "Ignore them completely", "Replace all with zero"], hint: "The best approach depends on why data is missing", explanation: "Options: mean/median imputation, KNN imputation, forward-fill, or removal if <5%. Always investigate WHY data is missing first!", category: "data" },
  { id: 16, scenario: "Feature scaling (normalization/standardization) is important because?", correctAnswer: "Algorithms sensitive to scale perform better", options: ["Algorithms sensitive to scale perform better", "It makes data look nicer", "It's required by law", "It reduces data size"], hint: "Think about gradient descent and distance-based algorithms", explanation: "Normalization: 0-1 range. Standardization: mean=0, std=1. KNN, SVM, neural networks all need scaled features!", category: "data" },
  { id: 17, scenario: "What is feature engineering?", correctAnswer: "Creating new informative features from existing data to improve model performance", options: ["Creating new informative features from existing data to improve model performance", "Deleting all features", "Using only raw data", "Random feature selection"], hint: "Transform raw data into better predictors", explanation: "Feature engineering creates new signals: date → day_of_week, text → word_count, coordinates → distance_to_city_center. Often more impactful than model choice!", category: "data" },
  { id: 18, scenario: "What Python library is the standard for tabular data manipulation?", correctAnswer: "pandas", options: ["pandas", "pygame", "flask", "django"], hint: "It uses DataFrames — like spreadsheets in code", explanation: "pandas provides DataFrame for data manipulation: read_csv, groupby, merge, pivot_table. Essential for any data scientist!", category: "data" },
  { id: 19, scenario: "What does df.groupby('category').agg({'sales': 'sum', 'count': 'mean'}) do?", correctAnswer: "Groups by category and calculates sum of sales and mean of count per group", options: ["Groups by category and calculates sum of sales and mean of count per group", "Deletes the category column", "Creates a new DataFrame", "Sorts the data"], hint: "groupby splits data, agg applies functions", explanation: "groupby + agg is the split-apply-combine pattern. It's like a PivotTable in code!", category: "data" },

  // === ETHICS ===
  { id: 20, scenario: "An AI hiring tool consistently rejects candidates from certain demographics. This is an example of?", correctAnswer: "Algorithmic Bias", options: ["Algorithmic Bias", "Efficient filtering", "Good AI design", "Random chance"], hint: "The AI learned patterns from biased historical data", explanation: "AI inherits biases from training data. Fairness auditing, diverse datasets, and bias metrics (demographic parity, equalized odds) are crucial!", category: "ethics" },
  { id: 21, scenario: "What is 'explainability' in AI?", correctAnswer: "The ability to understand and explain how a model makes decisions", options: ["The ability to understand and explain how a model makes decisions", "Making AI faster", "Using simpler models only", "Ignoring model outputs"], hint: "Can you explain WHY the model made that prediction?", explanation: "XAI (Explainable AI) uses SHAP, LIME, attention visualization to interpret models. Critical for healthcare, finance, legal AI!", category: "ethics" },

  // === ADVANCED: RAG, LangChain, Deployment ===
  { id: 22, scenario: "What does RAG (Retrieval-Augmented Generation) do?", correctAnswer: "Combines document retrieval with LLM generation for accurate, grounded answers", options: ["Combines document retrieval with LLM generation for accurate, grounded answers", "Generates random text", "Only stores data", "Replaces search engines"], hint: "It retrieves relevant context before generating", explanation: "RAG pipeline: Query → Embed → Vector DB search → Retrieve top-K docs → Inject into LLM prompt → Generate grounded answer. Reduces hallucinations!", category: "algorithms" },
  { id: 23, scenario: "What stores embeddings for similarity search in a RAG system?", correctAnswer: "Vector database (Pinecone, Weaviate, ChromaDB)", options: ["Vector database (Pinecone, Weaviate, ChromaDB)", "Regular SQL database", "Text files", "Excel spreadsheet"], hint: "Numbers representing meaning, searched by similarity", explanation: "Vector DBs store numerical embeddings and use approximate nearest neighbor (ANN) search for fast similarity matching.", category: "algorithms" },
  { id: 24, scenario: "What is LangChain?", correctAnswer: "A framework for building applications powered by language models with chains, agents, and tools", options: ["A framework for building applications powered by language models with chains, agents, and tools", "A blockchain protocol", "A programming language", "A database"], hint: "It connects LLMs to tools and data sources", explanation: "LangChain components: Chains (LLM sequences), Agents (LLM decides tools), Memory (conversation history), Retrievers (document search).", category: "algorithms" },
  { id: 25, scenario: "What is the process of converting text into numerical vectors that capture meaning?", correctAnswer: "Embedding", options: ["Embedding", "Encoding", "Encryption", "Compression"], hint: "Similar words/sentences have similar vectors", explanation: "Embeddings map text to dense vectors. 'king' - 'man' + 'woman' ≈ 'queen'. Models: Word2Vec, BERT, OpenAI embeddings.", category: "algorithms" },
  { id: 26, scenario: "How do you deploy a trained ML model to production?", correctAnswer: "Wrap in an API (Flask/FastAPI), containerize (Docker), deploy to cloud", options: ["Wrap in an API (Flask/FastAPI), containerize (Docker), deploy to cloud", "Email the model file", "Print predictions on paper", "Keep it on your laptop"], hint: "Other applications need to call your model", explanation: "ML Deployment: Train → Serialize (pickle/ONNX) → API wrapper → Docker container → Cloud (AWS/GCP/Azure) → Monitor & retrain.", category: "data" },
  { id: 27, scenario: "What is model drift?", correctAnswer: "When a model's performance degrades over time because real-world data changes", options: ["When a model's performance degrades over time because real-world data changes", "Moving a model to a new server", "Training with more data", "A type of hyperparameter"], hint: "The world changes, but your model doesn't", explanation: "Data drift = input distribution changes. Concept drift = relationship between input and output changes. Monitor and retrain regularly!", category: "data" },
  { id: 28, scenario: "What NumPy operation is 10-100x faster than Python lists for math?", correctAnswer: "Vectorized operations (element-wise on arrays)", options: ["Vectorized operations (element-wise on arrays)", "For loops", "List comprehensions", "Map/filter"], hint: "NumPy uses C under the hood", explanation: "np.array([1,2,3]) * 2 → [2,4,6] without loops. Broadcasting enables operations between different-shaped arrays!", category: "data" },
  { id: 29, scenario: "What is transfer learning?", correctAnswer: "Using a pre-trained model as a starting point and fine-tuning for a new task", options: ["Using a pre-trained model as a starting point and fine-tuning for a new task", "Transferring data between servers", "Moving models to production", "Training from scratch"], hint: "Why train from zero when someone already did the hard work?", explanation: "Transfer learning: take a model trained on millions of images/texts, freeze early layers, fine-tune last layers for your task. Saves time and data!", category: "algorithms" },
  { id: 30, scenario: "What does sklearn.model_selection.cross_validate do?", correctAnswer: "Evaluates model performance using k-fold cross-validation", options: ["Evaluates model performance using k-fold cross-validation", "Trains the model", "Deploys the model", "Visualizes data"], hint: "It splits data k ways and trains/tests k times", explanation: "K-fold CV: split data into k parts, train on k-1, test on 1, rotate. Gives robust performance estimate. Default k=5.", category: "ml-basics" },
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