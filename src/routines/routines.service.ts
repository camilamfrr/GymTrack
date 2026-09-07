import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AddRoutineExerciseDto, UpdateRoutineExerciseDto } from '../exercises/dto/exercise.dto.js';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routine.dto.js';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.routine.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    if (routine.userId !== userId) {
      throw new ForbiddenException('You do not have access to this routine');
    }

    return routine;
  }

  create(userId: string, dto: CreateRoutineDto) {
    return this.prisma.routine.create({
      data: {
        userId,
        name: dto.name.trim(),
        description: dto.description?.trim() ?? null,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateRoutineDto) {
    await this.findOne(id, userId);

    return this.prisma.routine.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.routine.delete({
      where: { id },
    });

    return { message: 'Routine deleted successfully' };
  }

  async addExerciseToRoutine(
    routineId: string,
    userId: string,
    dto: AddRoutineExerciseDto,
  ) {
    await this.findOne(routineId, userId);

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: dto.exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return this.prisma.routineExercise.upsert({
      where: {
        routineId_exerciseId: {
          routineId,
          exerciseId: dto.exerciseId,
        },
      },
      update: {
        sets: dto.sets,
        repetitions: dto.repetitions,
        restSeconds: dto.restSeconds,
      },
      create: {
        routineId,
        exerciseId: dto.exerciseId,
        sets: dto.sets,
        repetitions: dto.repetitions,
        restSeconds: dto.restSeconds,
      },
      include: {
        exercise: true,
      },
    });
  }

  async updateExerciseInRoutine(
    routineId: string,
    exerciseId: string,
    userId: string,
    dto: UpdateRoutineExerciseDto,
  ) {
    await this.findOne(routineId, userId);

    const existing = await this.prisma.routineExercise.findUnique({
      where: {
        routineId_exerciseId: {
          routineId,
          exerciseId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Exercise not assigned to this routine');
    }

    return this.prisma.routineExercise.update({
      where: { id: existing.id },
      data: {
        ...(dto.sets !== undefined && { sets: dto.sets }),
        ...(dto.repetitions !== undefined && { repetitions: dto.repetitions }),
        ...(dto.restSeconds !== undefined && { restSeconds: dto.restSeconds }),
      },
      include: {
        exercise: true,
      },
    });
  }

  async removeExerciseFromRoutine(routineId: string, exerciseId: string, userId: string) {
    await this.findOne(routineId, userId);

    const relation = await this.prisma.routineExercise.findUnique({
      where: {
        routineId_exerciseId: {
          routineId,
          exerciseId,
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Exercise not assigned to this routine');
    }

    await this.prisma.routineExercise.delete({
      where: { id: relation.id },
    });

    return { message: 'Exercise removed from routine successfully' };
  }
}
