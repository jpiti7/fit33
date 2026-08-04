"use server";

import { getCoachReportAction } from "@/features/coach";
import { answerCoachQuestion } from "@/features/coach-chat/services/coach-chat.service";
import { getNutritionDayAction } from "@/features/nutrition";
import { getWeeklyPlanAction } from "@/features/planner";
import {
  getHydrationDayAction,
  getPreferencesAction,
} from "@/features/settings";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function askCoachAction(question: string) {
  if (!question.trim() || question.length > 500) {
    return {
      success: false as const,
      message: "Escribe una pregunta de hasta 500 caracteres.",
    };
  }

  try {
    const [report, nutrition, plan, preferences, hydration] = await Promise.all(
      [
        getCoachReportAction(),
        getNutritionDayAction(today()),
        getWeeklyPlanAction(),
        getPreferencesAction(),
        getHydrationDayAction(today()),
      ],
    );

    return {
      success: true as const,
      response: answerCoachQuestion(question, {
        report,
        nutrition,
        plan,
        preferences,
        hydrationMl: hydration.amountMl,
      }),
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "El Coach no pudo responder.",
    };
  }
}
