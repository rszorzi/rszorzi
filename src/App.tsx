import { useEffect, useState } from "react";
import { skills } from "./data/skills";
import { useProgress } from "./state/progress";
import SkillPicker from "./components/SkillPicker";
import ReelFeed from "./components/ReelFeed";
import ProgressScreen from "./components/ProgressScreen";
import BottomNav, { type Tab } from "./components/BottomNav";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function App() {
  const progress = useProgress();
  const [tab, setTab] = useState<Tab>("learn");
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const activeSkill = skills.find((s) => s.id === activeSkillId) ?? null;

  return (
    <div className="phone-frame">
      <div className="phone-screen">
        {installPrompt && (
          <button
            className="install-banner"
            onClick={async () => {
              await installPrompt.prompt();
              await installPrompt.userChoice;
              setInstallPrompt(null);
            }}
          >
            📲 Install Reel Skills on your phone
          </button>
        )}
        {activeSkill ? (
          <ReelFeed
            skill={activeSkill}
            progress={progress}
            onBack={() => setActiveSkillId(null)}
          />
        ) : (
          <>
            {tab === "learn" && (
              <SkillPicker progress={progress} onSelect={setActiveSkillId} />
            )}
            {tab === "progress" && <ProgressScreen progress={progress} />}
            <BottomNav active={tab} onChange={setTab} />
          </>
        )}
      </div>
    </div>
  );
}
