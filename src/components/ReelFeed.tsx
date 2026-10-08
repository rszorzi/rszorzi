import { useMemo } from "react";
import type { Skill, Lesson } from "../data/skills";
import ReelCard from "./ReelCard";
import CheckpointCard from "./CheckpointCard";
import CertificateCard from "./CertificateCard";
import type { useProgress } from "../state/progress";

type FeedItem =
  | { type: "lesson"; lesson: Lesson }
  | { type: "checkpoint"; lesson: Lesson }
  | { type: "certificate" };

export default function ReelFeed({
  skill,
  progress,
  onBack,
}: {
  skill: Skill;
  progress: ReturnType<typeof useProgress>;
  onBack: () => void;
}) {
  const items: FeedItem[] = useMemo(() => {
    const arr: FeedItem[] = [];
    skill.lessons.forEach((lesson) => {
      arr.push({ type: "lesson", lesson });
      if (lesson.checkpoint) arr.push({ type: "checkpoint", lesson });
    });
    arr.push({ type: "certificate" });
    return arr;
  }, [skill]);

  const claimed = progress.state.earnedCredentials.some((c) => c.skillId === skill.id);

  return (
    <div className="reel-feed">
      <div className="reel-feed-header">
        <button className="back-btn" onClick={onBack}>
          ‹ Skills
        </button>
        <span className="reel-feed-title">
          {skill.emoji} {skill.title}
        </span>
      </div>
      {items.map((item) => {
        if (item.type === "lesson") {
          return (
            <ReelCard
              key={item.lesson.id}
              lesson={item.lesson}
              onWatched={() => progress.markLessonWatched(item.lesson.id)}
            />
          );
        }
        if (item.type === "checkpoint") {
          return (
            <CheckpointCard
              key={item.lesson.id + "-cp"}
              lesson={item.lesson}
              onAnswer={(correct) =>
                progress.recordCheckpointResult(skill.id, item.lesson.id, correct)
              }
            />
          );
        }
        return (
          <CertificateCard
            key="certificate"
            skill={skill}
            complete={progress.isSkillComplete(skill.id)}
            claimed={claimed}
            onClaim={() => progress.claimCredential(skill.id)}
          />
        );
      })}
    </div>
  );
}
