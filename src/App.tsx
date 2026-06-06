import React, { useState, useEffect } from "react";
import { ActivityType, UserStats } from "./types";
import Dashboard from "./components/Dashboard";
import QuickQuiz from "./components/QuickQuiz";
import SentenceCompletion from "./components/SentenceCompletion";
import DragAndDrop from "./components/DragAndDrop";
import DailyTest from "./components/DailyTest";
import CyrillicGuide from "./components/CyrillicGuide";
import WritingPractice from "./components/WritingPractice";
import CustomExercisePlayer from "./components/CustomExercisePlayer";
import { Sparkles, Globe, Volume2, Award, BookOpen, Clock } from "lucide-react";

const LOCAL_STORAGE_KEY = "russo_rapido_user_stats";

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  lastTestCompletedDate: null,
  completedDailyDates: [],
  level: 1,
};

export default function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>("dash");
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeCustomDataset, setActiveCustomDataset] = useState<any>(null);

  // Load stats from localStorage at startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading localStorage statistics:", e);
    }
  }, []);

  // Save stats helper
  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStats));
    } catch (e) {
      console.error("Error saving stats to localStorage:", e);
    }
  };

  const handleAddXP = (xpGained: number) => {
    const updatedXP = stats.xp + xpGained;
    const computedLevel = Math.floor(updatedXP / 100) + 1;
    
    const updated = {
      ...stats,
      xp: updatedXP,
      level: computedLevel,
    };
    saveStats(updated);
  };

  const handleCompleteDaily = (dateStr: string, score: number) => {
    // If already completed today, don't double count stats
    if (stats.completedDailyDates.includes(dateStr)) {
      return;
    }

    const xpGained = 50 + score * 10; // 50 XP completion bonus + 10 XP per correct answer
    const nextXP = stats.xp + xpGained;
    const computedLevel = Math.floor(nextXP / 100) + 1;

    // Daily streak calculations
    const lastDateString = stats.lastTestCompletedDate;
    
    // Calculate yesterday standard string representation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    let newStreak = stats.streak;
    if (lastDateString === dateStr) {
      // Completed already today, keep streak
    } else if (lastDateString === yesterdayStr) {
      // Completed yesterday, advance streak
      newStreak += 1;
    } else {
      // Streak broken, start fresh
      newStreak = 1;
    }

    const updated: UserStats = {
      ...stats,
      xp: nextXP,
      level: computedLevel,
      streak: newStreak,
      lastTestCompletedDate: dateStr,
      completedDailyDates: [...stats.completedDailyDates, dateStr],
    };

    saveStats(updated);
  };

  const handleNavigate = (activity: ActivityType) => {
    setCurrentActivity(activity);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    setCurrentActivity("dash");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900" id="app-root-container">
      
      {/* Upper Navigation Rail with Vibrant Palette Theme */}
      <header className="h-20 bg-white border-b-4 border-gray-100 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-50 shadow-xs" id="app-navbar">
        
        {/* Logo brand */}
        <div 
          onClick={handleBackToDashboard}
          className="flex items-center gap-3 cursor-pointer select-none"
          id="brand-logo"
        >
          <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white font-black text-2xl">
            R
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight block">Russo<span className="text-[#3B82F6]">Rapido</span></span>
            <span className="text-[10px] font-black text-gray-400 block -mt-1 uppercase tracking-widest leading-none">Impara Divertendoti</span>
          </div>
        </div>

        {/* Quick counters / badge menu */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Flame streak */}
          {stats.streak > 0 ? (
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-orange-100 shadow-3xs">
              <span className="text-base sm:text-lg animate-pulse">🔥</span>
              <span className="font-bold text-xs sm:text-sm text-orange-600 whitespace-nowrap">{stats.streak} {stats.streak === 1 ? "Giorno" : "Giorni"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-gray-100">
              <span className="text-xs sm:text-sm text-gray-400">🔥 0</span>
            </div>
          )}

          {/* XP Gems */}
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-blue-100 shadow-3xs">
            <span className="text-base sm:text-lg">💎</span>
            <span className="font-bold text-xs sm:text-sm text-blue-600 whitespace-nowrap">{stats.xp} XP</span>
          </div>

          <button
            onClick={() => handleNavigate("guide")}
            className="w-10 h-10 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full border-2 border-purple-200 flex items-center justify-center transition shadow-3xs"
            title="Prontuario Alfabeto"
          >
            <BookOpen size={18} strokeWidth={2.5} />
          </button>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-grow py-6 sm:py-8">
        {currentActivity === "dash" && (
          <Dashboard 
            stats={stats} 
            onNavigate={handleNavigate} 
            onLoadCustomDataset={(dataset) => {
              setActiveCustomDataset(dataset);
              handleNavigate("customPlay");
            }}
          />
        )}
        {currentActivity === "quiz" && (
          <QuickQuiz onBack={handleBackToDashboard} onAddXP={handleAddXP} />
        )}
        {currentActivity === "completion" && (
          <SentenceCompletion onBack={handleBackToDashboard} onAddXP={handleAddXP} />
        )}
        {currentActivity === "dragdrop" && (
          <DragAndDrop onBack={handleBackToDashboard} onAddXP={handleAddXP} />
        )}
        {currentActivity === "dailytest" && (
          <DailyTest onBack={handleBackToDashboard} onCompleteDaily={handleCompleteDaily} />
        )}
        {currentActivity === "guide" && (
          <CyrillicGuide onBack={handleBackToDashboard} />
        )}
        {currentActivity === "writing" && (
          <WritingPractice onBack={handleBackToDashboard} onAddXP={handleAddXP} />
        )}
        {currentActivity === "customPlay" && activeCustomDataset && (
          <CustomExercisePlayer
            dataset={activeCustomDataset}
            onBack={handleBackToDashboard}
            onAddXP={handleAddXP}
          />
        )}
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-xs" id="app-footer">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-500">
            Russo Rapido • Realizziamo l'eccellenza nell'apprendimento linguistico cirillico.
          </p>
          <p className="text-[10px]">
            Tutti i progressi, le risposte corrette e i giorni di streak sono salvati localmente sul tuo dispositivo per una totale privacy energetica.
          </p>
        </div>
      </footer>

    </div>
  );
}
