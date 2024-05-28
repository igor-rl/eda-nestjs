import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './nest-modules/global-config';
import { applySwaggerConfig } from './nest-modules/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? console : undefined,
  });

  applyGlobalConfig(app);

  applySwaggerConfig(app);

  await app.startAllMicroservices();

  await app.listen(process.env.API_PORT || 3000);

  console.log(`Documentação do projeto disponível em ${await app.getUrl()}`);
}

bootstrap();
