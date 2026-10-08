import { useCallback, useEffect, useState } from "react";
import { skills } from "../data/skills";

const STORAGE_KEY = "reel-skills-progress-v1";

// Simplified SM-2 style interval ladder (days).
const INTERVAL_LADDER = [1, 2, 4, 7, 14, 30, 60];

export interface ReviewItem {
  lessonId: string;
  skillId: string;
  step: number; // index into INTERVAL_LADDER
  dueAt: string; // ISO date
}

export interface ProgressState {
  streak: number;
  lastActiveDate: string | null;
  xp: number;
  completedLessonIds: string[];
  reviewQueue: ReviewItem[];
  earnedCredentials: { skillId: string; earnedAt: string }[];
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressState;
  } catch {
    // ignore corrupt storage
  }
  return {
    streak: 0,
    lastActiveDate: null,
    xp: 0,
    completedLessonIds: [],
    reviewQueue: [],
    earnedCredentials: [],
  };
}

function saveState(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bumpStreak(state: ProgressState): ProgressState {
  const today = todayStr();
  if (state.lastActiveDate === today) return state;
  const isConsecutive = state.lastActiveDate
    ? daysBetween(state.lastActiveDate, today) === 1
    : false;
  return {
    ...state,
    streak: isConsecutive ? state.streak + 1 : 1,
    lastActiveDate: today,
  };
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const markLessonWatched = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return bumpStreak(prev);
      const withStreak = bumpStreak(prev);
      return {
        ...withStreak,
        xp: withStreak.xp + 10,
        completedLessonIds: [...withStreak.completedLessonIds, lessonId],
      };
    });
  }, []);

  const recordCheckpointResult = useCallback(
    (skillId: string, lessonId: string, correct: boolean) => {
      setState((prev) => {
        const withStreak = bumpStreak(prev);
        const existing = withStreak.reviewQueue.find((r) => r.lessonId === lessonId);
        const nextStep = correct
          ? Math.min((existing?.step ?? -1) + 1, INTERVAL_LADDER.length - 1)
          : 0;
        const dueAt = new Date(
          Date.now() + INTERVAL_LADDER[nextStep] * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10);
        const otherItems = withStreak.reviewQueue.filter((r) => r.lessonId !== lessonId);
        return {
          ...withStreak,
          xp: withStreak.xp + (correct ? 15 : 5),
          reviewQueue: [...otherItems, { lessonId, skillId, step: nextStep, dueAt }],
        };
      });
    },
    []
  );

  const isSkillComplete = useCallback(
    (skillId: string) => {
      const skill = skills.find((s) => s.id === skillId);
      if (!skill) return false;
      return skill.lessons.every((l) => state.completedLessonIds.includes(l.id));
    },
    [state.completedLessonIds]
  );

  const claimCredential = useCallback((skillId: string) => {
    setState((prev) => {
      if (prev.earnedCredentials.some((c) => c.skillId === skillId)) return prev;
      return {
        ...prev,
        earnedCredentials: [
          ...prev.earnedCredentials,
          { skillId, earnedAt: todayStr() },
        ],
      };
    });
  }, []);

  const dueReviews = state.reviewQueue.filter((r) => r.dueAt <= todayStr());

  return {
    state,
    markLessonWatched,
    recordCheckpointResult,
    isSkillComplete,
    claimCredential,
    dueReviews,
  };
}
