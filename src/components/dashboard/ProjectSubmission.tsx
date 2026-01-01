import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Send, 
  CheckCircle2, 
  Code, 
  Database, 
  Shield, 
  Calculator,
  FileCode,
  Award,
  X
} from "lucide-react";

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  xpReward: number;
  skillsTested: string[];
  rubric: string[];
}

const projectTasks: ProjectTask[] = [
  {
    id: "java-calculator",
    title: "Build a Calculator",
    description: "Create a command-line calculator that handles +, -, *, / operations with proper input validation and error handling.",
    category: "Java Programming",
    icon: <Code className="w-5 h-5" />,
    xpReward: 150,
    skillsTested: ["variables", "operators", "if-else", "methods", "exceptions"],
    rubric: [
      "Uses Scanner for input",
      "Handles all 4 operations",
      "Validates input (not zero divisor)",
      "Uses methods for operations",
      "Has try-catch for exceptions"
    ]
  },
  {
    id: "erd-library",
    title: "Design Library Database",
    description: "Create an ERD for a library system with Books, Members, Loans, and Authors entities. Include proper relationships and keys.",
    category: "Systems Analysis",
    icon: <Database className="w-5 h-5" />,
    xpReward: 175,
    skillsTested: ["entities", "relationships", "primary-keys", "foreign-keys", "normalization"],
    rubric: [
      "All 4 entities defined",
      "Primary keys identified",
      "Foreign keys for relationships",
      "Cardinality shown (1:N, M:N)",
      "At least 3NF normalization"
    ]
  },
  {
    id: "security-audit",
    title: "Security Assessment Report",
    description: "Perform a security assessment on a fictional e-commerce website. Identify vulnerabilities and recommend controls.",
    category: "Cybersecurity",
    icon: <Shield className="w-5 h-5" />,
    xpReward: 200,
    skillsTested: ["threats", "vulnerabilities", "risk-assessment", "controls", "compliance"],
    rubric: [
      "Identifies 5+ vulnerabilities",
      "Rates risk (likelihood × impact)",
      "Recommends specific controls",
      "Prioritizes remediation",
      "References CIA triad"
    ]
  },
  {
    id: "algorithm-analysis",
    title: "Algorithm Complexity Report",
    description: "Analyze 3 sorting algorithms (bubble, merge, quick sort) and compare their time/space complexity with explanations.",
    category: "Maths for Computing",
    icon: <Calculator className="w-5 h-5" />,
    xpReward: 175,
    skillsTested: ["big-o", "time-complexity", "space-complexity", "comparison"],
    rubric: [
      "Correct Big-O for each algorithm",
      "Best/average/worst cases",
      "Space complexity analysis",
      "Trade-off discussion",
      "Real-world use case examples"
    ]
  },
  {
    id: "ml-project",
    title: "ML Classification Project",
    description: "Design a machine learning pipeline for classifying customer churn. Describe data preprocessing, model selection, and evaluation.",
    category: "AI & Data Science",
    icon: <FileCode className="w-5 h-5" />,
    xpReward: 225,
    skillsTested: ["data-cleaning", "train-test-split", "classification", "evaluation"],
    rubric: [
      "Data cleaning steps described",
      "Feature selection justified",
      "Model choice explained",
      "Train/test split defined",
      "Evaluation metrics chosen"
    ]
  }
];

interface ProjectSubmissionProps {
  compact?: boolean;
  onClose?: () => void;
}

export function ProjectSubmission({ compact = false, onClose }: ProjectSubmissionProps) {
  const { user } = useAuth();
  const { saveGameScore } = useProgress();
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [submission, setSubmission] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || !selectedTask || !submission.trim()) {
      toast.error("Please complete all fields");
      return;
    }

    setSubmitting(true);
    try {
      // Save as game score for tracking
      await saveGameScore({
        gameType: `project-${selectedTask.id}`,
        score: selectedTask.xpReward,
        accuracy: 100,
        timeTaken: 0
      });

      // Update leaderboard XP
      const { data: existing } = await supabase
        .from('leaderboard')
        .select('total_xp')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('leaderboard')
          .update({ total_xp: (existing.total_xp || 0) + selectedTask.xpReward })
          .eq('user_id', user.id);
      }

      setSubmitted(true);
      toast.success(`🎉 Project submitted! +${selectedTask.xpReward} XP`);
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedTask(null);
    setSubmission("");
    setTitle("");
    setSubmitted(false);
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-accent/10 via-card to-primary/5 border-accent/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Real-World Projects
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Apply your skills to practical challenges and earn bonus XP!
          </p>
          <div className="space-y-2">
            {projectTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {task.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.category}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{task.xpReward} XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-accent" />
            Real-World Projects
          </h2>
          <p className="text-muted-foreground">
            Apply your learning to practical challenges and prove mastery
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedTask ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {projectTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {task.icon}
                      </div>
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        +{task.xpReward} XP
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {task.skillsTested.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {task.skillsTested.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.skillsTested.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-success mb-2">Project Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              You earned <span className="text-primary font-bold">+{selectedTask.xpReward} XP</span>
            </p>
            <Button onClick={resetForm}>
              Submit Another Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                    ← Back
                  </Button>
                  <div className="flex-1">
                    <CardTitle>{selectedTask.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedTask.category}</p>
                  </div>
                  <Badge className="bg-accent/20 text-accent">
                    +{selectedTask.xpReward} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">📋 Task Description</h4>
                  <p className="text-muted-foreground">{selectedTask.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">✅ Rubric (What we're looking for)</h4>
                  <ul className="space-y-1">
                    {selectedTask.rubric.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <Input
                      placeholder="My Calculator App"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Submission (Code, Design, or Report)
                    </label>
                    <Textarea
                      placeholder="Paste your code, describe your design, or write your report here..."
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !submission.trim() || !title.trim()}
                  className="w-full h-12"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Project
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
