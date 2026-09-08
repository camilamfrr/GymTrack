import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ProgressService } from './progress.service.js';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller({ path: 'progress', version: '1' })
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get user progress metrics' })
  getProgress(@CurrentUser() user: { id: string }) {
    return this.progressService.getProgress(user.id);
  }
}
