import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ProgressService } from './progress.service.js';

@Controller({ path: 'progress', version: '1' })
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@CurrentUser() user: { id: string }) {
    return this.progressService.getProgress(user.id);
  }
}
