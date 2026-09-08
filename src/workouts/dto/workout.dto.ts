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
import { ApiProperty } from '@nestjs/swagger';

export class WorkoutExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the exercise' })
  exerciseId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Weight used (kg)' })
  weight?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'Number of repetitions' })
  repetitions: number;
}

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional routine id' })
  routineId?: string;

  @IsDateString()
  @ApiProperty({ example: '2026-09-08T10:00:00.000Z', description: 'ISO date string' })
  date: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'Duration of workout in minutes', example: 45 })
  durationMinutes: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  @ApiProperty({ type: [WorkoutExerciseDto] })
  exercises: WorkoutExerciseDto[];
}
