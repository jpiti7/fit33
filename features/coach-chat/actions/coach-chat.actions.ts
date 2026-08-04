"use server";

import { getCoachReportAction } from "@/features/coach";
import { answerWithOpenAI } from "@/features/coach-ai/providers/openai.provider";
import { answerCoachQuestion } from "@/features/coach-chat/services/coach-chat.service";
import { getNutritionDayAction } from "@/features/nutrition";
import { getWeeklyPlanAction } from "@/features/planner";
import { getLatestRecoveryAction } from "@/features/recovery";
import {
  getHydrationDayAction,
  getPreferencesAction,
} from "@/features/settings";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function askCoachAction(question: string) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion || cleanQuestion.length > 500) {
    return {
      success: false as const,
      message: "Escribe una pregunta de hasta 500 caracteres.",
    };
  }

  try {
    const [report, nutrition, plan, preferences, hydration, recovery] =
      await Promise.all([
        getCoachReportAction(),
        getNutritionDayAction(today()),
        getWeeklyPlanAction(),
        getPreferencesAction(),
        getHydrationDayAction(today()),
        getLatestRecoveryAction(),
      ]);

    const rulesResponse = answerCoachQuestion(cleanQuestion, {
      report,
      nutrition,
      plan,
      preferences,
      hydrationMl: hydration.amountMl,
    });

    const aiResponse = await answerWithOpenAI({
      question: cleanQuestion,
      rulesAnswer: rulesResponse.answer,
      summary: [
        `Adherencia: ${report.adherencePercent}%`,
        `Próxima rutina: ${report.nextWorkout.type}`,
        `Recuperación: ${recovery?.score ?? "sin check-in"}/100`,
        `Calorías hoy: ${nutrition.totals.calories}/${nutrition.targets.calories}`,
        `Proteína hoy: ${nutrition.totals.protein}/${nutrition.targets.protein} g`,
        `Hidratación: ${hydration.amountMl}/${preferences.targetWaterMl} ml`,
        `Objetivo de peso: ${preferences.targetWeight ?? "sin definir"} kg`,
        `Alergias: ${preferences.allergies.join(", ") || "ninguna"}`,
        `Alimentos evitados: ${preferences.dislikedFoods.join(", ") || "ninguno"}`,
      ].join("\n"),
    }).catch(() => null);

    return {
      success: true as const,
      response: aiResponse ?? rulesResponse,
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "El Coach no pudo responder.",
    };
  }
}
