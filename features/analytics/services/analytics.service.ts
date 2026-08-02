import type {
  AnalyticsComparison,
  AnalyticsPeriod,
  ExercisePersonalRecord,
  MuscleGroupAnalytics,
  TrainingAnalytics,
} from "@/features/analytics/types";
import {
  getWorkoutStats,
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
  type WorkoutHistoryItem,
} from "@/features/workouts/history";

const DAY_MS = 86_400_000;

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - distanceFromMonday);
  return result;
}

function startOfMonth(date: Date) {
  const result = startOfDay(date);
  result.setDate(1);
  return result;
}

function endExclusive(start: Date, milliseconds: number) {
  return new Date(start.getTime() + milliseconds);
}

function filterByPeriod(
  workouts: WorkoutHistoryItem[],
  start: Date,
  end: Date,
) {
  return workouts.filter((workout) => {
    const timestamp = new Date(workout.startedAt).getTime();
    return timestamp >= start.getTime() && timestamp < end.getTime();
  });
}

function summarizePeriod(
  workouts: WorkoutHistoryItem[],
  start: Date,
  end: Date,
): AnalyticsPeriod {
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    sessions: workouts.length,
    completedSets: workouts.reduce(
      (total, workout) => total + getWorkoutStats(workout).sets,
      0,
    ),
    durationMinutes: workouts.reduce(
      (total, workout) => total + workout.durationMinutes,
      0,
    ),
    volume: workouts.reduce(
      (total, workout) => total + getWorkoutStats(workout).volume,
      0,
    ),
  };
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / previous) * 100;
}

function buildWeekComparison(
  workouts: WorkoutHistoryItem[],
  now: Date,
): AnalyticsComparison {
  const currentStart = startOfWeek(now);
  const currentEnd = endExclusive(currentStart, 7 * DAY_MS);
  const previousStart = new Date(currentStart.getTime() - 7 * DAY_MS);
  const previousEnd = currentStart;

  const current = summarizePeriod(
    filterByPeriod(workouts, currentStart, currentEnd),
    currentStart,
    currentEnd,
  );
  const previous = summarizePeriod(
    filterByPeriod(workouts, previousStart, previousEnd),
    previousStart,
    previousEnd,
  );

  return {
    current,
    previous,
    sessionChangePercent: percentageChange(current.sessions, previous.sessions),
    volumeChangePercent: percentageChange(current.volume, previous.volume),
    durationChangePercent: percentageChange(
      current.durationMinutes,
      previous.durationMinutes,
    ),
  };
}

function buildMuscleGroups(
  workouts: WorkoutHistoryItem[],
): MuscleGroupAnalytics[] {
  const groups = new Map<
    string,
    { sessions: Set<string>; completedSets: number; volume: number }
  >();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const muscleGroup = exercise.muscleGroup?.trim() || "Sin clasificar";
      const current = groups.get(muscleGroup) ?? {
        sessions: new Set<string>(),
        completedSets: 0,
        volume: 0,
      };

      current.sessions.add(workout.id);
      current.completedSets += exercise.sets.length;
      current.volume += exercise.sets.reduce(
        (total, set) => total + set.weight * set.reps,
        0,
      );
      groups.set(muscleGroup, current);
    }
  }

  return [...groups.entries()]
    .map(([muscleGroup, values]) => ({
      muscleGroup,
      sessions: values.sessions.size,
      completedSets: values.completedSets,
      volume: values.volume,
    }))
    .sort((a, b) => b.volume - a.volume);
}

export function estimateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  if (reps === 1) {
    return weight;
  }

  return weight * (1 + Math.min(reps, 30) / 30);
}

function buildPersonalRecords(
  workouts: WorkoutHistoryItem[],
): ExercisePersonalRecord[] {
  const records = new Map<string, ExercisePersonalRecord>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        const setVolume = set.weight * set.reps;
        const oneRepMax = estimateOneRepMax(set.weight, set.reps);
        const current = records.get(exercise.name);

        if (!current) {
          records.set(exercise.name, {
            exerciseName: exercise.name,
            muscleGroup: exercise.muscleGroup,
            maxWeight: set.weight,
            maxReps: set.reps,
            maxSetVolume: setVolume,
            estimatedOneRepMax: oneRepMax,
            achievedAt: workout.startedAt,
          });
          continue;
        }

        const improved =
          set.weight > current.maxWeight ||
          set.reps > current.maxReps ||
          setVolume > current.maxSetVolume ||
          oneRepMax > current.estimatedOneRepMax;

        current.maxWeight = Math.max(current.maxWeight, set.weight);
        current.maxReps = Math.max(current.maxReps, set.reps);
        current.maxSetVolume = Math.max(current.maxSetVolume, setVolume);
        current.estimatedOneRepMax = Math.max(
          current.estimatedOneRepMax,
          oneRepMax,
        );

        if (improved) {
          current.achievedAt = workout.startedAt;
        }
      }
    }
  }

  return [...records.values()].sort(
    (a, b) => b.estimatedOneRepMax - a.estimatedOneRepMax,
  );
}

export function buildTrainingAnalytics(
  rawWorkouts: RawWorkoutHistoryItem[],
  now = new Date(),
): TrainingAnalytics {
  const workouts = rawWorkouts.map(normalizeWorkoutHistoryItem);
  const totalDuration = workouts.reduce(
    (total, workout) => total + workout.durationMinutes,
    0,
  );
  const monthStart = startOfMonth(now);
  const nextMonth = new Date(monthStart);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    generatedAt: now.toISOString(),
    totalSessions: workouts.length,
    totalCompletedSets: workouts.reduce(
      (total, workout) => total + getWorkoutStats(workout).sets,
      0,
    ),
    totalVolume: workouts.reduce(
      (total, workout) => total + getWorkoutStats(workout).volume,
      0,
    ),
    averageDurationMinutes:
      workouts.length === 0 ? 0 : Math.round(totalDuration / workouts.length),
    week: buildWeekComparison(workouts, now),
    month: summarizePeriod(
      filterByPeriod(workouts, monthStart, nextMonth),
      monthStart,
      nextMonth,
    ),
    muscleGroups: buildMuscleGroups(workouts),
    personalRecords: buildPersonalRecords(workouts),
  };
}
