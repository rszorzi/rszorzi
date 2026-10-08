export type Tab = "learn" | "progress";

export default function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${active === "learn" ? "active" : ""}`}
        onClick={() => onChange("learn")}
      >
        <span className="nav-icon">🎬</span>
        Learn
      </button>
      <button
        className={`nav-btn ${active === "progress" ? "active" : ""}`}
        onClick={() => onChange("progress")}
      >
        <span className="nav-icon">📈</span>
        Progress
      </button>
    </nav>
  );
}
