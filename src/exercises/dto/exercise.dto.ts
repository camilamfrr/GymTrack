import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bench press' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Chest' })
  muscleGroup: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional notes about the exercise' })
  description?: string;
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Incline bench press' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Chest' })
  muscleGroup?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional notes' })
  description?: string;
}

export class AddRoutineExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Exercise id to add to routine' })
  exerciseId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'Number of sets', example: 3 })
  sets: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'Number of repetitions', example: 10 })
  repetitions: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Rest between sets in seconds', example: 60 })
  restSeconds: number;
}

export class UpdateRoutineExerciseDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false, description: 'Optional updated sets' })
  sets?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false, description: 'Optional updated repetitions' })
  repetitions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Optional updated rest seconds' })
  restSeconds?: number;
}
