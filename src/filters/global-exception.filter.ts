import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.mapException(exception);

    const errorResponse = {
      statusCode: status,
      message,
    };

    this.logger.error(
      `[${request.method}] ${request.url} → ${status} | ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(status).json(errorResponse);
  }

  private mapException(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message = typeof res === 'string' ? res : (res as any).message || 'Erro inesperado';
      return { status, message };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return { status: HttpStatus.CONFLICT, message: 'Recurso já existe' };
        case 'P2003':
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Referência de chave estrangeira inválida',
          };
        case 'P2025':
          return { status: HttpStatus.NOT_FOUND, message: 'Registro não encontrado' };
        default:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Erro de banco de dados',
          };
      }
    }

    if (exception instanceof PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Dados inválidos para a operação no banco',
      };
    }

    if (exception instanceof PrismaClientInitializationError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Falha ao inicializar conexão com o banco',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }
}
