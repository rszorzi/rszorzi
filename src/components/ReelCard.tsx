import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../data/skills";

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ReelCard({
  lesson,
  onWatched,
}: {
  lesson: Lesson;
  onWatched: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const hasBeenActive = useRef(false);
  const hasFiredWatched = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isActive = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        setActive(isActive);
        if (isActive) hasBeenActive.current = true;
        if (
          !isActive &&
          entry.intersectionRatio < 0.15 &&
          hasBeenActive.current &&
          !hasFiredWatched.current
        ) {
          hasFiredWatched.current = true;
          onWatched();
        }
      },
      { threshold: [0, 0.15, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onWatched]);

  return (
    <div className="reel-card" ref={ref} style={{ background: lesson.gradient }}>
      <div className="reel-card-noise" />
      <div className={`reel-progress ${active ? "playing" : ""}`}>
        <div
          className="reel-progress-fill"
          style={active ? { animationDuration: `${lesson.durationSec}s` } : undefined}
        />
      </div>
      <div className="reel-duration">{formatDuration(lesson.durationSec)}</div>
      <div className="reel-content">
        <p className="reel-hook">{lesson.hook}</p>
        <h2 className="reel-title">{lesson.title}</h2>
        <ul className="reel-points">
          {lesson.bodyPoints.map((point, i) => (
            <li key={i} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="reel-swipe-hint">↑ swipe for next</div>
    </div>
  );
}
