export type ActivityType = 'dash' | 'quiz' | 'completion' | 'dragdrop' | 'dailytest' | 'guide' | 'writing' | 'customPlay';

export interface UserStats {
  xp: number;
  streak: number;
  lastTestCompletedDate: string | null; // YYYY-MM-DD
  completedDailyDates: string[]; // List of YYYY-MM-DD
  level: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  pronunciation: string;
  explanation: string;
  translation: string;
}

export interface CompletionQuestion {
  id: string;
  sentenceWithBlank: string; // e.g. "Как ___ дела?"
  correctAnswer: string; // e.g. "твои"
  options: string[]; // Options to fill in
  translation: string; // Italian translation
  pronunciation: string; // Phonetic transcription
  explanation: string; // Explanation of grammar/context
}

export interface MatchPair {
  id: string;
  russian: string;
  italian: string;
  pronunciation?: string;
}

export interface DragMatchSet {
  id: string;
  title: string;
  pairs: MatchPair[];
}

export interface DailyTestQuestion {
  type: 'quiz' | 'completion';
  quizQuestion?: QuizQuestion;
  completionQuestion?: CompletionQuestion;
}

export interface DailyTest {
  dateString: string; // YYYY-MM-DD
  questions: DailyTestQuestion[];
}
