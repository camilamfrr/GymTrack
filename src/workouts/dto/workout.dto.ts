import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class WorkoutExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  repetitions: number;
}

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  routineId?: string;

  @IsDateString()
  date: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}
