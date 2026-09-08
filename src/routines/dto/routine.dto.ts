import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  AddRoutineExerciseDto,
  UpdateRoutineExerciseDto,
} from '../../exercises/dto/exercise.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Full body split' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional description' })
  description?: string;
}

export class UpdateRoutineDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Upper body' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional description' })
  description?: string;
}

export { AddRoutineExerciseDto, UpdateRoutineExerciseDto };
