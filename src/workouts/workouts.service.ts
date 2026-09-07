import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWorkoutDto } from './dto/workout.dto.js';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.workout.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        routine: {
          select: { id: true, name: true },
        },
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        routine: true,
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException('You do not have access to this workout');
    }

    return workout;
  }

  async create(userId: string, dto: CreateWorkoutDto) {
    if (dto.routineId) {
      const routine = await this.prisma.routine.findUnique({
        where: { id: dto.routineId },
      });

      if (!routine) {
        throw new NotFoundException('Routine not found');
      }

      if (routine.userId !== userId) {
        throw new ForbiddenException('You do not have access to this routine');
      }
    }

    return this.prisma.workout.create({
      data: {
        userId,
        routineId: dto.routineId ?? null,
        date: new Date(dto.date),
        durationMinutes: dto.durationMinutes,
        sets: {
          create: dto.exercises.map((entry) => ({
            exerciseId: entry.exerciseId,
            weight: entry.weight ?? null,
            repetitions: entry.repetitions,
          })),
        },
      },
      include: {
        routine: true,
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }
}
