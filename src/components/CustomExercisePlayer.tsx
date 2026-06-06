import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Award, Flame, CheckCircle2, Volume2, ShieldCheck, HelpCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { playSuccessSound } from "../utils/sound";

interface CustomQuestion {
  type: "quiz" | "completion";
  questionText?: string;
  options: string[];
  correctOptionIndex?: number;
  sentenceWithBlank?: string;
  correctAnswer?: string;
  translation: string;
  pronunciation: string;
  explanation: string;
}

interface CustomDataset {
  title: string;
  questions: CustomQuestion[];
}

interface CustomExercisePlayerProps {
  dataset: CustomDataset;
  onBack: () => void;
  onAddXP: (xpGained: number) => void;
}

export default function CustomExercisePlayer({ dataset, onBack, onAddXP }: CustomExercisePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // For quiz
  const [selectedWord, setSelectedWord] = useState<string | null>(null); // For completion
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = dataset.questions[currentIndex];

  const handleQuizOptionClick = (idx: number, correctIdx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === correctIdx) {
      setScore((prev) => prev + 1);
      playSuccessSound();
    }
  };

  const handleCompletionWordClick = (word: string, correctAnswer: string) => {
    if (isAnswered) return;
    setSelectedWord(word);
    setIsAnswered(true);
    if (word.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setScore((prev) => prev + 1);
      playSuccessSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < dataset.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIdx(null);
      setSelectedWord(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalXP = 30 + score * 10;
      onAddXP(totalXP);
      playSuccessSound();
    }
  };

  const isCorrect = currentItem?.type === "quiz"
    ? selectedIdx === currentItem.correctOptionIndex
    : selectedWord === currentItem?.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4" id="custom-exercise-player">
      
      {/* Back button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3B82F6] font-black uppercase text-xs tracking-wider transition-colors cursor-pointer"
          id="btn-back-to-dash"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Esci dalla Sfida
        </button>
        <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
          Mazzo Esterno JSON 📁
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 md:p-8 shadow-xl"
            id={`custom-card-${currentIndex}`}
          >
            {/* Mazzo title & progression */}
            <div className="mb-4">
              <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{dataset.title}</span>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                <span className="text-[10px] font-black text-[#3B82F6] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                  {currentItem.type === "quiz" ? "Scelta Multipla" : "Completamento Frase"}
                </span>
                <span>
                  Quesito {currentIndex + 1} di {dataset.questions.length}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-150 relative">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / dataset.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Render dynamically by type */}
            {currentItem.type === "quiz" ? (
              /* Quiz interface */
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-850 mb-6 leading-tight uppercase tracking-tight">
                  {currentItem.questionText}
                </h2>

                <div className="space-y-3.5 mb-6">
                  {currentItem.options.map((option, idx) => {
                    let btnStyle = "border-2 border-gray-150 border-b-6 hover:border-[#3B82F6] hover:-translate-y-0.5 bg-white text-gray-700 hover:bg-gray-50";
                    let marker = null;

                    if (isAnswered) {
                      const isCorrectOpt = idx === currentItem.correctOptionIndex;
                      const isChosen = idx === selectedIdx;

                      if (isCorrectOpt) {
                        btnStyle = "bg-emerald-50 border-4 border-[#10B981] border-b-8 text-[#10B981] font-black shadow-md";
                        marker = <span className="text-[9px] font-black bg-white border border-[#10B981] text-[#10B981] px-2 py-0.5 rounded-md">CORRETTO</span>;
                      } else if (isChosen) {
                        btnStyle = "bg-rose-50 border-4 border-rose-500 border-b-8 text-rose-700 font-black shadow-md";
                        marker = <span className="text-[9px] font-black bg-white border border-rose-500 text-rose-500 px-2 py-0.5 rounded-md">ERRATO</span>;
                      } else {
                        btnStyle = "border-2 border-gray-100 border-b-4 bg-gray-50 text-gray-400 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleQuizOptionClick(idx, currentItem.correctOptionIndex ?? 0)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl flex items-center justify-between text-base sm:text-lg font-bold transition-all ${btnStyle}`}
                        id={`custom-opt-${idx}`}
                      >
                        <span className="font-serif tracking-tight">{option}</span>
                        {marker}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Completion interface */
              <div>
                <div className="mb-4 text-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-black">Incolla la parola corretta:</span>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 py-6 text-2xl md:text-3xl font-black text-gray-800 border-y-4 border-gray-100 my-4 tracking-tight">
                    <span>{currentItem.sentenceWithBlank?.split("___")[0]}</span>
                    <span className={`min-w-[100px] border-b-4 px-3 py-0.5 font-black text-center transition-all ${
                      isAnswered
                        ? isCorrect
                          ? "border-[#10B981] text-[#10B981] bg-emerald-50 rounded-2xl"
                          : "border-rose-500 text-rose-600 bg-rose-50 rounded-2xl"
                        : selectedWord
                        ? "border-[#3B82F6] text-[#3B82F6] bg-blue-50 rounded-2xl"
                        : "border-gray-200 text-gray-305 italic"
                    }`}>
                      {selectedWord || "_____"}
                    </span>
                    <span>{currentItem.sentenceWithBlank?.split("___")[1]}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500 bg-amber-50 border-2 border-amber-150 px-4 py-1.5 rounded-full inline-block">
                    🇮🇹 Traduzione: "{currentItem.translation}"
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5 mt-6 mb-6">
                  {currentItem.options.map((word) => {
                    const isWordChosen = selectedWord === word;
                    let pillStyle = "border-2 border-gray-150 border-b-6 bg-white text-gray-800 hover:border-[#3B82F6] hover:bg-blue-50/10 hover:-translate-y-0.5";

                    if (isAnswered && word === currentItem.correctAnswer) {
                      pillStyle = "bg-[#10B981] border-4 border-emerald-600 border-b-8 text-white font-black shadow-md cursor-not-allowed";
                    } else if (isWordChosen) {
                      pillStyle = isCorrect
                        ? "bg-[#10B981] border-4 border-emerald-600 border-b-8 text-white font-black cursor-not-allowed"
                        : "bg-rose-500 border-4 border-rose-700 border-b-8 text-white font-black cursor-not-allowed";
                    } else if (isAnswered) {
                      pillStyle = "bg-gray-50 border-2 border-gray-100 border-b-4 text-gray-400 opacity-40 cursor-not-allowed";
                    }

                    return (
                      <button
                        key={word}
                        disabled={isAnswered}
                        onClick={() => handleCompletionWordClick(word, currentItem.correctAnswer ?? "")}
                        className={`px-5 py-3.5 rounded-xl font-serif text-base sm:text-lg tracking-tight transition-all cursor-pointer ${pillStyle}`}
                        id={`custom-completion-${word}`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explanation card (gorgeous, expandable) */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-50/50 border-2 border-blue-100 rounded-2xl p-5 mb-6 text-sm font-bold text-gray-700"
                  id="custom-feedback-panel"
                >
                  <div className="font-bold text-gray-800 flex items-center gap-2 mb-2 uppercase tracking-tight text-xs">
                    <span className="p-1 rounded bg-[#3B82F6] text-white font-black text-[9px] font-mono px-1.5 leading-none">ANALISI</span>
                    <span>Modo d'uso & Pronuncia:</span>
                    <span className="text-xs font-mono font-black text-[#3B82F6]">
                      [{currentItem.pronunciation}]
                    </span>
                  </div>
                  <p className="leading-relaxed font-semibold text-gray-650 opacity-95">{currentItem.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action footer */}
            <div className="flex justify-end pt-4 border-t-2 border-gray-100">
              <button
                disabled={!isAnswered}
                onClick={handleNext}
                className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-md ${
                  isAnswered
                    ? "bg-[#10B981] border-b-6 border-green-700 text-white hover:bg-emerald-600 scale-102"
                    : "bg-gray-100 text-gray-400 border-b-4 border-gray-200 cursor-not-allowed shadow-none"
                }`}
                id="btn-next-custom"
              >
                {currentIndex < dataset.questions.length - 1 ? "Continua" : "Verifica Risultato"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Finished Card screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="custom-done-card"
          >
            <div className="w-16 h-16 bg-blue-50 border-b-4 border-blue-200 text-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Award size={32} strokeWidth={2.5} className="pulsing-accent" />
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Sfida Esterna Completata!</h1>
            <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-6">
              Hai completato con successo l'intero set di esercitazioni caricato da file JSON: <strong className="text-gray-800">"{dataset.title}"</strong>.
            </p>

            {/* Scoreboard stats */}
            <div className="inline-grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-amber-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-amber-600 uppercase tracking-wider">Punti XP guadagnati</span>
                <span className="text-xl font-black text-[#10B981]">+{30 + score * 10} XP</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-blue-600 uppercase tracking-wider">Esattezza</span>
                <span className="text-xl font-black text-blue-800">
                  {Math.round((score / dataset.questions.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedIdx(null);
                  setSelectedWord(null);
                  setIsAnswered(false);
                  setScore(0);
                  setIsFinished(false);
                }}
                className="w-full sm:w-auto px-6 py-4 bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-gray-300 hover:bg-gray-200 transition"
              >
                Ricomincia Mazzo
              </button>
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-blue-800 hover:bg-blue-600 transition shadow-md"
              >
                Torna in Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
