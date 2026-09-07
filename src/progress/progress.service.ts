import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userId: string) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId },
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, workout) => sum + workout.sets.length, 0);
    const totalVolume = workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.sets.reduce((setSum, set) => {
          const weight = set.weight ?? 0;
          return setSum + weight * set.repetitions;
        }, 0)
      );
    }, 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const workoutsInLastWeek = workouts.filter((workout) => new Date(workout.date) >= weekAgo).length;

    const exerciseStats = workouts.flatMap((workout) => workout.sets).reduce<Record<string, { name: string; totalRepetitions: number; totalVolume: number }>>((acc, set) => {
      const exerciseId = set.exerciseId;
      const exerciseName = set.exercise.name;
      const volume = (set.weight ?? 0) * set.repetitions;

      if (!acc[exerciseId]) {
        acc[exerciseId] = {
          name: exerciseName,
          totalRepetitions: 0,
          totalVolume: 0,
        };
      }

      acc[exerciseId].totalRepetitions += set.repetitions;
      acc[exerciseId].totalVolume += volume;

      return acc;
    }, {});

    const topExercises = Object.values(exerciseStats)
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5);

    const lastWorkout = workouts[0] ?? null;

    return {
      totalWorkouts,
      totalSets,
      totalVolume,
      workoutsInLastWeek,
      lastWorkout,
      topExercises,
    };
  }
}
