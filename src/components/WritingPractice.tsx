import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Trash2, RotateCcw, CheckCircle2, ShieldCheck, HelpCircle, Award, Sparkles, BookOpen } from "lucide-react";
import { playSuccessSound } from "../utils/sound";

interface WritingPrompt {
  id: string;
  type: "character" | "word" | "sentence";
  print: string;
  cursiveEnglishGuide: string;
  cursiveDescription: string;
  translation: string;
  pronunciation: string;
}

const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "w1",
    type: "character",
    print: "д (Д)",
    cursiveEnglishGuide: "g / D",
    cursiveDescription: "In corsivo minuscolo, si scrive esattamente come una 'g' dell'alfabeto latino! In maiuscolo, assomiglia a una 'D' latina o un arco con riccioli.",
    translation: "Lettera D",
    pronunciation: "De"
  },
  {
    id: "w2",
    type: "character",
    print: "т (Т)",
    cursiveEnglishGuide: "m / T",
    cursiveDescription: "La 'т' minuscola corsiva si scrive come la 'm' italiana! Fai attenzione: la 'т' stampatella sembra una 't' ma si scrive 'm' in corsivo per fluidità.",
    translation: "Lettera T",
    pronunciation: "Te"
  },
  {
    id: "w3",
    type: "character",
    print: "г (Г)",
    cursiveEnglishGuide: "u / G",
    cursiveDescription: "In corsivo minuscolo, la 'г' si scrive esattamente come una 'u' italiana senza il punto! In maiuscolo, è un cappello orizzontale.",
    translation: "Lettera G",
    pronunciation: "Ge"
  },
  {
    id: "w4",
    type: "character",
    print: "и (И)",
    cursiveEnglishGuide: "u / I",
    cursiveDescription: "La 'и' corsiva minuscola assomiglia a una 'u' inclinata, formata da un doppio uncino senza staccare la penna.",
    translation: "Lettera I",
    pronunciation: "I"
  },
  {
    id: "w5",
    type: "character",
    print: "ж (Ж)",
    cursiveEnglishGuide: "x-x",
    cursiveDescription: "Assomiglia a una farfalla o un fiocco. Si traccia una stella a tre rami o una 'x' capovolta incrociata con un'asta verticale centrale.",
    translation: "Lettera Ž (Zhe dolce)",
    pronunciation: "Že"
  },
  {
    id: "w6",
    type: "character",
    print: "я (Я)",
    cursiveEnglishGuide: "ia",
    cursiveDescription: "La 'я' corsiva inizia con un piccolo uncino in basso a sinistra, sale a formare un occhiello (come una 'o') e scende con una gambetta aperta.",
    translation: "Lettera Ja",
    pronunciation: "Ja"
  },
  {
    id: "w7",
    type: "word",
    print: "Мама",
    cursiveEnglishGuide: "Mama (con uncini di attacco)",
    cursiveDescription: "In corsivo, collega le lettere con uncini fluidi in basso. Ogni 'м' deve iniziare con una breve curva di attacco a livello della base.",
    translation: "Mamma",
    pronunciation: "Mama"
  },
  {
    id: "w8",
    type: "word",
    print: "Привет",
    cursiveEnglishGuide: "Privet (p, r, i, v, e, m)",
    cursiveDescription: "La 'п' è come una 'n', la 'р' ha una gamba lunga in giù, la 'и' sembra 'u', la 'в' ha un cappio in alto, la 'е' è normale, la 'т' sembra 'm'.",
    translation: "Ciao (informale)",
    pronunciation: "Privet"
  },
  {
    id: "w9",
    type: "word",
    print: "Спасибо",
    cursiveEnglishGuide: "Spasibo (s, n, a, s, i, b, o)",
    cursiveDescription: "La 'п' corsiva è una 'n' latina. La 'б' corsiva si scrive come un cerchio inferiore con una linea orizzontale ondulata in alto a destra.",
    translation: "Grazie",
    pronunciation: "Spasibo"
  },
  {
    id: "w10",
    type: "sentence",
    print: "Как дела?",
    cursiveEnglishGuide: "Kak dela? (k, a, k | g, e, l, a)",
    cursiveDescription: "Frase intera. Nota il collegamento tra la 'д' (scelta come g minuscola) e la 'е' successiva.",
    translation: "Come stai? / Come vanno le cose?",
    pronunciation: "Kak dela?"
  }
];

interface WritingPracticeProps {
  onBack: () => void;
  onAddXP: (xpGained: number) => void;
}

export default function WritingPractice({ onBack, onAddXP }: WritingPracticeProps) {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [mode, setMode] = useState<"stampatello" | "corsivo">("corsivo");
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState("#10B981"); // emerald theme color by default
  const [hasDrawn, setHasDrawn] = useState(false);
  const [checklist, setChecklist] = useState({
    shapeMatched: false,
    connectionsVetted: false,
     наклонениеSlanted: false,
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [evaluationLocked, setEvaluationLocked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const activePrompt = WRITING_PROMPTS[activePromptIndex];

  // Initialize Canvas
  useEffect(() => {
    initCanvas();
  }, [activePromptIndex, mode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set dimensions based on client bounding box
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || 600;
    canvas.height = 250;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // General canvas styling
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    // Draw background guides
    drawCanvasGuidelines(ctx, canvas.width, canvas.height);
    setHasDrawn(false);
    setChecklist({
      shapeMatched: false,
      connectionsVetted: false,
      наклонениеSlanted: false,
    });
    setHistory([]);
    setShowFeedback(false);
    setEvaluationLocked(false);
  };

  const drawCanvasGuidelines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();

    // Baseline (solid line)
    ctx.beginPath();
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width, height * 0.7);
    ctx.stroke();

    // Meanline (dashed line)
    ctx.beginPath();
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.moveTo(0, height * 0.4);
    ctx.lineTo(width, height * 0.4);
    ctx.stroke();

    // Slanted guidelines for cursive
    if (mode === "corsivo") {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      for (let x = -50; x < width; x += 60) {
        ctx.moveTo(x + 50, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || evaluationLocked) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || evaluationLocked) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Save snapshot to history for Undo
    const canvas = canvasRef.current;
    if (canvas) {
      const snapshot = canvas.toDataURL();
      setHistory((prev) => [...prev, snapshot]);
    }
  };

  const getEventCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    drawCanvasGuidelines(ctx, canvas.width, canvas.height);
    setHasDrawn(false);
    setHistory([]);
    setChecklist({
      shapeMatched: false,
      connectionsVetted: false,
      наклонениеSlanted: false,
    });
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || history.length === 0) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current snapshot
    setHistory(newHistory);

    // Redraw initial guidelines
    drawCanvasGuidelines(ctx, canvas.width, canvas.height);

    if (newHistory.length === 0) {
      setHasDrawn(false);
    } else {
      // Draw previous state onto canvas
      const img = new Image();
      img.src = newHistory[newHistory.length - 1];
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const handleSubmitEvaluation = () => {
    if (!hasDrawn) return;
    setEvaluationLocked(true);
    setShowFeedback(true);
    playSuccessSound();
    onAddXP(30); // Award 30 XP for writing practice block
  };

  const handleNextPrompt = () => {
    if (activePromptIndex < WRITING_PROMPTS.length - 1) {
      setActivePromptIndex((prev) => prev + 1);
    } else {
      setActivePromptIndex(0);
    }
  };

  const allChecked = checklist.shapeMatched && checklist.connectionsVetted && (mode === "stampatello" || checklist.наклонениеSlanted);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4" id="writing-practice-activity">
      
      {/* Top Header Row with dynamic elements */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3B82F6] font-black uppercase text-xs tracking-wider transition-colors self-start cursor-pointer"
          id="btn-back-to-dashboard"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Indietro alla Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-xl bg-amber-50 text-amber-500 border-2 border-amber-155 shadow-3xs">
            <BookOpen size={20} strokeWidth={2.5} />
          </span>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight" id="writing-title">
            Palestra Scrittura
          </h1>
        </div>
      </div>

      {/* Grid containing prompts, reference, and active canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Prompt Card & Guidance rules */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 shadow-md flex-grow flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-widest font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase inline-block mb-3">
                {activePrompt.type === "character" ? "Carattere Cirillico" : activePrompt.type === "word" ? "Vocabolo" : "Frase Intera"}
              </span>
              
              <h2 className="text-6xl font-black text-gray-850 my-2 font-serif" id="prompt-print">
                {activePrompt.print}
              </h2>

              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider font-mono">
                pronuncia: <span className="text-gray-700">[{activePrompt.pronunciation}]</span>
              </p>

              <div className="border-t border-gray-100 my-4 pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Traduzione italiana:</span>
                <span className="text-lg font-black text-[#10B981]">{activePrompt.translation}</span>
              </div>
            </div>

            <div className="mt-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl p-4 text-xs font-semibold text-gray-700 space-y-1.5">
              <span className="font-black text-blue-800 text-xs uppercase block tracking-wider">💡 Suggerimento Corsivo:</span>
              <p className="leading-relaxed text-gray-650 opacity-95">{activePrompt.cursiveDescription}</p>
              <div className="pt-1.5 font-bold text-blue-900 border-t border-blue-100 flex items-center gap-1.5">
                <span className="opacity-75">Modello Cursive:</span>
                <span className="font-serif italic font-black text-lg bg-white px-2 py-0.5 rounded border border-blue-200">{activePrompt.cursiveEnglishGuide}</span>
              </div>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 border-b-8 border-gray-200 p-4 shadow-sm flex items-center justify-between gap-2">
            <span className="text-xs font-black text-gray-450 uppercase uppercase">Completa gli altri:</span>
            <div className="flex gap-1.5">
              <button
                disabled={activePromptIndex === 0}
                onClick={() => setActivePromptIndex((prev) => prev - 1)}
                className="px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-700 font-black rounded-xl text-xs hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Prec
              </button>
              <span className="text-xs font-black text-gray-700 py-2">
                {activePromptIndex + 1} / {WRITING_PROMPTS.length}
              </span>
              <button
                disabled={activePromptIndex === WRITING_PROMPTS.length - 1}
                onClick={() => setActivePromptIndex((prev) => prev + 1)}
                className="px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-700 font-black rounded-xl text-xs hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Succ
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Drawing Canvas Board */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 shadow-xl flex flex-col justify-between" id="writing-board">
            
            {/* Mode selection & configuration tools */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200" id="mode-tabs">
                <button
                  type="button"
                  onClick={() => { setMode("corsivo"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    mode === "corsivo" ? "bg-white text-[#3B82F6] shadow-sm font-black" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Corsivo ✍️
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("stampatello"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    mode === "stampatello" ? "bg-white text-[#3B82F6] shadow-sm font-black" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Stampatello 🅰️
                </button>
              </div>

              {/* Stroke and Eraser Tools */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-gray-405">Spessore:</span>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-16 accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-gray-200"
                  />
                  <span className="text-xs font-bold font-mono text-gray-500 w-4">{brushSize}px</span>
                </div>

                <div className="h-4 w-px bg-gray-200" />

                {/* Color quick selects */}
                <div className="flex gap-1">
                  {["#10B981", "#3B82F6", "#EC4899", "#111827"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBrushColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        brushColor === color ? "border-amber-400 scale-120 ring-1 ring-amber-300" : "border-white opacity-70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Interactive Canvas Wrapper with Guide Overlays */}
            <div className="relative border-2 border-gray-150 rounded-2xl bg-[#FCFCFD] overflow-hidden" id="canvas-container">
              {/* Grid backdrop labels */}
              <div className="absolute top-2 left-3 text-[10px] font-black uppercase tracking-wider text-gray-400 pointer-events-none select-none z-10">
                Pannello Di Tracciamento
              </div>
              <div className="absolute bottom-2 right-4 text-[9px] font-black uppercase tracking-widest text-[#10B981]/50 pointer-events-none select-none z-10">
                {mode === "corsivo" ? "Tieniti inclinato a destra // 75°" : "Tieniti eretto // 90°"}
              </div>

              {/* Guidelines helper text pointers */}
              <div className="absolute left-2.5 top-[38%] border-b border-dashed border-gray-300 w-12 pointer-events-none opacity-40" />
              <span className="absolute left-16 top-[32%] text-[8px] font-bold text-gray-400 pointer-events-none opacity-60">Linea Media</span>
              
              <div className="absolute left-2.5 top-[68%] border-b border-solid border-gray-300 w-12 pointer-events-none opacity-55" />
              <span className="absolute left-16 top-[62%] text-[8px] font-bold text-gray-400 pointer-events-none opacity-60">Linea Base</span>

              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[250px] relative block cursor-crosshair z-20"
                style={{ touchAction: "none" }}
              />
            </div>

            {/* Board Buttons: Clear, Undo, Submit */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!hasDrawn || evaluationLocked}
                  onClick={handleClear}
                  className="px-4 py-3 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 font-black text-gray-500 rounded-xl border-2 border-gray-100 hover:border-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 text-xs uppercase tracking-wider"
                  title="Pulisci lavagna"
                >
                  <Trash2 size={14} /> Pulisci
                </button>
                <button
                  type="button"
                  disabled={history.length === 0 || evaluationLocked}
                  onClick={handleUndo}
                  className="px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-[#3B82F6] font-black text-gray-500 rounded-xl border-2 border-gray-100 hover:border-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 text-xs uppercase tracking-wider"
                  title="Annulla ultimo tratto"
                >
                  <RotateCcw size={14} /> Annulla
                </button>
              </div>

              {!showFeedback ? (
                <button
                  type="button"
                  disabled={!hasDrawn}
                  onClick={handleSubmitEvaluation}
                  className={`px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest border-b-6 transition-all ${
                    hasDrawn
                      ? "bg-[#10B981] border-green-700 text-white hover:bg-emerald-600 scale-102 shadow-md active:border-b-2"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Invia Pratica
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-100 px-4 py-2.5 rounded-2xl uppercase tracking-wider">
                  <CheckCircle2 size={16} /> Pratica Registrata!
                </span>
              )}
            </div>
          </div>

          {/* Duolingo style Self-Evaluation checklist (visible after sending or drawing) */}
          <AnimatePresence>
            {hasDrawn && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFBEB] rounded-[32px] border-2 border-amber-200 p-6 shadow-md"
                id="self-eval-box"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={20} className="text-[#3B82F6]" strokeWidth={2.5} />
                  <h3 className="text-base font-black text-amber-950 uppercase tracking-tight">Griglia di Autovalutazione</h3>
                </div>

                <p className="text-xs text-amber-900 font-bold mb-4 opacity-90 leading-relaxed">
                  Confronta il tuo scritto sulla lavagna con la descrizione a sinistra e spunta i criteri corretti per completare l'esercizio con precisione:
                </p>

                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      disabled={evaluationLocked}
                      checked={checklist.shapeMatched}
                      onChange={(e) => setChecklist((prev) => ({ ...prev, shapeMatched: e.target.checked }))}
                      className="w-5 h-5 rounded border-2 border-amber-300 text-amber-500 focus:ring-amber-400 mt-0.5 accent-amber-600 cursor-pointer"
                    />
                    <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950">
                      <span className="block font-black uppercase text-[10px] text-amber-800 tracking-wider">Forma Generale</span>
                      <span>Ho mantenuto la forma tipica del carattere (es. la 'д' che sembra 'g' o la 'т' che sembra 'm').</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      disabled={evaluationLocked}
                      checked={checklist.connectionsVetted}
                      onChange={(e) => setChecklist((prev) => ({ ...prev, connectionsVetted: e.target.checked }))}
                      className="w-5 h-5 rounded border-2 border-amber-300 text-amber-500 focus:ring-amber-400 mt-0.5 accent-amber-600 cursor-pointer"
                    />
                    <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950">
                      <span className="block font-black uppercase text-[10px] text-amber-800 tracking-wider">Collegamenti e fluidità</span>
                      <span>Ho interconnesso fluidamente le singole lettere e tracciato le linee senza interrompere la penna.</span>
                    </div>
                  </label>

                  {mode === "corsivo" && (
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        disabled={evaluationLocked}
                        checked={checklist.наклонениеSlanted}
                        onChange={(e) => setChecklist((prev) => ({ ...prev, наклонениеSlanted: e.target.checked }))}
                        className="w-5 h-5 rounded border-2 border-amber-300 text-amber-500 focus:focus:ring-amber-400 mt-0.5 accent-amber-600 cursor-pointer"
                      />
                      <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950">
                        <span className="block font-black uppercase text-[10px] text-amber-800 tracking-wider">Pendenza Inclinata</span>
                        <span>Ho inclinato la scrittura verso destra a circa 75 gradi (fondamentale per il corsivo russo).</span>
                      </div>
                    </label>
                  )}
                </div>

                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/80 border-2 border-amber-205 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-black text-xl shadow-inner animate-bounce">
                        💎
                      </span>
                      <div>
                        <span className="text-xs font-black text-[#10B981] block uppercase tracking-wider">PRATICA COMPLETATA</span>
                        <span className="text-xs font-bold text-gray-500">Ottimo lavoro! Hai raddoppiato la tua memoria muscolare.</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleNextPrompt}
                        className="w-full sm:w-auto px-5 py-3 bg-[#3B82F6] text-white font-black uppercase text-[10px] tracking-widest rounded-xl border-b-4 border-blue-850 hover:bg-blue-600 transition shadow-xs whitespace-nowrap"
                      >
                        Prossima Lettera
                      </button>
                      <button
                        type="button"
                        onClick={initCanvas}
                        className="w-full sm:w-auto px-5 py-3 bg-gray-100 text-gray-700 font-black uppercase text-[10px] tracking-widest rounded-xl border-b-4 border-gray-300 hover:bg-gray-200 transition whitespace-nowrap"
                      >
                        Riscrivi
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
