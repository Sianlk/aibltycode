import { useParams, useNavigate } from "react-router-dom";
import { InteractiveLesson } from "@/components/lessons/InteractiveLesson";

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
