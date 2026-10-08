import { skills } from "../data/skills";
import type { useProgress } from "../state/progress";

function findLessonTitle(lessonId: string): string {
  for (const skill of skills) {
    const lesson = skill.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson.title;
  }
  return lessonId;
}

export default function ProgressScreen({
  progress,
}: {
  progress: ReturnType<typeof useProgress>;
}) {
  const { state, dueReviews } = progress;

  return (
    <div className="screen progress-screen">
      <header className="screen-header">
        <h1>Your progress</h1>
      </header>

      <div className="stat-row">
        <div className="stat-tile">
          <div className="stat-value">🔥 {state.streak}</div>
          <div className="stat-label">day streak</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">⭐ {state.xp}</div>
          <div className="stat-label">total XP</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{state.completedLessonIds.length}</div>
          <div className="stat-label">lessons watched</div>
        </div>
      </div>

      <section className="progress-section">
        <h2>Due for spaced review ({dueReviews.length})</h2>
        {dueReviews.length === 0 ? (
          <p className="empty-note">Nothing due today. Come back tomorrow.</p>
        ) : (
          <ul className="review-list">
            {dueReviews.map((item) => (
              <li key={item.lessonId} className="review-list-item">
                <span>{findLessonTitle(item.lessonId)}</span>
                <span className="review-due-badge">due</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="progress-section">
        <h2>Credentials earned ({state.earnedCredentials.length})</h2>
        {state.earnedCredentials.length === 0 ? (
          <p className="empty-note">Finish a full skill track to earn your first credential.</p>
        ) : (
          <ul className="credential-list">
            {state.earnedCredentials.map((c) => {
              const skill = skills.find((s) => s.id === c.skillId);
              return (
                <li key={c.skillId} className="credential-list-item">
                  <span>
                    {skill?.emoji} {skill?.title}
                  </span>
                  <span className="credential-date">{c.earnedAt}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
