import React, { useState, useEffect } from "react";
import { getQuizForDate, quickQuizQuestions, completionQuestions } from "../data/russianData";
import { ArrowLeft, Check, X, Award, Medal, Calendar, ShieldCheck, Flame, ChevronRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSuccessSound, playErrorSound, playRewardSound } from "../utils/sound";

interface DailyTestProps {
  onBack: () => void;
  onCompleteDaily: (dateStr: string, correctCount: number) => void;
}

export default function DailyTest({ onBack, onCompleteDaily }: DailyTestProps) {
  const [dateStr, setDateStr] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // for quiz questions
  const [selectedWord, setSelectedWord] = useState<string | null>(null); // for fill questions
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Get current date string in standard YYYY-MM-DD
    const today = new Date();
    const YYYY = today.getFullYear();
    const MM = String(today.getMonth() + 1).padStart(2, "0");
    const DD = String(today.getDate()).padStart(2, "0");
    const dateQuery = `${YYYY}-${MM}-${DD}`;
    setDateStr(dateQuery);

    // Format human date in Italian
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    setFormattedDate(today.toLocaleDateString("it-IT", options));

    // Extract compile set for current day
    const compiled = getQuizForDate(dateQuery);
    setQuestions(compiled.questions);
  }, []);

  const handleStart = () => {
    setStarted(true);
    playSuccessSound();
  };

  const handleQuizOptionClick = (idx: number, correctIdx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const correct = idx === correctIdx;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleCompletionWordClick = (word: string, correctWord: string) => {
    if (isAnswered) return;
    setSelectedWord(word);
    setIsAnswered(true);

    const correct = word === correctWord;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIdx(null);
      setSelectedWord(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      onCompleteDaily(dateStr, score);
      playRewardSound();
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const currentItem = questions[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="daily-test-view">
      {/* Back button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          id="btn-quit-daily"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Calendar size={12} /> Test del Giorno
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          /* Introduction Screen - Vibrant Slate Styled */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="daily-test-intro-box"
          >
            <div className="w-16 h-16 bg-amber-50 border-b-4 border-amber-200 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Medal size={32} strokeWidth={2.5} className="pulsing-accent fill-amber-100" />
            </div>

            <h1 className="text-3xl font-black text-gray-850 mb-1 uppercase tracking-tight">Mini-Test Giornaliero</h1>
            <p className="text-[#3B82F6] font-black text-xs uppercase tracking-widest mb-4">
              {formattedDate}
            </p>

            <p className="text-gray-500 font-bold text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Metti alla prova le tue abilità con 5 domande speciali per oggi. Una combinazione di <strong className="text-gray-800">Scelta Multipla</strong> e <strong className="text-gray-800">Risoluzione Frasi</strong>.
            </p>

            <div className="bg-[#FFFBEB] border-2 border-amber-200 p-5 rounded-2xl max-w-md mx-auto mb-8 text-left space-y-2.5 text-xs text-amber-900 font-bold">
              <div className="flex items-center gap-2 font-black text-amber-950 uppercase tracking-wide">
                <ShieldCheck size={18} className="text-[#10B981]" strokeWidth={2.5} />
                Regole della Sfida Giornaliera:
              </div>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Le domande rimangono stabili per l'intera giornata.</li>
                <li>Garantisce <b className="text-[#10B981] font-black">+50 XP bonus</b> se completato con successo!</li>
                <li>Aiuta a incrementare il tuo Streak giornaliero (la fiamma).</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="px-10 py-4.5 bg-[#10B981] border-b-8 border-green-700 text-white font-black rounded-2xl hover:bg-emerald-600 shadow-md uppercase tracking-widest text-xs transition"
              id="btn-launch-daily"
            >
              Inizia il Test di Oggi
            </button>
          </motion.div>
        ) : !isFinished ? (
          /* Dynamic Active Question Frame - Vibrant Slate Card */
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 md:p-8 shadow-xl"
            id={`daily-card-${currentIndex}`}
          >
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                <span className="text-[10px] tracking-widest font-black text-[#3B82F6] bg-blue-50 border border-blue-50 px-3 py-1 rounded-full">
                  {currentItem.type === "quiz" ? "Scelta Multipla" : "Completamento"}
                </span>
                <span>
                  Domanda {currentIndex + 1} di 5
                </span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-205 relative">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300 relative"
                  style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Questions renderer depending on question type */}
            {currentItem.type === "quiz" ? (
              /* Multiple Choice */
              <div>
                <h2 className="text-2xl font-black text-gray-800 mb-6 leading-tight uppercase tracking-tight">
                  {currentItem.q.questionText}
                </h2>

                <div className="space-y-4 mb-6">
                  {currentItem.q.options.map((option: string, idx: number) => {
                    let btnStyle = "border-2 border-gray-200 border-b-8 hover:border-[#3B82F6] hover:-translate-y-0.5 bg-white text-gray-700 hover:bg-gray-50";
                    let marker = null;

                    if (isAnswered) {
                      const isCorrectOpt = idx === currentItem.q.correctOptionIndex;
                      const isChosen = idx === selectedIdx;

                      if (isCorrectOpt) {
                        btnStyle = "bg-emerald-50 border-4 border-[#10B981] border-b-8 text-[#10B981] font-black shadow-md";
                        marker = <span className="text-[10px] font-black bg-white border border-[#10B981] text-[#10B981] px-2 py-1 rounded-md">CORRETTO</span>;
                      } else if (isChosen) {
                        btnStyle = "bg-rose-50 border-4 border-rose-500 border-b-8 text-rose-700 font-black shadow-md";
                        marker = <span className="text-[10px] font-black bg-white border border-rose-500 text-rose-550 px-2 py-1 rounded-md">ERRATO</span>;
                      } else {
                        btnStyle = "border-2 border-gray-105 border-b-4 bg-gray-50 text-gray-400 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleQuizOptionClick(idx, currentItem.q.correctOptionIndex)}
                        className={`w-full text-left px-5 py-4 rounded-xl flex items-center justify-between text-lg font-bold transition-all ${btnStyle}`}
                        id={`daily-opt-${idx}`}
                      >
                        <span className="font-serif tracking-tight">{option}</span>
                        {marker}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Fill-in-the-blank Sentence Completion */
              <div>
                {/* Sentence with blank */}
                <div className="mb-4 text-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-black">Trova la parola mancante:</span>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 py-8 text-2xl md:text-3xl font-black text-gray-800 border-y-4 border-gray-100 my-4 tracking-tight">
                    <span>{currentItem.q.sentenceWithBlank.split("___")[0]}</span>
                    <span className={`min-w-[110px] border-b-4 px-3 py-1 font-black text-center transition-all ${
                      isAnswered
                        ? isCorrect
                          ? "border-[#10B981] text-[#10B981] bg-emerald-50 rounded-2xl"
                          : "border-rose-455 text-rose-600 bg-rose-50 rounded-2xl"
                        : selectedWord
                        ? "border-[#3B82F6] text-[#3B82F6] bg-blue-50 rounded-2xl"
                        : "border-gray-250 text-gray-300 italic"
                    }`}>
                      {selectedWord || "_____"}
                    </span>
                    <span>{currentItem.q.sentenceWithBlank.split("___")[1]}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500 bg-amber-50 border-2 border-amber-150 px-4 py-1.5 rounded-full shadow-3xs inline-block">
                    🇮🇹 Traduzione: "{currentItem.q.translation}"
                  </span>
                </div>

                {/* Option pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-8 mb-6">
                  {currentItem.q.options.map((word: string) => {
                    const isWordChosen = selectedWord === word;
                    let pillStyle = "border-2 border-gray-200 border-b-8 bg-white text-gray-800 hover:border-[#3B82F6] hover:bg-blue-55/10 hover:-translate-y-0.5";

                    if (isAnswered && word === currentItem.q.correctAnswer) {
                      pillStyle = "bg-[#10B981] border-4 border-emerald-605 border-b-8 text-white font-black shadow-md cursor-not-allowed";
                    } else if (isWordChosen) {
                      pillStyle = isCorrect
                        ? "bg-[#10B981] border-4 border-emerald-600 border-b-8 text-white font-black cursor-not-allowed"
                        : "bg-rose-500 border-4 border-rose-700 border-b-8 text-white font-black cursor-not-allowed";
                    } else if (isAnswered) {
                      pillStyle = "bg-gray-50 border-2 border-gray-105 border-b-4 text-gray-350 opacity-40 cursor-not-allowed";
                    }

                    return (
                      <button
                        key={word}
                        disabled={isAnswered}
                        onClick={() => handleCompletionWordClick(word, currentItem.q.correctAnswer)}
                        className={`px-6 py-4 rounded-2xl font-serif text-lg tracking-tight transition-all cursor-pointer ${pillStyle}`}
                        id={`daily-completion-pill-${word}`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer feedback panel */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-50/45 border-2 border-blue-100 rounded-2xl p-5 mb-6 text-sm font-bold text-gray-700"
                  id="daily-fb-panel"
                >
                  <div className="font-bold text-gray-850 flex items-center gap-2 mb-2 uppercase tracking-tight text-xs">
                    <span className="p-1 rounded bg-[#3B82F6] text-white font-black text-[9px] font-mono px-1.5 leading-none">DIDATTICA</span>
                    <span>Curiosità di Pronuncia & Regole:</span>
                    <span className="text-xs font-mono font-black text-[#3B82F6]">
                      [{currentItem.q.pronunciation || currentItem.q.options[currentItem.q.correctOptionIndex]}]
                    </span>
                  </div>
                  <p className="leading-relaxed font-semibold text-gray-650 opacity-95">{currentItem.q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex justify-end pt-3">
              <button
                disabled={!isAnswered}
                onClick={handleNext}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-md ${
                  isAnswered
                    ? "bg-[#10B981] border-b-8 border-green-700 text-white hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-400 border-b-4 border-gray-200 cursor-not-allowed shadow-none"
                }`}
                id="btn-next-daily-card"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Continua <ChevronRight size={16} strokeWidth={2.5} />
                  </>
                ) : (
                  <>
                    Vedi Risultato Finale <Award size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Finished Daily Test card - Vibrant Palette Styled */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-8 text-center shadow-lg"
            id="daily-test-completion-screen"
          >
            <div className="w-16 h-16 bg-blue-50 border-b-4 border-blue-200 text-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Flame size={32} strokeWidth={2.5} className="pulsing-accent fill-[#3B82F6] text-[#3B82F6]" />
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-1 uppercase tracking-tight">Test Giornaliero Completato!</h1>
            <p className="text-[#10B981] font-black text-sm tracking-widest uppercase mb-4">
              Streak +1 Giorno! 🔥
            </p>

            <p className="text-gray-500 font-bold text-xs sm:text-sm max-w-md mx-auto mb-6">
              Hai risposto con successo alla sfida del <span className="font-extrabold text-[#3B82F6]">{formattedDate}</span>. Il tuo streak è ora protetto e incrementato!
            </p>

            {/* Mini scorecard container */}
            <div className="bg-[#FFFBEB] border-2 border-amber-200 rounded-[32px] p-6 max-w-sm mx-auto mb-8 shadow-sm">
              <div className="text-center mb-4">
                <span className="block text-4xl font-black text-gray-800">{score} / 5</span>
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">RISPOSTE ESATTE</span>
              </div>

              <div className="border-t border-amber-200/60 pt-4 flex justify-between text-xs text-amber-700 font-bold uppercase">
                <div className="text-center flex-1">
                  <span className="block font-black text-[#10B981] text-base">+50 XP</span>
                  <span className="text-[9px]">Sfida Bonus</span>
                </div>
                <div className="w-px bg-amber-200"></div>
                <div className="text-center flex-1">
                  <span className="block font-black text-gray-800 text-base">+{score * 10} XP</span>
                  <span className="text-[9px]">Esito quesiti</span>
                </div>
              </div>
            </div>

            <button
               onClick={onBack}
               className="w-full sm:w-auto px-10 py-4.5 bg-[#3B82F6] border-b-8 border-blue-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-600 transition shadow-md"
               id="btn-return-from-daily"
            >
              Ritorna alla Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
