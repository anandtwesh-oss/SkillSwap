import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // --- 1. Validate API key exists at runtime (not module-level) ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error: AI API key is missing. Please set GEMINI_API_KEY in your .env file." },
        { status: 500 }
      );
    }

    // --- 2. Parse request body ---
    const { text, mode } = await req.json(); // mode: "quiz" | "flashcards"

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide more text (at least 20 characters)." },
        { status: 400 }
      );
    }

    // --- 3. Initialize Gemini client lazily ---
    const genAI = new GoogleGenerativeAI(apiKey);

    const PRIMARY_MODEL = "gemini-2.5-flash";
    const FALLBACK_MODEL = "gemini-flash-latest";

    // --- 4. Build prompt ---
    const prompt =
      mode === "flashcards"
        ? `You are a flashcard generator. Given the text below, generate 5-8 flashcards.
Respond ONLY with valid JSON. No markdown, no code fences, no preamble, no trailing text.
Use this exact format:
{"flashcards": [{"front": "question or term", "back": "answer or definition"}]}

Text:
${text}`
        : `You are a quiz generator. Given the text below, generate 5 multiple-choice questions.
Each question must have exactly 4 options. correctIndex is the 0-based index of the correct option in the options array. correctAnswer is the text of the correct option.
Respond ONLY with valid JSON. No markdown, no code fences, no preamble, no trailing text.
Use this exact format:
{"questions": [{"question": "text", "options": ["a","b","c","d"], "correctIndex": 0, "correctAnswer": "a", "explanation": "why this is correct"}]}

Text:
${text}`;

    // --- 5. Call Gemini API with fallback ---
    let rawText: string;
    let usedModel = PRIMARY_MODEL;

    try {
      console.log(`[Quiz API] Calling Gemini API with primary model: ${PRIMARY_MODEL}`);
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
      const result = await model.generateContent(prompt);
      rawText = result.response.text();
    } catch (primaryErr) {
      console.warn(`[Quiz API] Primary model ${PRIMARY_MODEL} failed:`, primaryErr instanceof Error ? primaryErr.message : primaryErr);
      console.log(`[Quiz API] Falling back to model: ${FALLBACK_MODEL}`);
      usedModel = FALLBACK_MODEL;

      const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      rawText = fallbackResult.response.text();
    }

    console.log(`[Quiz API] Raw Gemini response (model: ${usedModel}):`, rawText);

    // --- 6. Robust JSON parsing ---
    // Strip markdown code fences that Gemini sometimes wraps around JSON
    let cleaned = rawText.trim();

    // Remove ```json ... ``` or ``` ... ``` wrapper
    const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
    if (fenceMatch) {
      cleaned = fenceMatch[1].trim();
    }

    // Fallback: if still starts with ```, strip them line by line
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/g, "").replace(/\n?\s*```$/g, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[Quiz API] JSON parse failed. Cleaned text was:", cleaned);
      console.error("[Quiz API] Parse error:", parseErr);
      return NextResponse.json(
        { error: "The AI returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    // --- 7. Validate structure ---
    if (mode === "flashcards") {
      if (!Array.isArray(parsed.flashcards) || parsed.flashcards.length === 0) {
        console.error("[Quiz API] Parsed response missing 'flashcards' array:", parsed);
        return NextResponse.json(
          { error: "The AI response was missing flashcard data. Please try again." },
          { status: 502 }
        );
      }
    } else {
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        console.error("[Quiz API] Parsed response missing 'questions' array:", parsed);
        return NextResponse.json(
          { error: "The AI response was missing quiz data. Please try again." },
          { status: 502 }
        );
      }
    }

    console.log("[Quiz API] Successfully generated", mode === "flashcards"
      ? `${(parsed.flashcards as unknown[]).length} flashcards`
      : `${(parsed.questions as unknown[]).length} questions`
    );

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    // --- 8. Detailed error logging ---
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;

    console.error("[Quiz API] Unhandled error:", errorMessage);
    if (errorStack) console.error("[Quiz API] Stack:", errorStack);

    // Check for common Gemini API errors
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("401")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file." },
        { status: 401 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "API rate limit exceeded. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return NextResponse.json(
        { error: "The AI model is not available. Please check model name compatibility." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate ${errorMessage.includes("flashcard") ? "flashcards" : "quiz"}. Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}