import { skills } from "../data/skills";
import type { useProgress } from "../state/progress";

export default function SkillPicker({
  progress,
  onSelect,
}: {
  progress: ReturnType<typeof useProgress>;
  onSelect: (skillId: string) => void;
}) {
  return (
    <div className="screen skill-picker">
      <header className="screen-header">
        <h1>Reel Skills</h1>
        <p>Tradeable skills, 90 seconds at a time.</p>
      </header>
      <div className="streak-summary">
        <div className="streak-chip">🔥 {progress.state.streak} day streak</div>
        <div className="streak-chip">⭐ {progress.state.xp} XP</div>
        <div className="streak-chip">📚 {progress.dueReviews.length} due for review</div>
      </div>
      <div className="skill-grid">
        {skills.map((skill) => {
          const total = skill.lessons.length;
          const done = skill.lessons.filter((l) =>
            progress.state.completedLessonIds.includes(l.id)
          ).length;
          const pct = Math.round((done / total) * 100);
          return (
            <button
              key={skill.id}
              className="skill-card"
              style={{ borderColor: skill.color }}
              onClick={() => onSelect(skill.id)}
            >
              <div className="skill-card-emoji">{skill.emoji}</div>
              <div className="skill-card-title">{skill.title}</div>
              <div className="skill-card-tagline">{skill.tagline}</div>
              <div className="skill-card-progress-track">
                <div
                  className="skill-card-progress-fill"
                  style={{ width: `${pct}%`, background: skill.color }}
                />
              </div>
              <div className="skill-card-progress-label">
                {done}/{total} lessons
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
