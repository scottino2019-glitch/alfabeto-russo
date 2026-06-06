import React, { useState } from "react";
import { cyrillicAlphabet, AlphabetLetter } from "../data/russianData";
import { BookOpen, Search, ArrowLeft, Volume2, Info } from "lucide-react";
import { motion } from "motion/react";
import { playSuccessSound } from "../utils/sound";

interface CyrillicGuideProps {
  onBack: () => void;
}

export default function CyrillicGuide({ onBack }: CyrillicGuideProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter | null>(cyrillicAlphabet[0]);

  const filteredAlphabet = cyrillicAlphabet.filter(
    (item) =>
      item.letter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sound.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleIt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLetter = (letter: AlphabetLetter) => {
    setSelectedLetter(letter);
    playSuccessSound();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" id="cyrillic-guide-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" id="guide-header">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3B82F6] font-black uppercase text-xs tracking-wider transition-colors self-start cursor-pointer"
          id="btn-back-to-dashboard"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Indietro alla Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-xl bg-blue-50 text-[#3B82F6] border-2 border-blue-105">
            <BookOpen size={20} strokeWidth={2.5} />
          </span>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight" id="guide-title">
            Alfabeto Cirillico
          </h1>
        </div>
      </div>

      {/* Letter details (Hero section) */}
      {selectedLetter && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 mb-8 grid md:grid-cols-12 gap-6 items-center shadow-xl"
          id="selected-letter-hero"
        >
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FFFBEB] rounded-2xl text-center border-2 border-amber-200 shadow-inner">
            <span className="text-8xl font-black text-[#3B82F6]" id="hero-cyrillic-char">
              {selectedLetter.letter.split(" ")[0]}
            </span>
            <span className="text-base text-gray-500 mt-1 font-serif italic font-bold">
              italico: {selectedLetter.letter.split(" ")[1]}
            </span>
            <div className="mt-4 px-3.5 py-1.5 bg-white rounded-full text-xs font-black text-gray-700 border-2 border-amber-100 inline-block uppercase">
              Nome: {selectedLetter.name}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pronuncia</h3>
              <p className="text-gray-700 font-bold text-sm md:text-base leading-relaxed flex items-start gap-3 bg-blue-50/60 p-4 rounded-xl border-2 border-blue-100">
                <Info size={18} className="text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{selectedLetter.sound}</span>
              </p>
            </div>

            <div className="border-t-2 border-gray-100 pt-4">
              <h4 className="text-xs font-black text-gray-450 uppercase tracking-widest mb-2">Esempio Pratico</h4>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-4xl font-serif font-black text-gray-800">{selectedLetter.example}</span>
                <span className="text-xs font-mono font-black text-[#10B910] bg-emerald-50 border-2 border-emerald-100 px-2.5 py-1 rounded-xl">
                  [{selectedLetter.exampleTrans}]
                </span>
                <span className="text-gray-400 font-black">=</span>
                <span className="text-lg text-gray-750 italic font-black text-emerald-800">{selectedLetter.exampleIt}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 font-black uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Volume2 size={14} className="text-gray-300" strokeWidth={2.5} />
              <span>Scegli una lettera sotto nel mazzo dei 33 caratteri per esplorarla.</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search & Grid list */}
      <div className="bg-white rounded-[32px] border-2 border-gray-100 border-b-8 border-gray-200 p-6 shadow-md" id="alphabet-grid-section">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Tutti i 33 caratteri cirillici</h2>
          
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input
              type="text"
              placeholder="Cerca per lettera, pronuncia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#3B82F6] transition-all text-gray-700 font-bold placeholder-gray-400"
              id="search-alphabet-input"
            />
          </div>
        </div>

        {/* Letter grid */}
        {filteredAlphabet.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3" id="letters-grid">
            {filteredAlphabet.map((item) => {
              const isSelected = selectedLetter?.letter === item.letter;
              return (
                <button
                  key={item.letter}
                  onClick={() => handleSelectLetter(item)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#3B82F6] border-4 border-blue-800 border-b-8 text-white scale-102 font-black shadow-md"
                      : "bg-white border-2 border-gray-200 border-b-8 text-gray-850 hover:border-[#3B82F6] hover:bg-blue-50/10 hover:-translate-y-0.5"
                  }`}
                  id={`letter-btn-${item.name}`}
                >
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-serif">
                    {item.letter.split(" ")[0]}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 font-bold text-sm">
            Nessuna lettera trovata per "{searchTerm}".
          </div>
        )}
      </div>

      {/* Useful tip card */}
      <div className="mt-8 bg-[#FFFBEB] border-2 border-amber-200 rounded-3xl p-5 flex gap-4 text-xs font-semibold text-amber-900 leading-relaxed shadow-3xs">
        <span className="p-2 h-fit bg-white border border-amber-200 text-amber-500 rounded-xl font-bold flex items-center justify-center">💡</span>
        <div className="space-y-1">
          <p className="font-black text-amber-955 uppercase tracking-wide">Consiglio utile per l'alfabeto Russo:</p>
          <p className="text-amber-900">
            Ci sono lettere identiche a quelle italiane per grafia e suono (<b className="font-black text-gray-900">А, К, М, О, Т</b>), lettere che sembrano lette in un modo ma si leggono in un altro (<b className="font-black text-gray-900 font-serif">В</b> è 'v', <b className="font-black text-gray-900 font-serif">Р</b> è 'r', <b className="font-black text-gray-900 font-serif">Н</b> è 'n', <b className="font-black text-gray-900 font-serif">Х</b> è una 'h' aspirata), e lettere completamente uniche (Б, Г, Д, Ж, З, П, Ф, Ц, Ч, Ш, Щ, Э, Ю, Я). Presta attenzione ai due segni muti: il segno molle (Ь) ammorbidisce il suono prima di sé, mentre il segno duro (Ъ) separa distintamente la consonante dalla vocale successiva.
          </p>
        </div>
      </div>
    </div>
  );
}
