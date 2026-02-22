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
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import GamePage from "./pages/GamePage";
import ZonePage from "./pages/ZonePage";
import ModulePage from "./pages/ModulePage";
import LessonPage from "./pages/LessonPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import MultiplayerBattle from "./pages/MultiplayerBattle";
import AITutor from "./pages/AITutor";
import CodeSandbox from "./pages/CodeSandbox";
import AvatarPage from "./pages/AvatarPage";
import InstallApp from "./pages/InstallApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GameProvider>
        <AchievementProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
