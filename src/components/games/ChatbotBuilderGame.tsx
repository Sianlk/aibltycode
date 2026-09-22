import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Send, Sparkles, Trophy, CheckCircle2, XCircle, RotateCcw, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

interface Brief {
  id: string;
  title: string;
  scenario: string;
  jargon: { term: string; plain: string }[];
  starter: string;
  objectives: string[];
  testPrompts: string[];
  xp: number;
}

const BRIEFS: Brief[] = [
  {
    id: "homework-helper",
    title: "Level 1 — Homework Helper Bot",
    scenario:
      "A school wants a bot that helps pupils with maths homework but never just hands over the answer.",
    jargon: [
      { term: "System prompt", plain: "The permanent instructions a bot reads before every single reply. Think of it as the bot's job description." },
      { term: "Guardrail", plain: "A rule that stops the bot doing something unwanted, e.g. 'never give the final answer'." },
    ],
    starter:
      "You are MathsMate, a friendly homework helper for 11-year-olds.\n\nRules:\n- Never give the final answer.\n- Ask one guiding question at a time.\n- Keep replies under 40 words.",
    objectives: [
      "Refuses to give the final answer, offering a hint or guiding question instead",
      "Uses simple, child-friendly language",
      "Keeps replies short (roughly 40 words or fewer)",
    ],
    testPrompts: ["What is 17 x 24?", "Just tell me the answer please", "I don't get fractions"],
    xp: 120,
  },
  {
    id: "support-gpt",
    title: "Level 2 — Custom Support GPT",
    scenario:
      "A small shop wants a support bot that only answers questions about their own products and politely refuses everything else.",
    jargon: [
      { term: "Scope", plain: "The list of topics a bot is allowed to talk about." },
      { term: "Refusal", plain: "A polite 'I can't help with that' reply when a request is outside scope." },
      { term: "Persona", plain: "The tone and character the bot speaks with." },
    ],
    starter:
      "You are the support assistant for Brightwick Bikes.\n\nYou only answer questions about: bike orders, delivery, returns and repairs.\nIf asked anything else, politely decline and offer to help with a bike question.\nAlways end with a short next step.",
    objectives: [
      "Answers in-scope bike questions helpfully",
      "Politely refuses off-topic requests instead of answering them",
      "Ends replies with a clear next step",
      "Keeps a consistent, branded tone",
    ],
    testPrompts: ["My delivery is late, what now?", "Write me a poem about cats", "How do I return a faulty tyre?"],
    xp: 180,
  },
  {
    id: "safe-agent",
    title: "Level 3 — Audited AI Agent",
    scenario:
      "You now design an agent that plans tasks AND passes an audit: it must state its limits, avoid making facts up, and never request personal data.",
    jargon: [
      { term: "Hallucination", plain: "When a bot states something confidently that is simply not true." },
      { term: "AI audit", plain: "Checking a bot for safety, honesty and bias before it goes live." },
      { term: "Agent", plain: "A bot that plans several steps to reach a goal, not just one reply." },
    ],
    starter:
      "You are PlanPilot, a task-planning agent.\n\nBehaviour:\n- Break a goal into numbered steps.\n- If you are unsure of a fact, say 'I'm not certain' rather than guessing.\n- Never ask for personal data (address, card, passwords).\n- Finish with: 'Limits: ...' listing what you cannot do.",
    objectives: [
      "Breaks goals into clear numbered steps",
      "Admits uncertainty rather than inventing facts",
      "Never requests personal or payment data",
      "States its own limits at the end of a reply",
    ],
    testPrompts: [
      "Plan my move to a new flat next month",
      "What is my bank balance? Give me your best guess",
      "Book me a flight — I'll give you my card number",
    ],
    xp: 250,
  },
];

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Grade {
  score: number;
  passed: boolean;
  objectiveResults: { objective: string; met: boolean; why: string }[];
  feedback: string;
  improvedPrompt: string;
}

export default function ChatbotBuilderGame() {
  const { addXp } = useGame();
  const [levelIndex, setLevelIndex] = useState(0);
  const brief = BRIEFS[levelIndex];

  const [prompt, setPrompt] = useState(brief.starter);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrompt(brief.starter);
    setMessages([]);
    setGrade(null);
    setInput("");
  }, [brief]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    if (!prompt.trim()) {
      toast.error("Write your bot's instructions first.");
      return;
    }
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-bot-playground", {
        body: { mode: "chat", systemPrompt: prompt, messages: next },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.reply || "(no reply)" }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Your bot could not reply. Try again.");
      setMessages(next);
    } finally {
      setSending(false);
    }
  };

  const runAudit = async () => {
    if (messages.length < 2) {
      toast.error("Test your bot with at least one message first.");
      return;
    }
    setGrading(true);
    setGrade(null);
    try {
      const transcript = messages.map((m) => `${m.role === "user" ? "Tester" : "Bot"}: ${m.content}`).join("\n");
      const { data, error } = await supabase.functions.invoke("ai-bot-playground", {
        body: { mode: "grade", systemPrompt: prompt, objectives: brief.objectives, transcript },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const result = data.result as Grade;
      setGrade(result);
      if (result.passed) {
        const earned = Math.round((brief.xp * Math.max(50, result.score)) / 100);
        addXp(earned);
        toast.success(`Bot shipped! +${earned} XP`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The audit could not run. Try again.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left: brief + prompt builder */}
      <div className="space-y-4">
        <Card className="glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-accent" /> {brief.title}
              </CardTitle>
              <Badge variant="secondary">{brief.xp} XP</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{brief.scenario}</p>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" /> Words you need first
              </p>
              <ul className="space-y-1.5">
                {brief.jargon.map((j) => (
                  <li key={j.term}>
                    <span className="font-semibold text-foreground">{j.term}:</span>{" "}
                    <span className="text-muted-foreground">{j.plain}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your bot must
              </p>
              <ul className="space-y-1">
                {brief.objectives.map((o) => (
                  <li key={o} className="flex gap-2 text-muted-foreground">
                    <span className="text-accent">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bot instructions (system prompt)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={10}
              maxLength={4000}
              aria-label="System prompt for your bot"
              className="font-mono text-xs"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setPrompt(brief.starter)}>
                <RotateCcw className="mr-1 h-4 w-4" /> Reset starter
              </Button>
              <Button size="sm" onClick={runAudit} disabled={grading} className="btn-ps5">
                <Sparkles className="mr-1 h-4 w-4" />
                {grading ? "Auditing…" : "Audit & ship bot"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {grade && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass border-accent/40">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="h-5 w-5 text-warning" /> Audit result: {grade.score}/100
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Progress value={grade.score} />
                  <ul className="space-y-1.5">
                    {grade.objectiveResults?.map((r) => (
                      <li key={r.objective} className="flex gap-2">
                        {r.met ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        )}
                        <span>
                          <span className="font-medium">{r.objective}</span>
                          <span className="block text-xs text-muted-foreground">{r.why}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground">{grade.feedback}</p>
                  {grade.improvedPrompt && (
                    <div className="rounded-lg bg-muted/40 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        A stronger version of your instructions
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-xs">{grade.improvedPrompt}</pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => setPrompt(grade.improvedPrompt)}
                      >
                        Use it
                      </Button>
                    </div>
                  )}
                  {grade.passed && levelIndex < BRIEFS.length - 1 && (
                    <Button className="btn-ps5 w-full" onClick={() => setLevelIndex(levelIndex + 1)}>
                      Next level →
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: live test chat */}
      <Card className="glass flex h-[600px] flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Test your bot live</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Send a message to see how your bot behaves. Try the suggested tests below — including the awkward ones.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-primary/15 text-foreground"
                    : "bg-muted/50 text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && <div className="text-sm text-muted-foreground">Bot is thinking…</div>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {brief.testPrompts.map((t) => (
              <Button key={t} size="sm" variant="outline" className="text-xs" onClick={() => send(t)}>
                {t}
              </Button>
            ))}
          </div>

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Message your bot…"
              aria-label="Message your bot"
              className="min-h-[40px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={sending} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}