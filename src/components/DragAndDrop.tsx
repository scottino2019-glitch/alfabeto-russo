import React, { useState, useEffect } from "react";
import { dragMatchSets } from "../data/russianData";
import { DragMatchSet, MatchPair } from "../types";
import { ArrowLeft, RefreshCw, Layers, CheckCircle2, RotateCcw, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSuccessSound, playErrorSound, playRewardSound } from "../utils/sound";

interface DragAndDropProps {
  onBack: () => void;
  onAddXP: (xp: number) => void;
}

interface MatchItem {
  id: string;
  text: string;
  type: 'russian' | 'italian';
  pairId: string;
}

export default function DragAndDrop({ onBack, onAddXP }: DragAndDropProps) {
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [russianCards, setRussianCards] = useState<MatchPair[]>([]);
  const [italianCards, setItalianCards] = useState<MatchPair[]>([]);
  
  const [selectedRussianId, setSelectedRussianId] = useState<string | null>(null);
  const [selectedItalianId, setSelectedItalianId] = useState<string | null>(null);
  
  const [matchedIds, setMatchedIds] = useState<string[]>([]); // holds the pairIds that have been matched
  const [recentWrongIds, setRecentWrongIds] = useState<{ru: string | null, it: string | null}>({ru: null, it: null});
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const currentSet: DragMatchSet = dragMatchSets[activeSetIndex];

  // Initialize and shuffle columns
  useEffect(() => {
    if (!currentSet) return;
    
    // Shuffle left column independently of right column
    const ruShuffled = [...currentSet.pairs].sort(() => Math.random() - 0.5);
    const itShuffled = [...currentSet.pairs].sort(() => Math.random() - 0.5);
    
    setRussianCards(ruShuffled);
    setItalianCards(itShuffled);
    setMatchedIds([]);
    setSelectedRussianId(null);
    setSelectedItalianId(null);
    setShowWinScreen(false);
    setAttempts(0);
  }, [activeSetIndex, currentSet]);

  const handleRussianTap = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    setSelectedRussianId(pairId);
    
    // Check match immediately if we already have an Italian selection
    if (selectedItalianId) {
      checkMatch(pairId, selectedItalianId);
    }
  };

  const handleItalianTap = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    setSelectedItalianId(pairId);
    
    // Check match immediately if we already have a Russian selection
    if (selectedRussianId) {
      checkMatch(selectedRussianId, pairId);
    }
  };

  const checkMatch = (ruId: string, itId: string) => {
    setAttempts(prev => prev + 1);
    
    if (ruId === itId) {
      // SUCCESS MATCH
      setMatchedIds(prev => [...prev, ruId]);
      setSelectedRussianId(null);
      setSelectedItalianId(null);
      playSuccessSound();
      
      // If all matched!
      if (matchedIds.length + 1 === currentSet.pairs.length) {
        setTimeout(() => {
          setShowWinScreen(true);
          onAddXP(30); // 30 XP for matching all correctly
          playRewardSound();
        }, 500);
      }
    } else {
      // MISMATCH
      setRecentWrongIds({ ru: ruId, it: itId });
      playErrorSound();
      
      // Flash red then reset
      setTimeout(() => {
        setRecentWrongIds({ ru: null, it: null });
        setSelectedRussianId(null);
        setSelectedItalianId(null);
      }, 800);
    }
  };

  const resetSet = () => {
    const ruShuffled = [...currentSet.pairs].sort(() => Math.random() - 0.5);
    const itShuffled = [...currentSet.pairs].sort(() => Math.random() - 0.5);
    setRussianCards(ruShuffled);
    setItalianCards(itShuffled);
    setMatchedIds([]);
    setSelectedRussianId(null);
    setSelectedItalianId(null);
    setShowWinScreen(false);
    setAttempts(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6" id="drag-drop-module">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" id="drag-header">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors self-start"
          id="btn-quit-drag"
        >
          <ArrowLeft size={16} /> Esci dall'Attività
        </button>
        
        {/* Set cycle controls */}
        <div className="flex items-center gap-2 self-end">
          <Layers size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Mazzo attuale:</span>
          <select
            value={activeSetIndex}
            onChange={(e) => setActiveSetIndex(Number(e.target.value))}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium"
          >
            {dragMatchSets.map((set, idx) => (
              <option key={set.id} value={idx}>
                {set.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {!showWinScreen ? (
          <motion.div
            key={activeSetIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 md:p-8 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                  <span>Abbinamento Rapido</span>
                </h2>
                <p className="text-gray-450 font-bold text-xs mt-1">
                  Seleziona una parola in <b className="text-blue-650 font-black">Russo</b> e abbinala al suo significato in <b className="text-emerald-650 font-black">Italiano</b>.
                </p>
              </div>
              <button
                onClick={resetSet}
                title="Ricomincia mazzo"
                className="p-3 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all font-black"
              >
                <RotateCcw size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Score and stats */}
            <div className="flex items-center gap-4 mb-6 text-xs text-gray-400 font-mono">
              <div className="bg-[#FFFBEB] px-3.5 py-2.5 rounded-xl border-2 border-amber-200 flex items-center gap-1.5 font-bold uppercase">
                <span>Completati:</span>
                <strong className="text-amber-800 font-black">{matchedIds.length} / {currentSet.pairs.length}</strong>
              </div>
              <div className="bg-blue-50 px-3.5 py-2.5 rounded-xl border-2 border-blue-100 flex items-center gap-1.5 font-bold uppercase">
                <span>Tentativi:</span>
                <strong className="text-blue-800 font-black">{attempts}</strong>
              </div>
            </div>

            {/* Core Columns container */}
            <div className="grid grid-cols-2 gap-6 relative" id="matching-grid">
              {/* Russian Column */}
              <div className="space-y-4">
                <span className="block text-center text-xs font-black text-blue-650 bg-blue-50/70 border-2 border-blue-200 py-2 rounded-2xl mb-4 tracking-wider uppercase col-title">
                  Russo 🇷🇺
                </span>
                
                {russianCards.map((p) => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedRussianId === p.id;
                  const isWrong = recentWrongIds.ru === p.id;

                  let borderClass = "border-2 border-gray-200 border-b-8 bg-white text-gray-800 hover:border-[#3B82F6] hover:bg-blue-55/10 hover:-translate-y-0.5";
                  if (isMatched) {
                    borderClass = "border-2 border-emerald-200 border-b-4 bg-emerald-50/70 text-emerald-800 opacity-50 cursor-default font-black";
                  } else if (isWrong) {
                    borderClass = "border-4 border-rose-500 bg-rose-50 text-rose-850 animate-shake";
                  } else if (isSelected) {
                    borderClass = "border-4 border-[#3B82F6] border-b-8 bg-blue-50 text-[#3B82F6] scale-102 font-black shadow-md";
                  }

                  return (
                    <motion.button
                      key={`ru-${p.id}`}
                      disabled={isMatched || isWrong}
                      onClick={() => handleRussianTap(p.id)}
                      layoutId={`card-ru-${p.id}`}
                      className={`w-full py-4 px-4 text-center rounded-2xl font-serif text-lg tracking-tight transition-all cursor-pointer ${borderClass}`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{p.russian}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-[#10B981] shrink-0 font-bold" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Italian Column */}
              <div className="space-y-4">
                <span className="block text-center text-xs font-black text-[#10B981] bg-emerald-50/70 border-2 border-emerald-150 py-2 rounded-2xl mb-4 tracking-wider uppercase col-title">
                  Italiano 🇮🇹
                </span>
                
                {italianCards.map((p) => {
                  const isMatched = matchedIds.includes(p.id);
                  const isSelected = selectedItalianId === p.id;
                  const isWrong = recentWrongIds.it === p.id;

                  let borderClass = "border-2 border-gray-200 border-b-8 bg-white text-gray-800 hover:border-[#10B981] hover:bg-emerald-55/10 hover:-translate-y-0.5";
                  if (isMatched) {
                    borderClass = "border-2 border-emerald-200 border-b-4 bg-emerald-50/70 text-emerald-800 opacity-50 cursor-default font-black";
                  } else if (isWrong) {
                    borderClass = "border-4 border-rose-500 bg-rose-50 text-rose-850 animate-shake";
                  } else if (isSelected) {
                    borderClass = "border-4 border-[#10B981] border-b-8 bg-emerald-50 text-[#10B981] scale-102 font-black shadow-md";
                  }

                  return (
                    <motion.button
                      key={`it-${p.id}`}
                      disabled={isMatched || isWrong}
                      onClick={() => handleItalianTap(p.id)}
                      layoutId={`card-it-${p.id}`}
                      className={`w-full py-4 px-4 text-center rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer ${borderClass}`}
                    >
                      <span>{p.italian}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Finished matching set - Vibrant Palette Styled */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="drag-win-card"
          >
            <div className="w-16 h-16 bg-blue-50 border-b-4 border-blue-200 text-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Flame size={32} strokeWidth={2.5} className="pulsing-accent fill-[#3B82F6]" />
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Incredibile, mazzo completato!</h1>
            <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-6">
              Hai abbinato con successo tutte le coppie linguistiche per il mazzo <strong className="text-gray-700">"{currentSet.title}"</strong>.
            </p>

            <div className="inline-grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-amber-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-amber-600 uppercase tracking-wider">Esercizio XP</span>
                <span className="text-xl font-black text-[#10B981]">+30 XP</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-blue-600 uppercase tracking-wider">Precisione</span>
                <span className="text-xl font-black text-blue-800">
                  {Math.round((currentSet.pairs.length / Math.max(attempts, currentSet.pairs.length)) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {activeSetIndex < dragMatchSets.length - 1 ? (
                <button
                  onClick={() => setActiveSetIndex(prev => prev + 1)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-blue-800 hover:bg-blue-600 transition shadow-md"
                >
                  Prossimo Mazzo
                </button>
              ) : (
                <button
                  onClick={() => setActiveSetIndex(0)}
                  className="w-full sm:w-auto px-6 py-4 bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-gray-300 hover:bg-gray-200 transition"
                >
                  Ricomincia da Capo
                </button>
              )}
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-slate-900 hover:bg-slate-700 transition"
              >
                La mia Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shake style definition specifically for wrong match feedback */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
