import { useParams, useNavigate } from "react-router-dom";
import { InteractiveLesson } from "@/components/lessons/InteractiveLesson";
// Import moduleData to ensure lesson metadata is registered before lesson lookup
import "@/data/moduleData";

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  
  return (
    <InteractiveLesson
      lessonId={lessonId}
      onComplete={() => navigate(`/module/${moduleId}`)}
      onExit={() => navigate(`/module/${moduleId}`)}
    />
  );
}
