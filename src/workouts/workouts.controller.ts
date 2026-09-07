import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateWorkoutDto } from './dto/workout.dto.js';
import { WorkoutsService } from './workouts.service.js';

@Controller({ path: 'workouts', version: '1' })
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.workoutsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workoutsService.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(user.id, dto);
  }
}
