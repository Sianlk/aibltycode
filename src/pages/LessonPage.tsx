import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InteractiveLesson } from "@/components/lessons/InteractiveLesson";
import { RetentionGate } from "@/components/lessons/RetentionGate";
// Import moduleData to ensure lesson metadata is registered before lesson lookup
import "@/data/moduleData";

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [coreLessonComplete, setCoreLessonComplete] = useState(false);

  const exitLesson = () => navigate(`/module/${moduleId}`);

  if (!lessonId) return null;

  if (coreLessonComplete) {
    return (
      <RetentionGate
        lessonId={lessonId}
        onMastered={exitLesson}
        onExit={exitLesson}
      />
    );
  }

  return (
    <InteractiveLesson
      lessonId={lessonId}
      onComplete={() => setCoreLessonComplete(true)}
      onExit={exitLesson}
    />
  );
}