import React, { useEffect } from 'react';
import { TutorChat } from '@/components/tutor/TutorChat';
import { Header } from '@/components/layout/Header';

export default function AITutor() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <TutorChat className="h-[calc(100vh-64px)]" />
      </main>
    </div>
  );
}
