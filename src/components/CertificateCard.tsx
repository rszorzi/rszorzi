import { useEffect, useState } from "react";
import type { Skill } from "../data/skills";

export default function CertificateCard({
  skill,
  complete,
  claimed,
  onClaim,
}: {
  skill: Skill;
  complete: boolean;
  claimed: boolean;
  onClaim: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (complete && !claimed) onClaim();
  }, [complete, claimed, onClaim]);

  const shareText = `I just completed the ${skill.title} track on Reel Skills 🎬 — ${skill.lessons.length} lessons, ${skill.lessons.filter((l) => l.checkpoint).length} checkpoints passed.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "Reel Skills credential" });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!complete) {
    return (
      <div className="reel-card certificate-card locked">
        <div className="certificate-emoji">🔒</div>
        <h2>Finish every lesson to unlock your credential</h2>
        <p>Scroll back up and complete any lessons you skipped.</p>
      </div>
    );
  }

  return (
    <div className="reel-card certificate-card" style={{ background: skill.color }}>
      <div className="certificate-emoji">{skill.emoji}</div>
      <div className="certificate-eyebrow">CERTIFICATE OF COMPLETION</div>
      <h2>{skill.title}</h2>
      <p className="certificate-name">Ricardo Zorzi</p>
      <p className="certificate-meta">
        {skill.lessons.length} lessons · {skill.lessons.filter((l) => l.checkpoint).length} checkpoints passed
      </p>
      <button className="share-btn" onClick={handleShare}>
        {copied ? "Copied — paste anywhere" : "Share credential"}
      </button>
    </div>
  );
}
