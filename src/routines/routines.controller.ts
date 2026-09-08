import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import {
  AddRoutineExerciseDto,
  CreateRoutineDto,
  UpdateRoutineDto,
  UpdateRoutineExerciseDto,
} from './dto/routine.dto.js';
import { RoutinesService } from './routines.service.js';

@ApiTags('Routines')
@ApiBearerAuth()
@Controller({ path: 'routines', version: '1' })
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  @ApiOperation({ summary: 'List all routines for user' })
  findAll(@CurrentUser() user: { id: string }) {
    return this.routinesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new routine' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateRoutineDto) {
    return this.routinesService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a routine by id' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.routinesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a routine' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a routine' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.routinesService.remove(id, user.id);
  }

  @Post(':id/exercises')
  @ApiOperation({ summary: 'Add an exercise to a routine' })
  addExercise(
    @Param('id') routineId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: AddRoutineExerciseDto,
  ) {
    return this.routinesService.addExerciseToRoutine(routineId, user.id, dto);
  }

  @Patch(':id/exercises/:exerciseId')
  @ApiOperation({ summary: 'Update an exercise in a routine' })
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
  @ApiOperation({ summary: 'Remove an exercise from a routine' })
  removeExercise(
    @Param('id') routineId: string,
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.routinesService.removeExerciseFromRoutine(routineId, exerciseId, user.id);
  }
}
