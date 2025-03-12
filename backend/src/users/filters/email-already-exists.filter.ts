import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EmailAlreadyExistsError } from '../errors';
import { Response } from 'express';

@Catch(EmailAlreadyExistsError)
export class EmailAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
