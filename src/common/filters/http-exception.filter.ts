import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';

    // TypeORM unique constraint violation
    if (
      exception instanceof QueryFailedError &&
      (exception as any).code === '23505'
    ) {
      status = HttpStatus.BAD_REQUEST;
      // Try to extract the field name from the detail message
      const detail = (exception as any).detail as string | undefined;
      let field = '';
      if (detail) {
        const match = detail.match(/\((.*?)\)=/);
        if (match) {
          field = match[1];
        }
      }
      message = field
        ? `Unique constraint violation: The value for "${field}" is already in use.`
        : 'Unique constraint violation: This value is already in use.';
    }
    // Other HttpExceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      if (
        typeof responseMessage === 'object' &&
        responseMessage !== null &&
        'message' in responseMessage
      ) {
        message = Array.isArray((responseMessage as any).message)
          ? (responseMessage as any).message.join(', ')
          : (responseMessage as any).message;
      } else if (typeof responseMessage === 'string') {
        message = responseMessage;
      }
    }
    // Other errors
    else if (exception.message) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
