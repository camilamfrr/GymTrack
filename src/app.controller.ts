import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from './common/decorators/public.decorator.js';

import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Version('1')
  @Get()
  @ApiOperation({ summary: 'API root / healthcheck' })
  getHello(): string {
    return this.appService.getHello();
  }
}
