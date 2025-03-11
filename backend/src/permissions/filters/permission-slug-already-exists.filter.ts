import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PermissionSlugAlreadyExistsError } from '../errors';
import { Response } from 'express';

@Catch(PermissionSlugAlreadyExistsError)
export class PermissionSlugAlreadyExistsErrorFilter implements ExceptionFilter{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
