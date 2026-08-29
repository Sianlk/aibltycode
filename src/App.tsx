import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TutorFloatingButton } from "@/components/tutor/TutorFloatingButton";
import React, { Suspense } from "react";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Lazy-load heavy pages to reduce initial bundle
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const GamePage = React.lazy(() => import("./pages/GamePage"));
const ZonePage = React.lazy(() => import("./pages/ZonePage"));
const ModulePage = React.lazy(() => import("./pages/ModulePage"));
const LessonPage = React.lazy(() => import("./pages/LessonPage"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const MultiplayerBattle = React.lazy(() => import("./pages/MultiplayerBattle"));
const AITutor = React.lazy(() => import("./pages/AITutor"));
const CodeSandbox = React.lazy(() => import("./pages/CodeSandbox"));
const AvatarPage = React.lazy(() => import("./pages/AvatarPage"));
const InstallApp = React.lazy(() => import("./pages/InstallApp"));
const LearningPath = React.lazy(() => import("./pages/LearningPath"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GameProvider>
        <AchievementProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to main content
              </a>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
                  <Route path="/game/:gameId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
                  <Route path="/module/:moduleId" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
                  <Route path="/zone/:zoneId" element={<ProtectedRoute><ZonePage /></ProtectedRoute>} />
                  <Route path="/lesson/:moduleId/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/battle" element={<ProtectedRoute><MultiplayerBattle /></ProtectedRoute>} />
                  <Route path="/tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
                  <Route path="/sandbox" element={<ProtectedRoute><CodeSandbox /></ProtectedRoute>} />
                  <Route path="/avatar" element={<ProtectedRoute><AvatarPage /></ProtectedRoute>} />
                  <Route path="/install" element={<InstallApp />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              {/* Global AI Tutor Button */}
              <TutorFloatingButton />
            </BrowserRouter>
          </TooltipProvider>
        </AchievementProvider>
      </GameProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
