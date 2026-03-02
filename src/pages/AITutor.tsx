import React from 'react';
import { TutorChat } from '@/components/tutor/TutorChat';
import { Header } from '@/components/layout/Header';

export default function AITutor() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        <TutorChat className="h-full" />
      </main>
    </div>
  );
}
