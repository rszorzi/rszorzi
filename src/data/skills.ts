export interface Checkpoint {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  skillId: string;
  title: string;
  hook: string;
  durationSec: number;
  bodyPoints: string[];
  gradient: string;
  checkpoint?: Checkpoint;
}

export interface Skill {
  id: string;
  title: string;
  emoji: string;
  color: string;
  tagline: string;
  lessons: Lesson[];
}

export const skills: Skill[] = [
  {
    id: "excel",
    title: "Excel for Work",
    emoji: "📊",
    color: "#1f7a4d",
    tagline: "Spreadsheets that get you noticed",
    lessons: [
      {
        id: "excel-1",
        skillId: "excel",
        title: "The =SUM() shortcut nobody shows you",
        hook: "Stop dragging your mouse across 40 cells.",
        durationSec: 75,
        bodyPoints: [
          "Select the range, hit Alt + =",
          "Excel guesses the SUM formula instantly",
          "Works on rows AND columns at once",
        ],
        gradient: "linear-gradient(160deg,#134e2f,#1f7a4d 55%,#3fae7a)",
      },
      {
        id: "excel-2",
        skillId: "excel",
        title: "VLOOKUP in plain English",
        hook: "\"Find this, bring me that.\" That's it.",
        durationSec: 90,
        bodyPoints: [
          "=VLOOKUP(what you're searching, where to search, which column, exact match)",
          "Always use FALSE for exact match",
          "Freeze the table range with $ signs",
        ],
        gradient: "linear-gradient(160deg,#0f3d24,#1f7a4d 55%,#57c294)",
        checkpoint: {
          question: "Which argument makes VLOOKUP require an exact match?",
          options: ["TRUE", "FALSE", "0", "EXACT"],
          correctIndex: 1,
          explanation: "FALSE (or 0) forces an exact match; TRUE allows approximate matches.",
        },
      },
      {
        id: "excel-3",
        skillId: "excel",
        title: "Pivot tables in 90 seconds",
        hook: "Turn 10,000 rows into one useful table.",
        durationSec: 85,
        bodyPoints: [
          "Insert → PivotTable",
          "Drag a category into Rows, a number into Values",
          "Right-click to change Sum → Average or Count",
        ],
        gradient: "linear-gradient(160deg,#123f27,#1f7a4d 55%,#43b483)",
      },
      {
        id: "excel-4",
        skillId: "excel",
        title: "Conditional formatting that flags problems",
        hook: "Make Excel highlight your own mistakes.",
        durationSec: 70,
        bodyPoints: [
          "Select range → Conditional Formatting → New Rule",
          "\"Format cells that contain\" for quick flags",
          "Use a formula rule for cross-column logic",
        ],
        gradient: "linear-gradient(160deg,#0f3d24,#1f7a4d 55%,#57c294)",
        checkpoint: {
          question: "You want to highlight a row red only when Column C > Column D. What rule type do you use?",
          options: [
            "Cell value + preset color scale",
            "A custom formula rule",
            "Data bars",
            "Top/Bottom rules only",
          ],
          correctIndex: 1,
          explanation: "Cross-column logic needs a formula rule, e.g. =$C1>$D1.",
        },
      },
    ],
  },
  {
    id: "bartend",
    title: "Bartending Flair",
    emoji: "🍸",
    color: "#a3372c",
    tagline: "Pour with confidence, tip better",
    lessons: [
      {
        id: "bar-1",
        skillId: "bartend",
        title: "The 4-count free pour",
        hook: "Ditch the jigger without over-pouring.",
        durationSec: 60,
        bodyPoints: [
          "Count \"1-Mississippi\" per ounce while pouring",
          "Practice against a jigger until it matches",
          "Tilt the bottle 45° for a steady stream",
        ],
        gradient: "linear-gradient(160deg,#5c1712,#a3372c 55%,#e0685a)",
      },
      {
        id: "bar-2",
        skillId: "bartend",
        title: "The bottle spin catch",
        hook: "The move that gets phones out.",
        durationSec: 90,
        bodyPoints: [
          "Grip the neck, spin with your wrist not your arm",
          "Practice one full rotation before catching",
          "Always practice over a padded surface first",
        ],
        gradient: "linear-gradient(160deg,#4a120e,#a3372c 55%,#d85a4c)",
        checkpoint: {
          question: "Where should you practice bottle spins first?",
          options: ["Over the bar top", "Over a padded/soft surface", "Outdoors on concrete", "It doesn't matter"],
          correctIndex: 1,
          explanation: "Padded surfaces prevent breakage and injury while you build muscle memory.",
        },
      },
      {
        id: "bar-3",
        skillId: "bartend",
        title: "Building a drink in the right order",
        hook: "Ice, then spirit, then mixer — always.",
        durationSec: 65,
        bodyPoints: [
          "Ice first so it doesn't melt while you build",
          "Spirits before mixers to control layering",
          "Garnish last, right before serving",
        ],
        gradient: "linear-gradient(160deg,#5c1712,#a3372c 55%,#e0685a)",
      },
    ],
  },
  {
    id: "prompt",
    title: "Prompt Writing",
    emoji: "🤖",
    color: "#3a4fd8",
    tagline: "Get AI to actually do what you mean",
    lessons: [
      {
        id: "prompt-1",
        skillId: "prompt",
        title: "Give the model a role",
        hook: "\"Act as...\" changes everything.",
        durationSec: 60,
        bodyPoints: [
          "Open with the role: \"You are a senior copy editor\"",
          "Roles set vocabulary, tone, and priorities",
          "Pair the role with the actual task",
        ],
        gradient: "linear-gradient(160deg,#171f5c,#3a4fd8 55%,#7c8aef)",
      },
      {
        id: "prompt-2",
        skillId: "prompt",
        title: "Show, don't just tell",
        hook: "One example beats three sentences of instructions.",
        durationSec: 80,
        bodyPoints: [
          "Give one input/output example in the prompt",
          "Match the exact format you want back",
          "Two examples fix edge cases; three rarely helps more",
        ],
        gradient: "linear-gradient(160deg,#131a4d,#3a4fd8 55%,#6577e6)",
        checkpoint: {
          question: "What's the fastest way to fix a model outputting the wrong format?",
          options: [
            "Write a longer instruction paragraph",
            "Add an example in the exact output format you want",
            "Repeat the instruction three times",
            "Switch to all caps",
          ],
          correctIndex: 1,
          explanation: "A concrete example anchors format far more reliably than more prose instructions.",
        },
      },
      {
        id: "prompt-3",
        skillId: "prompt",
        title: "Ask it to check its own work",
        hook: "A second pass catches most mistakes.",
        durationSec: 70,
        bodyPoints: [
          "Add: \"Review your answer for errors before finalizing\"",
          "Ask it to list assumptions it made",
          "For code: ask it to trace through one example",
        ],
        gradient: "linear-gradient(160deg,#171f5c,#3a4fd8 55%,#7c8aef)",
      },
    ],
  },
];
