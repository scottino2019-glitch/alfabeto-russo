import React, { useState, useEffect } from "react";
import { ActivityType, UserStats } from "../types";
import { 
  Flame, Award, Globe, BookOpen, Layers, Edit3, 
  HelpCircle, CalendarCheck, Sparkles, Compass, Check, Info, RefreshCw,
  UploadCloud, FileJson, FolderOpen, AlertCircle, Play
} from "lucide-react";
import { motion } from "motion/react";
import { playSuccessSound } from "../utils/sound";

interface DashboardProps {
  stats: UserStats;
  onNavigate: (activity: ActivityType) => void;
  onLoadCustomDataset: (dataset: any) => void;
}

const GRAMMAR_TIPS = [
  {
    title: "I 6 Casi del Russo",
    text: "La lingua russa declina i sostantivi in 6 casi differenti (Nominativo, Genitivo, Dativo, Accusativo, Strumentale, Preposizionale) a seconda della funzione logica della parola nella frase."
  },
  {
    title: "La riduzione vocalica (Akan'ye)",
    text: "Quando la lettera 'O' in russo non porta l'accento tonico principale, si pronuncia più debole, quasi come una 'A' italiana. Ad esempio, 'хорошо' si legge [Kharashó]."
  },
  {
    title: "I Generi dei Sostantivi",
    text: "In russo i generi sono tre: Maschile (termina di solito in consonante), Femminile (termina in А, Я o Ь) e Neutro (termina in О, Е). Riconoscere il genere ti aiuterà ad abbinare gli aggettivi!"
  },
  {
    title: "I due segni muti",
    text: "Il segno molle (Ь) rende dolce e sfumata la consonante che lo precede (es. 'День' - Giorno). Il segno duro (Ъ) costringe a una breve pausa sillabica prima di ricominciare a leggere la vocale (es. 'Объект')."
  },
  {
    title: "Mancanza del verbo 'Essere' al presente",
    text: "Nel tempo presente in lingua russa, il verbo 'Essere' non si esprime. Ad esempio, 'Я Иван' significa letteralmente 'Io Ivan', ovvero 'Io sono Ivan'!"
  }
];

export default function Dashboard({ stats, onNavigate, onLoadCustomDataset }: DashboardProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [weekDays, setWeekDays] = useState<{ label: string; dateStr: string; short: string; completed: boolean }[]>([]);
  const [customDatasets, setCustomDatasets] = useState<any[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [customLoadError, setCustomLoadError] = useState<string | null>(null);

  // Fetch the custom files indexed inside public/esercizi/index.json
  useEffect(() => {
    const fetchCustomIndex = async () => {
      setLoadingCustom(true);
      try {
        const res = await fetch("/esercizi/index.json");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.datasets)) {
            setCustomDatasets(data.datasets);
          }
        } else {
          console.warn("Nessun file indice public/esercizi/index.json trovato.");
        }
      } catch (err) {
        console.error("Errore nel caricamento del file indice degli esercizi:", err);
      } finally {
        setLoadingCustom(false);
      }
    };
    fetchCustomIndex();
  }, []);

  // Fetch and launch specific exercise from public folder
  const handleLaunchStaticCustom = async (fileName: string) => {
    setCustomLoadError(null);
    try {
      const res = await fetch(`/esercizi/${fileName}`);
      if (!res.ok) throw new Error(`Impossibile leggere il file /esercizi/${fileName}`);
      const parsed = await res.json();
      if (!parsed.title || !Array.isArray(parsed.questions)) {
        throw new Error("Formato JSON non valido. Deve contenere un campo 'title' e un array 'questions'.");
      }
      onLoadCustomDataset(parsed);
    } catch (err: any) {
      setCustomLoadError(err.message || "Errore nel caricamento dell'esercizio.");
    }
  };

  // Handle uploaded JSON file drag/selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    readAndLoadFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    readAndLoadFile(file);
  };

  const readAndLoadFile = (file: File) => {
    setCustomLoadError(null);
    if (!file.name.endsWith(".json")) {
      setCustomLoadError("Seleziona un file in formato .json valido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.title || !Array.isArray(parsed.questions)) {
          throw new Error("Formato JSON non valido. Deve contenere 'title' e un 'questions' array.");
        }
        playSuccessSound();
        onLoadCustomDataset(parsed);
      } catch (err: any) {
        setCustomLoadError("Errore decodifica JSON: " + (err.message || "Verifica la sintassi."));
      }
    };
    reader.readAsText(file);
  };

  // Generate the list of the past 7 days to display in the calendar
  useEffect(() => {
    const daysArr = [];
    const italianDays = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const shortDays = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    
    // Cycle for past 7 days up to today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const YYYY = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, "0");
      const DD = String(d.getDate()).padStart(2, "0");
      const dateStr = `${YYYY}-${MM}-${DD}`;
      
      daysArr.push({
        label: italianDays[d.getDay()],
        short: shortDays[d.getDay()],
        dateStr,
        completed: stats.completedDailyDates.includes(dateStr)
      });
    }
    setWeekDays(daysArr);
  }, [stats.completedDailyDates]);

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % GRAMMAR_TIPS.length);
    playSuccessSound();
  };

  // Determine XP for next level (assuming 100 XP steps)
  const xpInCurrentLevel = stats.xp % 100;
  const currentCalculatedLevel = Math.floor(stats.xp / 100) + 1;
  const xpNeededForNext = 100;

  // Check if today's test is completed
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const isTodayCompleted = stats.completedDailyDates.includes(todayStr);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6" id="dashboard-view">
      
      {/* Visual Header / Welcome Hero - Vibrant Palette Accent */}
      <div className="bg-[#3B82F6] rounded-[36px] p-6 sm:p-8 text-white mb-8 border-b-8 border-blue-700 shadow-lg relative overflow-hidden" id="dashboard-hero">
        <div className="absolute right-0 bottom-0 opacity-15 font-serif text-[180px] leading-none select-none pointer-events-none translate-y-12 translate-x-6">
          РУС
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <Globe size={18} className="animate-spin-slow" />
            <span className="text-xs uppercase tracking-widest font-mono font-black">RUSSO RAPIDO • LIVELLO ATTIVO</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">Привет! 👋</h1>
          <p className="text-blue-50 max-w-md mt-2 text-sm sm:text-base font-bold leading-relaxed">
            Inizia ad allenarti per sbloccare nuovi livelli e completare il tuo obiettivo giornaliero in cirillico.
          </p>
        </div>
      </div>

      {/* Stats Bento Block - Vibrant Palette Styled */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8" id="stats-section">
        
        {/* User XP Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border-2 border-gray-100 border-b-8 border-gray-200 p-6 flex flex-col justify-between shadow-sm" id="card-xp">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">OBIETTIVO XP</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Award size={20} />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-800">{stats.xp}</span>
              <span className="text-xs text-gray-400 font-bold uppercase">XP ACQUISITI</span>
            </div>

            {/* Progress Bar under XP level */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-black text-gray-505 mb-1.5 uppercase">
                <span>Livello {currentCalculatedLevel}</span>
                <span>{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 relative">
                <div 
                  className="h-full bg-[#10B981] rounded-full transition-all duration-350 relative"
                  style={{ width: `${(xpInCurrentLevel / xpNeededForNext) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
            
            <p className="text-[11px] font-bold text-gray-400 mt-2 text-center">
              Mancano {xpNeededForNext - xpInCurrentLevel} XP per il Livello {currentCalculatedLevel + 1}!
            </p>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="md:col-span-3 bg-white rounded-3xl border-2 border-gray-100 border-b-8 border-gray-200 p-6 flex flex-col justify-between text-center items-center shadow-sm" id="card-streak">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2 w-full text-left">Streak</span>
          
          <div className="flex flex-col items-center justify-center my-2 relative">
            <Flame 
              size={56} 
              className={`transition-all duration-500 ${
                stats.streak > 0 
                  ? "text-orange-500 fill-orange-500 pulsing-accent drop-shadow-[0_2px_8px_rgba(249,115,22,0.35)]" 
                  : "text-gray-200"
              }`} 
            />
            <span className="text-3xl font-black text-gray-800 mt-2">
              {stats.streak} {stats.streak === 1 ? "Giorno" : "Giorni"}
            </span>
          </div>

          <span className="text-[10px] font-bold text-gray-400 leading-tight">
            {stats.streak > 0 
              ? "Streak protetto per oggi!" 
              : "Fai un test per accendere il fuoco dello streak!"}
          </span>
        </div>

        {/* Weekly Mini Test tracker */}
        <div className="md:col-span-4 bg-white rounded-3xl border-2 border-gray-100 border-b-8 border-gray-200 p-6 flex flex-col justify-between shadow-sm" id="card-calendar-week">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">SETTIMANA IN CORSO</span>
            <CalendarCheck size={18} className="text-gray-400" />
          </div>

          {/* Calendar row list */}
          <div className="flex justify-between items-center gap-1 my-2">
            {weekDays.map((day, idx) => {
              const isToday = day.dateStr === todayStr;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isToday ? "text-[#3B82F6] font-black" : "text-gray-400"}`}>
                    {day.short.substring(0, 1)}
                  </span>
                  <div 
                    title={`${day.label} (${day.dateStr})`}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                      day.completed
                        ? "bg-[#10B981] border-[#10B981] text-white shadow-xs"
                        : isToday
                        ? "border-amber-400 text-amber-600 bg-amber-50 animate-pulse scale-105"
                        : "border-gray-100 text-gray-400 bg-gray-50"
                    }`}
                  >
                    {day.completed ? (
                      <Check size={14} strokeWidth={4} />
                    ) : (
                      <span>{day.dateStr.split("-")[2]}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <span className="text-[10px] font-bold text-gray-400 text-center block mt-1">
            Ultimi 7 giorni di allenamento.
          </span>
        </div>
      </div>

      {/* Main Grid for Activities */}
      <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6 uppercase" id="section-activities-title">
        Scegli una sfida linguistica 🇷🇺
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" id="activities-grid">
        
        {/* 1. QUIZ RAPIDI */}
        <div 
          onClick={() => onNavigate("quiz")}
          className="group bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-8 border-gray-200 hover:border-b-8 hover:border-[#3B82F6] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-sm"
          id="activity-card-quiz"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-blue-50 text-[#3B82F6] rounded-2xl group-hover:bg-[#3B82F6] group-hover:text-white transition-colors duration-350">
                <Compass size={22} />
              </span>
              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +10 XP / risp
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 group-hover:text-[#3B82F6] transition-colors uppercase">
              Quiz Rapidi
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Domande a risposta multipla su vocaboli, modi di dire, verbi essenziali e fonetica. Semplice e immediato!
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#3B82F6] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
            Combatti con il tempo &rarr;
          </span>
        </div>

        {/* 2. COMPLETAMENTO FRASI */}
        <div 
          onClick={() => onNavigate("completion")}
          className="group bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-8 border-gray-200 hover:border-b-8 hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-sm"
          id="activity-card-completion"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-350">
                <Edit3 size={22} />
              </span>
              <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                +10 XP / risp
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 group-hover:text-amber-700 transition-colors uppercase">
              Completamento Frasi
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Completa le espressioni inserendo la parola corretta nel contesto. Ottimo per imparare i famigerati casi russi.
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
            Completa le frasi &rarr;
          </span>
        </div>

        {/* 3. TRASCINAMENTO VOCABOLI */}
        <div 
          onClick={() => onNavigate("dragdrop")}
          className="group bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-8 border-gray-200 hover:border-b-8 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-sm"
          id="activity-card-match"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-350">
                <Layers size={22} />
              </span>
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                +30 XP / mazzo
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors uppercase">
              Abbinamento Rapido
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Trascina o tocca per accoppiare parole in cirillico e significati in italiano. Impara vocaboli chiave.
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
            Sblocca mazzi &rarr;
          </span>
        </div>

        {/* 4. MINI TEST GIORNALIERO */}
        <div 
          onClick={() => onNavigate("dailytest")}
          className={`group bg-white rounded-3xl p-6 border-2 border-b-8 hover:-translate-y-1 duration-300 transition-all cursor-pointer relative flex flex-col justify-between shadow-sm ${
            isTodayCompleted 
              ? "border-green-150 border-b-8 border-gray-200 opacity-90 hover:border-[#10B981]" 
              : "border-gray-100 border-b-8 border-gray-200 hover:border-rose-500"
          }`}
          id="activity-card-daily"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className={`p-3 rounded-2xl transition-colors duration-355 ${
                isTodayCompleted 
                  ? "bg-green-50 text-green-600" 
                  : "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
              }`}>
                <Flame size={22} className={!isTodayCompleted ? "pulsing-accent" : ""} />
              </span>
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                +50 XP Bonus
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <h3 className="text-lg font-black text-gray-800 uppercase">
                Test Giornaliero
              </h3>
              {isTodayCompleted && (
                <span className="text-[10px] font-black bg-[#10B981] text-white px-2 py-0.5 rounded-full uppercase">
                  COMPLETATO
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Un set di 5 quesiti generati appositamente per oggi. Eseguilo per mantenere vivido il tuo streak di studio!
            </p>
          </div>
          <span className={`text-xs font-black uppercase tracking-widest inline-flex items-center gap-1 ${
            isTodayCompleted ? "text-gray-400 pointer-events-none" : "text-rose-500 group-hover:translate-x-1.5 transition-transform"
          }`}>
            {isTodayCompleted ? "Completato oggi!" : "Inizia il test &rarr;"}
          </span>
        </div>

        {/* 5. GUIDA ALL'ALFABETO CIRILLICO */}
        <div 
          onClick={() => onNavigate("guide")}
          className="group bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-8 border-gray-200 hover:border-b-8 hover:border-purple-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-sm"
          id="activity-card-guide"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-350">
                <BookOpen size={22} />
              </span>
              <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Consultazione
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 group-hover:text-purple-700 transition-colors uppercase">
              Alfabeto Cirillico
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Sfogliatore per imparare i 33 caratteri, ascoltare l'audio delle pronunce ed esplorare pratici esempi in italiano.
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#3B82F6] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
            Consulta Guida &rarr;
          </span>
        </div>

        {/* 6. PALESTRA SCRITTURA */}
        <div 
          onClick={() => onNavigate("writing")}
          className="group bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-8 border-gray-200 hover:border-b-8 hover:border-emerald-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between shadow-sm"
          id="activity-card-writing"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-emerald-50 text-[#10B981] rounded-2xl group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-350">
                <Edit3 size={22} />
              </span>
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                +30 XP Pratica
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors uppercase">
              Palestra Scrittura
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed mb-4">
              Esercitati sulle forme dei caratteri russi in Corsivo (Cursive) e Stampatello (Print) con la nostra lavagna interattiva!
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#10B981] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
            Impugna la penna &rarr;
          </span>
        </div>

      </div>

      {/* DYNAMIC JSON EXERCISES IMPORTER & public/esercizi FOLDER INTEGRATION */}
      <div className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 sm:p-8 mb-8 shadow-md" id="custom-exercises-importer">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-50 text-[#3B82F6]">
              <FolderOpen size={24} strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">📁 Mazzi di Studio JSON</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Esercizi Dinamici Integrati</p>
            </div>
          </div>
          
          <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-205 px-3 py-1.5 rounded-full uppercase">
            Auto-Import da public/esercizi
          </span>
        </div>

        {customLoadError && (
          <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-xl flex items-center gap-2 mb-6" id="load-error-card">
            <AlertCircle size={18} className="shrink-0" />
            <span>{customLoadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Side: Automatically crawled files list */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Mazzi Disponibili nel Progetto:</h4>
              
              {loadingCustom ? (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 py-6">
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
                  <span>Ricerca files...</span>
                </div>
              ) : customDatasets.length > 0 ? (
                <div className="space-y-3" id="static-exercises-list">
                  {customDatasets.map((dataset) => (
                    <div 
                      key={dataset.id}
                      className="bg-gray-50/50 hover:bg-blue-50/10 border-2 border-gray-150 rounded-2xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-white border border-gray-200 rounded-lg text-blue-600">
                            <FileJson size={14} />
                          </span>
                          <span className="font-black text-gray-850 text-sm uppercase tracking-tight">{dataset.title}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-405 leading-relaxed pl-1">
                          {dataset.description}
                        </p>
                        <span className="inline-block text-[9px] font-black text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200 font-mono">
                          Percorso: /public/esercizi/{dataset.fileName}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleLaunchStaticCustom(dataset.fileName)}
                        className="w-full sm:w-auto px-4.5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl border-b-4 border-blue-800 shadow-3xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Play size={12} fill="white" /> Gioca
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-150 rounded-2xl text-gray-400 text-xs font-bold">
                  Nessun file trovato in <code className="bg-gray-50 px-1 py-0.5 rounded">public/esercizi/index.json</code>.
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-150 rounded-2xl p-4 text-[11px] font-semibold text-amber-900 leading-relaxed">
              <span className="font-black block uppercase mb-1">💡 Istruzioni Auto-Importazione:</span>
              Puoi aggiungere infiniti esercizi personalizzati creando file JSON (con un <code className="font-mono bg-white px-1 font-bold">title</code> e un array <code className="font-mono bg-white px-1 font-bold">questions</code> di quiz/completion) nella cartella <code className="font-bold">public/esercizi/</code> del progetto ed elencandoli nel file catalogo <code className="font-mono bg-white px-1 font-bold">index.json</code>. Appariranno qui automaticamente ad ogni compilazione!
            </div>
          </div>

          {/* Right Side: Interactive Drag & Drop Box */}
          <div className="md:col-span-5 flex flex-col">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Oppure carica un file JSON istantaneo:</h4>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="flex-grow border-2 border-dashed border-gray-300 hover:border-[#3B82F6] bg-gray-50/50 hover:bg-blue-50/10 rounded-[28px] p-6 flex flex-col items-center justify-center text-center transition relative min-h-[180px] group cursor-pointer"
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                id="file-upload-input"
              />
              
              <div className="p-3.5 bg-white rounded-full border border-gray-200 text-gray-400 group-hover:text-[#3B82F6] group-hover:border-blue-105 transition mb-3 shadow-3xs">
                <UploadCloud size={30} className="animate-bounce" />
              </div>
              
              <span className="block font-black text-gray-800 text-xs sm:text-sm uppercase tracking-tight mb-1">
                Trascina il file .json
              </span>
              <span className="block text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                oppure clicca per sfogliare
              </span>
              
              <div className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-[8px] font-black uppercase text-gray-400 font-mono">
                Solo file tipo .json
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Grammar Tips Box - Vibrant Palette Styled */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 border-b-8 border-gray-200 p-6 flex flex-col sm:flex-row items-start gap-4 mb-4 shadow-sm" id="classroom-tip-section">
        <span className="p-3 bg-blue-50 text-[#3B82F6] rounded-2xl">
          <Info size={24} strokeWidth={2.5} />
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Pillola di Didattica</span>
            <button 
              onClick={rotateTip}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition"
              title="Cambia pillola"
            >
              <RefreshCw size={14} strokeWidth={2.5} />
            </button>
          </div>
          <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">{GRAMMAR_TIPS[tipIndex].title}</h4>
          <p className="text-xs font-bold text-gray-500 leading-relaxed">{GRAMMAR_TIPS[tipIndex].text}</p>
        </div>
      </div>
      
    </div>
  );
}
