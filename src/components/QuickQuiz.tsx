import React, { useState, useEffect } from "react";
import { quickQuizQuestions } from "../data/russianData";
import { QuizQuestion } from "../types";
import { ArrowLeft, CheckCircle2, XCircle, Award, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSuccessSound, playErrorSound, playRewardSound } from "../utils/sound";

interface QuickQuizProps {
  onBack: () => void;
  onAddXP: (xp: number) => void;
}

export default function QuickQuiz({ onBack, onAddXP }: QuickQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize quiz with 5 random distinct questions from quickQuizQuestions
  useEffect(() => {
    const shuffled = [...quickQuizQuestions].sort(() => 0.5 - Math.random());
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

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return; // Prevent double clicking

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNextClick = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const xpGained = score * 10;
      onAddXP(xpGained);
      playRewardSound();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="quick-quiz-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" id="quiz-header">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          id="btn-quit-quiz"
        >
          <ArrowLeft size={16} /> Esci dal Quiz
        </button>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
          Livello Principiante
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 md:p-8 shadow-sm"
            id={`quiz-card-${currentIndex}`}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-black text-gray-400 mb-2 uppercase tracking-wide">
                <span>Quiz Rapido</span>
                <span>
                  Domanda {currentIndex + 1} di {questions.length}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300 relative"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Question title */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest font-black text-[#3B82F6] bg-blue-50 px-2.5 py-1 rounded-full">
                Grammatica & Vocabolario
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mt-4 leading-tight uppercase tracking-tight">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-4 mb-6">
              {currentQuestion.options.map((option, idx) => {
                let buttonStyle = "border-2 border-gray-200 border-b-8 hover:border-[#3B82F6] hover:-translate-y-0.5 bg-white text-gray-700 hover:bg-gray-50";
                let icon = null;

                if (isAnswered) {
                  const isCurrentCorrect = idx === currentQuestion.correctOptionIndex;
                  const isCurrentSelected = idx === selectedOption;

                  if (isCurrentCorrect) {
                    buttonStyle = "bg-emerald-50 border-4 border-[#10B981] border-b-8 text-[#10B981] font-black shadow-md";
                    icon = <CheckCircle2 size={20} className="text-[#10B981] shrink-0" />;
                  } else if (isCurrentSelected) {
                    buttonStyle = "bg-rose-50 border-4 border-rose-500 border-b-8 text-rose-700 font-black shadow-md";
                    icon = <XCircle size={20} className="text-rose-500" />;
                  } else {
                    buttonStyle = "bg-gray-50/50 border-2 border-gray-105 border-b-4 text-gray-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left px-6 py-4 rounded-xl flex items-center justify-between text-lg font-bold transition-all ${buttonStyle}`}
                    id={`option-btn-${idx}`}
                  >
                    <span className="font-serif tracking-tight">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation card revealed when answered */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-50/40 border-2 border-blue-100 rounded-2xl p-5 mb-6 overflow-hidden"
                  id="explanation-panel"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-1 rounded-md bg-[#3B82F6] text-white font-black text-[10px] font-mono uppercase px-2">
                      DIDATTICA
                    </span>
                    <h3 className="text-xs font-black text-[#3B82F6] uppercase tracking-wider">Analisa del Vocabolo</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-700 leading-relaxed font-bold">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-serif font-black text-lg text-gray-800">
                        {currentQuestion.options[currentQuestion.correctOptionIndex]}
                      </span>
                      <span className="text-xs font-mono bg-white border border-blue-100 px-2 py-0.5 rounded shadow-3xs text-blue-600">
                        [{currentQuestion.pronunciation}]
                      </span>
                      <span className="text-gray-400">—</span>
                      <span className="italic text-gray-800">{currentQuestion.translation}</span>
                    </div>
                    <p className="border-t border-blue-100/60 pt-2 mt-1 font-medium text-gray-600 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex justify-end">
              <button
                disabled={!isAnswered}
                onClick={handleNextClick}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-md ${
                  isAnswered
                    ? "bg-[#10B981] text-white border-b-8 border-green-700 hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-400 border-b-4 border-gray-200 cursor-not-allowed shadow-none"
                }`}
                id="btn-next-question"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Continua <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                ) : (
                  <>
                    Vedi Risultati <Award size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Finished screen - Vibrant Palette Styled */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="quiz-results-card"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-650 rounded-2xl flex items-center justify-center mx-auto mb-6 border-b-4 border-blue-205 shadow-sm">
              <Sparkles size={32} className="pulsing-accent" />
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Quiz Completato!</h1>
            <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-6">
              Eccezionale! Ogni quiz rapido consolida regole e vocaboli nella tua memoria a lungo termine.
            </p>

            {/* Score circle badge - Vibrant */}
            <div className="inline-block relative p-4 mb-6 bg-amber-50 rounded-3xl border-2 border-amber-200 border-b-8 shadow-sm">
              <div className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center bg-white border border-amber-100 shadow-3xs">
                <span className="text-4xl font-black text-gray-800">{score} / 5</span>
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">RISPOSTE</span>
              </div>
            </div>

            {/* Stats Gained */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-amber-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-amber-600 uppercase tracking-wider">Punti Guadagnati</span>
                <span className="text-2xl font-black text-[#10B981]">+{score * 10} XP</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 border-b-8 text-center">
                <span className="block text-[10px] font-black text-blue-600 uppercase tracking-wider">Precisione</span>
                <span className="text-2xl font-black text-blue-800">{score * 20}%</span>
              </div>
            </div>

            {/* Reward message based on score */}
            <p className="text-sm font-bold text-gray-700 mb-8 px-4 py-3 bg-gray-50 rounded-xl border-b-4 border-gray-200 inline-flex items-center gap-2">
              <AlertCircle size={16} className="text-[#3B82F6]" />
              {score === 5 && "Eccellente! Hai risposto correttamente a tutto!"}
              {score >= 3 && score < 5 && "Molto bene! Continua così per padroneggiare i vocaboli."}
              {score < 3 && "Continua a esercitarti! L'alfabeto e i vocaboli arriveranno col tempo."}
            </p>

            {/* Actions with chunky buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => {
                  setQuestions([...quickQuizQuestions].sort(() => 0.5 - Math.random()).slice(0, 5));
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setIsFinished(false);
                  setScore(0);
                }}
                className="w-full sm:w-auto px-6 py-4 bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-xs rounded-2xl border-b-8 border-gray-300 hover:bg-gray-200 transition"
                id="btn-retry-quiz"
              >
                Riprova Quiz
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
