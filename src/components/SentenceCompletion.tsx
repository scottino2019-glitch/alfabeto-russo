import React, { useState, useEffect } from "react";
import { completionQuestions } from "../data/russianData";
import { CompletionQuestion } from "../types";
import { ArrowLeft, Check, X, Sparkles, BookOpen, Volume2, ArrowRight, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSuccessSound, playErrorSound, playRewardSound } from "../utils/sound";

interface SentenceCompletionProps {
  onBack: () => void;
  onAddXP: (xp: number) => void;
}

export default function SentenceCompletion({ onBack, onAddXP }: SentenceCompletionProps) {
  const [questions, setQuestions] = useState<CompletionQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Pick 5 random fill-in-the-blank questions
    const shuffled = [...completionQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleWordSelect = (word: string) => {
    if (isChecked) return;
    setSelectedWord(word);
  };

  const handleVerify = () => {
    if (!selectedWord || isChecked) return;

    const correct = selectedWord === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setScore((prev) => prev + 1);
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      const xpGained = score * 10;
      onAddXP(xpGained);
      playRewardSound();
    }
  };

  // Split sentence elements around the blank
  const renderSentenceWithBlank = () => {
    const parts = currentQuestion.sentenceWithBlank.split("___");
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 py-8 text-2xl md:text-3.5xl font-black text-gray-800 border-y-4 border-gray-100 mb-8 tracking-tight">
        <span>{parts[0]}</span>
        <motion.span
          layout
          className={`min-w-[120px] border-b-4 text-center px-4 py-1.5 font-black transition-all ${
            isChecked
              ? isCorrect
                ? "border-[#10B981] text-[#10B981] bg-emerald-50 rounded-2xl"
                : "border-rose-455 text-rose-600 bg-rose-50 rounded-2xl"
              : selectedWord
              ? "border-blue-500 text-[#3B82F6] bg-blue-50 rounded-2xl font-black"
              : "border-gray-200 text-gray-300 italic"
          }`}
        >
          {selectedWord || "_____"}
        </motion.span>
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="completion-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" id="completion-header">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-xs font-black uppercase tracking-wider transition-colors"
          id="btn-quit-completion"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Esci dall'Attività
        </button>
        <span className="text-xs font-black uppercase tracking-wider bg-white text-[#3B82F6] px-4 py-1.5 rounded-full border-2 border-blue-50 shadow-3xs">
          Completamento Frasi
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 md:p-8 shadow-lg"
            id={`completion-card-${currentIndex}`}
          >
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                <span>Riempi lo Spazio Vuoto (___)</span>
                <span>
                  Esercizio {currentIndex + 1} di {questions.length}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-205 relative">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Hint / Italian translation button */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-450">
                Grammatica applicata
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/70 px-3 py-1.5 rounded-full transition-all border-2 border-amber-150 font-black uppercase tracking-wide shadow-3xs"
                id="hint-toggle-btn"
              >
                <Lightbulb size={12} strokeWidth={2.5} />
                {showHint ? "Nascondi Traduzione" : "Vedi Traduzione"}
              </button>
            </div>

            {/* Italian Translation display */}
            <div className="mb-6 text-center">
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-black text-gray-700 italic bg-amber-50/45 p-3 rounded-2xl border-2 border-amber-100"
                >
                  🇮🇹 "{currentQuestion.translation}"
                </motion.div>
              ) : (
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider py-2">
                  Clicca sulla lampadina per l'aiuto in italiano
                </div>
              )}
            </div>

            {/* Interactive Sentence with Blank */}
            {renderSentenceWithBlank()}

            {/* Russian Option Selection Pills */}
            <div className="text-center mb-8">
              <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Scegli la parola corretta:
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {currentQuestion.options.map((word) => {
                  const isWordSelected = selectedWord === word;
                  let pillStyle = "border-2 border-gray-200 border-b-8 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50/20";
                  
                  if (isWordSelected) {
                    pillStyle = "bg-amber-50 border-4 border-amber-500 border-b-8 text-amber-600 font-black shadow-md";
                  }

                  if (isChecked) {
                    const isWordCorrect = word === currentQuestion.correctAnswer;
                    if (isWordCorrect) {
                      pillStyle = "bg-[#10B981] border-4 border-emerald-600 border-b-8 text-white font-black shadow-md cursor-not-allowed";
                    } else if (isWordSelected) {
                      pillStyle = "bg-rose-500 border-4 border-rose-700 border-b-8 text-white font-black cursor-not-allowed";
                    } else {
                      pillStyle = "bg-gray-50 border-2 border-gray-105 border-b-4 text-gray-300 opacity-40 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={word}
                      disabled={isChecked}
                      onClick={() => handleWordSelect(word)}
                      className={`px-6 py-4 rounded-2xl font-serif text-xl tracking-tight transition-all ${pillStyle}`}
                      id={`choice-pill-${word}`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result Explanation box */}
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-3xl border-2 border-b-8 mb-6 text-sm flex gap-4 shadow-sm ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-200 border-b-8 text-emerald-900"
                      : "bg-rose-50 border-rose-200 border-b-8 text-rose-900"
                  }`}
                  id="completion-explanation"
                >
                  <span className="p-2.5 h-fit rounded-xl bg-white shadow-3xs text-xl shrink-0">
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <div className="font-bold">
                    <div className="font-black text-base flex items-center gap-2 flex-wrap mb-1 uppercase tracking-tight">
                      <span>{isCorrect ? "Ottima intuizione!" : "Falso amico!"}</span>
                      <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded shadow-3xs text-blue-600 flex items-center gap-1">
                        <Volume2 size={12} />
                        [{currentQuestion.pronunciation}]
                      </span>
                    </div>
                    <p className="font-medium text-gray-600 leading-relaxed mb-2">{currentQuestion.explanation}</p>
                    <p className="text-xs font-black text-gray-400 italic">
                      Significato: "{currentQuestion.translation}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">
                {!selectedWord ? "Scegli un'opzione" : "Parola impostata"}
              </span>
              {!isChecked ? (
                <button
                  disabled={!selectedWord}
                  onClick={handleVerify}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all text-white ${
                    selectedWord
                      ? "bg-[#10B981] border-b-8 border-green-700 shadow-md hover:bg-emerald-600"
                      : "bg-gray-100 text-gray-400 border-b-4 border-gray-200 cursor-not-allowed"
                  }`}
                  id="btn-verify-completion"
                >
                  Verifica
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-blue-800 hover:bg-blue-600 transition shadow-md"
                  id="btn-next-completion"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Prossima <ArrowRight size={16} strokeWidth={2.5} />
                    </>
                  ) : (
                    <>
                      Completa Attività <Sparkles size={16} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Finished screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="completion-results-card"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-b-4 border-blue-150">
              <BookOpen size={30} strokeWidth={2.5} className="pulsing-accent" />
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Completato con Successo!</h1>
            <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-6">
              Il completamento delle frasi allena la sensibilità ai casi logici e alla corretta concordanza grammaticale.
            </p>

            {/* Score circle */}
            <div className="inline-block relative p-4 mb-6 bg-amber-50 rounded-3xl border-2 border-amber-200 border-b-8 shadow-sm">
              <div className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center bg-white border border-amber-100 shadow-3xs">
                <span className="text-4xl font-black text-gray-800">{score} / 5</span>
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">RISPOSTE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-amber-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-amber-600 uppercase tracking-wider">Punti Guadagnati</span>
                <span className="text-xl font-bold text-[#10B981]">+{score * 10} XP</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-blue-600 uppercase tracking-wider">Precisione</span>
                <span className="text-xl font-bold text-blue-800">{score * 20}%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => {
                  setQuestions([...completionQuestions].sort(() => 0.5 - Math.random()).slice(0, 5));
                  setCurrentIndex(0);
                  setSelectedWord(null);
                  setIsChecked(false);
                  setIsCorrect(false);
                  setIsFinished(false);
                  setScore(0);
                  setShowHint(false);
                }}
                className="w-full sm:w-auto px-6 py-4 bg-gray-100 text-gray-750 font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-gray-300 hover:bg-gray-200 transition"
                id="btn-retry-completion"
              >
                Riprova
              </button>
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-blue-800 hover:bg-blue-600 transition shadow-md"
                id="btn-return-dash"
              >
                Torna ai Moduli
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
