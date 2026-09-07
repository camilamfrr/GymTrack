import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import {
  AddRoutineExerciseDto,
  CreateRoutineDto,
  UpdateRoutineDto,
  UpdateRoutineExerciseDto,
} from './dto/routine.dto.js';
import { RoutinesService } from './routines.service.js';

@Controller({ path: 'routines', version: '1' })
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.routinesService.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateRoutineDto) {
    return this.routinesService.create(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.routinesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.routinesService.remove(id, user.id);
  }

  @Post(':id/exercises')
  addExercise(
    @Param('id') routineId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: AddRoutineExerciseDto,
  ) {
    return this.routinesService.addExerciseToRoutine(routineId, user.id, dto);
  }

  @Patch(':id/exercises/:exerciseId')
  updateExercise(
    @Param('id') routineId: string,
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateRoutineExerciseDto,
  ) {
    return this.routinesService.updateExerciseInRoutine(
      routineId,
      exerciseId,
      user.id,
      dto,
    );
  }

  @Delete(':id/exercises/:exerciseId')
  removeExercise(
    @Param('id') routineId: string,
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.routinesService.removeExerciseFromRoutine(routineId, exerciseId, user.id);
  }
}
