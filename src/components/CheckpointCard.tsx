import { useState } from "react";
import type { Lesson } from "../data/skills";

export default function CheckpointCard({
  lesson,
  onAnswer,
}: {
  lesson: Lesson;
  onAnswer: (correct: boolean) => void;
}) {
  const checkpoint = lesson.checkpoint!;
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    onAnswer(index === checkpoint.correctIndex);
  };

  return (
    <div className="reel-card checkpoint-card">
      <div className="checkpoint-badge">PRACTICE CHECKPOINT</div>
      <h2 className="checkpoint-question">{checkpoint.question}</h2>
      <div className="checkpoint-options">
        {checkpoint.options.map((option, i) => {
          const isCorrect = i === checkpoint.correctIndex;
          const isSelected = i === selected;
          let cls = "checkpoint-option";
          if (answered && isCorrect) cls += " correct";
          else if (answered && isSelected && !isCorrect) cls += " incorrect";
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`checkpoint-feedback ${selected === checkpoint.correctIndex ? "good" : "bad"}`}>
          <strong>{selected === checkpoint.correctIndex ? "Nice, that's it. +15 XP" : "Not quite. +5 XP"}</strong>
          <p>{checkpoint.explanation}</p>
          <p className="checkpoint-review-note">
            This will resurface for spaced review{selected === checkpoint.correctIndex ? " in a few days." : " tomorrow."}
          </p>
        </div>
      )}
      {!answered && <div className="reel-swipe-hint">tap an answer</div>}
    </div>
  );
}
