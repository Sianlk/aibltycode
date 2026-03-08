import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Code2, Zap, Trophy, GraduationCap, Gamepad2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

type UserMode = 'kid' | 'pro';

const AuthPage: React.FC = () => {
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMode) {
      setShowModeSelection(true);
      return;
    }

    try {
      authSchema.parse({ email, password, displayName });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, displayName, selectedMode);
    setLoading(false);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Email already registered. Try signing in.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created! Welcome to AibiltyCode.');
      navigate('/dashboard');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      toast.error('Invalid credentials. Check your email and password.');
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleModeSelect = (mode: UserMode) => {
    setSelectedMode(mode);
    setShowModeSelection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Code2 className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AibiltyCode
            </span>
          </motion.div>
          <p className="text-muted-foreground">Master coding &amp; tech from scratch</p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Learn to code the smart way — no experience needed</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <AnimatePresence mode="wait">
                  {showModeSelection ? (
                    <motion.div
                      key="mode-selection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-2">
                        <h3 className="font-bold text-lg text-foreground">Who's learning?</h3>
                        <p className="text-sm text-muted-foreground">Choose the experience that fits you</p>
                      </div>

                      <button
                        onClick={() => handleModeSelect('kid')}
                        className="w-full p-5 rounded-xl border-2 border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all text-left flex items-start gap-4 group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Gamepad2 className="w-7 h-7 text-warning" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">Young Coder</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ages 8–16 · Fun games, mascots, bright colours, and step-by-step adventures. 
                            Parental controls included.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleModeSelect('pro')}
                        className="w-full p-5 rounded-xl border-2 border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all text-left flex items-start gap-4 group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">Adult Learner</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ages 16+ · Professional interface, career-focused tracks, and industry tools. 
                            Zero experience needed.
                          </p>
                        </div>
                      </button>

                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-muted-foreground"
                        onClick={() => setShowModeSelection(false)}
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Display Name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <Input
                          type="password"
                          placeholder="Password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        {selectedMode && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border">
                            <div className="flex items-center gap-2">
                              {selectedMode === 'kid' ? (
                                <Gamepad2 className="w-5 h-5 text-warning" />
                              ) : (
                                <GraduationCap className="w-5 h-5 text-primary" />
                              )}
                              <span className="text-sm font-medium text-foreground">
                                {selectedMode === 'kid' ? 'Young Coder' : 'Adult Learner'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowModeSelection(true)}
                              className="text-xs text-primary hover:underline"
                            >
                              Change
                            </button>
                          </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Creating account...' : selectedMode ? 'Create Account' : 'Next: Choose Your Mode'}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center gap-1">
                  <Zap className="h-5 w-5 text-warning" />
                  <span className="text-muted-foreground">Zero to Pro</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Trophy className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">Earn Badges</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Real Skills</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
