import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PermissionSlugAlreadyExistsErrorFilter } from './permissions/filters/permission-slug-already-exists.filter';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundErrorFilter } from './common/filters/not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new PermissionSlugAlreadyExistsErrorFilter(),
    new NotFoundErrorFilter(),
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
