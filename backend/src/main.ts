import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundErrorFilter } from './common/filters/not-found-error.filter';
import { InvalidCredentialsErrorFilter } from './filters/invalid-credentials-error.filter';
import { PermissionSlugAlreadyExistsErrorFilter } from './permissions/filters/permission-slug-already-exists.filter';
import { EmailAlreadyExistsErrorFilter } from './users/filters/email-already-exists.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new PermissionSlugAlreadyExistsErrorFilter(),
    new EmailAlreadyExistsErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidCredentialsErrorFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost', // Alterar conforme necessário
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
