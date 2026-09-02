import type { WorkoutTemplate, WorkoutType } from "@/types/workout";

/**
 * Fit33 usa 3 variantes por cada tipo de entrenamiento.
 * La variante se selecciona de forma determinista según la semana del año,
 * de modo que las rutinas alternan automáticamente sin cambiar el reparto
 * semanal Push / Pierna A / Pull / Pierna B + hombro.
 */
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // PUSH — Semana A
  {
    type: "Push",
    variant: 1,
    day: "Lunes",
    description: "Pecho, hombro y tríceps",
    exercises: [
      {
        name: "Press banca",
        muscleGroup: "Pecho",
        targetSets: 4,
        targetReps: "6-8",
      },
      {
        name: "Press inclinado con mancuernas",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Aperturas en polea",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Press militar",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "6-8",
      },
      {
        name: "Elevaciones laterales",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Fondos asistidos",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "8-12",
      },
      {
        name: "Extensión de tríceps con cuerda",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Push",
    variant: 2,
    day: "Lunes",
    description: "Pecho, hombro y tríceps",
    exercises: [
      {
        name: "Press inclinado con barra",
        muscleGroup: "Pecho",
        targetSets: 4,
        targetReps: "6-8",
      },
      {
        name: "Press pecho en máquina",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Cruce de poleas",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Press hombro en máquina",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Elevaciones laterales en polea",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Press cerrado",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Extensión de tríceps unilateral",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Push",
    variant: 3,
    day: "Lunes",
    description: "Pecho, hombro y tríceps",
    exercises: [
      {
        name: "Press pecho en máquina convergente",
        muscleGroup: "Pecho",
        targetSets: 4,
        targetReps: "6-8",
      },
      {
        name: "Press inclinado en máquina",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Aperturas con mancuernas",
        muscleGroup: "Pecho",
        targetSets: 3,
        targetReps: "10-15",
      },
      {
        name: "Press Arnold",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Elevaciones laterales con mancuernas",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Extensión de tríceps por encima de la cabeza",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Jalón de tríceps con barra",
        muscleGroup: "Tríceps",
        targetSets: 3,
        targetReps: "12-15",
      },
    ],
  },

  // PIERNA A
  {
    type: "Pierna A",
    variant: 1,
    day: "Martes",
    description: "Cuádriceps, femoral y gemelos",
    exercises: [
      {
        name: "Sentadilla hack",
        muscleGroup: "Cuádriceps",
        targetSets: 4,
        targetReps: "6-8",
      },
      {
        name: "Prensa",
        muscleGroup: "Cuádriceps",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Peso muerto rumano",
        muscleGroup: "Femoral",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Curl femoral",
        muscleGroup: "Femoral",
        targetSets: 4,
        targetReps: "10-12",
      },
      {
        name: "Extensión de cuádriceps",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Gemelos",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Pierna A",
    variant: 2,
    day: "Martes",
    description: "Cuádriceps, femoral y gemelos",
    exercises: [
      {
        name: "Prensa inclinada",
        muscleGroup: "Cuádriceps",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Sentadilla goblet",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Peso muerto rumano con mancuernas",
        muscleGroup: "Femoral",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Curl femoral sentado",
        muscleGroup: "Femoral",
        targetSets: 4,
        targetReps: "10-12",
      },
      {
        name: "Extensión unilateral de cuádriceps",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Gemelo sentado",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Pierna A",
    variant: 3,
    day: "Martes",
    description: "Cuádriceps, femoral y gemelos",
    exercises: [
      {
        name: "Sentadilla en multipower",
        muscleGroup: "Cuádriceps",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Prensa unilateral",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Buenos días en multipower",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Curl femoral tumbado",
        muscleGroup: "Femoral",
        targetSets: 4,
        targetReps: "10-12",
      },
      {
        name: "Extensión de cuádriceps",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Gemelo en prensa",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },

  // PULL
  {
    type: "Pull",
    variant: 1,
    day: "Jueves",
    description: "Espalda y bíceps",
    exercises: [
      {
        name: "Dominadas asistidas",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "6-10",
      },
      {
        name: "Jalón al pecho",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Remo en máquina",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Remo unilateral",
        muscleGroup: "Espalda",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Face pull",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Curl con barra",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Curl inclinado",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "10-12",
      },
    ],
  },
  {
    type: "Pull",
    variant: 2,
    day: "Jueves",
    description: "Espalda y bíceps",
    exercises: [
      {
        name: "Jalón agarre neutro",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Remo con pecho apoyado",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Remo en polea baja",
        muscleGroup: "Espalda",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Pullover en polea",
        muscleGroup: "Espalda",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Pájaros en máquina",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Curl martillo",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Curl en polea",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "10-12",
      },
    ],
  },
  {
    type: "Pull",
    variant: 3,
    day: "Jueves",
    description: "Espalda y bíceps",
    exercises: [
      {
        name: "Dominadas asistidas agarre neutro",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "6-10",
      },
      {
        name: "Jalón unilateral",
        muscleGroup: "Espalda",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Remo con mancuerna",
        muscleGroup: "Espalda",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Remo sentado unilateral",
        muscleGroup: "Espalda",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Face pull",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Curl predicador",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Curl martillo en cuerda",
        muscleGroup: "Bíceps",
        targetSets: 3,
        targetReps: "10-12",
      },
    ],
  },

  // PIERNA B + HOMBRO
  {
    type: "Pierna B + hombro",
    variant: 1,
    day: "Viernes",
    description: "Glúteo, femoral y hombro",
    exercises: [
      {
        name: "Hip thrust",
        muscleGroup: "Glúteo",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Sentadilla búlgara",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Peso muerto rumano",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Curl femoral",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Elevaciones laterales",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Pájaros",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Gemelos",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Pierna B + hombro",
    variant: 2,
    day: "Viernes",
    description: "Glúteo, femoral y hombro",
    exercises: [
      {
        name: "Hip thrust en máquina",
        muscleGroup: "Glúteo",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Step-up con mancuernas",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Peso muerto a una pierna",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Curl femoral sentado",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Press hombro con mancuernas",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Elevaciones laterales en polea",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Gemelo sentado",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },
  {
    type: "Pierna B + hombro",
    variant: 3,
    day: "Viernes",
    description: "Glúteo, femoral y hombro",
    exercises: [
      {
        name: "Puente de glúteo con barra",
        muscleGroup: "Glúteo",
        targetSets: 4,
        targetReps: "8-10",
      },
      {
        name: "Prensa con pies altos",
        muscleGroup: "Cuádriceps",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Pull-through en polea",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "10-12",
      },
      {
        name: "Curl femoral tumbado",
        muscleGroup: "Femoral",
        targetSets: 3,
        targetReps: "12-15",
      },
      {
        name: "Press Arnold",
        muscleGroup: "Hombro",
        targetSets: 3,
        targetReps: "8-10",
      },
      {
        name: "Elevaciones laterales con mancuernas",
        muscleGroup: "Hombro",
        targetSets: 4,
        targetReps: "12-15",
      },
      {
        name: "Gemelo en prensa",
        muscleGroup: "Gemelos",
        targetSets: 5,
        targetReps: "12-15",
      },
    ],
  },
];

function getWeekNumber(date: Date) {
  const start = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const current = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayOfYear =
    Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.ceil(dayOfYear / 7);
}

export function getWorkoutVariant(type: WorkoutType, date = new Date()) {
  const variants = WORKOUT_TEMPLATES.filter((workout) => workout.type === type);
  if (variants.length === 0) return undefined;
  const index = (getWeekNumber(date) - 1) % variants.length;
  return variants[index];
}

export function getWorkoutTemplate(type: string, date = new Date()) {
  return getWorkoutVariant(type as WorkoutType, date);
}
