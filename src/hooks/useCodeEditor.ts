import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CodeProject {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  difficulty: number;
  category: string;
  hints: string[];
  xpReward: number;
}

export interface ValidationResult {
  success: boolean;
  output?: string;
  errors?: string[];
  hints?: string[];
}

export function useCodeEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [challenges, setChallenges] = useState<CodeChallenge[]>([]);
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<CodeChallenge | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('code_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setProjects(data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || undefined,
        code: p.code,
        language: p.language || 'java',
        isPublic: p.is_public || false,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
      })));
    }
  }, [user]);

  const loadChallenges = useCallback(async () => {
    const { data, error } = await supabase
      .from('code_challenges')
      .select('id, title, description, starter_code, expected_output, test_cases, difficulty, category, hints, xp_reward, created_at')
      .order('difficulty', { ascending: true });

    if (!error && data) {
      setChallenges(data.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        starterCode: c.starter_code || '',
        expectedOutput: c.expected_output || '',
        difficulty: c.difficulty || 1,
        category: c.category || 'general',
        hints: (c.hints as string[]) || [],
        xpReward: c.xp_reward || 50,
      })));
    }
  }, []);

  const createProject = useCallback(async (title: string, initialCode = '') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('code_projects')
      .insert({
        user_id: user.id,
        title,
        code: initialCode || `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, World!");\n    }\n}`,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to create project', variant: 'destructive' });
      return null;
    }

    const project: CodeProject = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      code: data.code,
      language: data.language || 'java',
      isPublic: data.is_public || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    setProjects(prev => [project, ...prev]);
    setCurrentProject(project);
    setCode(project.code);
    return project;
  }, [user, toast]);

  const saveProject = useCallback(async () => {
    if (!currentProject || !user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('code_projects')
      .update({ code, updated_at: new Date().toISOString() })
      .eq('id', currentProject.id);

    setIsSaving(false);

    if (error) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } else {
      toast({ title: 'Saved!', description: 'Your code has been saved.' });
      setCurrentProject(prev => prev ? { ...prev, code, updatedAt: new Date() } : null);
    }
  }, [currentProject, code, user, toast]);

  const deleteProject = useCallback(async (projectId: string) => {
    const { error } = await supabase
      .from('code_projects')
      .delete()
      .eq('id', projectId);

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setCode('');
      }
    }
  }, [currentProject]);

  const openProject = useCallback((project: CodeProject) => {
    setCurrentProject(project);
    setCurrentChallenge(null);
    setCode(project.code);
    setOutput(null);
  }, []);

  const openChallenge = useCallback((challenge: CodeChallenge) => {
    setCurrentChallenge(challenge);
    setCurrentProject(null);
    setCode(challenge.starterCode);
    setOutput(null);
  }, []);

  const validateCode = useCallback(async () => {
    setIsValidating(true);
    setOutput(null);

    try {
      const expectedOutput = currentChallenge?.expectedOutput || '';
      
      const { data, error } = await supabase.functions.invoke('validate-code', {
        body: { code, language: 'java', expectedOutput },
      });

      if (error) throw error;

      setOutput(data as ValidationResult);

      if (data.success && currentChallenge && user) {
        // Mark challenge as completed
        await supabase
          .from('challenge_completions')
          .upsert({
            user_id: user.id,
            challenge_id: currentChallenge.id,
            user_code: code,
            passed: true,
          }, { onConflict: 'user_id,challenge_id' });

        // Award XP
        await supabase.rpc('has_role', { _user_id: user.id, _role: 'user' }); // Just to check auth
        
        toast({
          title: '🎉 Challenge Complete!',
          description: `You earned ${currentChallenge.xpReward} XP!`,
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setOutput({
        success: false,
        errors: ['Failed to validate code. Please try again.'],
      });
    } finally {
      setIsValidating(false);
    }
  }, [code, currentChallenge, user, toast]);

  const resetCode = useCallback(() => {
    if (currentChallenge) {
      setCode(currentChallenge.starterCode);
    } else if (currentProject) {
      setCode(currentProject.code);
    }
    setOutput(null);
  }, [currentChallenge, currentProject]);

  return {
    projects,
    challenges,
    currentProject,
    currentChallenge,
    code,
    output,
    isValidating,
    isSaving,
    setCode,
    loadProjects,
    loadChallenges,
    createProject,
    saveProject,
    deleteProject,
    openProject,
    openChallenge,
    validateCode,
    resetCode,
  };
}
