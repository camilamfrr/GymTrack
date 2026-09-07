import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  muscleGroup: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  muscleGroup?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AddRoutineExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sets: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  repetitions: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  restSeconds: number;
}

export class UpdateRoutineExerciseDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sets?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  repetitions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  restSeconds?: number;
}
