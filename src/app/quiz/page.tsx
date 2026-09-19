import QuizGenerator from "@/components/QuizGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Quiz & Flashcard Generator — SkillSwap",
  description:
    "Paste any article or notes and let AI generate interactive quizzes and flashcards to supercharge your learning.",
};

export default function QuizPage() {
  return <QuizGenerator />;
}