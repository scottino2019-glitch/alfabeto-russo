import { QuizQuestion, CompletionQuestion, DragMatchSet, MatchPair } from "../types";

export interface AlphabetLetter {
  letter: string;
  italic: string;
  name: string;
  sound: string;
  example: string;
  exampleTrans: string;
  exampleIt: string;
}

export const cyrillicAlphabet: AlphabetLetter[] = [
  { letter: "А а", italic: "А а", name: "A", sound: "Come 'a' in italiano", example: "Анна", exampleTrans: "Anna", exampleIt: "Anna" },
  { letter: "Б б", italic: "Б б", name: "Be", sound: "Come 'b' in italiano", example: "Брат", exampleTrans: "Brat", exampleIt: "Fratello" },
  { letter: "В в", italic: "В в", name: "Ve", sound: "Come 'v' in italiano", example: "Вода", exampleTrans: "Voda", exampleIt: "Acqua" },
  { letter: "Г г", italic: "Г г", name: "Ge", sound: "Come 'g' dura (gatto)", example: "Город", exampleTrans: "Gorod", exampleIt: "Città" },
  { letter: "Д д", italic: "Д д", name: "De", sound: "Come 'd' in italiano", example: "Дом", exampleTrans: "Dom", exampleIt: "Casa" },
  { letter: "Е е", italic: "Е е", name: "Je", sound: "Come 'ie' in 'ieri' o 'e' chiusa", example: "Еда", exampleTrans: "Yeda", exampleIt: "Cibo" },
  { letter: "Ё ё", italic: "Ё ё", name: "Jo", sound: "Come 'io' in 'iodio'", example: "Ёлка", exampleTrans: "Yolka", exampleIt: "Abete" },
  { letter: "Ж ж", italic: "Ж ж", name: "Že", sound: "Suono dolce come la 'j' francese (bonjour)", example: "Жена", exampleTrans: "Zhena", exampleIt: "Moglie" },
  { letter: "З з", italic: "З з", name: "Ze", sound: "Come la 's' sonora (rosa)", example: "Звезда", exampleTrans: "Zvezda", exampleIt: "Stella" },
  { letter: "И и", italic: "И и", name: "I", sound: "Come 'i' in italiano", example: "Италия", exampleTrans: "Italiya", exampleIt: "Italia" },
  { letter: "Й й", italic: "Й й", name: "I breve", sound: "Semivocale corta come la 'i' di 'baita'", example: "Чай", exampleTrans: "Chai", exampleIt: "Tè" },
  { letter: "К к", italic: "К к", name: "Ka", sound: "Come 'c' in 'cane' o 'k'", example: "Книга", exampleTrans: "Kniga", exampleIt: "Libro" },
  { letter: "Л л", italic: "Л л", name: "El", sound: "Come la 'l' italiana ma più scura", example: "Лампа", exampleTrans: "Lampa", exampleIt: "Lampada" },
  { letter: "М м", italic: "М м", name: "Em", sound: "Come 'm' in italiano", example: "Мама", exampleTrans: "Mama", exampleIt: "Mamma" },
  { letter: "Н н", italic: "Н н", name: "En", sound: "Come 'n' in italiano", example: "Ночь", exampleTrans: "Noch", exampleIt: "Notte" },
  { letter: "О о", italic: "О о", name: "O", sound: "Come 'o' (si legge 'a' se non accentata)", example: "Окно", exampleTrans: "Okno (se legge aknó)", exampleIt: "Finestra" },
  { letter: "П п", italic: "П п", name: "Pe", sound: "Come 'p' in italiano", example: "Папа", exampleTrans: "Papa", exampleIt: "Papà" },
  { letter: "Р р", italic: "Р р", name: "Er", sound: "Come la 'r' vibrante italiana", example: "Рыба", exampleTrans: "Ryba", exampleIt: "Pesce" },
  { letter: "С с", italic: "С с", name: "Es", sound: "Sempre sorda come in 'sole'", example: "Сок", exampleTrans: "Sok", exampleIt: "Succo" },
  { letter: "Т т", italic: "Т т", name: "Te", sound: "Come 't' in italiano", example: "Телефон", exampleTrans: "Telefon", exampleIt: "Telefono" },
  { letter: "У у", italic: "У у", name: "U", sound: "Come 'u' in italiano", example: "Утро", exampleTrans: "Utro", exampleIt: "Mattina" },
  { letter: "Ф ф", italic: "Ф ф", name: "Ef", sound: "Come 'f' in italiano", example: "Фото", exampleTrans: "Foto", exampleIt: "Foto" },
  { letter: "Х х", italic: "Х х", name: "Kha", sound: "Suono aspirato forte, come la 'ch' tedesca (Bach)", example: "Хлеб", exampleTrans: "Khleb", exampleIt: "Pane" },
  { letter: "Ц ц", italic: "Ц ц", name: "Tse", sound: "Come 'z' aspra (marzo)", example: "Царь", exampleTrans: "Tsar", exampleIt: "Zar" },
  { letter: "Ч ч", italic: "Ч ч", name: "Če", sound: "Come la 'ci' dolce (ciao)", example: "Чайка", exampleTrans: "Chaika", exampleIt: "Gabbiano" },
  { letter: "Ш ш", italic: "Ш ш", name: "Ša", sound: "Come 'sc' in 'scimmia' (sorda e dura)", example: "Школа", exampleTrans: "Shkola", exampleIt: "Scuola" },
  { letter: "Щ щ", italic: "Щ щ", name: "Šča", sound: "Come 'sc' di scimmia ma pronunciata molto dolce", example: "Борщ", exampleTrans: "Borshch", exampleIt: "Borsch (zuppa)" },
  { letter: "Ъ ъ", italic: "Ъ ъ", name: "Segno duro", sound: "Non ha suono proprio; marca una pausa tra consonante e vocale", example: "Объект", exampleTrans: "Obyekt", exampleIt: "Oggetto" },
  { letter: "Ы ы", italic: "Ы ы", name: "Yy", sound: "Suono gutturale tra 'i' e 'u' (spingendo la lingua indietro)", example: "Мы", exampleTrans: "My", exampleIt: "Noi" },
  { letter: "Ь ь", italic: "Ь ь", name: "Segno molle", sound: "Non ha suono; ammorbidisce la consonante precedente", example: "День", exampleTrans: "Den'", exampleIt: "Giorno" },
  { letter: "Э э", italic: "Э э", name: "E", sound: "Come 'e' aperta in 'erba'", example: "Эхо", exampleTrans: "Ekho", exampleIt: "Eco" },
  { letter: "Ю ю", italic: "Ю ю", name: "Ju", sound: "Come 'iu' in 'piuma'", example: "Юбка", exampleTrans: "Yubka", exampleIt: "Gonna" },
  { letter: "Я я", italic: "Я я", name: "Ja", sound: "Come 'ia' in 'piatto'", example: "Яблоко", exampleTrans: "Yabloko", exampleIt: "Mela" }
];

export const quickQuizQuestions: QuizQuestion[] = [
  {
    id: "qq1",
    questionText: "Come si dice 'Grazie' in russo?",
    options: ["Пожалуйста", "Спасибо", "Здравствуйте", "Привет"],
    correctOptionIndex: 1,
    pronunciation: "Spasibo",
    translation: "Grazie",
    explanation: "'Спасибо' (Spasibo) significa 'Grazie'. 'Пожалуйста' significa 'Prego/Per favore'."
  },
  {
    id: "qq2",
    questionText: "Qual è il significato della parola 'Дом'?",
    options: ["Giorno", "Amico", "Casa", "Città"],
    correctOptionIndex: 2,
    pronunciation: "Dom",
    translation: "Casa",
    explanation: "'Дом' (Dom) significa 'Casa' o 'Edificio'. È imparentato con il latino 'domus'."
  },
  {
    id: "qq3",
    questionText: "Quale di queste espressioni significa 'Buongiorno' (formale)?",
    options: ["Добрый день", "Привет", "Доброе утро", "Спокойной ночи"],
    correctOptionIndex: 0,
    pronunciation: "Dobry den'",
    translation: "Buon pomeriggio / Buona giornata",
    explanation: "'Добрый день' (Dobry den') si usa dal mezzogiorno al tardo pomeriggio. 'Доброе утро' significa 'Buongiorno (mattina)'."
  },
  {
    id: "qq4",
    questionText: "Cosa significa il pronome russo 'Мы'?",
    options: ["Io", "Voi", "Loro", "Noi"],
    correctOptionIndex: 3,
    pronunciation: "My",
    translation: "Noi",
    explanation: "'Мы' (My) significa 'Noi'. Si compone del suono gutturale 'Ы'."
  },
  {
    id: "qq5",
    questionText: "Come si dice 'Sì' e 'No' in russo?",
    options: ["Да e Нет", "Да e Пожалуйста", "Привет e Пока", "Хорошо e Плохо"],
    correctOptionIndex: 0,
    pronunciation: "Da e Nyet",
    translation: "Sì e No",
    explanation: "'Да' (Da) significa Sì, 'Нет' (Nyet) significa No."
  },
  {
    id: "qq6",
    questionText: "Che cos'è il 'Борщ' (Borsch)?",
    options: ["Una bevanda alcolica", "Un dolce natalizio", "Una tradizionale zuppa di barbabietole", "Un ballo storico"],
    correctOptionIndex: 2,
    pronunciation: "Borshch",
    translation: "Zuppa di barbabietola",
    explanation: "Il 'Борщ' è il piatto tipico più famoso dell'est Europa, a base di barbabietole, cavolo e carne."
  },
  {
    id: "qq7",
    questionText: "Cosa significa 'Я не понимаю'?",
    options: ["Non so dove sia", "Non capisco", "Non parlo russo", "Vorrei ordinare"],
    correctOptionIndex: 1,
    pronunciation: "Ya ne ponimayu",
    translation: "Non capisco",
    explanation: "'Я' = Io, 'не' = non, 'понимаю' = capisco (dal verbo понимать)."
  },
  {
    id: "qq8",
    questionText: "In russo, come si pronuncia la lettera 'О' quando NON è accentata?",
    options: ["Come una 'U'", "Come una 'E'", "Resta muta", "Come una 'A'"],
    correctOptionIndex: 3,
    pronunciation: "Akan'ye",
    translation: "Riduzione della 'o'",
    explanation: "Questo fenomeno si chiama 'Akan'ye'. Ad esempio 'Хорошо' (bene) si pronuncia 'Kharashó' perché solo l'ultima 'O' è accentata."
  },
  {
    id: "qq9",
    questionText: "Quale numero corrisponde a 'Один'?",
    options: ["Uno", "Due", "Tre", "Dieci"],
    correctOptionIndex: 0,
    pronunciation: "Odin (pronunciato adín)",
    translation: "Uno",
    explanation: "'Один' (adín) è il numero 1. Due è 'Два' (Dva) e tre è 'Три' (Tri)."
  },
  {
    id: "qq10",
    questionText: "Quale di queste parole significa 'Amico' in russo?",
    options: ["Собака", "Друг", "Книга", "Брат"],
    correctOptionIndex: 1,
    pronunciation: "Drug",
    translation: "Amico",
    explanation: "'Друг' (Drug) significa amico maschile. Amica femminile si dice invece 'Подруга' (Podruga)."
  }
];

export const completionQuestions: CompletionQuestion[] = [
  {
    id: "cq1",
    sentenceWithBlank: "Как ___ дела?",
    correctAnswer: "твои",
    options: ["твои", "меня", "это", "вы"],
    translation: "Come vanno le tue cose? (Come stai?)",
    pronunciation: "Kak tvoi dela?",
    explanation: "'Dela' (affari/cose) è plurale neutro, quindi richiede il possessivo plurale 'твои' (tuoi)."
  },
  {
    id: "cq2",
    sentenceWithBlank: "Меня зовут ___.",
    correctAnswer: "Иван",
    options: ["Иван", "книга", "хорошо", "ты"],
    translation: "Mi chiamo Ivan.",
    pronunciation: "Menya zovut Ivan.",
    explanation: "'Меня зовут' significa letteralmente 'Mi chiamano', seguito dal nome proprio di persona."
  },
  {
    id: "cq3",
    sentenceWithBlank: "Я говорю по-___.",
    correctAnswer: "русски",
    options: ["русски", "русский", "руссия", "россия"],
    translation: "Parlo in russo.",
    pronunciation: "Ya govoryu po-russki.",
    explanation: "La costruzione 'по-русски' significa 'in lingua russa / alla maniera russa' ed è utilizzata con i verbi di lingua come говорить."
  },
  {
    id: "cq4",
    sentenceWithBlank: "Приятно ___ познакомиться.",
    correctAnswer: "с вами",
    options: ["с вами", "ты", "мы", "меня"],
    translation: "Piacere di conoscervi / conoscerla (formale).",
    pronunciation: "Priyatno s vami poznakomit'sya.",
    explanation: "'С вами' significa 'con voi'. 'Приятно познакомиться' significa letteralmente 'Piacevole conoscersi con voi'."
  },
  {
    id: "cq5",
    sentenceWithBlank: "Где находится ___?",
    correctAnswer: "метро",
    options: ["метро", "быстро", "писать", "один"],
    translation: "Dove si trova la metropolitana?",
    pronunciation: "Gde nakhoditsya metro?",
    explanation: "'Где' = dove, 'находится' = si trova, e 'метро' (metro) è il celeberrimo trasporto sotterraneo russo."
  },
  {
    id: "cq6",
    sentenceWithBlank: "Я тебя ___.",
    correctAnswer: "люблю",
    options: ["люблю", "хлеб", "друг", "красивый"],
    translation: "Ti amo.",
    pronunciation: "Ya tebya lyublyu.",
    explanation: "'Я' (Io), 'тебя' (te - accusativo di ты), 'люблю' (amo - prima persona del verbo любить)."
  },
  {
    id: "cq7",
    sentenceWithBlank: "Книга лежит на ___.",
    correctAnswer: "столе",
    options: ["столе", "стол", "стола", "столу"],
    translation: "Il libro è sul tavolo.",
    pronunciation: "Kniga lezhit na stole.",
    explanation: "Dopo la preposizione 'на' (su) per stato in luogo, si usa il caso Preposizionale. Quindi la desinenza di 'стол' cambia in 'столе'."
  },
  {
    id: "cq8",
    sentenceWithBlank: "Сегодня хорошая ___.",
    correctAnswer: "погода",
    options: ["погода", "вода", "метро", "утро"],
    translation: "Oggi c'è un bel tempo.",
    pronunciation: "Segodnya khoroshaya pogoda.",
    explanation: "L'aggettivo 'хорошая' (bella) è femminile, pertanto richiede il sostantivo femminile 'погода' (tempo atmosferico)."
  }
];

export const dragMatchSets: DragMatchSet[] = [
  {
    id: "dm1",
    title: "Saluti e Convenevoli 🌟",
    pairs: [
      { id: "dm1_1", russian: "Привет", italian: "Ciao (informale)" },
      { id: "dm1_2", russian: "Здравствуйте", italian: "Salve (formale)" },
      { id: "dm1_3", russian: "Пока", italian: "Ciao / Ci vediamo (congedo)" },
      { id: "dm1_4", russian: "До свидания", italian: "Arrivederci" },
      { id: "dm1_5", russian: "Благодарю", italian: "Ringrazio / Prego" }
    ]
  },
  {
    id: "dm2",
    title: "Membri della Famiglia 👨‍👩‍👧‍👦",
    pairs: [
      { id: "dm2_1", russian: "Мама", italian: "Mamma" },
      { id: "dm2_2", russian: "Папа", italian: "Papà" },
      { id: "dm2_3", russian: "Брат", italian: "Fratello" },
      { id: "dm2_4", russian: "Сестра", italian: "Sorella" },
      { id: "dm2_5", russian: "Сын", italian: "Figlio" }
    ]
  },
  {
    id: "dm3",
    title: "Alimenti Fondamentali 🍎",
    pairs: [
      { id: "dm3_1", russian: "Вода", italian: "Acqua" },
      { id: "dm3_2", russian: "Хлеб", italian: "Pane" },
      { id: "dm3_3", russian: "Молоко", italian: "Latte" },
      { id: "dm3_4", russian: "Чай", italian: "Tè" },
      { id: "dm3_5", russian: "Яблоко", italian: "Mela" }
    ]
  },
  {
    id: "dm4",
    title: "Numeri cardinali 🔢",
    pairs: [
      { id: "dm4_1", russian: "Один", italian: "Uno" },
      { id: "dm4_2", russian: "Два", italian: "Due" },
      { id: "dm4_3", russian: "Три", italian: "Tre" },
      { id: "dm4_4", russian: "Четыре", italian: "Quattro" },
      { id: "dm4_5", russian: "Пять", italian: "Cinque" }
    ]
  }
];

// Seeded pseudorandom algorithm using strings (like calendar dates) to generate stable questions for any date
function hashStringToNum(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getQuizForDate(dateStr: string): { questions: { type: 'quiz' | 'completion', id: string, q: any }[] } {
  const seed = hashStringToNum(dateStr);
  
  // We want to extract randomly yet deterministically:
  // 3 from quickQuizQuestions
  // 2 from completionQuestions
  
  const selectedQuestions: { type: 'quiz' | 'completion', id: string, q: any }[] = [];
  
  // Pick 3 from quickQuizQuestions without duplicates
  const quizIndices = [...Array(quickQuizQuestions.length).keys()];
  // Shuffle indices with seed
  let currentSeed = seed;
  for (let i = quizIndices.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    const temp = quizIndices[i];
    quizIndices[i] = quizIndices[j];
    quizIndices[j] = temp;
  }
  
  for (let i = 0; i < 3; i++) {
    const qIndex = quizIndices[i];
    selectedQuestions.push({
      type: 'quiz',
      id: quickQuizQuestions[qIndex].id,
      q: quickQuizQuestions[qIndex]
    });
  }

  // Pick 2 from completionQuestions without duplicates
  const completionIndices = [...Array(completionQuestions.length).keys()];
  for (let i = completionIndices.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    const temp = completionIndices[i];
    completionIndices[i] = completionIndices[j];
    completionIndices[j] = temp;
  }
  
  for (let i = 0; i < 2; i++) {
    const qIndex = completionIndices[i];
    selectedQuestions.push({
      type: 'completion',
      id: completionQuestions[qIndex].id,
      q: completionQuestions[qIndex]
    });
  }

  // Final shuffle of the mixed remaining questions
  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    const temp = selectedQuestions[i];
    selectedQuestions[i] = selectedQuestions[j];
    selectedQuestions[j] = temp;
  }

  return { questions: selectedQuestions };
}
