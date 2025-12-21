import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { ArrowRight, RotateCcw, Check, X, Brain, Lightbulb, Star, Code, Zap } from "lucide-react";

interface Flashcard {
  id: string;
  title: string;
  visual: React.ReactNode;
  steps: string[];
  example: string;
  memory_trick: string;
  category: "loops" | "conditionals" | "methods" | "oop" | "data" | "security" | "systems";
  realWorld: string;
}

// Visual code block component
const CodeBlock = ({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) => (
  <div className={`font-mono text-sm p-3 rounded-lg ${highlight ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/50'}`}>
    {children}
  </div>
);

// Visual step indicator
const StepIndicator = ({ step, label, active }: { step: number; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${active ? 'bg-primary/20 scale-105' : 'bg-muted/30'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
      {step}
    </div>
    <span className={active ? 'text-primary font-semibold' : 'text-muted-foreground'}>{label}</span>
  </div>
);

const flashcards: Flashcard[] = [
  // FOR LOOP - Visual step-by-step
  {
    id: "for-loop",
    title: "FOR Loop: F.I.C.U.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-primary mb-4">🔄 F.I.C.U.</div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary">
            <div className="text-2xl font-black text-primary">F</div>
            <div className="text-xs">for</div>
          </div>
          <div className="bg-accent/20 p-3 rounded-lg border-2 border-accent">
            <div className="text-2xl font-black text-accent">I</div>
            <div className="text-xs">i = 0</div>
          </div>
          <div className="bg-warning/20 p-3 rounded-lg border-2 border-warning">
            <div className="text-2xl font-black text-warning">C</div>
            <div className="text-xs">i &lt; 10</div>
          </div>
          <div className="bg-success/20 p-3 rounded-lg border-2 border-success">
            <div className="text-2xl font-black text-success">U</div>
            <div className="text-xs">i++</div>
          </div>
        </div>
        <div className="text-lg font-mono bg-muted/50 p-3 rounded-lg">
          for(<span className="text-accent">i=0</span>; <span className="text-warning">i&lt;10</span>; <span className="text-success">i++</span>)
        </div>
      </div>
    ),
    steps: ["FOR keyword", "INITIALIZE counter (i = 0)", "CONDITION to check (i < 10)", "UPDATE counter (i++)"],
    example: "for (int i = 0; i < 10; i++) { }",
    memory_trick: "🍕 Think: 'For I Can Understand' - For, Init, Condition, Update",
    category: "loops",
    realWorld: "Like a cashier counting items: Start at 0, check if more items, add 1"
  },
  
  // WHILE LOOP
  {
    id: "while-loop",
    title: "WHILE Loop: W.C.B.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-primary mb-4">⏳ W.C.B.</div>
        <div className="flex justify-center gap-4">
          <div className="bg-primary/20 p-4 rounded-lg border-2 border-primary text-center">
            <div className="text-3xl font-black text-primary">W</div>
            <div className="text-sm">while</div>
          </div>
          <div className="text-3xl flex items-center">→</div>
          <div className="bg-warning/20 p-4 rounded-lg border-2 border-warning text-center">
            <div className="text-3xl font-black text-warning">C</div>
            <div className="text-sm">condition</div>
          </div>
          <div className="text-3xl flex items-center">→</div>
          <div className="bg-success/20 p-4 rounded-lg border-2 border-success text-center">
            <div className="text-3xl font-black text-success">B</div>
            <div className="text-sm">body</div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">⚠️ Check BEFORE running!</div>
      </div>
    ),
    steps: ["WHILE keyword", "CHECK condition first", "RUN body if true", "REPEAT until false"],
    example: "while (hungry) { eat(); }",
    memory_trick: "🚦 Traffic Light: While(green) { drive(); } - Check first, then go!",
    category: "loops",
    realWorld: "Like waiting at a door: While it's locked, keep knocking"
  },

  // DO-WHILE LOOP
  {
    id: "do-while",
    title: "DO-WHILE: D.W.C.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-accent mb-4">🎯 D.W.C.</div>
        <div className="flex justify-center gap-4">
          <div className="bg-success/20 p-4 rounded-lg border-2 border-success text-center">
            <div className="text-3xl font-black text-success">D</div>
            <div className="text-sm">do { }</div>
          </div>
          <div className="text-3xl flex items-center">→</div>
          <div className="bg-primary/20 p-4 rounded-lg border-2 border-primary text-center">
            <div className="text-3xl font-black text-primary">W</div>
            <div className="text-sm">while</div>
          </div>
          <div className="text-3xl flex items-center">→</div>
          <div className="bg-warning/20 p-4 rounded-lg border-2 border-warning text-center">
            <div className="text-3xl font-black text-warning">C</div>
            <div className="text-sm">condition</div>
          </div>
        </div>
        <div className="text-center text-sm text-success font-semibold">✓ Runs AT LEAST once!</div>
      </div>
    ),
    steps: ["DO the action first", "THEN check WHILE condition", "REPEAT if still true"],
    example: "do { askPassword(); } while (!correct);",
    memory_trick: "🎰 Slot Machine: Do(pull) While(want-more) - You pull at least once!",
    category: "loops",
    realWorld: "Like tasting food: Do(taste) then check While(need-salt)"
  },

  // IF-ELSE
  {
    id: "if-else",
    title: "IF-ELSE: I.T.E.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-primary mb-4">🔀 I.T.E.</div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary w-48 text-center">
            <span className="font-black text-primary">IF</span> condition?
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <div className="text-success text-xl">✓</div>
              <div className="bg-success/20 p-2 rounded-lg border border-success text-sm">
                THEN do this
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-destructive text-xl">✗</div>
              <div className="bg-destructive/20 p-2 rounded-lg border border-destructive text-sm">
                ELSE do that
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    steps: ["IF checks a condition", "THEN runs if true", "ELSE runs if false"],
    example: "if (age >= 18) { vote(); } else { wait(); }",
    memory_trick: "🚪 Door Decision: IF(unlocked) enter; ELSE knock",
    category: "conditionals",
    realWorld: "Like a bouncer: IF(age >= 21) let-in; ELSE turn-away"
  },

  // SWITCH-CASE
  {
    id: "switch-case",
    title: "SWITCH: S.C.B.D.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-accent mb-4">🎛️ S.C.B.D.</div>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="text-primary font-bold mb-2">switch(day) {`{`}</div>
          <div className="ml-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 px-2 py-1 rounded text-sm">case "Mon":</span>
              <span className="text-muted-foreground">work();</span>
              <span className="text-warning font-bold">break;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 px-2 py-1 rounded text-sm">case "Sat":</span>
              <span className="text-muted-foreground">relax();</span>
              <span className="text-warning font-bold">break;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-destructive/20 px-2 py-1 rounded text-sm">default:</span>
              <span className="text-muted-foreground">sleep();</span>
            </div>
          </div>
          <div className="text-primary font-bold">{`}`}</div>
        </div>
      </div>
    ),
    steps: ["SWITCH on a variable", "CASE matches values", "BREAK exits switch", "DEFAULT catches all else"],
    example: "switch(grade) { case 'A': great(); break; default: tryAgain(); }",
    memory_trick: "📺 TV Remote: Switch(channel) Case(1): news; Case(2): sports; Default: off",
    category: "conditionals",
    realWorld: "Like a vending machine: Press button → Get specific item"
  },

  // TERNARY OPERATOR
  {
    id: "ternary",
    title: "TERNARY: C ? T : F",
    visual: (
      <div className="space-y-4">
        <div className="text-4xl font-black text-warning mb-4">⚖️ C ? T : F</div>
        <div className="flex items-center justify-center gap-2 text-xl">
          <span className="bg-primary/20 px-3 py-2 rounded-lg border-2 border-primary">Condition</span>
          <span className="text-2xl font-black">?</span>
          <span className="bg-success/20 px-3 py-2 rounded-lg border-2 border-success">True</span>
          <span className="text-2xl font-black">:</span>
          <span className="bg-destructive/20 px-3 py-2 rounded-lg border-2 border-destructive">False</span>
        </div>
        <div className="font-mono bg-muted/50 p-3 rounded-lg text-center">
          result = (age &gt;= 18) <span className="text-warning font-bold">?</span> "adult" <span className="text-warning font-bold">:</span> "minor"
        </div>
      </div>
    ),
    steps: ["Write the Condition", "? for what happens if TRUE", ": for what happens if FALSE"],
    example: "String status = (score > 50) ? \"pass\" : \"fail\";",
    memory_trick: "❓ Question Mark = 'is it true?' then pick left : or right",
    category: "conditionals",
    realWorld: "Like a quick decision: Raining? Umbrella : Sunglasses"
  },

  // METHOD STRUCTURE
  {
    id: "method",
    title: "METHOD: A.R.N.P.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-success mb-4">🔧 A.R.N.P.</div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <div className="bg-primary/20 px-3 py-2 rounded-lg border-2 border-primary">
            <div className="text-sm text-muted-foreground">Access</div>
            <div className="font-bold text-primary">public</div>
          </div>
          <div className="bg-accent/20 px-3 py-2 rounded-lg border-2 border-accent">
            <div className="text-sm text-muted-foreground">Return</div>
            <div className="font-bold text-accent">int</div>
          </div>
          <div className="bg-warning/20 px-3 py-2 rounded-lg border-2 border-warning">
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="font-bold text-warning">add</div>
          </div>
          <div className="bg-success/20 px-3 py-2 rounded-lg border-2 border-success">
            <div className="text-sm text-muted-foreground">Params</div>
            <div className="font-bold text-success">(a, b)</div>
          </div>
        </div>
        <div className="font-mono bg-muted/50 p-3 rounded-lg text-center">
          <span className="text-primary">public</span> <span className="text-accent">int</span> <span className="text-warning">add</span>(<span className="text-success">int a, int b</span>)
        </div>
      </div>
    ),
    steps: ["ACCESS modifier (public/private)", "RETURN type (int/void/String)", "NAME the method", "PARAMETERS in parentheses"],
    example: "public int calculateSum(int a, int b) { return a + b; }",
    memory_trick: "🎭 Actor's Resume: Public(visible) Actor(type) Named(name) Playing(role/params)",
    category: "methods",
    realWorld: "Like a recipe: Who can use it → What it makes → Name → Ingredients"
  },

  // TRY-CATCH
  {
    id: "try-catch",
    title: "TRY-CATCH: T.C.F.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-destructive mb-4">🛡️ T.C.F.</div>
        <div className="space-y-2">
          <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary">
            <span className="font-bold text-primary">TRY</span> - Risky code here
          </div>
          <div className="bg-destructive/20 p-3 rounded-lg border-2 border-destructive">
            <span className="font-bold text-destructive">CATCH</span> - Handle errors
          </div>
          <div className="bg-success/20 p-3 rounded-lg border-2 border-success">
            <span className="font-bold text-success">FINALLY</span> - Always runs
          </div>
        </div>
      </div>
    ),
    steps: ["TRY the risky code", "CATCH any exceptions", "FINALLY cleanup (optional, always runs)"],
    example: "try { readFile(); } catch (Exception e) { log(e); } finally { close(); }",
    memory_trick: "🎪 Trapeze Artist: TRY the trick, CATCH if fall, FINALLY bow",
    category: "methods",
    realWorld: "Like cooking: Try recipe, Catch if burnt, Finally clean kitchen"
  },

  // CLASS STRUCTURE
  {
    id: "class",
    title: "CLASS: C.F.C.M.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-primary mb-4">📦 C.F.C.M.</div>
        <div className="bg-muted/30 p-4 rounded-lg text-sm font-mono">
          <div className="text-primary font-bold">class Dog {`{`}</div>
          <div className="ml-4 space-y-1">
            <div className="text-accent">// Fields (data)</div>
            <div>String name;</div>
            <div className="text-accent mt-2">// Constructor</div>
            <div>Dog(String n) {`{`} name = n; {`}`}</div>
            <div className="text-accent mt-2">// Methods (actions)</div>
            <div>void bark() {`{`} ... {`}`}</div>
          </div>
          <div className="text-primary font-bold">{`}`}</div>
        </div>
      </div>
    ),
    steps: ["CLASS declaration", "FIELDS (variables/data)", "CONSTRUCTOR (setup)", "METHODS (actions)"],
    example: "class Car { String color; Car(String c) { color = c; } void drive() {} }",
    memory_trick: "🏠 House Blueprint: Class=House, Fields=Rooms, Constructor=Builder, Methods=Activities",
    category: "oop",
    realWorld: "Like a blueprint: Name, What it has, How to build, What it does"
  },

  // INHERITANCE
  {
    id: "inheritance",
    title: "INHERITANCE: E.S.O.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-accent mb-4">🧬 E.S.O.</div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary w-32 text-center">
            <div className="font-bold">Animal</div>
            <div className="text-xs text-muted-foreground">(parent)</div>
          </div>
          <div className="text-2xl">↓ extends</div>
          <div className="flex gap-4">
            <div className="bg-accent/20 p-2 rounded-lg border border-accent text-center">
              <div className="font-bold text-sm">Dog</div>
            </div>
            <div className="bg-accent/20 p-2 rounded-lg border border-accent text-center">
              <div className="font-bold text-sm">Cat</div>
            </div>
          </div>
        </div>
        <div className="font-mono text-sm bg-muted/50 p-2 rounded-lg text-center">
          class Dog <span className="text-primary font-bold">extends</span> Animal
        </div>
      </div>
    ),
    steps: ["Child EXTENDS parent", "SUPER calls parent", "OVERRIDE to customize"],
    example: "class Dog extends Animal { @Override void speak() { bark(); } }",
    memory_trick: "👨‍👧 Family Tree: Child Extends parent, gets Super's traits, can Override them",
    category: "oop",
    realWorld: "Like genetics: Dog extends Animal, inherits traits, can override behavior"
  },

  // ARRAY
  {
    id: "array",
    title: "ARRAY: T.N.S.I.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-secondary mb-4">📊 T.N.S.I.</div>
        <div className="flex justify-center gap-1 mb-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-12 h-12 bg-primary/20 border-2 border-primary rounded flex flex-col items-center justify-center">
              <div className="text-lg font-bold">{i * 10}</div>
              <div className="text-[10px] text-muted-foreground">[{i}]</div>
            </div>
          ))}
        </div>
        <div className="font-mono text-sm bg-muted/50 p-2 rounded-lg text-center">
          <span className="text-accent">int[]</span> nums = <span className="text-primary">new int[5]</span>;
        </div>
      </div>
    ),
    steps: ["TYPE with brackets []", "NAME the array", "SIZE is fixed", "INDEX starts at 0"],
    example: "String[] names = new String[3]; names[0] = \"Alice\";",
    memory_trick: "🗄️ Filing Cabinet: Type[] Name = new Type[Size]; Access by drawer number [0,1,2...]",
    category: "data",
    realWorld: "Like parking spots: Fixed number, numbered from 0"
  },

  // LIST/ARRAYLIST
  {
    id: "arraylist",
    title: "ArrayList: A.G.A.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-success mb-4">📋 A.G.A.</div>
        <div className="flex justify-center items-center gap-1 mb-4">
          <div className="w-10 h-10 bg-success/20 border-2 border-success rounded flex items-center justify-center">A</div>
          <div className="w-10 h-10 bg-success/20 border-2 border-success rounded flex items-center justify-center">B</div>
          <div className="w-10 h-10 bg-success/20 border-2 border-success rounded flex items-center justify-center">C</div>
          <div className="text-2xl mx-2">→</div>
          <div className="w-10 h-10 bg-success/30 border-2 border-dashed border-success rounded flex items-center justify-center text-success">+</div>
        </div>
        <div className="text-center text-sm text-success font-semibold">Grows automatically!</div>
        <div className="font-mono text-sm bg-muted/50 p-2 rounded-lg text-center">
          ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();
        </div>
      </div>
    ),
    steps: ["ArrayList declaration", "GROWS dynamically", "ADD/remove anytime"],
    example: "list.add(\"item\"); list.remove(0); list.get(1);",
    memory_trick: "🎈 Balloon String: Add balloons anytime, remove anytime, no fixed size",
    category: "data",
    realWorld: "Like a shopping cart: Add items, remove items, grows as needed"
  },

  // HASHMAP
  {
    id: "hashmap",
    title: "HashMap: K.V.P.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-warning mb-4">🗺️ K.V.P.</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 px-3 py-2 rounded-lg border border-primary font-mono">"name"</div>
            <span className="text-xl">→</span>
            <div className="bg-accent/20 px-3 py-2 rounded-lg border border-accent">"Alice"</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 px-3 py-2 rounded-lg border border-primary font-mono">"age"</div>
            <span className="text-xl">→</span>
            <div className="bg-accent/20 px-3 py-2 rounded-lg border border-accent">25</div>
          </div>
        </div>
        <div className="font-mono text-sm bg-muted/50 p-2 rounded-lg text-center">
          HashMap&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
        </div>
      </div>
    ),
    steps: ["KEY to look up", "VALUE to retrieve", "PUT and GET pairs"],
    example: "map.put(\"score\", 100); int s = map.get(\"score\");",
    memory_trick: "📚 Dictionary: Word(key) → Definition(value). Look up word, get meaning!",
    category: "data",
    realWorld: "Like a phone book: Name → Number, look up name to get number"
  },

  // SECURITY - Authentication
  {
    id: "auth",
    title: "AUTH: A.A.A.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-destructive mb-4">🔐 A.A.A.</div>
        <div className="space-y-2">
          <div className="bg-primary/20 p-3 rounded-lg border-l-4 border-primary">
            <span className="font-bold text-primary">Authentication</span> - WHO are you?
          </div>
          <div className="bg-accent/20 p-3 rounded-lg border-l-4 border-accent">
            <span className="font-bold text-accent">Authorization</span> - WHAT can you do?
          </div>
          <div className="bg-warning/20 p-3 rounded-lg border-l-4 border-warning">
            <span className="font-bold text-warning">Accounting</span> - WHAT did you do?
          </div>
        </div>
      </div>
    ),
    steps: ["AUTHENTICATE identity (login)", "AUTHORIZE access (permissions)", "ACCOUNT for actions (logs)"],
    example: "login() → checkPermissions() → logActivity()",
    memory_trick: "🎫 Concert Entry: Show ID(auth), Check ticket type(authz), Log entry(accounting)",
    category: "security",
    realWorld: "Like entering a building: Badge(who), Floor access(what), Sign-in log(record)"
  },

  // SYSTEMS - Input-Process-Output
  {
    id: "ipo",
    title: "SYSTEM: I.P.O.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-primary mb-4">⚙️ I.P.O.</div>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-accent/20 p-4 rounded-lg border-2 border-accent text-center">
            <div className="text-2xl mb-1">📥</div>
            <div className="font-bold text-accent">INPUT</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-primary/20 p-4 rounded-lg border-2 border-primary text-center">
            <div className="text-2xl mb-1">⚙️</div>
            <div className="font-bold text-primary">PROCESS</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-success/20 p-4 rounded-lg border-2 border-success text-center">
            <div className="text-2xl mb-1">📤</div>
            <div className="font-bold text-success">OUTPUT</div>
          </div>
        </div>
      </div>
    ),
    steps: ["INPUT data enters", "PROCESS transforms it", "OUTPUT result exits"],
    example: "input(order) → process(payment) → output(receipt)",
    memory_trick: "🏭 Factory: Raw materials IN, Machine PROCESSES, Products OUT",
    category: "systems",
    realWorld: "Like a coffee machine: Coffee beans(in), Grind & brew(process), Coffee(out)"
  },

  // ACID Transactions
  {
    id: "acid",
    title: "DATABASE: A.C.I.D.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-success mb-4">💾 A.C.I.D.</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary">
            <span className="font-bold text-primary">A</span>tomic - All or nothing
          </div>
          <div className="bg-accent/20 p-2 rounded-lg border border-accent">
            <span className="font-bold text-accent">C</span>onsistent - Valid state
          </div>
          <div className="bg-warning/20 p-2 rounded-lg border border-warning">
            <span className="font-bold text-warning">I</span>solated - No interference
          </div>
          <div className="bg-success/20 p-2 rounded-lg border border-success">
            <span className="font-bold text-success">D</span>urable - Permanent
          </div>
        </div>
      </div>
    ),
    steps: ["ATOMIC: Complete fully or not at all", "CONSISTENT: Database stays valid", "ISOLATED: Transactions don't interfere", "DURABLE: Changes are permanent"],
    example: "Transfer money: Both accounts update or neither does",
    memory_trick: "💰 Bank Transfer: Either BOTH accounts change or NEITHER - no half-done!",
    category: "systems",
    realWorld: "Like moving money: Debit AND credit happen together, or not at all"
  },

  // MVC Pattern
  {
    id: "mvc",
    title: "PATTERN: M.V.C.",
    visual: (
      <div className="space-y-3">
        <div className="text-4xl font-black text-accent mb-4">🏗️ M.V.C.</div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary text-center w-24">
              <div className="font-bold text-primary">Model</div>
              <div className="text-xs">Data</div>
            </div>
            <div className="bg-accent/20 p-3 rounded-lg border-2 border-accent text-center w-24">
              <div className="font-bold text-accent">View</div>
              <div className="text-xs">Display</div>
            </div>
            <div className="bg-success/20 p-3 rounded-lg border-2 border-success text-center w-24">
              <div className="font-bold text-success">Controller</div>
              <div className="text-xs">Logic</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">User → Controller → Model → View → User</div>
        </div>
      </div>
    ),
    steps: ["MODEL stores data", "VIEW displays to user", "CONTROLLER handles logic"],
    example: "User clicks → Controller processes → Model updates → View refreshes",
    memory_trick: "🎬 Movie Set: Model=Script, View=Screen, Controller=Director",
    category: "systems",
    realWorld: "Like a restaurant: Chef(Controller), Recipe(Model), Plate presentation(View)"
  },
];

const categoryColors: Record<string, string> = {
  loops: "bg-primary/20 text-primary border-primary/30",
  conditionals: "bg-accent/20 text-accent border-accent/30",
  methods: "bg-success/20 text-success border-success/30",
  oop: "bg-warning/20 text-warning border-warning/30",
  data: "bg-secondary/20 text-secondary border-secondary/30",
  security: "bg-destructive/20 text-destructive border-destructive/30",
  systems: "bg-primary/20 text-primary border-primary/30",
};

const categoryLabels: Record<string, string> = {
  loops: "🔄 Loops",
  conditionals: "🔀 Conditionals",
  methods: "🔧 Methods",
  oop: "📦 OOP",
  data: "📊 Data Structures",
  security: "🔐 Security",
  systems: "⚙️ Systems",
};

export function MnemonicFlashcardGame() {
  const { playSound } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [learning, setLearning] = useState<string[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((known.length + learning.length) / flashcards.length) * 100;

  const handleReveal = useCallback(() => {
    setShowAnswer(true);
    playSound("click");
  }, [playSound]);

  const handleKnow = useCallback(() => {
    if (!known.includes(currentCard.id)) {
      setKnown([...known, currentCard.id]);
    }
    playSound("success");
    nextCard();
  }, [currentCard, known, playSound]);

  const handleLearning = useCallback(() => {
    if (!learning.includes(currentCard.id) && !known.includes(currentCard.id)) {
      setLearning([...learning, currentCard.id]);
    }
    playSound("click");
    nextCard();
  }, [currentCard, learning, known, playSound]);

  const nextCard = () => {
    setShowAnswer(false);
    setShowSteps(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnown([]);
    setLearning([]);
    setShowSteps(false);
    setIsComplete(false);
    playSound("click");
  };

  if (isComplete) {
    const accuracy = Math.round((known.length / flashcards.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-3xl font-black text-foreground mb-4">Session Complete!</h2>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="bg-success/10 border-success/30">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">{known.length}</p>
              <p className="text-sm text-muted-foreground">Mastered</p>
            </CardContent>
          </Card>
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-3xl font-bold text-warning">{learning.length}</p>
              <p className="text-sm text-muted-foreground">Learning</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <p className="text-xl text-muted-foreground mb-2">Retention Rate</p>
          <p className="text-5xl font-black text-primary">{accuracy}%</p>
        </div>

        <Button size="lg" onClick={resetGame} className="gap-2">
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-success">
              <Check className="w-4 h-4" /> {known.length}
            </span>
            <span className="flex items-center gap-1 text-warning">
              <Brain className="w-4 h-4" /> {learning.length}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Category Badge */}
      <div className="flex justify-center mb-4">
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${categoryColors[currentCard.category]}`}>
          {categoryLabels[currentCard.category]}
        </span>
      </div>

      {/* Main Card */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          {/* Title */}
          <h3 className="text-2xl font-black text-foreground mb-6 text-center">
            {currentCard.title}
          </h3>

          {/* Visual */}
          <div className="mb-6">
            {currentCard.visual}
          </div>

          {/* Memory Trick - Always visible */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              <span className="font-bold text-warning">Memory Trick</span>
            </div>
            <p className="text-foreground">{currentCard.memory_trick}</p>
          </div>

          {/* Show Steps Toggle */}
          {!showAnswer && (
            <Button
              variant="outline"
              onClick={() => setShowSteps(!showSteps)}
              className="w-full mb-4"
            >
              <Code className="w-4 h-4 mr-2" />
              {showSteps ? "Hide Steps" : "Show Step-by-Step"}
            </Button>
          )}

          {/* Steps */}
          <AnimatePresence>
            {showSteps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 mb-4"
              >
                {currentCard.steps.map((step, i) => (
                  <StepIndicator key={i} step={i + 1} label={step} active />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Section */}
          {!showAnswer ? (
            <Button onClick={handleReveal} className="w-full" size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Show Full Answer
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Code Example */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Code Example:</p>
                <code className="font-mono text-sm text-foreground">{currentCard.example}</code>
              </div>

              {/* Real World Analogy */}
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-accent font-semibold mb-1">Real World:</p>
                <p className="text-foreground">{currentCard.realWorld}</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={handleLearning}
            className="h-16 text-lg gap-2 border-warning text-warning hover:bg-warning/10"
          >
            <Brain className="w-6 h-6" />
            Still Learning
          </Button>
          <Button
            size="lg"
            onClick={handleKnow}
            className="h-16 text-lg gap-2 bg-success hover:bg-success/90"
          >
            <Check className="w-6 h-6" />
            Got It!
          </Button>
        </motion.div>
      )}

      {/* Tip */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        💡 Practice daily! Visual patterns stick better than text alone.
      </p>
    </div>
  );
}