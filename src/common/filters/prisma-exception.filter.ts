import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      response.status(status).json(
        typeof payload === 'string'
          ? { message: payload, statusCode: status }
          : { ...(payload as Record<string, unknown>), statusCode: status },
      );
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, meta } = exception;

      if (code === 'P2002') {
        const field = meta?.target ? String(meta.target) : 'field';
        response.status(HttpStatus.CONFLICT).json({
          message: `A record with this ${field} already exists`,
          statusCode: HttpStatus.CONFLICT,
        });
        return;
      }

      if (code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'The requested record was not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
        return;
      }

      if (code === 'P2003') {
        response.status(HttpStatus.BAD_REQUEST).json({
          message: 'A related record could not be processed',
          statusCode: HttpStatus.BAD_REQUEST,
        });
        return;
      }
    }

    const error = new InternalServerErrorException('Internal server error');
    response.status(error.getStatus()).json({
      message: error.getResponse(),
      statusCode: error.getStatus(),
    });
  }
}
