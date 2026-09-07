import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
} from './dto/exercise.dto.js';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.exercise.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        name: dto.name.trim(),
        muscleGroup: dto.muscleGroup.trim(),
        description: dto.description?.trim() ?? null,
      },
    });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);

    return this.prisma.exercise.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.muscleGroup !== undefined && { muscleGroup: dto.muscleGroup.trim() }),
        ...(dto.description !== undefined && { description: dto.description.trim() }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.exercise.delete({
      where: { id },
    });

    return { message: 'Exercise deleted successfully' };
  }
}
