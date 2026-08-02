import type { WorkoutTemplate } from "@/types/workout";

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    type: "Push",
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
    type: "Pierna A",
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
    type: "Pull",
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
    type: "Pierna B + hombro",
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
];

export function getWorkoutTemplate(type: string) {
  return WORKOUT_TEMPLATES.find(
    (workout) => workout.type === type,
  );
}