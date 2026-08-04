import type { CoachReport } from "@/features/coach";
import type { NutritionDay } from "@/features/nutrition";
import type { WeeklyPlan } from "@/features/planner";
import type { UserPreferences } from "@/features/settings";
import type { CoachChatResponse } from "@/features/coach-chat/types";

type ChatContext = {
  report: CoachReport;
  nutrition: NutritionDay;
  plan: WeeklyPlan;
  preferences: UserPreferences;
  hydrationMl: number;
};

function normalize(text: string) {
  return text
    .toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function answerCoachQuestion(
  question: string,
  context: ChatContext,
): CoachChatResponse {
  const query = normalize(question);
  const remainingCalories = Math.max(
    0,
    context.nutrition.targets.calories - context.nutrition.totals.calories,
  );
  const remainingProtein = Math.max(
    0,
    context.nutrition.targets.protein - context.nutrition.totals.protein,
  );
  const next =
    context.plan.sessions.find(
      (session) => session.date >= new Date().toISOString().slice(0, 10),
    ) ?? context.plan.sessions[0];

  if (
    query.includes("entreno") ||
    query.includes("entrenar") ||
    query.includes("hoy")
  ) {
    return {
      answer: `La sesión recomendada es ${next?.type ?? context.report.nextWorkout.type}. ${context.report.nextWorkout.reason} Tu adherencia semanal está en ${context.report.adherencePercent} %.`,
      suggestions: [
        "¿Cómo gestiono el descanso?",
        "¿Debo subir peso?",
        "Muéstrame mi semana",
      ],
      source: "rules",
    };
  }

  if (
    query.includes("comer") ||
    query.includes("caloria") ||
    query.includes("proteina")
  ) {
    const allergies = context.preferences.allergies.join(", ");
    return {
      answer: `Te quedan aproximadamente ${Math.round(remainingCalories)} kcal y ${Math.round(remainingProtein)} g de proteína. Prioriza una comida sencilla con proteína magra, verduras y una ración de hidratos. Evita tus alérgenos registrados: ${allergies || "ninguno"}.`,
      suggestions: [
        "Dame una idea de cena",
        "¿Cuánta proteína me falta?",
        "¿Cómo voy de agua?",
      ],
      source: "rules",
    };
  }

  if (query.includes("agua") || query.includes("hidrata")) {
    const remaining = Math.max(
      0,
      context.preferences.targetWaterMl - context.hydrationMl,
    );
    return {
      answer: `Llevas ${context.hydrationMl} ml de ${context.preferences.targetWaterMl} ml. Te faltan ${remaining} ml. Reparte lo restante durante el día en tomas de 250–500 ml.`,
      suggestions: [
        "Registrar 500 ml",
        "¿Cómo voy de nutrición?",
        "¿Qué entreno hoy?",
      ],
      source: "rules",
    };
  }

  if (
    query.includes("peso") ||
    query.includes("adelgaz") ||
    query.includes("grasa")
  ) {
    const weightRecommendation = context.report.recommendations.find(
      (item) => item.category === "weight",
    );
    return {
      answer:
        weightRecommendation?.message ??
        `Tu objetivo configurado es ${context.preferences.targetWeight ?? "sin definir"} kg. Necesito varios registros semanales comparables para valorar bien la tendencia.`,
      suggestions: [
        "¿Voy demasiado rápido?",
        "¿Qué calorías tengo?",
        "Ver progreso",
      ],
      source: "rules",
    };
  }

  if (
    query.includes("subir") ||
    query.includes("carga") ||
    query.includes("estanc")
  ) {
    const progression = context.report.recommendations.find(
      (item) => item.category === "progression",
    );
    return {
      answer:
        progression?.message ??
        "Sube la carga solo cuando completes el rango de repeticiones con técnica estable y el RIR previsto. Un incremento de 2–2,5 kg suele ser suficiente en tren superior.",
      suggestions: ["¿Qué RIR uso?", "¿Necesito descarga?", "Ver mis marcas"],
      source: "rules",
    };
  }

  const top = context.report.recommendations.slice(0, 2);
  return {
    answer:
      `${context.report.headline} ${top.map((item) => item.message).join(" ")}`.trim(),
    suggestions: [
      "¿Qué entreno hoy?",
      "¿Qué debería comer?",
      "¿Cómo voy de agua?",
    ],
    source: "rules",
  };
}
