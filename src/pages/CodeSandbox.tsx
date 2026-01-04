import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw, Save, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { OutputConsole } from '@/components/editor/OutputConsole';
import { ChallengePanel } from '@/components/editor/ChallengePanel';
import { useCodeEditor } from '@/hooks/useCodeEditor';
import { TutorFloatingButton } from '@/components/tutor/TutorFloatingButton';

export default function CodeSandbox() {
  const navigate = useNavigate();
  const {
    challenges, currentChallenge, code, output, isValidating, isSaving,
    setCode, loadChallenges, openChallenge, validateCode, resetCode, createProject, saveProject
  } = useCodeEditor();

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Code Lab</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetCode} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              onClick={validateCode} 
              disabled={isValidating}
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500"
            >
              <Play className="h-4 w-4" />
              Run Code
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Challenge Panel */}
          <div className="lg:col-span-1">
            <ChallengePanel
              challenges={challenges}
              currentChallenge={currentChallenge}
              onSelectChallenge={openChallenge}
            />
          </div>

          {/* Editor & Output */}
          <div className="lg:col-span-3 space-y-4">
            <CodeEditor
              value={code}
              onChange={setCode}
              minHeight="400px"
            />
            <OutputConsole result={output} isLoading={isValidating} />
          </div>
        </div>
      </main>

      <TutorFloatingButton currentTopic={currentChallenge?.title} />
    </div>
  );
}
