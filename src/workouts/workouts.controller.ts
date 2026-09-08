import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateWorkoutDto } from './dto/workout.dto.js';
import { WorkoutsService } from './workouts.service.js';

@ApiTags('Workouts')
@ApiBearerAuth()
@Controller({ path: 'workouts', version: '1' })
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  @ApiOperation({ summary: 'List all user workouts' })
  findAll(@CurrentUser() user: { id: string }) {
    return this.workoutsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workout by id' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workoutsService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(user.id, dto);
  }
}
