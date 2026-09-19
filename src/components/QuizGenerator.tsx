"use client";

import { useState, useCallback } from "react";
import {
  BrainCircuit,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  FileText,
  Layers,
  Trophy,
  ArrowRight,
  Zap,
} from "lucide-react";

/* ---------- Types ---------- */
type MCQ = {
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer?: string;
  explanation: string;
};

type Flashcard = { front: string; back: string };

/* ---------- Component ---------- */
export default function QuizGenerator() {
  /* state */
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"quiz" | "flashcards">("quiz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentCard, setCurrentCard] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showScore, setShowScore] = useState(false);
  const [generated, setGenerated] = useState(false);

  /* derived */
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.reduce(
    (acc, q, i) => acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const allAnswered = answeredCount === questions.length && questions.length > 0;
  const charCount = text.trim().length;

  /* handlers */
  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setFlashcards([]);
    setSelectedAnswers({});
    setCurrentCard(0);
    setFlippedCards(new Set());
    setShowScore(false);
    setGenerated(false);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        return;
      }

      if (mode === "quiz") {
        setQuestions(data.questions || []);
      } else {
        setFlashcards(data.flashcards || []);
      }
      setGenerated(true);
    } catch (err) {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [text, mode]);

  const handleReset = () => {
    setQuestions([]);
    setFlashcards([]);
    setSelectedAnswers({});
    setCurrentCard(0);
    setFlippedCards(new Set());
    setShowScore(false);
    setGenerated(false);
    setError("");
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAnswer = (questionIdx: number, optionIdx: number) => {
    if (selectedAnswers[questionIdx] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* ---- Header ---- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/80 dark:bg-indigo-900/40 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
            AI Quiz & Flashcard Generator
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Paste any article, notes, or study material — AI will create interactive quizzes or flashcards instantly.
          </p>
        </div>

        {/* ---- Input Card ---- */}
        {!generated && (
          <div className="quiz-glass-card rounded-2xl p-6 mb-6">
            {/* Mode Selector */}
            <div className="flex items-center justify-center mb-5">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setMode("quiz")}
                  className={`quiz-mode-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "quiz"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md shadow-indigo-500/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Quiz (MCQ)
                </button>
                <button
                  onClick={() => setMode("flashcards")}
                  className={`quiz-mode-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "flashcards"
                      ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-md shadow-violet-500/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Flashcards
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your article, notes, or any study material here..."
                className="w-full h-44 p-4 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className={`text-xs font-medium ${charCount < 20 ? "text-amber-500" : "text-slate-400"}`}>
                  {charCount} chars
                </span>
                {charCount >= 20 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || charCount < 20}
              className="quiz-generate-btn mt-4 w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate {mode === "quiz" ? "Quiz" : "Flashcards"}
                </>
              )}
            </button>

            {charCount < 20 && charCount > 0 && (
              <p className="text-xs text-amber-500 mt-2 text-center">
                Need at least 20 characters ({20 - charCount} more)
              </p>
            )}
          </div>
        )}

        {/* ---- Loading Skeleton ---- */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="quiz-glass-card rounded-2xl p-6">
                <div className="quiz-shimmer h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="space-y-2">
                  <div className="quiz-shimmer h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" style={{ animationDelay: `${i * 0.15}s` }} />
                  <div className="quiz-shimmer h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" style={{ animationDelay: `${i * 0.15 + 0.1}s` }} />
                  <div className="quiz-shimmer h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" style={{ animationDelay: `${i * 0.15 + 0.2}s` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Error ---- */}
        {error && (
          <div className="quiz-glass-card rounded-2xl p-5 border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Generation Failed</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-1">{error}</p>
                <button
                  onClick={handleGenerate}
                  disabled={loading || charCount < 20}
                  className="quiz-mode-btn mt-3 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- QUIZ RESULTS ---- */}
        {mode === "quiz" && questions.length > 0 && !loading && (
          <div>
            {/* Progress Bar */}
            <div className="quiz-glass-card rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Progress: {answeredCount}/{questions.length} answered
                </span>
                {allAnswered && !showScore && (
                  <button
                    onClick={() => setShowScore(true)}
                    className="quiz-mode-btn flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
                  >
                    See Score <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Score Card */}
            {showScore && (
              <div className="quiz-glass-card rounded-2xl p-6 mb-6 text-center quiz-score-reveal">
                <Trophy className={`w-12 h-12 mx-auto mb-3 ${
                  correctCount === questions.length ? "text-amber-400" :
                  correctCount >= questions.length * 0.6 ? "text-indigo-500" : "text-slate-400"
                }`} />
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                  {correctCount} / {questions.length}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {correctCount === questions.length
                    ? "🎉 Perfect score! Outstanding!"
                    : correctCount >= questions.length * 0.8
                    ? "🔥 Great job! Almost perfect!"
                    : correctCount >= questions.length * 0.6
                    ? "👍 Good effort! Keep studying."
                    : "📚 Keep learning! You'll get there."}
                </p>
                <button
                  onClick={handleReset}
                  className="quiz-mode-btn mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-bold rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Generate New Quiz
                </button>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-5">
              {questions.map((q, i) => {
                const answered = selectedAnswers[i] !== undefined;
                const isCorrect = selectedAnswers[i] === q.correctIndex;
                return (
                  <div
                    key={i}
                    className={`quiz-glass-card rounded-2xl p-5 transition-all duration-300 ${
                      answered
                        ? isCorrect
                          ? "ring-2 ring-emerald-400/50"
                          : "ring-2 ring-red-400/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    <div className="space-y-2 ml-10">
                      {q.options.map((opt, oi) => {
                        const isSelected = selectedAnswers[i] === oi;
                        const isCorrectOpt = oi === q.correctIndex;
                        const showResult = answered;

                        let optClasses =
                          "quiz-option-btn w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ";

                        if (showResult && isCorrectOpt) {
                          optClasses +=
                            "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300";
                        } else if (showResult && isSelected && !isCorrectOpt) {
                          optClasses +=
                            "bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300";
                        } else if (!showResult) {
                          optClasses +=
                            "bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 cursor-pointer";
                        } else {
                          optClasses +=
                            "bg-white/30 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500";
                        }

                        return (
                          <button
                            key={oi}
                            onClick={() => selectAnswer(i, oi)}
                            disabled={showResult}
                            className={optClasses}
                          >
                            <span className="flex items-center gap-3">
                              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full border-2 text-[10px] font-bold border-current">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span>{opt}</span>
                              {showResult && isCorrectOpt && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                              )}
                              {showResult && isSelected && !isCorrectOpt && (
                                <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {answered && q.explanation && (
                      <div className="mt-4 ml-10 p-3 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/40">
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">💡 Explanation</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Reset */}
            {!showScore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleReset}
                  className="quiz-mode-btn flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---- FLASHCARD RESULTS ---- */}
        {mode === "flashcards" && flashcards.length > 0 && !loading && (
          <div>
            {/* Card Counter */}
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Card {currentCard + 1} of {flashcards.length}
              </span>
              <div className="flex justify-center gap-1.5 mt-2">
                {flashcards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCard(i)}
                    className={`quiz-mode-btn w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentCard
                        ? "bg-violet-500 scale-125"
                        : flippedCards.has(i)
                        ? "bg-violet-300 dark:bg-violet-700"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mx-auto" style={{ maxWidth: "480px" }}>
              <div
                onClick={() => toggleFlip(currentCard)}
                className={`quiz-flashcard-inner cursor-pointer ${flippedCards.has(currentCard) ? "quiz-flashcard-flipped" : ""}`}
              >
                {/* Front */}
                <div className="quiz-flashcard-face quiz-flashcard-front quiz-glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px]">
                  <FileText className="w-6 h-6 text-violet-400 mb-4" />
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center leading-relaxed">
                    {flashcards[currentCard].front}
                  </p>
                  <span className="mt-6 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Tap to reveal answer
                  </span>
                </div>

                {/* Back */}
                <div className="quiz-flashcard-face quiz-flashcard-back quiz-glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
                  <Zap className="w-6 h-6 text-indigo-500 mb-4" />
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center leading-relaxed">
                    {flashcards[currentCard].back}
                  </p>
                  <span className="mt-6 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Tap to see question
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setCurrentCard((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentCard === 0}
                className="quiz-mode-btn flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:border-violet-400 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={() => {
                  setCurrentCard((prev) => Math.min(flashcards.length - 1, prev + 1));
                }}
                disabled={currentCard === flashcards.length - 1}
                className="quiz-mode-btn flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:border-violet-400 transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reset */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReset}
                className="quiz-mode-btn flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Generate New Set
              </button>
            </div>
          </div>
        )}

        {/* ---- Empty State ---- */}
        {!loading && !generated && !error && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium">Paste some text above and hit Generate</p>
            <p className="text-xs mt-1">Works best with articles, notes, textbook passages, and documentation.</p>
          </div>
        )}
      </div>
    </div>
  );
}